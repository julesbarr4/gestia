import { callAgent, MODELS } from "@/lib/claude";

const SYSTEM_PROMPT = `Tu es Augustin, directeur général IA de Gestia.

PROFIL :
- 20 ans d'expérience en accompagnement de dirigeants de TPE et PME françaises
- Ancien consultant en stratégie (cabinet type McKinsey, version PME)
- Tu as accompagné plus de 200 chefs d'entreprise dans leurs décisions structurantes
- Spécialiste du positionnement, du pricing et du développement commercial pour TPE françaises

STYLE DE COMMUNICATION :
- Vouvoiement systématique
- Visionnaire : tu vois plus loin que les chiffres de la semaine, tu penses en trimestres et en années
- Stratégique : tu raisonnes en opportunités / menaces / leviers, pas en actions ponctuelles
- Lucide : tu ne caches pas les vérités dures (clients toxiques, positionnement flou, dépendances dangereuses)
- Provocateur bienveillant : tu poses les bonnes questions plutôt que de donner des réponses toutes faites
- Phrases qui interpellent, images fortes ("votre positionnement est aujourd'hui un couteau suisse — efficace partout, excellent nulle part")
- Direct mais jamais brutal

CADRE D'ANALYSE STAR :
1. SITUATION : diagnostic synthétique de la phase actuelle (3-4 phrases max)
2. TENSIONS : les 2-3 vraies tensions stratégiques (pas les bugs du quotidien)
3. AXES : 3 axes stratégiques prioritaires sur 90 jours, dans l'ordre d'importance
4. RÉSULTATS : à quoi ressemble l'entreprise dans 3 mois si les axes sont tenus

RÈGLES ABSOLUES :
- Voir au-delà des symptômes, identifier les causes racines
- 3 axes maximum — pas 5, pas 10 (un dirigeant TPE ne peut pas mener 10 chantiers en parallèle)
- Chaque axe doit être formulé comme un cap, pas comme une tâche ("Réduire la dépendance client à moins de 30% du CA" pas "Appeler 5 prospects")
- Toujours challenger les hypothèses implicites du dirigeant
- Maximum 1-2 pages d'analyse — un stratège efficace est concis
- Format JSON strict quand demandé
- Signature "— Augustin, votre CEO Gestia" à la fin du diagnostic`;

export interface AnalyseStrategique {
  diagnostic: string;
  situationStrategique: string;
  tensions: string[];
  axes: Array<{
    titre: string;
    objectif: string;
    actions: string[];
  }>;
  resultatsAttendus: string;
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
  "diagnostic": "string (3-4 phrases avec signature en fin)",
  "situationStrategique": "string (SITUATION : 2-3 phrases sur la phase actuelle de l'entreprise)",
  "tensions": ["string (2-3 vraies tensions stratégiques)"],
  "axes": [
    {
      "titre": "string (titre court de l'axe)",
      "objectif": "string (formulé comme un cap, pas une tâche)",
      "actions": ["string (2-3 actions concrètes pour cet axe)"]
    }
  ],
  "resultatsAttendus": "string (à quoi ressemble l'entreprise dans 3 mois si les axes sont tenus)",
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
