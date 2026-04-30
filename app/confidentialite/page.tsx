import { PublicShell } from "@/app/components/public-layout";

export const metadata = {
  title: "Politique de confidentialité — Gestia",
};

export default function ConfidentialitePage() {
  return (
    <PublicShell>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "80px 40px" }}>
        <p style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", marginBottom: "12px", fontFamily: "Geist Mono, monospace" }}>LÉGAL</p>
        <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "42px", lineHeight: 1.06, color: "var(--ink)", marginBottom: "8px" }}>
          Politique de<br /><em>Confidentialité.</em>
        </h1>
        <p style={{ fontSize: "13px", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace", marginBottom: "56px" }}>Dernière mise à jour : janvier 2026</p>

        {[
          {
            titre: "1. Données collectées",
            corps: "Dans le cadre de l'utilisation de la plateforme Gestia, nous collectons : votre email et nom d'entreprise lors de la création de compte, vos données de facturation traitées par Stripe (nous ne stockons pas les numéros de carte), les documents métier générés (devis, factures), et des données d'usage anonymisées pour améliorer le service.",
          },
          {
            titre: "2. Finalités",
            corps: "Vos données sont traitées pour : l'authentification et la gestion de votre compte, la génération de documents via les agents IA, la facturation et la gestion des paiements, et l'amélioration continue du service. Nous n'utilisons pas vos données à des fins publicitaires.",
          },
          {
            titre: "3. Destinataires",
            corps: "Vos données ne sont jamais revendues ni cédées à des tiers. Nos sous-traitants techniques sont : Supabase (hébergement base de données, UE), Anthropic (traitement IA des requêtes), Stripe (paiement, certifié PCI-DSS). Tout transfert hors UE est encadré par des clauses contractuelles types.",
          },
          {
            titre: "4. Durée de conservation",
            corps: "Vos données sont conservées pendant la durée active de votre abonnement, puis pour une durée maximale de 3 ans après la résiliation à des fins de gestion des litiges. Les données de facturation sont conservées 10 ans conformément aux obligations légales françaises.",
          },
          {
            titre: "5. Droits des utilisateurs",
            corps: "Conformément au RGPD (articles 15 à 22), vous disposez des droits d'accès, de rectification, de suppression, de portabilité et d'opposition sur vos données. Pour exercer ces droits, contactez-nous à contact@gestia.fr. En cas de réponse insatisfaisante, vous pouvez saisir la CNIL (cnil.fr).",
          },
          {
            titre: "6. Cookies",
            corps: "Gestia utilise uniquement des cookies strictement nécessaires au fonctionnement du service (session d'authentification, préférences). Aucun cookie publicitaire ou de suivi tiers n'est déposé. Vous pouvez gérer les cookies via les paramètres de votre navigateur.",
          },
          {
            titre: "7. Contact DPO",
            corps: "Pour toute question relative à vos données personnelles ou pour exercer vos droits, contactez notre Délégué à la Protection des Données : contact@gestia.fr — JMB TRADING. Réponse garantie sous 30 jours.",
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
