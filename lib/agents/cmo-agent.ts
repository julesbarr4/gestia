import { callAgent, MODELS } from "@/lib/claude";

const SYSTEM_PROMPT = `Tu es le CMO (Directeur Marketing) IA de Gestia. Tu crées du contenu marketing en français pour aider les entrepreneurs à développer leur présence en ligne.

Règles :
- Contenu adapté au secteur d'activité de l'entreprise
- Ton professionnel mais accessible, humain
- Optimisé pour l'engagement (pas du contenu générique)
- Respecter les pratiques du marché français
- Formats adaptés à chaque réseau social`;

export interface ContenuMarketing {
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  emailNewsletter?: string;
  hashtags: string[];
}

export async function genererContenuSocial(params: {
  nomEntreprise: string;
  secteur: string;
  sujet: string;
  reseaux: Array<"linkedin" | "instagram" | "facebook">;
  tonalite?: "professionnel" | "decontracte" | "inspirant";
}): Promise<ContenuMarketing> {
  const tonalite = params.tonalite || "professionnel";

  const { contenu } = await callAgent(
    MODELS.HAIKU,
    SYSTEM_PROMPT,
    `Génère du contenu marketing pour "${params.nomEntreprise}" (${params.secteur}).

Sujet : ${params.sujet}
Tonalité : ${tonalite}
Réseaux ciblés : ${params.reseaux.join(", ")}

Retourne UNIQUEMENT ce JSON (inclure seulement les réseaux demandés) :
{
  ${params.reseaux.includes("linkedin") ? '"linkedin": "string (post LinkedIn 150-300 mots)",' : ""}
  ${params.reseaux.includes("instagram") ? '"instagram": "string (caption Instagram 50-150 mots)",' : ""}
  ${params.reseaux.includes("facebook") ? '"facebook": "string (post Facebook 100-200 mots)",' : ""}
  "hashtags": ["string"]
}`,
    2048
  );

  const cleaned = contenu.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned) as ContenuMarketing;
}

export async function genererEmailNewsletter(params: {
  nomEntreprise: string;
  secteur: string;
  sujet: string;
  offre?: string;
}): Promise<{ sujet: string; corps: string }> {
  const { contenu } = await callAgent(
    MODELS.SONNET,
    SYSTEM_PROMPT,
    `Génère une newsletter email pour "${params.nomEntreprise}" (${params.secteur}).

Sujet/thème : ${params.sujet}
${params.offre ? `Offre à mettre en avant : ${params.offre}` : ""}

Retourne UNIQUEMENT ce JSON :
{
  "sujet": "string (objet email accrocheur)",
  "corps": "string (email HTML-friendly, 300-500 mots)"
}`,
    2048
  );

  const cleaned = contenu.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned) as { sujet: string; corps: string };
}
