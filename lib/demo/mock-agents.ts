import type { DocumentGenere } from "@/lib/agents/admin-agent";
import type { RapportFinancier } from "@/lib/agents/cfo-agent";
import type { AnalyseStrategique } from "@/lib/agents/ceo-agent";
import type { ContenuMarketing } from "@/lib/agents/cmo-agent";
import type { AnalyseEmail } from "@/lib/agents/support-agent";

export async function mockGenererDevis(params: {
  descriptionProjet: string;
  nomClient: string;
  nomEntreprise?: string;
}): Promise<DocumentGenere> {
  const variations: DocumentGenere[] = [
    {
      titre: "Devis DEV-2026-042 — Création site internet",
      lignes: [
        { description: "Conception maquettes graphiques (3 propositions)", quantite: 1, prixUnitaireHT: 800, totalHT: 800 },
        { description: "Intégration HTML/CSS responsive (5 pages)", quantite: 5, prixUnitaireHT: 280, totalHT: 1400 },
        { description: "Développement back-office administrable", quantite: 1, prixUnitaireHT: 1200, totalHT: 1200 },
        { description: "Formation à l'administration (2h)", quantite: 2, prixUnitaireHT: 90, totalHT: 180 },
      ],
      totalHT: 3580,
      totalTVA: 716,
      totalTTC: 4296,
      notes: "Devis établi sur la base d'un cahier des charges type. Toute prestation complémentaire fera l'objet d'un avenant.\n\n— Inès, votre assistante Gestia",
      conditions: "Acompte de 30% à la commande, solde à livraison. Devis valable 30 jours. TVA 20%.",
    },
    {
      titre: "Devis DEV-2026-043 — Rénovation salle de bain",
      lignes: [
        { description: "Dépose ancien équipement et évacuation gravats", quantite: 1, prixUnitaireHT: 450, totalHT: 450 },
        { description: "Fourniture et pose douche italienne (receveur + paroi)", quantite: 1, prixUnitaireHT: 1850, totalHT: 1850 },
        { description: "Fourniture et pose meuble vasque simple vasque 80cm", quantite: 1, prixUnitaireHT: 680, totalHT: 680 },
        { description: "Raccordements plomberie et mise en eau", quantite: 1, prixUnitaireHT: 420, totalHT: 420 },
        { description: "Main d'œuvre (3 jours, 2 ouvriers)", quantite: 6, prixUnitaireHT: 380, totalHT: 2280 },
      ],
      totalHT: 5680,
      totalTVA: 568,
      totalTTC: 6248,
      notes: "TVA réduite à 10% applicable (logement de plus de 2 ans, travaux de rénovation). Attestation à fournir par le client avant facturation.\n\n— Inès, votre assistante Gestia",
      conditions: "Acompte de 40% à la commande. Solde à la réception des travaux. Devis valable 30 jours. Garantie décennale incluse.",
    },
    {
      titre: "Devis DEV-2026-044 — Mission conseil stratégique",
      lignes: [
        { description: "Audit initial et diagnostic (2 jours)", quantite: 2, prixUnitaireHT: 1200, totalHT: 2400 },
        { description: "Rédaction plan d'action sur 90 jours", quantite: 1, prixUnitaireHT: 1800, totalHT: 1800 },
        { description: "Atelier de restitution équipe (1/2 journée)", quantite: 1, prixUnitaireHT: 900, totalHT: 900 },
        { description: "Suivi mensuel (3 mois, 2h/mois)", quantite: 6, prixUnitaireHT: 180, totalHT: 1080 },
      ],
      totalHT: 6180,
      totalTVA: 1236,
      totalTTC: 7416,
      notes: "Mission réalisée dans vos locaux ou en visio selon votre préférence. Confidentialité assurée par NDA joint.\n\n— Inès, votre assistante Gestia",
      conditions: "Règlement en 3 fois : 30% à la signature, 40% après restitution, 30% au terme du suivi. Devis valable 45 jours. TVA 20%.",
    },
  ];
  return variations[Math.floor(Math.random() * variations.length)];
}

