export const maxDuration = 120; // 2 min timeout Vercel

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { genererContenuSocial } from "@/lib/agents/cmo-agent";
import { isDemoMode } from "@/lib/demo/is-demo";
import { mockGenererContenuMarketing } from "@/lib/demo/mock-agents";

export async function POST(req: NextRequest) {
  // demo bypass
  if (isDemoMode()) {
    const body = await req.json();
    const { sujet, reseaux, tonalite, nomEntreprise } = body;
    if (!sujet || !reseaux?.length) {
      return NextResponse.json({ erreur: "sujet et reseaux sont requis" }, { status: 400 });
    }
    const contenu = await mockGenererContenuMarketing({ nomEntreprise: nomEntreprise || "Entreprise Démo", sujet, reseaux, tonalite });
    return NextResponse.json({ contenu });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json();
  const { sujet, reseaux, tonalite } = body;

  if (!sujet || !reseaux?.length) {
    return NextResponse.json({ erreur: "sujet et reseaux sont requis" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nom_entreprise")
    .eq("id", user.id)
    .single();

  const contenu = await genererContenuSocial({
    nomEntreprise: profile?.nom_entreprise || "Mon Entreprise",
    secteur: "services",
    sujet,
    reseaux,
    tonalite,
  });

  return NextResponse.json({ contenu });
}
