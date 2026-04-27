export const TEAM_AGENTS = [
  {
    id: "ines",
    prenom: "Inès",
    role: "Assistante administrative",
    emoji: "🗂️",
    initiale: "I",
    couleur: "blue",
    accentBg: "bg-blue-600",
    cardBg: "bg-blue-50",
    cardBorder: "border-blue-200",
    textColor: "text-blue-600",
    baseline: "Devis, factures et relances sans effort",
    description:
      "12 ans d'expérience en cabinet d'expertise comptable. Inès maîtrise toutes les normes françaises : TVA, mentions légales, facturation électronique 2026.",
    missions: [
      "Génère vos devis en 30 secondes",
      "Crée vos factures conformes aux normes",
      "Relance automatiquement les impayés avec 3 niveaux de ton",
    ],
    pourQui:
      "Parfait pour les artisans et commerçants qui passent des heures sur leur administratif.",
    lien: "/devis/nouveau",
  },
  {
    id: "lea",
    prenom: "Léa",
    role: "Responsable service client",
    emoji: "✉️",
    initiale: "L",
    couleur: "emerald",
    accentBg: "bg-emerald-600",
    cardBg: "bg-emerald-50",
    cardBorder: "border-emerald-200",
    textColor: "text-emerald-600",
    baseline: "Vos emails clients traités 24h/24",
    description:
      "8 ans en customer success. Léa a géré plus de 50 000 tickets clients et sait désescalader même les situations les plus tendues.",
    missions: [
      "Analyse chaque email entrant (catégorie, urgence)",
      "Rédige une réponse empathique et pro",
      "Adapte le ton : info, réclamation douce, réclamation agressive",
    ],
    pourQui:
      "Indispensable si vous ne voulez plus louper un client pendant vos vacances ou vos pics d'activité.",
    lien: "/emails",
  },
  {
    id: "hugo",
    prenom: "Hugo",
    role: "Directeur financier",
    emoji: "💰",
    initiale: "H",
    couleur: "violet",
    accentBg: "bg-violet-600",
    cardBg: "bg-violet-50",
    cardBorder: "border-violet-200",
    textColor: "text-violet-600",
    baseline: "Votre rapport financier chaque lundi matin",
    description:
      "15 ans en direction financière PME. Hugo reconnaît un problème de trésorerie ou un client toxique en 30 secondes de lecture.",
    missions: [
      "Analyse CA, impayés, devis en attente",
      "Identifie les points forts et les tensions",
      "Donne 3 actions concrètes pour la semaine",
    ],
    pourQui:
      "Pour tous les dirigeants qui n'ont jamais su lire un bilan mais veulent piloter leurs chiffres.",
    lien: "/rapports",
  },
  {
    id: "cyprien",
    prenom: "Cyprien",
    role: "Directeur marketing",
    emoji: "📢",
    initiale: "C",
    couleur: "orange",
    accentBg: "bg-orange-600",
    cardBg: "bg-orange-50",
    cardBorder: "border-orange-200",
    textColor: "text-orange-600",
    baseline: "Posts et newsletters prêts à publier",
    description:
      "10 ans en content marketing, plus de 5 000 posts produits pour des marques TPE/PME. Cyprien maîtrise les algorithmes des réseaux sociaux français.",
    missions: [
      "Rédige vos posts LinkedIn, Instagram, Facebook",
      "Génère vos newsletters prêtes à envoyer",
      "Adapte automatiquement le ton selon la plateforme",
    ],
    pourQui:
      "Pour les entrepreneurs qui savent que le marketing compte, mais n'ont ni le temps ni les mots pour s'en occuper.",
    lien: "/marketing",
  },
  {
    id: "augustin",
    prenom: "Augustin",
    role: "Directeur général",
    emoji: "🎯",
    initiale: "A",
    couleur: "gray",
    accentBg: "bg-gray-900",
    cardBg: "bg-gray-100",
    cardBorder: "border-gray-300",
    textColor: "text-gray-800",
    baseline: "Votre stratégie trimestrielle décodée",
    description:
      "20 ans d'accompagnement de dirigeants. Ancien consultant en stratégie, Augustin voit plus loin que les chiffres de la semaine.",
    missions: [
      "Diagnostic stratégique avec le cadre STAR",
      "Identifie vos vraies tensions structurelles",
      "Définit 3 axes prioritaires sur 90 jours",
    ],
    pourQui:
      "Pour les dirigeants qui veulent arrêter de subir leur quotidien et reprendre la main sur leur vision.",
    lien: "/strategie",
  },
] as const;

export type TeamAgent = (typeof TEAM_AGENTS)[number];