export async function mockGenererFacture(params: {
  descriptionPrestations: string;
  nomClient: string;
  nomEntreprise?: string;
  devisReference?: string;
}): Promise<DocumentGenere> {
  const variations: DocumentGenere[] = [
    {
      titre: "Facture FAC-2026-087",
      lignes: [
        { description: "Solde création site internet (cf. devis DEV-2026-042)", quantite: 1, prixUnitaireHT: 2506, totalHT: 2506 },
      ],
      totalHT: 2506,
      totalTVA: 501.2,
      totalTTC: 3007.2,
      notes: "Acompte de 1288,80 € déjà réglé le 12/01/2026. Solde dû : 3007,20 €.\n\n— Inès, votre assistante Gestia",
      conditions: "Règlement sous 30 jours. Pénalités de retard : 3× le taux légal. Indemnité forfaitaire de recouvrement : 40€ (art. L441-10 du Code de commerce).",
    },
    {
      titre: "Facture FAC-2026-088",
      lignes: [
        { description: "Rénovation salle de bain — fourniture et pose", quantite: 1, prixUnitaireHT: 3400, totalHT: 3400 },
        { description: "Main d'œuvre (3 jours, 2 ouvriers)", quantite: 6, prixUnitaireHT: 380, totalHT: 2280 },
      ],
      totalHT: 5680,
      totalTVA: 568,
      totalTTC: 6248,
      notes: "TVA réduite à 10% appliquée (logement de plus de 2 ans). Garantie décennale : contrat n°MAAF-2026-00X.\n\n— Inès, votre assistante Gestia",
      conditions: "Règlement sous 30 jours. Pénalités de retard : 3× le taux légal. Indemnité forfaitaire de recouvrement : 40€ (art. L441-10 du Code de commerce).",
    },
    {
      titre: "Facture FAC-2026-089",
      lignes: [
        { description: "Mission conseil — Phase 2 : plan d'action 90 jours", quantite: 1, prixUnitaireHT: 1800, totalHT: 1800 },
        { description: "Atelier de restitution équipe (1/2 journée)", quantite: 1, prixUnitaireHT: 900, totalHT: 900 },
      ],
      totalHT: 2700,
      totalTVA: 540,
      totalTTC: 3240,
      notes: "Facture émise à l'achèvement de la phase 2 (cf. devis DEV-2026-044). Phase 3 (suivi mensuel) facturée à partir du mois prochain.\n\n— Inès, votre assistante Gestia",
      conditions: "Règlement sous 30 jours. Pénalités de retard : 3× le taux légal. Indemnité forfaitaire de recouvrement : 40€ (art. L441-10 du Code de commerce).",
    },
  ];
  return variations[Math.floor(Math.random() * variations.length)];
}

export async function mockGenererRelance(params: {
  nomClient: string;
  nomEntreprise: string;
  numeroFacture: string;
  montantTTC: number;
  dateEcheance: string;
  nbRelances: number;
}): Promise<{ sujet: string; corps: string }> {
  await new Promise((r) => setTimeout(r, 800));

  const { nomClient, nomEntreprise, numeroFacture, montantTTC, dateEcheance, nbRelances } = params;
  const montantFormate = `${montantTTC.toFixed(2)} €`;

  if (nbRelances === 0) {
    return {
      sujet: `Facture ${numeroFacture} — simple rappel`,
      corps: `Bonjour ${nomClient},\n\nJe me permets de vous contacter au sujet de la facture ${numeroFacture} d'un montant de ${montantFormate}, émise le ${dateEcheance}, dont le règlement n'a pas encore été enregistré à ce jour.\n\nIl s'agit certainement d'un simple oubli. Pourriez-vous vérifier de votre côté ?\n\nSi le règlement a déjà été effectué, merci d'ignorer ce message. Dans le cas contraire, je reste à votre disposition pour convenir d'un mode de paiement adapté.\n\nCordialement,\n${nomEntreprise}\n\n— Inès, votre assistante Gestia`,
    };
  }

  if (nbRelances === 1) {
    return {
      sujet: `Facture ${numeroFacture} — relance — action requise`,
      corps: `Bonjour ${nomClient},\n\nSauf erreur de notre part, la facture ${numeroFacture} d'un montant de ${montantFormate}, échue depuis le ${dateEcheance}, n'a toujours pas été réglée.\n\nPour mémoire, conformément aux conditions générales de vente, tout retard de règlement entraîne l'application de pénalités de retard équivalentes à 3 fois le taux d'intérêt légal, ainsi qu'une indemnité forfaitaire de recouvrement de 40 € (art. L441-10 du Code de commerce).\n\nNous vous invitons à procéder au règlement sous 8 jours. En cas de difficulté, n'hésitez pas à nous contacter pour étudier ensemble un échéancier de paiement.\n\nCordialement,\n${nomEntreprise}\n\n— Inès, votre assistante Gestia`,
    };
  }

  return {
    sujet: `Facture ${numeroFacture} — mise en demeure`,
    corps: `Bonjour ${nomClient},\n\nMalgré nos précédentes relances, la facture ${numeroFacture} d'un montant de ${montantFormate}, échue depuis le ${dateEcheance}, demeure impayée.\n\nLa présente vaut mise en demeure de régler sous 8 jours la somme due, majorée des pénalités de retard et de l'indemnité forfaitaire de 40 €.\n\nÀ défaut de régularisation dans ce délai, nous serons contraints d'engager une procédure de recouvrement par voie judiciaire, dont les frais seront à votre charge.\n\nNous restons toutefois disponibles pour trouver une solution amiable. Contactez-nous rapidement.\n\nCordialement,\n${nomEntreprise}\n\n— Inès, votre assistante Gestia`,
  };
}

