import Link from "next/link";
import { Zap } from "lucide-react";

export const metadata = {
  title: "Politique de confidentialité — Gestia",
};

export default function ConfidentialitePage() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Gestia</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Connexion
            </Link>
            <Link href="/signup" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Essai gratuit
            </Link>
          </div>
        </div>
      </nav>

      {/* CONTENU */}
      <main className="pt-28 pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Politique de confidentialité</h1>
          <p className="text-sm text-gray-400 mb-10">Dernière mise à jour : janvier {year} — JMB TRADING</p>

          <div className="space-y-8 text-gray-700 text-sm leading-relaxed">

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Responsable du traitement</h2>
              <p>
                Le responsable du traitement des données personnelles collectées via la plateforme Gestia est la société
                <strong> JMB TRADING</strong>, éditrice du service. Pour toute question relative à vos données, vous pouvez
                contacter notre Délégué à la Protection des Données (DPO) à l'adresse <strong>contact@gestia.fr</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Données collectées</h2>
              <p>Dans le cadre de l'utilisation de la plateforme Gestia, nous collectons les catégories de données suivantes :</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Données d'identification</strong> : nom, prénom, nom de l'entreprise, adresse email.</li>
                <li><strong>Données de connexion</strong> : adresse IP, logs d'accès, informations de session.</li>
                <li><strong>Données de facturation</strong> : informations de paiement traitées par Stripe (nous ne stockons pas les numéros de carte).</li>
                <li><strong>Données métier</strong> : devis, factures, contacts clients, emails traités par les agents IA.</li>
                <li><strong>Données d'usage</strong> : pages visitées, fonctionnalités utilisées, interactions avec les agents IA.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Finalités du traitement</h2>
              <p>Vos données sont traitées pour les finalités suivantes :</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Fourniture et amélioration du service Gestia.</li>
                <li>Gestion de votre compte et authentification.</li>
                <li>Facturation et gestion des paiements.</li>
                <li>Support client et traitement de vos demandes.</li>
                <li>Envoi de communications liées au service (mises à jour, alertes).</li>
                <li>Analyse statistique anonymisée pour améliorer la plateforme.</li>
                <li>Respect de nos obligations légales et réglementaires.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Base légale du traitement</h2>
              <p>
                Les traitements reposent sur les bases légales suivantes : exécution du contrat (art. 6.1.b RGPD) pour la
                fourniture du service, intérêt légitime (art. 6.1.f RGPD) pour l'amélioration du service et la sécurité,
                et votre consentement (art. 6.1.a RGPD) pour les communications marketing optionnelles.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Destinataires des données</h2>
              <p>
                Vos données sont traitées par Gestia et ses sous-traitants techniques strictement nécessaires à la fourniture
                du service :
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Supabase</strong> — hébergement de la base de données (UE).</li>
                <li><strong>Stripe</strong> — traitement des paiements (certifié PCI-DSS).</li>
                <li><strong>Anthropic</strong> — traitement IA des requêtes (les données sont anonymisées autant que possible).</li>
                <li><strong>Brevo</strong> — envoi d'emails transactionnels.</li>
              </ul>
              <p className="mt-2">
                Nous ne vendons ni ne louons vos données à des tiers. Tout transfert hors UE est encadré par des garanties
                appropriées (clauses contractuelles types).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Durée de conservation</h2>
              <p>
                Vos données sont conservées pendant la durée de votre abonnement, puis pour une durée maximale de
                <strong> 3 ans</strong> à des fins de gestion des litiges et d'obligations comptables. Les données de
                facturation sont conservées <strong>10 ans</strong> conformément aux obligations légales françaises.
                À l'issue de ces délais, vos données sont supprimées ou anonymisées.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Vos droits</h2>
              <p>
                Conformément au RGPD (articles 15 à 22), vous disposez des droits suivants sur vos données personnelles :
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Droit d'accès</strong> : obtenir une copie de vos données.</li>
                <li><strong>Droit de rectification</strong> : corriger des données inexactes.</li>
                <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données (« droit à l'oubli »).</li>
                <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré.</li>
                <li><strong>Droit d'opposition</strong> : vous opposer à certains traitements.</li>
                <li><strong>Droit à la limitation</strong> : restreindre temporairement un traitement.</li>
              </ul>
              <p className="mt-2">
                Pour exercer ces droits, contactez notre DPO à <strong>contact@gestia.fr</strong>. En cas de réponse
                insatisfaisante, vous pouvez introduire une réclamation auprès de la <strong>CNIL</strong> (cnil.fr).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Cookies</h2>
              <p>
                Gestia utilise des cookies strictement nécessaires au fonctionnement du service (session d'authentification,
                préférences). Aucun cookie publicitaire ou de pistage tiers n'est déposé sans votre consentement explicite.
                Vous pouvez gérer les cookies via les paramètres de votre navigateur.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Sécurité</h2>
              <p>
                Gestia met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :
                chiffrement TLS en transit, chiffrement au repos, contrôle d'accès strict, journalisation des accès et
                tests de sécurité réguliers. En cas de violation de données susceptible d'affecter vos droits, nous vous
                en informerons dans les 72 heures conformément à l'article 33 du RGPD.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Contact DPO</h2>
              <p>
                Pour toute question relative à vos données personnelles ou pour exercer vos droits, contactez notre
                Délégué à la Protection des Données :
              </p>
              <div className="mt-2 bg-gray-50 rounded-xl p-4">
                <p className="font-medium text-gray-900">JMB TRADING — DPO</p>
                <p>Email : <a href="mailto:contact@gestia.fr" className="text-blue-600 hover:underline">contact@gestia.fr</a></p>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-gray-900">Gestia</span>
          </div>
          <p className="text-sm text-gray-400">
            © {year} Gestia — JMB TRADING · Tous droits réservés
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/cgv" className="hover:text-gray-600">CGV</Link>
            <Link href="/confidentialite" className="hover:text-gray-600">Confidentialité</Link>
            <Link href="/contact" className="hover:text-gray-600">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
