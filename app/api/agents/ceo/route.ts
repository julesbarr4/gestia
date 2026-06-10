import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyserStrategieEntreprise } from "@/lib/agents/ceo-agent";
import { verifierEtIncrementerGeneration } from "@/lib/plans/check-plan";

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });

  const acces = await verifierEtIncrementerGeneration(user.id, "strategie");
  if (!acces.autorise) {
    return NextResponse.json({ erreur: acces.erreur, planRequis: acces.planRequis, limite: true }, { status: 403 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nom_entreprise, ville, plan")
    .eq("id", user.id)
    .single();

  const { data: stats } = await supabase
    .from("factures")
    .select("total_ttc, statut")
    .eq("user_id", user.id);

  const { count: nbClients } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { data: firstFacture } = await supabase
    .from("factures")
    .select("created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  const caTotal = (stats || []).reduce((s, f) => s + f.total_ttc, 0);
  const nbMoisActivite = firstFacture
    ? Math.max(1, Math.round((Date.now() - new Date(firstFacture.created_at).getTime()) / (1000 * 60 * 60 * 24 * 30)))
    : 1;

  const { objectifs, problemes } = await req.json();

  try {
    const analyse = await analyserStrategieEntreprise({
      nomEntreprise: profile?.nom_entreprise || "Mon Entreprise",
      secteur: profile?.ville ? `TPE, ${profile.ville}` : "TPE France",
      nbMoisActivite,
      caTotal,
      nbClients: nbClients || 0,
      objectifs: objectifs || "Développer l'activité",
      problemes: problemes || "Manque de temps",
    });

    await supabase.from("agents_logs").insert({
      user_id: user.id,
      agent: "ceo",
      action: "analyse_strategique",
      input: { objectifs, problemes },
      output: { diagnostic: analyse.diagnostic },
      statut: "succes",
    });

    return NextResponse.json({ analyse });
  } catch (err) {
    await supabase.rpc("rembourser_generation", { p_user_id: user.id });
    await supabase.from("agents_logs").insert({
      user_id: user.id,
      agent: "ceo",
      action: "analyse_strategique",
      input: { objectifs, problemes },
      output: { erreur: err instanceof Error ? err.message : String(err) },
      statut: "erreur",
    });
    return NextResponse.json({ erreur: "Erreur lors de l'analyse stratégique" }, { status: 500 });
  }
}