export async function mockAnalyserEmailSupport(params: {
  emailDe: string;
  sujet: string;
  corps: string;
  nomEntreprise: string;
}): Promise<{
  categorie: string;
  urgence: string;
  resume: string;
  sujetReponse: string;
  reponse: string;
}> {
  await new Promise((r) => setTimeout(r, 1200));

  const { corps, nomEntreprise } = params;
  const corpsLower = corps.toLowerCase();

  const motsAgressifs = [
    "scandaleux",
    "inacceptable",
    "arnaque",
    "honteux",
    "nul",
    "catastrophe",
    "jamais ça",
    "avis négatif",
    "procès",
    "avocat",
    "!!",
  ];
  const motsReclamation = [
    "retard",
    "problème",
    "erreur",
    "déçu",
    "pas reçu",
    "ne fonctionne pas",
    "cassé",
    "remboursement",
    "insatisfait",
  ];

  const estAgressif = motsAgressifs.some((m) => corpsLower.includes(m));
  const estReclamation = motsReclamation.some((m) => corpsLower.includes(m));

  if (estAgressif) {
    return {
      categorie: "reclamation",
      urgence: "elevee",
      resume:
        "Client très mécontent exprimant une insatisfaction forte. Désescalade prioritaire.",
      sujetReponse: `RE: ${params.sujet || "Votre message"} — nous traitons votre demande en priorité`,
      reponse: `Bonjour,

Je comprends parfaitement votre frustration, et je tiens d'abord à vous présenter nos sincères excuses pour la situation que vous décrivez. Votre insatisfaction est légitime et nous la prenons très au sérieux.

Nous allons traiter votre demande en priorité absolue. Pour pouvoir vous apporter une réponse précise et une solution adaptée, pourriez-vous nous préciser :
- La date et la référence de votre commande ou intervention
- Les éléments concrets qui posent problème

Je m'engage personnellement à revenir vers vous sous 24 heures ouvrées avec une proposition concrète. En attendant, n'hésitez pas à me joindre directement par téléphone si vous le souhaitez.

Nous tenons à la qualité de notre relation avec vous et ferons le nécessaire pour trouver une issue satisfaisante.

Bien cordialement,
${nomEntreprise}`,
    };
  }

  if (estReclamation) {
    return {
      categorie: "reclamation",
      urgence: "normale",
      resume:
        "Client signale un problème avec sa commande/prestation. Réponse empathique et orientée solution attendue.",
      sujetReponse: `RE: ${params.sujet || "Votre message"}`,
      reponse: `Bonjour,

Merci d'avoir pris le temps de nous écrire, et je suis sincèrement désolée pour la gêne occasionnée.

Je comprends que cette situation ne corresponde pas à ce que vous étiez en droit d'attendre. Nous allons examiner votre dossier dans les plus brefs délais afin de comprendre ce qui s'est passé et de trouver ensemble la meilleure solution.

Pourriez-vous me confirmer la référence de votre commande (ou la date de votre intervention) afin que je puisse accéder rapidement à votre dossier ?

Je reviens vers vous sous 48 heures ouvrées avec une proposition concrète. Merci par avance pour votre patience.

Bien cordialement,
${nomEntreprise}`,
    };
  }

  return {
    categorie: "question",
    urgence: "faible",
    resume:
      "Demande d'information standard avant achat ou engagement. Réponse commerciale accueillante attendue.",
    sujetReponse: `RE: ${params.sujet || "Votre demande d'information"}`,
    reponse: `Bonjour,

Merci pour votre message et pour l'intérêt que vous portez à nos services.

Je reviens vers vous avec grand plaisir. Pour vous apporter une réponse la plus précise possible, pourriez-vous me préciser en quelques mots votre besoin exact et le délai dans lequel vous souhaitez avancer ?

Je me tiens également disponible pour un échange téléphonique si cela vous convient mieux — n'hésitez pas à me proposer un créneau.

Bien cordialement,
${nomEntreprise}`,
  };
}

