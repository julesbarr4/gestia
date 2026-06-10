export const maxDuration = 120;

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { genererContenuSocial } from "@/lib/agents/cmo-agent";
import { verifierEtIncrementerGeneration } from "@/lib/plans/check-plan";
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  const acces = await verifierEtIncrementerGeneration(user.id, "marketing");
  if (!acces.autorise) {
    return NextResponse.json(
      { erreur: acces.erreur, planRequis: acces.planRequis, limite: true },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { sujet, reseaux, tonalite, secteur } = body;

  if (!sujet || !reseaux?.length) {
    return NextResponse.json({ erreur: "sujet et reseaux sont requis" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nom_entreprise, secteur")
    .eq("id", user.id)
    .single();

  try {
    const contenu = await genererContenuSocial({
      nomEntreprise: profile?.nom_entreprise || "Mon Entreprise",
      secteur: secteur || profile?.secteur || undefined,
      sujet,
      reseaux,
      tonalite,
    });

    await supabase.from("agents_logs").insert({
      user_id: user.id, agent: "cmo", action: "generer_contenu",
      input: { sujet }, output: { reseaux }, statut: "succes",
    });

    return NextResponse.json({ contenu });
  } catch (err) {
    await supabase.rpc("rembourser_generation", { p_user_id: user.id });
    console.error("Erreur génération marketing:", err);
    return NextResponse.json(
      { erreur: "Erreur lors de la génération. Votre quota n'a pas été débité." },
      { status: 500 }
    );
  }
}
