export const maxDuration = 120; // 2 min timeout Vercel

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { genererRapportHebdomadaire } from "@/lib/agents/cfo-agent";
import { verifierEtIncrementerGeneration } from "@/lib/plans/check-plan";
export async function POST(_req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  const acces = await verifierEtIncrementerGeneration(user.id, "rapport");
  if (!acces.autorise) {
    return NextResponse.json(
      { erreur: acces.erreur, planRequis: acces.planRequis, limite: true },
      { status: 403 }
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nom_entreprise")
    .eq("id", user.id)
    .single();

  const maintenant = new Date();
  const debutSemaine = new Date(maintenant);
  debutSemaine.setDate(maintenant.getDate() - 7);
  const debutMois = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
  const debutMoisPrecedent = new Date(maintenant.getFullYear(), maintenant.getMonth() - 1, 1);
  const finMoisPrecedent = new Date(maintenant.getFullYear(), maintenant.getMonth(), 0);

  const [
    { data: facturesSemaine },
    { data: facturesMois },
    { data: facturesMoisPrecedent },
    { data: facturesImpayees },
    { data: devisEnAttente },
    { data: devisAcceptes },
    { data: devisTotaux },
  ] = await Promise.all([
    supabase.from("factures").select("total_ttc").eq("user_id", user.id).eq("statut", "payee").gte("created_at", debutSemaine.toISOString()),
    supabase.from("factures").select("total_ttc").eq("user_id", user.id).eq("statut", "payee").gte("created_at", debutMois.toISOString()),
    supabase.from("factures").select("total_ttc").eq("user_id", user.id).eq("statut", "payee").gte("created_at", debutMoisPrecedent.toISOString()).lte("created_at", finMoisPrecedent.toISOString()),
    supabase.from("factures").select("total_ttc").eq("user_id", user.id).in("statut", ["envoyee", "en_retard"]),
    supabase.from("devis").select("id").eq("user_id", user.id).eq("statut", "envoye"),
    supabase.from("devis").select("id").eq("user_id", user.id).eq("statut", "accepte").gte("created_at", debutMois.toISOString()),
    supabase.from("devis").select("id").eq("user_id", user.id).gte("created_at", debutMois.toISOString()),
  ]);

  const caSemaine = (facturesSemaine || []).reduce((s, f) => s + f.total_ttc, 0);
  const caMois = (facturesMois || []).reduce((s, f) => s + f.total_ttc, 0);
  const caMoisPrecedent = (facturesMoisPrecedent || []).reduce((s, f) => s + f.total_ttc, 0);
  const montantImpaye = (facturesImpayees || []).reduce((s, f) => s + f.total_ttc, 0);
  const tauxAcceptation = devisTotaux?.length
    ? Math.round(((devisAcceptes?.length || 0) / devisTotaux.length) * 100)
    : 0;

  const { data: nouveauxClients } = await supabase
    .from("clients")
    .select("id", { count: "exact" })
    .eq("user_id", user.id)
    .gte("created_at", debutSemaine.toISOString());

  const rapport = await genererRapportHebdomadaire({
    nomEntreprise: profile?.nom_entreprise || "Mon Entreprise",
    caSemaine,
    caMois,
    caMoisPrecedent,
    facturesImpayees: facturesImpayees?.length || 0,
    montantImpaye,
    nbNouveauxClients: nouveauxClients?.length || 0,
    nbDevisEnAttente: devisEnAttente?.length || 0,
    devisAcceptesTaux: tauxAcceptation,
  });

  await supabase.from("rapports_financiers").insert({
    user_id: user.id,
    semaine: debutSemaine.toISOString().split("T")[0],
    ca_semaine: caSemaine,
    ca_mois: caMois,
    factures_impayees: facturesImpayees?.length || 0,
    montant_impaye: montantImpaye,
    analyse_ia: rapport.resumeExecutif,
    recommandations: rapport.recommandations,
  });

  await supabase.from("agents_logs").insert({
    user_id: user.id, agent: "cfo", action: "generer_rapport",
    input: { periode: "hebdomadaire" }, output: { caSemaine, caMois }, statut: "succes",
  });

  return NextResponse.json({
    rapport,
    metriques: { caSemaine, caMois, caMoisPrecedent, montantImpaye, tauxAcceptation },
  });
}