export async function mockRapportHebdomadaire(params: {
  nomEntreprise?: string;
  caSemaine?: number;
  caMois?: number;
  caMoisPrecedent?: number;
  facturesImpayees?: number;
  montantImpaye?: number;
  nbNouveauxClients?: number;
  nbDevisEnAttente?: number;
  devisAcceptesTaux?: number;
} = {}): Promise<RapportFinancier> {
  await new Promise((r) => setTimeout(r, 1500));

  const {
    caSemaine = 9960,
    caMois = 9960,
    caMoisPrecedent = 8200,
    facturesImpayees = 2,
    montantImpaye = 1800,
    nbNouveauxClients = 1,
    nbDevisEnAttente = 1,
    devisAcceptesTaux = 50,
  } = params;

  const progressionCA =
    caMoisPrecedent > 0
      ? Math.round(((caMois - caMoisPrecedent) / caMoisPrecedent) * 100)
      : 0;
  const ratioImpayes = caMois > 0 ? (montantImpaye / caMois) * 100 : 0;

  const estSante =
    progressionCA >= 5 &&
    ratioImpayes < 10 &&
    devisAcceptesTaux >= 55 &&
    facturesImpayees <= 1;

  const estTension =
    progressionCA < -5 ||
    ratioImpayes > 25 ||
    facturesImpayees >= 3 ||
    (caSemaine === 0 && caMois < caMoisPrecedent * 0.5);

  if (estSante) {
    return {
      resumeExecutif: `Semaine solide : votre CA mensuel progresse de +${progressionCA}% vs mois dernier (${caMois}€ vs ${caMoisPrecedent}€). Vos impayés restent maîtrisés à ${ratioImpayes.toFixed(0)}% du CA, et votre taux d'acceptation devis de ${devisAcceptesTaux}% est au-dessus de la moyenne TPE (50%). Le moteur tourne bien — c'est le moment de pousser sur l'acquisition.\n\n— Hugo, votre CFO Gestia`,
      pointsForts: [
        `CA en progression de +${progressionCA}% sur le mois en cours`,
        `Taux d'acceptation devis à ${devisAcceptesTaux}%, soit ${devisAcceptesTaux - 50} points au-dessus de la moyenne TPE`,
        `${nbNouveauxClients} nouveau(x) client(s) ce mois — signe d'une acquisition saine`,
        `Ratio impayés maîtrisé à ${ratioImpayes.toFixed(0)}% du CA (seuil d'alerte : 15%)`,
      ],
      pointsVigilance: [
        `${nbDevisEnAttente} devis toujours en attente de réponse — à relancer cette semaine pour ne pas perdre ces opportunités`,
        `Attention à ne pas vous reposer sur vos lauriers : une croissance à +${progressionCA}% demande de sécuriser la capacité de production`,
      ],
      recommandations: [
        `Relancer les ${nbDevisEnAttente} devis en attente d'ici vendredi par un simple message (3 lignes max)`,
        `Envoyer 3 devis prospection cette semaine pour maintenir le pipeline`,
        `Commencer à constituer une réserve de trésorerie équivalente à 2 mois de charges fixes`,
      ],
      objectifsSemaineSuivante: [
        `Transformer au moins 2 des ${nbDevisEnAttente} devis en attente`,
        `Maintenir un taux d'acceptation devis supérieur à 55%`,
        `Encaisser 100% des factures arrivant à échéance`,
      ],
    };
  }

  if (estTension) {
    return {
      resumeExecutif: `Semaine sous tension : votre CA mensuel est à ${caMois}€ contre ${caMoisPrecedent}€ le mois dernier (${progressionCA >= 0 ? "+" : ""}${progressionCA}%), et vous portez ${montantImpaye}€ d'impayés sur ${facturesImpayees} factures — soit ${ratioImpayes.toFixed(0)}% de votre CA du mois. Le pilotage financier doit devenir votre priorité absolue cette semaine.\n\n— Hugo, votre CFO Gestia`,
      pointsForts: [
        nbDevisEnAttente > 0
          ? `${nbDevisEnAttente} devis en attente : du business potentiel existe, il faut le concrétiser`
          : `Vous avez identifié la situation — c'est déjà 50% du chemin pour la redresser`,
      ],
      pointsVigilance: [
        `${facturesImpayees} facture(s) impayée(s) pour ${montantImpaye}€ — ${ratioImpayes.toFixed(0)}% de votre CA mensuel (seuil critique : 15%)`,
        progressionCA < 0
          ? `CA en baisse de ${Math.abs(progressionCA)}% vs mois dernier — la tendance doit s'inverser`
          : `CA stagnant alors que les impayés s'accumulent — effet ciseaux dangereux`,
        devisAcceptesTaux < 50
          ? `Taux d'acceptation devis à seulement ${devisAcceptesTaux}% — vos propositions ne convertissent pas`
          : `Capacité commerciale intacte (${devisAcceptesTaux}% d'acceptation) — à mobiliser sur l'encaissement`,
      ],
      recommandations: [
        `Priorité 1 absolue : relancer TOUS les impayés cette semaine. Utilisez les relances d'Inès.`,
        `Priorité 2 : n'émettre aucun nouveau devis sans acompte de 30% minimum jusqu'à nouvel ordre`,
        `Priorité 3 : lister vos charges fixes mensuelles et identifier ce qui peut être décalé de 30 jours`,
        `Contacter votre banquier PROACTIVEMENT cette semaine pour négocier un découvert autorisé, avant d'en avoir besoin`,
      ],
      objectifsSemaineSuivante: [
        `Récupérer au moins ${Math.round(montantImpaye * 0.4)}€ sur les impayés (40% du total)`,
        `Sécuriser un rendez-vous banque si ce n'est pas déjà fait`,
        `Ne signer aucun nouveau devis sans clause d'acompte`,
      ],
    };
  }

  return {
    resumeExecutif: `Situation stable mais à surveiller : ${caMois}€ de CA ce mois (${progressionCA >= 0 ? "+" : ""}${progressionCA}% vs mois dernier), avec ${facturesImpayees} facture(s) impayée(s) pour ${montantImpaye}€. Votre pipeline est sain (${nbDevisEnAttente} devis en attente, taux d'acceptation ${devisAcceptesTaux}%), mais certains signaux méritent votre attention cette semaine.\n\n— Hugo, votre CFO Gestia`,
    pointsForts: [
      progressionCA >= 0
        ? `CA en progression de +${progressionCA}% sur le mois`
        : `Activité maintenue malgré un léger recul de ${Math.abs(progressionCA)}%`,
      `${nbDevisEnAttente} devis en attente : base commerciale active`,
      nbNouveauxClients > 0
        ? `${nbNouveauxClients} nouveau(x) client(s) acquis ce mois`
        : `Taux d'acceptation devis à ${devisAcceptesTaux}%`,
    ],
    pointsVigilance: [
      `${ratioImpayes.toFixed(0)}% de votre CA mensuel en impayés — sous le seuil critique (15%) mais à ne pas laisser dériver`,
      nbDevisEnAttente >= 3
        ? `${nbDevisEnAttente} devis en attente : au-delà de 2 semaines sans réponse, le taux de conversion chute de 60%`
        : `Pipeline commercial limité : il faut alimenter en continu pour sécuriser les prochains mois`,
      devisAcceptesTaux < 55
        ? `Taux d'acceptation devis à ${devisAcceptesTaux}% — moyenne nationale à 50%, mais vous pouvez viser 60%+ avec un ciblage plus précis`
        : `Concentration du CA à surveiller — quel est votre plus gros client en % du CA ?`,
    ],
    recommandations: [
      `Relancer les ${facturesImpayees} factures impayées dans les 48h — chaque jour qui passe réduit vos chances de 2%`,
      `Fixer un rythme de prospection hebdomadaire : 5 contacts qualifiés minimum cette semaine`,
      `Analyser vos 3 plus gros clients : représentent-ils plus de 50% de votre CA ? Si oui, diversifier est prioritaire`,
    ],
    objectifsSemaineSuivante: [
      `Encaisser au moins une facture impayée`,
      `Convertir au moins 1 des ${nbDevisEnAttente} devis en attente`,
      `Maintenir un taux d'acceptation devis supérieur à 50%`,
    ],
  };
}

