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
  nomEntreprise: string;
  secteur?: string;
  nbMoisActivite?: number;
  caTotal?: number;
  nbClients?: number;
  objectifs?: string;
  problemes?: string;
}): Promise<{
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
    impact: string;
    effort: string;
    delai: string;
  }>;
  opportunites: string[];
  risques: string[];
  messageMotivation: string;
}> {
  await new Promise((r) => setTimeout(r, 2000));

  const {
    nomEntreprise,
    nbMoisActivite = 24,
    caTotal = 80000,
    nbClients = 12,
  } = params;

  const caParClient = nbClients > 0 ? caTotal / nbClients : 0;
  const caMensuelMoyen = nbMoisActivite > 0 ? caTotal / nbMoisActivite : 0;

  const estCroissance = caMensuelMoyen >= 8000 && nbClients >= 10 && nbMoisActivite >= 12;
  const estReinvention = caMensuelMoyen < 3000 || (nbMoisActivite >= 18 && nbClients < 5);

  if (estCroissance) {
    return {
      diagnostic: `${nomEntreprise} est entrée dans sa phase d'accélération : ${nbClients} clients actifs, ${Math.round(caMensuelMoyen)}€ de CA mensuel moyen, ${nbMoisActivite} mois d'activité. Les fondations sont posées, le modèle fonctionne. La vraie question des 90 prochains jours n'est plus "comment gagner plus de clients", mais "comment grandir sans perdre ce qui fait votre différence".\n\n— Augustin, votre CEO Gestia`,
      situationStrategique: `Vous êtes en phase d'accélération maîtrisée. Votre produit ou service a trouvé son marché. Les clients recommandent, le bouche-à-oreille fonctionne. Mais attention : c'est précisément à ce stade que la plupart des TPE perdent leur âme en grandissant mal.`,
      tensions: [
        `Capacité de production qui va bientôt saturer face à la demande entrante — sans plan, vous allez refuser des clients ou baisser en qualité`,
        `Votre positionnement actuel est clair, mais il va devoir évoluer pour justifier des tarifs plus élevés et attirer des clients plus gros`,
        `Vous êtes aujourd'hui l'homme/la femme-orchestre — si vous ne déléguez pas bientôt, vous deviendrez le goulet d'étranglement de votre propre réussite`,
      ],
      axes: [
        {
          titre: "Axe 1 : Muscler votre positionnement premium",
          objectif: "Passer d'un positionnement généraliste à une expertise signature qui justifie 20 à 30% de tarif en plus",
          actions: [
            "Identifier le type de projet/client sur lequel vous êtes radicalement meilleur que la concurrence",
            "Réécrire votre page d'accueil et votre pitch autour de cette expertise signature",
            "Augmenter les tarifs de 15-20% sur les nouveaux clients dès le mois prochain",
          ],
        },
        {
          titre: "Axe 2 : Déléguer ou externaliser l'opérationnel",
          objectif: "Libérer 20% de votre temps dirigeant pour travailler SUR l'entreprise, pas dedans",
          actions: [
            "Lister toutes vos tâches d'une semaine et identifier celles qui ne demandent pas votre expertise",
            "Recruter un premier alternant ou freelance pour les tâches administratives/support",
            "Mettre en place des process documentés pour que ce ne soit plus dans votre tête",
          ],
        },
        {
          titre: "Axe 3 : Construire une réserve stratégique",
          objectif: "Sécuriser l'entreprise avec une trésorerie de 3 mois de charges — vous pourrez prendre des risques plus ambitieux",
          actions: [
            "Ouvrir un compte d'épargne pro dédié aux fonds propres",
            "Verser automatiquement 10% de chaque encaissement dessus",
            "Ne JAMAIS utiliser ce compte pour financer l'exploitation courante",
          ],
        },
      ],
      resultatsAttendus: `Dans 90 jours, ${nomEntreprise} aura une offre premium clairement identifiable, un CA en croissance sans saturation opérationnelle, et les premières briques d'une équipe qui vous libèrent du quotidien. Vous passerez de "dirigeant qui produit" à "dirigeant qui décide".`,
      priorites: [
        {
          action: "Réécrire le positionnement autour d'une expertise signature",
          impact: "eleve",
          effort: "moyen",
          delai: "1 mois",
        },
        {
          action: "Augmenter les tarifs de 15-20% sur les nouveaux clients",
          impact: "eleve",
          effort: "faible",
          delai: "immédiat",
        },
        {
          action: "Recruter un premier renfort (alternant/freelance)",
          impact: "eleve",
          effort: "moyen",
          delai: "2-3 mois",
        },
      ],
      opportunites: [
        `Demande en croissance sur votre marché — profitez-en pour monter en gamme avant la concurrence`,
        `Vos clients actuels sont un vivier de recommandations sous-exploité — créez un programme de parrainage simple`,
        `Possibilité de packager votre expertise en formations ou contenus premium (revenus passifs à terme)`,
      ],
      risques: [
        `Croître trop vite sans structurer → baisse de qualité perçue → érosion de la confiance construite`,
        `Rester trop longtemps l'homme-orchestre → épuisement personnel et plafonnement du CA`,
        `Ne pas augmenter les tarifs alors que la demande le permet → laisse de l'argent sur la table`,
      ],
      messageMotivation: `Vous avez prouvé que votre idée marche. La prochaine étape n'est pas de travailler plus — c'est de travailler différemment. Votre job change : vous devenez stratège.`,
    };
  }

  if (estReinvention) {
    return {
      diagnostic: `${nomEntreprise} est arrivée à un point de bascule : ${nbMoisActivite} mois d'activité, ${nbClients} clients, ${Math.round(caMensuelMoyen)}€ de CA mensuel moyen. Les signaux indiquent qu'il est temps de questionner le modèle, pas d'ajouter des tactiques. Ne vous laissez pas endormir par l'idée qu'"il suffit de prospecter plus". Le problème est probablement plus structurel.\n\n— Augustin, votre CEO Gestia`,
      situationStrategique: `Vous êtes en phase de réinvention. Cela ne veut pas dire échec — cela veut dire que ce qui a fonctionné pour arriver ici ne fonctionnera pas pour aller plus loin. C'est un moment inconfortable mais décisif. Les dirigeants qui traversent cette phase en posant les bonnes questions en sortent plus forts.`,
      tensions: [
        `Votre proposition de valeur n'est pas suffisamment différenciée — vos prospects vous comparent à n'importe qui d'autre`,
        `Vos clients actuels ne sont peut-être pas les "bons" clients — ceux qui paient trop peu, sont trop exigeants, ou ne reviennent jamais`,
        `Votre modèle économique est à revoir : ${Math.round(caParClient)}€ de CA moyen par client est probablement sous la barre de rentabilité réelle`,
      ],
      axes: [
        {
          titre: "Axe 1 : Redéfinir votre client idéal",
          objectif: "Arrêter de vendre à tout le monde pour se concentrer sur un profil précis qui paie bien et revient",
          actions: [
            "Lister vos 3 meilleurs clients (rentabilité + plaisir de travailler) et identifier ce qu'ils ont en commun",
            "Dresser le profil du client idéal : secteur, taille, problèmes, budget type",
            "Refuser désormais tout client qui ne correspond pas — c'est le plus difficile mais le plus transformateur",
          ],
        },
        {
          titre: "Axe 2 : Clarifier votre promesse",
          objectif: "Passer d'une offre vague à une promesse qu'un client peut résumer en une phrase",
          actions: [
            "Tester 3 formulations de votre promesse sur des prospects et voir laquelle déclenche le plus de \"oui je veux en savoir plus\"",
            "Réécrire tous vos supports (site, LinkedIn, signature email) autour de cette promesse",
            "Dire NON publiquement à ce que vous ne faites PAS — c'est ça qui rend une offre crédible",
          ],
        },
        {
          titre: "Axe 3 : Sauver la trésorerie avant tout",
          objectif: "S'assurer que vous tenez 6 mois, même si la réinvention prend du temps",
          actions: [
            "Lister toutes les charges fixes et identifier ce qui peut être réduit ou suspendu",
            "Négocier avec 2-3 fournisseurs un décalage de paiement de 30 jours",
            "Obtenir un rendez-vous banque PROACTIVEMENT pour anticiper un éventuel besoin de trésorerie",
          ],
        },
      ],
      resultatsAttendus: `Dans 90 jours, ${nomEntreprise} aura un client idéal clairement identifié, une promesse qui se mémorise en 10 secondes, et une trésorerie sécurisée. Vous aurez probablement moins de clients — mais chacun rapportera plus, et le travail sera plus satisfaisant.`,
      priorites: [
        {
          action: "Définir le profil précis du client idéal",
          impact: "eleve",
          effort: "faible",
          delai: "2 semaines",
        },
        {
          action: "Réécrire la promesse de valeur en une phrase claire",
          impact: "eleve",
          effort: "moyen",
          delai: "1 mois",
        },
        {
          action: "Sécuriser la trésorerie (RDV banque + négo fournisseurs)",
          impact: "eleve",
          effort: "moyen",
          delai: "immédiat",
        },
      ],
      opportunites: [
        `La période de questionnement est aussi celle où on découvre des niches ignorées par la concurrence`,
        `Vos anciens clients peuvent redevenir des clients si votre offre évolue vers leurs vrais besoins`,
        `Un positionnement plus clair attire des clients mieux payants — même en réduisant le volume, le CA peut monter`,
      ],
      risques: [
        `Tenter de "sauver" le modèle actuel en empilant des tactiques (promos, pubs, prospection massive) → épuise la tréso sans régler le problème de fond`,
        `Reporter la décision stratégique par peur → 6 mois de plus dans la même situation`,
        `Couper trop brutalement sans plan B → fermeture par manque de cash`,
      ],
      messageMotivation: `Les entreprises qui traversent une phase de réinvention en posant les bonnes questions deviennent souvent meilleures que celles qui n'ont jamais été challengées. C'est un moment difficile, mais c'est aussi une opportunité rare.`,
    };
  }

  return {
    diagnostic: `${nomEntreprise} est dans une phase de consolidation : ${nbClients} clients, ${Math.round(caMensuelMoyen)}€ de CA mensuel moyen, ${nbMoisActivite} mois d'activité. Les fondamentaux sont là, mais certaines tensions structurelles doivent être résolues avant d'envisager une accélération. Les 90 prochains jours sont l'occasion de solidifier les bases.\n\n— Augustin, votre CEO Gestia`,
    situationStrategique: `Vous êtes en phase de consolidation. Votre activité fonctionne, vous générez un revenu, mais l'entreprise dépend trop souvent de votre implication quotidienne et n'a pas encore acquis la robustesse qui permettra d'accélérer sans risque. C'est un moment précieux pour renforcer ce qui doit l'être.`,
    tensions: [
      `Concentration du CA : avec ${nbClients} clients, la perte d'un gros client peut faire très mal`,
      `Votre temps dirigeant est encore trop absorbé par le quotidien opérationnel — vous manquez de hauteur pour piloter`,
      `Les process clés (vente, livraison, facturation) reposent sur votre mémoire et votre présence — non transmissibles en l'état`,
    ],
    axes: [
      {
        titre: "Axe 1 : Diversifier le portefeuille clients",
        objectif: "Réduire la dépendance à vos plus gros clients en élargissant la base",
        actions: [
          "Identifier votre plus gros client en % du CA — s'il dépasse 30%, c'est une priorité absolue",
          "Lancer une action de prospection ciblée pour acquérir 3 clients similaires à vos meilleurs actuels",
          "Refuser les projets qui renforcent la dépendance à un client existant",
        ],
      },
      {
        titre: "Axe 2 : Documenter vos process critiques",
        objectif: "Rendre l'entreprise moins dépendante de votre présence quotidienne",
        actions: [
          "Lister les 5 process les plus critiques (vente, devis, livraison, facturation, relance)",
          "Pour chacun, écrire une procédure simple que quelqu'un d'autre pourrait suivre",
          "Identifier celui que vous pourriez déléguer en premier dans les 6 prochains mois",
        ],
      },
      {
        titre: "Axe 3 : Élever votre offre en gamme",
        objectif: "Augmenter le CA par client plutôt que courir après de nouveaux clients en permanence",
        actions: [
          "Identifier 1 à 2 services complémentaires que vos meilleurs clients achèteraient",
          "Tester la nouvelle offre sur 3 clients existants avant de la généraliser",
          "Augmenter progressivement les tarifs sur les nouveaux clients (+10% dès le mois prochain)",
        ],
      },
    ],
    resultatsAttendus: `Dans 90 jours, ${nomEntreprise} aura un portefeuille plus équilibré (moins de risque de dépendance), des process documentés qui vous libèrent 3-4 heures par semaine, et un CA par client en hausse. Vous passerez de "tout fait par moi" à "je pilote et j'ai commencé à déléguer".`,
    priorites: [
      {
        action: "Identifier et diversifier si un client pèse plus de 30% du CA",
        impact: "eleve",
        effort: "moyen",
        delai: "2 mois",
      },
      {
        action: "Documenter vos 5 process critiques",
        impact: "moyen",
        effort: "moyen",
        delai: "1 mois",
      },
      {
        action: "Tester un upsell sur 3 clients existants",
        impact: "moyen",
        effort: "faible",
        delai: "3 semaines",
      },
    ],
    opportunites: [
      `Vos clients actuels sont un vivier de recommandations — un simple message de demande peut générer 2-3 leads qualifiés`,
      `La mise en place de process documentés peut vous permettre de recruter un premier alternant sans chaos`,
      `Un upsell sur clients existants coûte 5 fois moins cher que l'acquisition d'un nouveau client`,
    ],
    risques: [
      `Rester dans une zone de confort opérationnel sans jamais muscler la dimension stratégique`,
      `Laisser un client dépasser 40% du CA sans réagir → exposition majeure en cas de perte`,
      `Cumuler les process "dans la tête" au lieu de les documenter → impossibilité de déléguer plus tard`,
    ],
    messageMotivation: `La phase de consolidation est moins excitante que la phase d'acquisition, mais c'est elle qui fait la différence entre les TPE qui plafonnent et celles qui passent au palier supérieur. Prenez ce temps au sérieux.`,
  };
}

