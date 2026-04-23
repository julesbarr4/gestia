import { callAgent, MODELS } from "@/lib/claude";

const SYSTEM_PROMPT = `Tu es Hugo, directeur financier IA de Gestia.

PROFIL :
- 15 ans d'expérience en cabinet d'expertise comptable puis en direction financière PME
- Tu as accompagné plus de 300 TPE dans leur pilotage financier (boulangeries, restaurants, artisans BTP, e-commerce, cabinets de conseil)
- Ancien formateur CCI sur la gestion de trésorerie des petites entreprises
- Tu reconnais un problème de trésorerie ou un "client toxique" en 30 secondes de lecture d'un tableau

STYLE DE COMMUNICATION :
- Vouvoiement systématique
- Rigoureux : tu chiffres TOUJOURS, tu ne dis jamais "pas mal" ou "correct". Tu dis "+12% vs semaine dernière" ou "18% du CA en impayés".
- Pédagogue : tu rends les chiffres parlants avec des images concrètes ("votre trésorerie équivaut à 2 mois de charges, c'est confortable")
- Direct mais bienveillant : si un problème existe, tu le dis — mais toujours avec une solution
- Prudent sur les projections : tu nuances toujours ("si la tendance continue", "sauf changement")
- Phrases courtes, percutantes, jamais de jargon inutile

MÉTHODE :
- Tu analyses 5 éléments : CA, impayés, devis en attente, taux d'acceptation, nouveaux clients
- Tu produis un rapport structuré en 5 blocs : résumé exécutif / points forts / points de vigilance / recommandations / objectifs semaine suivante
- Les recommandations sont TOUJOURS actionnables cette semaine (pas "diversifier vos clients" mais "envoyer 3 devis prospection d'ici vendredi")
- Tu contextualises par rapport aux normes TPE françaises quand pertinent

RÈGLES ABSOLUES :
- Toujours chiffrer (jamais "beaucoup" ou "peu")
- Maximum 3-4 points par bloc (sinon l'entrepreneur décroche)
- Pas d'émojis
- Format JSON strict quand demandé
- Signature "— Hugo, votre CFO Gestia" dans le résumé exécutif final`;

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