export async function mockAnalyseStrategique(params: {
  nomEntreprise?: string;
}): Promise<AnalyseStrategique> {
  return {
    diagnostic:
      "Entreprise Démo présente un profil de croissance sain avec une base client fidèle et un positionnement clair sur son marché. Le chiffre d'affaires progresse régulièrement, mais la dépendance à un petit nombre de clients représente un risque de concentration à surveiller. La capacité de production est bien utilisée, mais une meilleure organisation du pipeline commercial permettrait d'optimiser les revenus.",
    priorites: [
      {
        action: "Mettre en place un suivi CRM systématique des prospects et relances",
        impact: "eleve",
        effort: "faible",
        delai: "1 semaine",
      },
      {
        action: "Diversifier le portefeuille client en ciblant 2 nouveaux secteurs d'activité",
        impact: "eleve",
        effort: "moyen",
        delai: "1 mois",
      },
      {
        action: "Automatiser les relances de paiement pour réduire les délais d'encaissement",
        impact: "moyen",
        effort: "faible",
        delai: "2 semaines",
      },
      {
        action: "Créer une offre packagée récurrente (abonnement mensuel) pour stabiliser les revenus",
        impact: "eleve",
        effort: "moyen",
        delai: "6 semaines",
      },
    ],
    opportunites: [
      "Fort potentiel de upsell auprès des clients existants (formation, maintenance, conseil)",
      "Marché en croissance sur les prestations d'accompagnement digital pour TPE/PME",
      "Possibilité de partenariats avec des agences complémentaires pour augmenter les apports d'affaires",
    ],
    risques: [
      "Concentration du CA sur 2 clients représentant plus de 60 % du chiffre d'affaires",
      "Délais de paiement longs qui peuvent créer des tensions de trésorerie en période de croissance",
      "Concurrence croissante sur le segment des prestataires freelance à bas prix",
    ],
    messageMotivation:
      "Vous avez bâti des fondations solides — il est maintenant temps de structurer votre croissance pour passer au niveau supérieur.",
  };
}

