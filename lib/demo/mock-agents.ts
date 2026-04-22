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
  return {
    titre: `Devis — ${params.descriptionProjet.slice(0, 60)}`,
    lignes: [
      { description: "Analyse des besoins et cadrage du projet", quantite: 1, prixUnitaireHT: 700, totalHT: 700 },
      { description: "Conception et maquettage", quantite: 1, prixUnitaireHT: 1200, totalHT: 1200 },
      { description: "Développement et intégration", quantite: 12, prixUnitaireHT: 110, totalHT: 1320 },
      { description: "Recette, livraison et formation", quantite: 1, prixUnitaireHT: 480, totalHT: 480 },
    ],
    totalHT: 3700,
    totalTVA: 740,
    totalTTC: 4440,
    notes: `Devis établi pour ${params.nomClient}. Acompte de 30 % à la signature, solde à la livraison.`,
    conditions: "Devis valable 30 jours. Paiement à 30 jours fin de mois. Tout retard entraîne des pénalités de 3 fois le taux légal en vigueur.",
  };
}

export async function mockGenererFacture(params: {
  descriptionPrestations: string;
  nomClient: string;
  nomEntreprise?: string;
  devisReference?: string;
}): Promise<DocumentGenere> {
  return {
    titre: `Facture — ${params.descriptionPrestations.slice(0, 60)}`,
    lignes: [
      { description: "Prestation de service — phase 1", quantite: 1, prixUnitaireHT: 2000, totalHT: 2000 },
      { description: "Prestation de service — phase 2", quantite: 1, prixUnitaireHT: 1500, totalHT: 1500 },
      { description: "Frais de coordination et suivi", quantite: 1, prixUnitaireHT: 350, totalHT: 350 },
    ],
    totalHT: 3850,
    totalTVA: 770,
    totalTTC: 4620,
    notes: params.devisReference
      ? `Facture établie suite au devis ${params.devisReference} accepté par ${params.nomClient}.`
      : `Facture établie pour ${params.nomClient}.`,
    conditions: "Paiement sous 30 jours. En cas de retard, pénalités de 3 fois le taux légal en vigueur.",
  };
}

export async function mockGenererRelance(params: {
  factureId?: string;
  nomClient?: string;
  numeroFacture?: string;
  montantTTC?: number;
}): Promise<{ sujet: string; corps: string }> {
  const numero = params.numeroFacture || "FAC-2026-XXXX";
  const montant = params.montantTTC ? `${params.montantTTC.toFixed(2)} €` : "montant dû";
  const client = params.nomClient || "Madame, Monsieur";

  return {
    sujet: `Rappel de paiement — Facture ${numero}`,
    corps: `Bonjour ${client},

Nous nous permettons de vous contacter au sujet de la facture ${numero} d'un montant de ${montant}, dont l'échéance est dépassée.

Sauf erreur de notre part, nous n'avons pas encore reçu votre règlement. Pourriez-vous procéder au virement dans les meilleurs délais ?

Si vous avez déjà effectué le paiement, veuillez ignorer ce message et nous en informer afin que nous mettions à jour nos dossiers.

Restant à votre disposition pour tout renseignement,

Cordialement,
Entreprise Démo
contact@entreprise-demo.fr`,
  };
}

export async function mockAnalyserEmailSupport(params: {
  emailDe: string;
  sujet?: string;
  corps: string;
}): Promise<AnalyseEmail> {
  return {
    categorie: "question",
    urgence: "normale",
    resume: "Le client demande des informations sur les délais et la prochaine étape du projet.",
    sujetReponse: `Re : ${params.sujet || "Votre demande"}`,
    reponse: `Bonjour,

Merci pour votre message. Nous avons bien pris note de votre demande et nous revenons vers vous dans les plus brefs délais.

Notre équipe est actuellement en cours d'analyse de votre situation et vous apportera une réponse complète sous 24 à 48 heures ouvrées.

N'hésitez pas à nous contacter si vous avez des questions urgentes.

Cordialement,
L'équipe Entreprise Démo`,
  };
}

export async function mockRapportHebdomadaire(params: {
  nomEntreprise?: string;
}): Promise<RapportFinancier> {
  return {
    resumeExecutif:
      "Cette semaine affiche de bonnes performances avec un chiffre d'affaires en progression par rapport à la semaine précédente. Le portefeuille clients se consolide et le taux d'acceptation des devis reste au-dessus de la moyenne du secteur. Deux factures impayées méritent une attention particulière pour préserver la trésorerie.",
    pointsForts: [
      "Chiffre d'affaires hebdomadaire en hausse de 12 % vs semaine précédente",
      "Taux d'acceptation des devis : 67 % (moyenne secteur : 55 %)",
      "Aucune nouvelle relance client nécessaire cette semaine",
    ],
    pointsVigilance: [
      "Facture FAC-2026-0003 en retard depuis 11 jours — risque d'encaissement",
      "Deux devis en attente de réponse depuis plus de 14 jours",
      "CA mensuel inférieur de 8 % à l'objectif fixé en début de mois",
    ],
    recommandations: [
      "Relancer Atelier Dupont Créations par téléphone avant vendredi pour la facture en retard",
      "Proposer un rendez-vous de suivi à Sophie Leclerc Conseil pour accélérer la décision sur le devis",
      "Identifier 2 nouveaux prospects cette semaine pour alimenter le pipeline commercial",
      "Mettre à jour les conditions de paiement sur les futurs devis pour réduire les délais",
    ],
    objectifsSemaineSuivante: [
      "Encaisser au moins 1 des 2 factures impayées",
      "Obtenir une réponse ferme sur le devis DEV-2026-0001",
      "Créer et envoyer 1 nouveau devis prospect",
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
