import { callAgent, MODELS } from "@/lib/claude";

const SYSTEM_PROMPT = `Tu es l'Agent Administratif de Gestia, une plateforme SaaS française pour entrepreneurs.
Tu génères des devis, factures, et relances clients professionnels en français.

Règles :
- Toujours répondre en JSON valide quand demandé
- Utiliser un ton professionnel mais chaleureux
- Respecter les normes françaises (TVA 20%, mentions légales, format date JJ/MM/AAAA)
- Les montants sont en euros (€)
- Ne jamais inventer des informations non fournies — utiliser des placeholders clairs`;

export interface LigneDocument {
  description: string;
  quantite: number;
  prixUnitaireHT: number;
  totalHT: number;
}

export interface DocumentGenere {
  titre: string;
  lignes: LigneDocument[];
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  notes: string;
  conditions: string;
}

export async function genererDevis(params: {
  descriptionProjet: string;
  nomClient: string;
  nomEntreprise: string;
}): Promise<DocumentGenere> {
  const { contenu } = await callAgent(
    MODELS.SONNET,
    SYSTEM_PROMPT,
    `Génère un devis professionnel en JSON pour :
Client : ${params.nomClient}
Entreprise émettrice : ${params.nomEntreprise}
Description du projet : ${params.descriptionProjet}

Retourne UNIQUEMENT ce JSON (sans markdown) :
{
  "titre": "string",
  "lignes": [{"description": "string", "quantite": number, "prixUnitaireHT": number, "totalHT": number}],
  "totalHT": number,
  "totalTVA": number,
  "totalTTC": number,
  "notes": "string",
  "conditions": "string"
}`,
    2048
  );

  const cleaned = contenu.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned) as DocumentGenere;
}

export async function genererFacture(params: {
  descriptionPrestations: string;
  nomClient: string;
  nomEntreprise: string;
  devisReference?: string;
}): Promise<DocumentGenere> {
  const { contenu } = await callAgent(
    MODELS.SONNET,
    SYSTEM_PROMPT,
    `Génère une facture professionnelle en JSON pour :
Client : ${params.nomClient}
Entreprise émettrice : ${params.nomEntreprise}
${params.devisReference ? `Référence devis : ${params.devisReference}` : ""}
Prestations : ${params.descriptionPrestations}

Retourne UNIQUEMENT ce JSON (sans markdown) :
{
  "titre": "string",
  "lignes": [{"description": "string", "quantite": number, "prixUnitaireHT": number, "totalHT": number}],
  "totalHT": number,
  "totalTVA": number,
  "totalTTC": number,
  "notes": "string",
  "conditions": "Paiement sous 30 jours. En cas de retard, pénalités de 3 fois le taux légal."
}`,
    2048
  );

  const cleaned = contenu.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned) as DocumentGenere;
}

export async function genererRelance(params: {
  nomClient: string;
  nomEntreprise: string;
  numeroFacture: string;
  montantTTC: number;
  dateEcheance: string;
  nbRelances: number;
}): Promise<{ sujet: string; corps: string }> {
  const niveauRelance =
    params.nbRelances === 0
      ? "première relance, ton cordial"
      : params.nbRelances === 1
        ? "deuxième relance, ton plus ferme"
        : "troisième relance, ton formel, mention de voies légales possibles";

  const { contenu } = await callAgent(
    MODELS.HAIKU,
    SYSTEM_PROMPT,
    `Génère un email de relance (${niveauRelance}) en JSON :
Client : ${params.nomClient}
Entreprise : ${params.nomEntreprise}
Facture n° : ${params.numeroFacture}
Montant TTC : ${params.montantTTC}€
Échéance : ${params.dateEcheance}

Retourne UNIQUEMENT ce JSON :
{"sujet": "string", "corps": "string"}`,
    1024
  );

  const cleaned = contenu.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned) as { sujet: string; corps: string };
}
