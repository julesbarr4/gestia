export function OrganizationStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Gestia",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: "https://gestia-beta.vercel.app",
    description:
      "Logiciel de devis et facturation IA pour artisans, auto-entrepreneurs et TPE françaises. Génération automatique de devis, factures conformes Factur-X RFE 2026, relances intelligentes.",
    offers: [
      {
        "@type": "Offer",
        name: "Plan Gratuit",
        price: "0",
        priceCurrency: "EUR",
        description: "5 générations IA gratuites",
      },
      {
        "@type": "Offer",
        name: "Plan Essentiel",
        price: "19",
        priceCurrency: "EUR",
        billingDuration: "P1M",
        description: "Devis et factures illimités avec Inès, Léa et Hugo",
      },
      {
        "@type": "Offer",
        name: "Plan Pro",
        price: "39",
        priceCurrency: "EUR",
        billingDuration: "P1M",
        description: "Tous les agents IA : Inès, Léa, Hugo, Cyprien et Augustin",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "47",
      bestRating: "5",
    },
    publisher: {
      "@type": "Organization",
      name: "Gestia",
      url: "https://gestia-beta.vercel.app",
      logo: {
        "@type": "ImageObject",
        url: "https://gestia-beta.vercel.app/og-image.png",
      },
    },
    featureList: [
      "Génération de devis automatique par IA",
      "Facturation électronique conforme Factur-X",
      "Relances automatiques clients",
      "Rapport financier hebdomadaire",
      "Conforme réforme facturation électronique 2026",
    ],
    screenshot: "https://gestia-beta.vercel.app/og-image.png",
    softwareVersion: "1.0",
    datePublished: "2026-01-01",
    inLanguage: "fr-FR",
    audience: {
      "@type": "Audience",
      audienceType: "Artisans, auto-entrepreneurs, TPE françaises",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FAQStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Qu'est-ce que Gestia ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Gestia est un logiciel de gestion administrative basé sur l'intelligence artificielle, conçu pour les artisans, auto-entrepreneurs et TPE françaises. Il automatise la création de devis, factures, relances et rapports financiers.",
        },
      },
      {
        "@type": "Question",
        name: "Gestia est-il conforme à la réforme de la facturation électronique 2026 ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui. Gestia génère des factures au format Factur-X (PDF/A-3 + XML CII profil BASIC), conforme à la norme EN 16931 et à la réforme de la facturation électronique (RFE). Validé par le validateur officiel FNFE-MPE.",
        },
      },
      {
        "@type": "Question",
        name: "Combien coûte Gestia ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Gestia propose 3 plans : Gratuit (5 générations IA), Essentiel à 19€/mois (illimité avec Inès, Léa et Hugo), et Pro à 39€/mois (tous les agents IA). Aucune carte bancaire requise pour l'essai gratuit.",
        },
      },
      {
        "@type": "Question",
        name: "Qui sont Inès, Léa, Hugo, Cyprien et Augustin ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ce sont les 5 agents IA de Gestia : Inès gère vos devis, factures et relances ; Léa analyse et répond à vos emails clients ; Hugo produit vos rapports financiers ; Cyprien crée votre contenu marketing ; Augustin élabore votre stratégie d'entreprise.",
        },
      },
      {
        "@type": "Question",
        name: "Gestia fonctionne-t-il pour les auto-entrepreneurs ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui, Gestia est conçu pour les auto-entrepreneurs. Il gère la TVA à 0% (franchise en base art. 293 B du CGI) et ajoute automatiquement les mentions légales obligatoires sur vos factures.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbStructuredData({ items }: {
  items: Array<{ name: string; url: string }>;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
