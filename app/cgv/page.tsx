import { PublicShell } from "@/app/components/public-layout";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente",
  description: "Conditions générales de vente et d'utilisation de Gestia.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://gestia-beta.vercel.app/cgv" },
};

export default function CGVPage() {
  return (
    <PublicShell>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "80px 40px" }}>
        <p style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", marginBottom: "12px", fontFamily: "Geist Mono, monospace" }}>LÉGAL</p>
        <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "42px", lineHeight: 1.06, color: "var(--ink)", marginBottom: "8px" }}>
          Conditions Générales<br /><em>de Vente.</em>
        </h1>
        <p style={{ fontSize: "13px", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace", marginBottom: "56px" }}>Dernière mise à jour : janvier 2026</p>

        {[
          {
            titre: "1. Objet",
            corps: "Les présentes Conditions Générales de Vente régissent les relations contractuelles entre la société JMB TRADING, éditeur de la plateforme Gestia accessible à l'adresse gestia.fr, et toute personne souhaitant souscrire à l'un des abonnements proposés. Toute souscription implique l'acceptation pleine et entière des présentes CGV.",
          },
          {
            titre: "2. Description du service",
            corps: "Gestia est une plateforme SaaS permettant aux entrepreneurs, freelances et PME d'automatiser leur gestion administrative grâce à des agents IA : génération de devis, émission de factures, relances automatiques, réponses emails, rapports financiers et recommandations stratégiques.",
          },
          {
            titre: "3. Prix et facturation",
            corps: "Les tarifs sont indiqués en euros TTC. L'abonnement est facturé mensuellement ou annuellement selon le choix de l'utilisateur. Les formules disponibles sont : Essentiel à 19 €/mois et Pro à 39 €/mois. Gestia se réserve le droit de modifier ses tarifs avec un préavis de 30 jours.",
          },
          {
            titre: "4. Paiement",
            corps: "Le paiement s'effectue par carte bancaire via Stripe. En cas d'échec de paiement, l'accès au service peut être suspendu après un délai de 7 jours.",
          },
          {
            titre: "5. Rétractation",
            corps: "Conformément à l'article L221-18 du Code de la consommation, vous disposez d'un délai de 14 jours pour exercer votre droit de rétractation à compter de la souscription. Tout nouveau client bénéficie d'une période d'essai gratuite de 14 jours sans engagement ni carte bancaire.",
          },
          {
            titre: "6. Résiliation",
            corps: "Le client peut résilier son abonnement à tout moment depuis son espace client ou par email à contact@gestia.fr. La résiliation prend effet à la fin de la période d'abonnement en cours. Aucun remboursement prorata temporis n'est effectué sauf disposition légale contraire.",
          },
          {
            titre: "7. Responsabilité",
            corps: "Gestia met à disposition des outils IA à titre d'assistance. Les documents générés (devis, factures) doivent être vérifiés par l'utilisateur. Gestia ne saurait être tenu responsable des erreurs de contenu des documents générés.",
          },
          {
            titre: "8. Données personnelles",
            corps: "Le traitement des données personnelles est régi par notre Politique de Confidentialité, disponible sur gestia.fr/confidentialite. Vos données sont hébergées en France.",
          },
          {
            titre: "9. Droit applicable",
            corps: "Les présentes CGV sont soumises au droit français. En cas de litige, les parties s'engagent à rechercher une solution amiable avant tout recours judiciaire. À défaut, le tribunal compétent sera celui du siège social de JMB TRADING.",
          },
        ].map((section) => (
          <div key={section.titre} style={{ marginBottom: "36px" }}>
            <h2 style={{ fontFamily: "Instrument Serif, serif", fontSize: "22px", color: "var(--ink)", marginBottom: "10px" }}>{section.titre}</h2>
            <p style={{ fontSize: "15px", color: "var(--ink-2)", lineHeight: 1.7 }}>{section.corps}</p>
          </div>
        ))}
      </div>
    </PublicShell>
  );
}