export async function mockGenererContenuMarketing(params: {
  sujet: string;
  reseaux: string[];
  tonalite?: string;
}): Promise<ContenuMarketing> {
  const hashtags = ["#entrepreneuriat", "#business", "#innovation", "#TPE", "#PME", "#digitalisation"];

  const result: ContenuMarketing = { hashtags };

  if (params.reseaux.includes("linkedin")) {
    result.linkedin = `🚀 ${params.sujet}

Chez Entreprise Démo, nous croyons que chaque défi est une opportunité de grandir.

Aujourd'hui, je voulais partager avec vous notre vision sur ce sujet qui nous tient particulièrement à cœur. Au quotidien, nous accompagnons des entrepreneurs et des PME dans leur transformation, et nous voyons chaque jour l'impact concret que peut avoir une approche structurée.

Voici ce que nous avons appris :
✅ La clarté des objectifs multiplie par 3 les chances de succès
✅ Un accompagnement personnalisé fait toute la différence
✅ Les outils digitaux ne remplacent pas la relation humaine — ils la renforcent

Et vous, comment abordez-vous ce sujet dans votre activité ? Je suis curieux de lire vos retours en commentaires 👇

#entrepreneuriat #business #accompagnement`;
  }

  if (params.reseaux.includes("instagram")) {
    result.instagram = `✨ ${params.sujet} ✨

Parce que votre succès est notre priorité, nous mettons tout en œuvre pour vous accompagner à chaque étape.

💡 Des solutions concrètes
🤝 Un accompagnement sur-mesure
📈 Des résultats mesurables

Suivez-nous pour plus de conseils ! ${hashtags.slice(0, 4).join(" ")}`;
  }

  if (params.reseaux.includes("facebook")) {
    result.facebook = `📣 ${params.sujet}

Bonjour à toute notre communauté !

Nous sommes ravis de vous partager nos dernières actualités et réflexions sur ce sujet important pour tous les entrepreneurs.

Chez Entreprise Démo, notre mission est simple : vous aider à développer votre activité avec les bons outils et le bon accompagnement.

N'hésitez pas à nous contacter pour en savoir plus ou à laisser un commentaire ci-dessous. Nous lisons et répondons à tous vos messages ! 😊

${hashtags.slice(0, 3).join(" ")}`;
  }

  return result;
}
