export const maxDuration = 120; // 2 min timeout Vercel

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { genererContenuSocial } from "@/lib/agents/cmo-agent";
import { verifierAccesAgent, incrementerGenerations } from "@/lib/plans/check-plan";
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  const acces = await verifierAccesAgent(user.id, "marketing");
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

  const contenu = await genererContenuSocial({
    nomEntreprise: profile?.nom_entreprise || "Mon Entreprise",
    // Priorité au secteur fourni dans la requête, sinon celui du profil.
    secteur: secteur || profile?.secteur || undefined,
    sujet,
    reseaux,
    tonalite,
  });

  await incrementerGenerations(user.id);
  return NextResponse.json({ contenu });
}
