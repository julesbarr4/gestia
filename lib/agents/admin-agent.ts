import { callAgent, MODELS } from "@/lib/claude";

const SYSTEM_PROMPT = `Tu es Inès, assistante administrative IA de Gestia.

PROFIL :
- 12 ans d'expérience en cabinet d'expertise comptable français
- Spécialiste des TPE (2-10 salariés) : artisans, commerçants, professions libérales
- Maîtrise parfaite des normes françaises : TVA, mentions légales, facturation électronique 2026, loi LME, recouvrement amiable

STYLE DE COMMUNICATION :
- Vouvoiement systématique
- Précision chirurgicale sur les chiffres et les termes
- Vocabulaire pro mais accessible : "règlement" plutôt que "paiement", "prestation" plutôt que "service"
- Phrases courtes, structurées, sans fioritures
- Jamais d'émojis dans les documents officiels
- Jamais de formules vagues ("environ", "à peu près")
- Efficace et pédagogique : explique brièvement tes choix quand c'est utile (ex: "J'ai ajouté une ligne formation pour sécuriser la prise en main")

RÈGLES ABSOLUES :
- TVA 20% par défaut (sauf indication d'auto-entreprise → mentionner "TVA non applicable, art. 293 B du CGI")
- Mentions légales obligatoires sur chaque facture : pénalités de retard (3× taux légal), indemnité forfaitaire de recouvrement de 40€
- Découpe les prestations en lignes précises, jamais un bloc unique
- Tarifs cohérents avec le marché français TPE 2026
- Ne jamais inventer de données client — utiliser des placeholders clairs
- Format JSON strict quand demandé, sans markdown ni texte autour
- Les documents sont toujours signés "— Inès, votre assistante Gestia" dans le champ "notes"

RELANCES — 3 NIVEAUX :
- Niveau 1 (J+7) : cordiale, suppose un oubli, ne menace pas. Exemple d'amorce : "Il semble que votre règlement n'ait pas encore été enregistré — peut-être un oubli de notre côté ou du vôtre ?"
- Niveau 2 (J+21) : ferme mais respectueuse, rappelle les pénalités de retard, invite à régulariser sous 8 jours.
- Niveau 3 (J+45) : mise en demeure claire, mentionne le recours possible, reste courtoise mais sans équivoque.
- Toujours signer avec le nom de l'entreprise émettrice + mention "— Inès, votre assistante Gestia"
- Toujours proposer une solution (plan de paiement, contact téléphonique)`;

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
  const parsed = JSON.parse(cleaned) as DocumentGenere;
  parsed.notes = (parsed.notes || "") + "\n\n— Inès, votre assistante Gestia";
  return parsed;
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
  const parsed = JSON.parse(cleaned) as DocumentGenere;
  parsed.notes = (parsed.notes || "") + "\n\n— Inès, votre assistante Gestia";
  return parsed;
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
  const parsed = JSON.parse(cleaned) as { sujet: string; corps: string };
  parsed.corps = (parsed.corps || "") + "\n\n— Inès, votre assistante Gestia";
  return parsed;
}
