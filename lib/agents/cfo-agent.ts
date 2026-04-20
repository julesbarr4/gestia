import { callAgent, MODELS } from "@/lib/claude";

const SYSTEM_PROMPT = `Tu es le CFO (Directeur Financier) IA de Gestia. Tu analyses les données financières d'entrepreneurs français et fournis des analyses claires et des recommandations concrètes.

Règles :
- Analyses chiffrées et précises
- Recommandations actionnables et réalistes
- Utiliser des termes simples, pas de jargon financier inutile
- Toujours contextualiser par rapport à la norme du secteur si possible
- Être honnête si les données sont insuffisantes pour une analyse complète`;

export interface RapportFinancier {
  resumeExecutif: string;
  pointsForts: string[];
  pointsVigilance: string[];
  recommandations: string[];
  objectifsSemaineSuivante: string[];
}

export async function genererRapportHebdomadaire(params: {
  nomEntreprise: string;
  caSemaine: number;
  caMois: number;
  caMoisPrecedent: number;
  facturesImpayees: number;
  montantImpaye: number;
  nbNouveauxClients: number;
  nbDevisEnAttente: number;
  devisAcceptesTaux: number;
}): Promise<RapportFinancier> {
  const { contenu } = await callAgent(
    MODELS.SONNET,
    SYSTEM_PROMPT,
    `Génère le rapport financier hebdomadaire pour "${params.nomEntreprise}" :

Données cette semaine :
- CA semaine : ${params.caSemaine}€
- CA mois en cours : ${params.caMois}€
- CA mois précédent : ${params.caMoisPrecedent}€
- Factures impayées : ${params.facturesImpayees} (${params.montantImpaye}€)
- Nouveaux clients : ${params.nbNouveauxClients}
- Devis en attente de réponse : ${params.nbDevisEnAttente}
- Taux d'acceptation devis : ${params.devisAcceptesTaux}%

Retourne UNIQUEMENT ce JSON :
{
  "resumeExecutif": "string (2-3 phrases)",
  "pointsForts": ["string"],
  "pointsVigilance": ["string"],
  "recommandations": ["string"],
  "objectifsSemaineSuivante": ["string"]
}`,
    2048
  );

  const cleaned = contenu.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned) as RapportFinancier;
}

export async function analyserTresorerie(params: {
  nomEntreprise: string;
  soldeActuel: number;
  chargesMensuelles: number;
  caPrevu: number;
  facturessEcheances: Array<{ montant: number; dateEcheance: string }>;
}): Promise<{ analyse: string; alertes: string[]; conseils: string[] }> {
  const { contenu } = await callAgent(
    MODELS.HAIKU,
    SYSTEM_PROMPT,
    `Analyse la trésorerie de "${params.nomEntreprise}" :

Solde actuel : ${params.soldeActuel}€
Charges mensuelles : ${params.chargesMensuelles}€
CA prévu ce mois : ${params.caPrevu}€
Factures à encaisser : ${JSON.stringify(params.facturessEcheances)}

Retourne UNIQUEMENT ce JSON :
{
  "analyse": "string",
  "alertes": ["string"],
  "conseils": ["string"]
}`,
    1024
  );

  const cleaned = contenu.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned) as {
    analyse: string;
    alertes: string[];
    conseils: string[];
  };
}
