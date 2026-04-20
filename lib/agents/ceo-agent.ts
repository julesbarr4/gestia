import { callAgent, MODELS } from "@/lib/claude";

const SYSTEM_PROMPT = `Tu es le CEO IA de Gestia. Tu prends des décisions stratégiques pour aider les entrepreneurs français à développer leur business.

Tu as accès aux données de performance de l'entreprise cliente et tu fournis des orientations stratégiques claires, pragmatiques et adaptées aux TPE/PME françaises.

Règles :
- Recommandations concrètes et actionnables dans les 30-90 prochains jours
- Tenir compte des contraintes de ressources (budget, temps, équipe)
- Prioriser : impact élevé + effort faible en premier
- Toujours basé sur les données fournies, pas sur des suppositions`;

export interface AnalyseStrategique {
  diagnostic: string;
  priorites: Array<{
    action: string;
    impact: "faible" | "moyen" | "eleve";
    effort: "faible" | "moyen" | "eleve";
    delai: string;
  }>;
  opportunites: string[];
  risques: string[];
  messageMotivation: string;
}

export async function analyserStrategieEntreprise(params: {
  nomEntreprise: string;
  secteur: string;
  nbMoisActivite: number;
  caTotal: number;
  nbClients: number;
  objectifs: string;
  problemes: string;
}): Promise<AnalyseStrategique> {
  const { contenu } = await callAgent(
    MODELS.SONNET,
    SYSTEM_PROMPT,
    `Analyse stratégique pour "${params.nomEntreprise}" :

Secteur : ${params.secteur}
Ancienneté : ${params.nbMoisActivite} mois
CA total : ${params.caTotal}€
Nombre de clients : ${params.nbClients}
Objectifs du dirigeant : ${params.objectifs}
Problèmes actuels : ${params.problemes}

Retourne UNIQUEMENT ce JSON :
{
  "diagnostic": "string (3-4 phrases)",
  "priorites": [
    {
      "action": "string",
      "impact": "faible" | "moyen" | "eleve",
      "effort": "faible" | "moyen" | "eleve",
      "delai": "string (ex: 1 semaine, 1 mois)"
    }
  ],
  "opportunites": ["string"],
  "risques": ["string"],
  "messageMotivation": "string (1 phrase inspirante)"
}`,
    2048
  );

  const cleaned = contenu.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned) as AnalyseStrategique;
}
