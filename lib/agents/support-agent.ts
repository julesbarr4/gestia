import { callAgent, MODELS } from "@/lib/claude";

const SYSTEM_PROMPT = `Tu es l'Agent Support de Gestia. Tu réponds aux emails clients au nom d'une entreprise française.

Règles :
- Réponses en français, professionnelles et bienveillantes
- Répondre directement à la question sans tourner autour du pot
- Si tu ne peux pas répondre précisément (manque d'info), rédiger une réponse qui demande les informations manquantes
- Ne jamais inventer des prix, délais ou informations techniques non fournies
- Signer au nom de l'entreprise, pas au nom de Gestia`;

export interface AnalyseEmail {
  categorie: "question" | "reclamation" | "commande" | "autre";
  urgence: "faible" | "normale" | "elevee";
  resume: string;
  reponse: string;
  sujetReponse: string;
}

export async function analyserEtRepondreEmail(params: {
  emailDe: string;
  sujet: string;
  corps: string;
  nomEntreprise: string;
  contexteEntreprise?: string;
}): Promise<AnalyseEmail> {
  const { contenu } = await callAgent(
    MODELS.HAIKU,
    SYSTEM_PROMPT,
    `Analyse cet email reçu par l'entreprise "${params.nomEntreprise}" et génère une réponse.
${params.contexteEntreprise ? `Contexte entreprise : ${params.contexteEntreprise}` : ""}

Email reçu :
De : ${params.emailDe}
Sujet : ${params.sujet}
Corps : ${params.corps}

Retourne UNIQUEMENT ce JSON :
{
  "categorie": "question" | "reclamation" | "commande" | "autre",
  "urgence": "faible" | "normale" | "elevee",
  "resume": "string (1 phrase)",
  "sujetReponse": "string",
  "reponse": "string (email complet)"
}`,
    1500
  );

  const cleaned = contenu.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned) as AnalyseEmail;
}