export async function mockGenererContenuMarketing(params: {
  nomEntreprise: string;
  secteur?: string;
  sujet: string;
  reseaux: Array<"linkedin" | "instagram" | "facebook" | "newsletter">;
  tonalite?: string;
}): Promise<{
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  newsletter?: { sujet: string; corps: string };
  hashtags: string[];
}> {
  await new Promise((r) => setTimeout(r, 1500));

  const { nomEntreprise, sujet, reseaux } = params;
  const sujetLower = sujet.toLowerCase();

  const motsPromo = ["promo", "offre", "réduction", "lancement", "nouveau", "soldes", "remise", "-20", "-30", "-50"];
  const motsStorytelling = ["client", "projet", "retour", "expérience", "témoignage", "histoire", "parcours", "réussite"];

  const estPromo = motsPromo.some((m) => sujetLower.includes(m));
  const estStorytelling = motsStorytelling.some((m) => sujetLower.includes(m));

  const result: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    newsletter?: { sujet: string; corps: string };
    hashtags: string[];
  } = { hashtags: [] };

  if (reseaux.includes("linkedin")) {
    if (estPromo) {
      result.linkedin = `J'ai une nouvelle qui va vous intéresser 👇

Chez ${nomEntreprise}, on vient de lancer quelque chose dont on est fiers : ${sujet}.

Pourquoi on en parle aujourd'hui ?

Parce qu'on a pris le temps de le construire correctement, avec les retours de nos premiers clients. Et parce qu'on pense que ça va vraiment vous faire gagner du temps (ou vous faire économiser, ou les deux).

Les 10 premiers qui nous contactent cette semaine bénéficient d'un tarif de lancement — et d'un créneau d'échange direct avec moi pour adapter l'offre à leur contexte.

Un message en MP ou un commentaire ici, et je reviens vers vous sous 24h.

#TPE #Entrepreneurs #Lancement`;
    } else if (estStorytelling) {
      result.linkedin = `Un de nos clients m'a appelé la semaine dernière, la voix un peu tendue.

Son contexte : ${sujet}.

La situation semblait compliquée. Mais en creusant, on s'est rendu compte que le vrai enjeu n'était pas celui qu'il pensait.

On a pris le temps de poser les choses à plat, de regarder les chiffres, et de construire ensemble un plan d'action sur 3 semaines.

Résultat : non seulement le problème est résolu, mais il a identifié deux leviers de croissance qu'il n'avait jamais explorés.

Ce que je retiens de cette expérience :

→ Le problème exprimé n'est souvent pas le vrai problème
→ Prendre 30 minutes pour comprendre avant d'agir, ça change tout
→ Nos clients en savent plus sur leur business qu'ils ne le pensent — il faut juste bien les écouter

Et vous, quelle est la dernière fois où vous avez remis à plat un sujet que vous pensiez réglé ?

#Entrepreneuriat #TPE #Accompagnement`;
    } else {
      result.linkedin = `${sujet}.

Voilà un sujet sur lequel je me fais poser la même question tous les mois par mes clients TPE.

Alors voici les 3 erreurs que je vois le plus souvent — et comment les éviter :

1️⃣ Vouloir tout faire parfait du premier coup
La perfection est l'ennemi du lancement. Mieux vaut itérer vite avec de vrais retours clients que peaufiner seul dans son coin pendant 6 mois.

2️⃣ Négliger les fondamentaux au profit des tactiques
Avant de chercher "le bon outil" ou "la bonne technique", clarifiez votre proposition de valeur. Tout le reste en découle.

3️⃣ Sous-estimer la puissance du bouche-à-oreille
Un client satisfait vaut 10 posts LinkedIn bien écrits. Vos meilleurs commerciaux sont déjà dans votre portefeuille.

Si vous deviez en retenir un seul : lequel vous parle le plus ?

#Entrepreneuriat #Conseils #TPE`;
    }
  }

  if (reseaux.includes("instagram")) {
    if (estPromo) {
      result.instagram = `OFFRE SPÉCIALE 🎉

${sujet}

On vous a préparé quelque chose de spécial cette semaine. Tarif de lancement pour les 10 premiers.

👉 Lien en bio ou DM pour en profiter
⏰ Jusqu'à dimanche soir

On a hâte d'en discuter avec vous ✨`;
    } else if (estStorytelling) {
      result.instagram = `L'histoire qui nous a marqués cette semaine ✨

${sujet}

Ce qu'on adore dans ce métier, c'est voir nos clients transformer leurs défis en opportunités.

Merci à eux pour leur confiance 🙏

Et vous, quelle est votre plus belle réussite récente ? On lit tout en commentaire 👇`;
    } else {
      result.instagram = `${sujet} — on vous dit tout 👇

Voici les 3 points à retenir :

✅ Point 1 — celui qu'on oublie tout le temps
✅ Point 2 — celui qui change tout
✅ Point 3 — le bonus qui fait la différence

Swipez pour voir le détail de chaque point →

Sauvegardez ce post pour y revenir plus tard 📌

Et vous, vous faites comment ? Dites-nous en commentaire ✨`;
    }
  }

  if (reseaux.includes("facebook")) {
    result.facebook = `Bonjour à toutes et à tous 👋

Aujourd'hui on voulait partager avec vous quelque chose d'important : ${sujet}.

Ça fait un moment qu'on travaille là-dessus en interne, et on est ravis de pouvoir enfin vous en parler. On sait à quel point c'est un sujet qui revient souvent dans vos messages, alors on espère que ça va vous aider.

N'hésitez pas à nous poser vos questions en commentaire, on y répondra une par une dans la journée.

Et si vous connaissez quelqu'un qui pourrait être intéressé, partagez-lui ce post — ça nous aide énormément !

Belle journée à tous 💙`;
  }

  if (reseaux.includes("newsletter")) {
    if (estPromo) {
      result.newsletter = {
        sujet: `🎁 ${sujet} — votre accès prioritaire (48h)`,
        corps: `Bonjour,

J'ai une nouvelle à vous annoncer en priorité — avant même qu'elle sorte publiquement.

${sujet}

Pourquoi je vous en parle en premier ? Parce que vous faites partie de nos clients les plus fidèles, et qu'on tenait à vous offrir un accès prioritaire avant que tout le monde ne se précipite dessus.

Concrètement, voici ce que ça change pour vous :

→ Tarif de lancement maintenu pendant 48h (puis +20% à partir de lundi)
→ Un créneau d'échange direct avec notre équipe pour adapter l'offre à vos besoins
→ Une garantie satisfait ou remboursé 30 jours, sans condition

Pour en profiter, il suffit de répondre à cet email ou de cliquer sur le bouton ci-dessous. On revient vers vous dans la journée.

À très vite,

L'équipe ${nomEntreprise}

P.S. : Cette offre est réservée à nos abonnés newsletter. N'hésitez pas à en parler à un ami, mais sachez qu'ils devront d'abord s'inscrire pour en bénéficier.`,
      };
    } else if (estStorytelling) {
      result.newsletter = {
        sujet: `Ce qu'un client nous a dit la semaine dernière`,
        corps: `Bonjour,

Je voulais partager avec vous une conversation qui m'a marqué cette semaine.

${sujet}

En discutant avec ce client, on a touché quelque chose d'important : la plupart des problèmes qu'on nous présente ne sont pas les vrais problèmes. Ce sont souvent les symptômes.

Le vrai travail, c'est de prendre le temps de comprendre avant de proposer une solution. Et c'est exactement ce qui fait la différence entre un accompagnement qui transforme vraiment et un service qui ne fait que régler le problème du jour.

Si vous vous reconnaissez dans cette situation, ou si vous avez un sujet similaire sur lequel vous bloquez depuis un moment, répondez-nous à cet email. On prendra le temps d'en parler ensemble, sans engagement.

Belle semaine à vous,

L'équipe ${nomEntreprise}`,
      };
    } else {
      result.newsletter = {
        sujet: `Le conseil du mois : ${sujet}`,
        corps: `Bonjour,

Chaque mois, on partage avec vous UN conseil concret, applicable immédiatement, sur un sujet qui nous est posé régulièrement par nos clients.

Le sujet de ce mois : ${sujet}.

Voici les 3 principes qui changent vraiment les choses :

1. Commencer par les fondamentaux avant de chercher les astuces
La plupart des gens veulent des hacks. La vérité, c'est que 80% des résultats viennent de 20% des actions — et ces 20%, ce sont les bases bien faites.

2. Mesurer avant d'optimiser
On ne peut pas améliorer ce qu'on ne mesure pas. Avant de vouloir "faire mieux", prenez 30 minutes pour poser des indicateurs simples.

3. Tester à petite échelle avant de généraliser
Une bonne idée sur 100 clients ne marche pas forcément sur 1000. Testez, ajustez, puis déployez.

Si vous voulez aller plus loin sur ce sujet, répondez simplement à cet email avec votre question — on prendra le temps d'y répondre personnellement.

Belle semaine,

L'équipe ${nomEntreprise}`,
      };
    }
  }

  if (estPromo) {
    result.hashtags = ["#Lancement", "#OffreSpeciale", "#TPE", "#Entrepreneuriat", "#FrancePME"];
  } else if (estStorytelling) {
    result.hashtags = ["#Storytelling", "#Entrepreneuriat", "#ClientSuccess", "#TPE", "#Temoignage"];
  } else {
    result.hashtags = ["#Conseils", "#Entrepreneuriat", "#TPE", "#FrancePME", "#Expertise"];
  }

  return result;
}
