export const maxDuration = 120; // 2 min timeout Vercel

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyserEtRepondreEmail } from "@/lib/agents/support-agent";
import { reponseAgentSuspecte } from "@/lib/agents/prompt-securite";
import { verifierAccesAgent, incrementerGenerations } from "@/lib/plans/check-plan";
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  const acces = await verifierAccesAgent(user.id, "support");
  if (!acces.autorise) {
    return NextResponse.json(
      { erreur: acces.erreur, planRequis: acces.planRequis, limite: true },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { emailDe, sujet, corps, ajouterSignatureLea } = body;

  if (!emailDe || !corps) {
    return NextResponse.json({ erreur: "emailDe et corps sont requis" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nom_entreprise")
    .eq("id", user.id)
    .single();

  const analyse = await analyserEtRepondreEmail({
    emailDe,
    sujet: sujet || "(sans sujet)",
    corps,
    nomEntreprise: profile?.nom_entreprise || "Mon Entreprise",
  });

  if (ajouterSignatureLea === true) {
    analyse.reponse += "\n\n— Généré par Léa, votre assistante support Gestia";
  }

  // Filtre de sortie anti prompt-injection : si la réponse générée semble
  // détournée (instructions inhabituelles, fuite de prompt), elle n'est pas
  // marquée "traite" et l'utilisateur est invité à la relire avant envoi.
  const suspecte = reponseAgentSuspecte(analyse.reponse) || reponseAgentSuspecte(analyse.sujetReponse);

  const { data: emailLog } = await supabase
    .from("emails_entrants")
    .insert({
      user_id: user.id,
      de: emailDe,
      sujet,
      corps,
      reponse_ia: analyse.reponse,
      statut: suspecte ? "en_attente" : "traite",
    })
    .select()
    .single();

  await incrementerGenerations(user.id);
  return NextResponse.json({
    analyse,
    emailLogId: emailLog?.id,
    ...(suspecte && {
      avertissementSecurite:
        "Cette réponse contient des éléments inhabituels (possible tentative de manipulation dans l'e-mail reçu). Relisez-la attentivement avant tout envoi.",
    }),
  });
}
