// Référentiel des secteurs d'activité supportés par les agents IA.
//
// Chaque secteur fournit un contexte métier injecté dans les prompts pour
// adapter le ton, le vocabulaire et les leviers marketing aux réalités du
// terrain. Centraliser ces définitions évite de coder en dur "services"
// dans les routes API et permet d'ajouter un secteur sans toucher aux agents.

export type SecteurId =
  | "services"
  | "artisanat_btp"
  | "restauration"
  | "sante_bienetre"
  | "ecommerce"
  | "conseil";

export interface Secteur {
  id: SecteurId;
  /** Libellé affiché à l'utilisateur. */
  label: string;
  /** Description courte du secteur, injectée dans le prompt. */
  description: string;
  /** Vocabulaire et angles qui résonnent avec la clientèle du secteur. */
  vocabulaire: string[];
  /** Leviers marketing les plus efficaces pour ce secteur. */
  leviers: string[];
  /** Tonalité à privilégier par défaut. */
  tonaliteConseillee: "professionnel" | "decontracte" | "inspirant";
}

export const SECTEUR_PAR_DEFAUT: SecteurId = "services";

export const SECTEURS: Record<SecteurId, Secteur> = {
  services: {
    id: "services",
    label: "Services aux entreprises & particuliers",
    description:
      "Prestataire de services généraliste (B2B ou B2C) vendant du temps, de l'expertise ou de la main-d'œuvre.",
    vocabulaire: ["accompagnement", "sur-mesure", "réactivité", "proximité", "engagement"],
    leviers: [
      "Mettre en avant la relation de confiance et la disponibilité",
      "Témoignages clients concrets et avant/après",
      "Clarté sur le périmètre et les délais de la prestation",
    ],
    tonaliteConseillee: "professionnel",
  },

  artisanat_btp: {
    id: "artisanat_btp",
    label: "Artisanat & BTP",
    description:
      "Artisan ou entreprise du bâtiment (maçonnerie, plomberie, électricité, menuiserie, rénovation). Clientèle locale sensible au savoir-faire et aux garanties.",
    vocabulaire: ["savoir-faire", "chantier", "devis gratuit", "garantie décennale", "matériaux", "finitions"],
    leviers: [
      "Photos avant/après de chantiers réalisés",
      "Mettre en avant les labels (RGE, Qualibat) et assurances",
      "Ancrage local : zone d'intervention et bouche-à-oreille",
    ],
    tonaliteConseillee: "professionnel",
  },

  restauration: {
    id: "restauration",
    label: "Restauration & métiers de bouche",
    description:
      "Restaurant, traiteur, boulangerie, food-truck ou commerce de bouche. Décision d'achat émotionnelle et visuelle, forte saisonnalité.",
    vocabulaire: ["fait maison", "produits frais", "de saison", "circuit court", "gourmand", "réservation"],
    leviers: [
      "Contenu visuel et appétissant (photos de plats, coulisses cuisine)",
      "Mettre en avant la fraîcheur, l'origine des produits et les nouveautés du menu",
      "Jouer sur la saisonnalité et les événements (midi, brunch, fêtes)",
    ],
    tonaliteConseillee: "decontracte",
  },

  sante_bienetre: {
    id: "sante_bienetre",
    label: "Santé & bien-être",
    description:
      "Praticien du bien-être ou de la santé (kiné, ostéo, coach sportif, naturopathe, institut de beauté, spa). Clientèle en recherche de confiance et de résultats.",
    vocabulaire: ["bien-être", "écoute", "accompagnement personnalisé", "résultats durables", "sérénité", "prévention"],
    leviers: [
      "Pédagogie : expliquer le bénéfice santé sans promesse médicale abusive",
      "Rassurer sur le sérieux, les qualifications et l'hygiène",
      "Témoignages et résultats clients (dans le respect de la déontologie)",
    ],
    tonaliteConseillee: "inspirant",
  },

  ecommerce: {
    id: "ecommerce",
    label: "E-commerce & vente en ligne",
    description:
      "Boutique en ligne vendant des produits physiques ou numériques. Cycle d'achat court, forte concurrence, sensibilité aux promotions et à la preuve sociale.",
    vocabulaire: ["livraison", "stock limité", "nouveauté", "best-seller", "avis clients", "offre"],
    leviers: [
      "Urgence et rareté (stock limité, offre à durée déterminée)",
      "Preuve sociale : notes, avis et nombre de ventes",
      "Mise en avant claire du produit phare et de l'offre du moment",
    ],
    tonaliteConseillee: "decontracte",
  },

  conseil: {
    id: "conseil",
    label: "Conseil & professions intellectuelles",
    description:
      "Consultant, expert-comptable, avocat, agence ou freelance vendant de l'expertise intellectuelle à forte valeur ajoutée. Cycle de décision long, crédibilité déterminante.",
    vocabulaire: ["expertise", "ROI", "stratégie", "méthodologie", "cas client", "accompagnement"],
    leviers: [
      "Démontrer l'expertise par du contenu de fond (analyses, retours d'expérience)",
      "Études de cas chiffrées et résultats obtenus pour des clients",
      "Positionnement d'autorité et clarté de la promesse de valeur",
    ],
    tonaliteConseillee: "professionnel",
  },
};

/**
 * Résout un identifiant de secteur potentiellement absent/invalide
 * (saisie utilisateur, ancienne donnée "services" en base, etc.) vers une
 * définition de secteur garantie. Ne lève jamais.
 */
export function resoudreSecteur(secteur?: string | null): Secteur {
  if (secteur && secteur in SECTEURS) {
    return SECTEURS[secteur as SecteurId];
  }
  return SECTEURS[SECTEUR_PAR_DEFAUT];
}

/**
 * Construit le bloc de contexte secteur injecté dans les prompts des agents.
 */
export function contexteSecteurPourPrompt(secteur?: string | null): string {
  const s = resoudreSecteur(secteur);
  return [
    `Secteur d'activité du client : ${s.label}.`,
    s.description,
    `Vocabulaire qui résonne avec sa clientèle : ${s.vocabulaire.join(", ")}.`,
    `Leviers marketing prioritaires pour ce secteur :`,
    ...s.leviers.map((l) => `- ${l}`),
  ].join("\n");
}

/** Liste exploitable côté UI (menus déroulants). */
export const SECTEURS_LISTE: Array<{ id: SecteurId; label: string }> = (
  Object.values(SECTEURS)
).map((s) => ({ id: s.id, label: s.label }));
