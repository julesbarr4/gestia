import Link from "next/link";
import { Zap } from "lucide-react";

export const metadata = {
  title: "Conditions Générales de Vente — Gestia",
};

export default function CGVPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Conditions Générales de Vente</h1>
          <p className="text-sm text-gray-400 mb-10">Dernière mise à jour : janvier {year} — JMB TRADING</p>

          <div className="prose prose-gray max-w-none space-y-8 text-gray-700 text-sm leading-relaxed">

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Objet</h2>
              <p>
                Les présentes Conditions Générales de Vente (ci-après « CGV ») régissent les relations contractuelles entre
                la société JMB TRADING (ci-après « Gestia » ou « le Prestataire »), éditeur de la plateforme Gestia accessible
                à l'adresse <strong>gestia.fr</strong>, et toute personne physique ou morale (ci-après « le Client ») souhaitant
                souscrire à l'un des abonnements proposés. Toute souscription implique l'acceptation pleine et entière des
                présentes CGV.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Description du service</h2>
              <p>
                Gestia est une plateforme SaaS (Software as a Service) permettant aux entrepreneurs, freelances et PME
                d'automatiser leur gestion administrative grâce à des agents IA : génération de devis, émission de factures,
                relances automatiques, réponses emails, rapports financiers et recommandations stratégiques.
              </p>
              <p className="mt-2">
                Le service est accessible depuis tout navigateur web récent, sans installation de logiciel. Gestia se réserve
                le droit de faire évoluer les fonctionnalités disponibles selon les abonnements souscrits.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Prix et abonnements</h2>
              <p>
                Les tarifs en vigueur sont indiqués en euros TTC sur la page Tarifs du site. Gestia propose actuellement
                deux formules d'abonnement mensuel :
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Starter</strong> : 49 € HT / mois — destiné aux freelances et micro-entrepreneurs.</li>
                <li><strong>Pro</strong> : 99 € HT / mois — destiné aux PME de 1 à 10 salariés.</li>
              </ul>
              <p className="mt-2">
                Gestia se réserve le droit de modifier ses tarifs à tout moment. Le Client sera informé de toute modification
                tarifaire par email au moins 30 jours avant son entrée en vigueur. L'utilisation du service après cette date
                vaut acceptation des nouveaux tarifs.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Paiement</h2>
              <p>
                Le paiement s'effectue par carte bancaire via notre prestataire sécurisé Stripe. Les abonnements sont
                prélevés mensuellement à date anniversaire de la souscription. En cas d'échec de paiement, Gestia se réserve
                le droit de suspendre l'accès au service jusqu'à régularisation. Aucune facture en papier n'est émise ;
                les justificatifs sont disponibles dans l'espace client.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Période d'essai et rétractation</h2>
              <p>
                Tout nouveau Client bénéficie d'une période d'essai gratuite de 14 jours, sans engagement et sans carte
                bancaire requise. À l'issue de cette période, la souscription est convertie en abonnement payant sauf résiliation
                avant la fin de l'essai.
              </p>
              <p className="mt-2">
                Conformément à l'article L221-18 du Code de la consommation, le Client dispose d'un délai de 14 jours à
                compter de la souscription pour exercer son droit de rétractation, sauf si le service a été pleinement
                exécuté avec son accord exprès. La demande doit être adressée à <strong>contact@gestia.fr</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Résiliation</h2>
              <p>
                Le Client peut résilier son abonnement à tout moment depuis son espace client ou par email à contact@gestia.fr.
                La résiliation prend effet à la fin de la période d'abonnement en cours. Aucun remboursement prorata temporis
                n'est effectué sauf disposition légale contraire.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Responsabilité</h2>
              <p>
                Gestia est soumise à une obligation de moyens. La plateforme est fournie « en l'état » et Gestia ne garantit
                pas une disponibilité sans interruption. En cas de dysfonctionnement, Gestia s'engage à mettre en œuvre tous
                les moyens raisonnables pour rétablir le service dans les meilleurs délais. La responsabilité de Gestia ne
                saurait être engagée pour tout préjudice indirect, perte de données, ou manque à gagner résultant de l'utilisation
                ou de l'impossibilité d'utiliser le service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Données personnelles</h2>
              <p>
                Les données collectées dans le cadre de la relation contractuelle sont traitées conformément à notre
                <Link href="/confidentialite" className="text-blue-600 hover:underline mx-1">Politique de confidentialité</Link>
                et au Règlement Général sur la Protection des Données (RGPD). Le Client dispose des droits d'accès, de
                rectification et de suppression de ses données en contactant notre DPO à <strong>contact@gestia.fr</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Droit applicable et litiges</h2>
              <p>
                Les présentes CGV sont soumises au droit français. En cas de litige, les parties s'engagent à rechercher
                une solution amiable avant tout recours judiciaire. À défaut, le tribunal compétent sera celui du siège
                social de JMB TRADING. Le Client consommateur peut également recourir à un médiateur de la consommation
                agréé conformément aux articles L611-1 et suivants du Code de la consommation.
              </p>
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
