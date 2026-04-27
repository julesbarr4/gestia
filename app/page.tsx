import Link from "next/link";
import {
  FileText,
  Receipt,
  Mail,
  TrendingUp,
  Zap,
  Shield,
  CheckCircle,
  ArrowRight,
  Bot,
} from "lucide-react";

const FONCTIONNALITES = [
  {
    icon: FileText,
    titre: "Devis en 30 secondes",
    desc: "Décrivez votre projet en quelques mots. L'IA génère un devis professionnel complet, prêt à envoyer.",
  },
  {
    icon: Receipt,
    titre: "Factures automatiques",
    desc: "Transformez un devis accepté en facture en un clic. Numérotation, TVA et mentions légales gérées.",
  },
  {
    icon: Mail,
    titre: "Relances intelligentes",
    desc: "Gestia détecte les factures impayées et envoie des relances automatiques au bon moment, sur le bon ton.",
  },
  {
    icon: Bot,
    titre: "Réponses emails IA",
    desc: "Votre agent support lit et répond à vos emails clients automatiquement, 24h/24, 7j/7.",
  },
  {
    icon: TrendingUp,
    titre: "Rapport financier hebdo",
    desc: "Chaque semaine, votre CFO IA analyse vos chiffres et vous donne des recommandations concrètes.",
  },
  {
    icon: Zap,
    titre: "Stratégie & croissance",
    desc: "Votre CEO IA identifie les opportunités et vous guide sur les priorités à fort impact.",
  },
];

const TEMOIGNAGES = [
  {
    nom: "Sophie M.",
    metier: "Graphiste freelance",
    texte:
      "J'économise 5h par semaine sur l'admin. Les devis sont impeccables et les clients me paient plus vite grâce aux relances auto.",
  },
  {
    nom: "Thomas R.",
    metier: "Consultant en marketing",
    texte:
      "Le rapport hebdomadaire m'a permis de voir que 40% de mon CA venait d'un seul client. J'ai pu diversifier à temps.",
  },
  {
    nom: "Amina B.",
    metier: "Gérante boutique en ligne",
    texte:
      "Les réponses emails automatiques m'ont sauvé la mise pendant mes vacances. Aucun client n'a attendu plus de 5 minutes.",
  },
];

const PLANS = [
  {
    nom: "Starter",
    prix: "49€",
    cible: "Freelances & micro-entrepreneurs",
    features: [
      "10 devis / mois par IA",
      "10 factures / mois",
      "Relances automatiques",
      "Rapport financier hebdo",
      "Support email",
    ],
    cta: "Commencer gratuitement",
    highlight: false,
  },
  {
    nom: "Pro",
    prix: "99€",
    cible: "PME 1 à 10 salariés",
    features: [
      "Devis & factures illimités",
      "Agent support emails IA",
      "Contenu marketing IA",
      "Analyse stratégique CEO IA",
      "Support prioritaire",
    ],
    cta: "Essai 14 jours gratuit",
    highlight: true,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Gestia</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#fonctionnalites" className="hover:text-gray-900 transition-colors">
              Fonctionnalités
            </a>
            <Link href="/equipe" className="hover:text-gray-900 transition-colors">
              L&apos;équipe
            </Link>
            <a href="#tarifs" className="hover:text-gray-900 transition-colors">
              Tarifs
            </a>
            <a href="#temoignages" className="hover:text-gray-900 transition-colors">
              Témoignages
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Essai gratuit
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-2 rounded-full mb-8">
            <Shield className="w-4 h-4" />
            Conforme facturation électronique 2026
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Votre admin gérée{" "}
            <span className="text-blue-600">par l'IA,</span>
            <br />
            vous vous concentrez sur votre business.
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Gestia automatise vos devis, factures, relances et emails clients grâce à des agents IA.
            Gagnez 5h par semaine dès le premier jour.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              Commencer gratuitement
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-gray-400">Pas de carte bancaire requise · 14 jours gratuits</p>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { val: "5h", label: "économisées / semaine" },
              { val: "28%", label: "des dirigeants perdent en admin" },
              { val: "30s", label: "pour générer un devis" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stat.val}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FONCTIONNALITÉS */}
      <section id="fonctionnalites" className="py-24 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              6 agents IA travaillent pour vous
            </h2>
            <p className="text-lg text-gray-500">
              Chaque agent est spécialisé dans une fonction clé de votre entreprise.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FONCTIONNALITES.map((f) => (
              <div key={f.titre} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.titre}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section id="temoignages" className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-16">
            Ils ont repris le contrôle de leur temps
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {TEMOIGNAGES.map((t) => (
              <div key={t.nom} className="bg-gray-50 p-6 rounded-2xl">
                <p className="text-gray-700 text-sm leading-relaxed mb-4">&ldquo;{t.texte}&rdquo;</p>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{t.nom}</div>
                  <div className="text-gray-400 text-xs">{t.metier}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TARIFS */}
      <section id="tarifs" className="py-24 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent, sans surprise
            </h2>
            <p className="text-gray-500">Résiliable à tout moment. Pas d'engagement.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.nom}
                className={`p-8 rounded-2xl border-2 ${
                  plan.highlight
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="mb-6">
                  <div className={`text-sm font-medium mb-1 ${plan.highlight ? "text-blue-200" : "text-gray-400"}`}>
                    {plan.cible}
                  </div>
                  <div className="text-4xl font-bold">
                    {plan.prix}
                    <span className={`text-base font-normal ${plan.highlight ? "text-blue-200" : "text-gray-400"}`}>
                      /mois
                    </span>
                  </div>
                  <div className={`text-xl font-semibold mt-1 ${plan.highlight ? "" : "text-gray-900"}`}>
                    {plan.nom}
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? "text-blue-200" : "text-blue-600"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block text-center py-3 rounded-xl font-semibold transition-colors ${
                    plan.highlight
                      ? "bg-white text-blue-600 hover:bg-blue-50"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Prêt à libérer 5h par semaine ?
          </h2>
          <p className="text-lg text-gray-500 mb-8">
            Rejoignez les entrepreneurs qui font confiance à Gestia pour leur admin.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors"
          >
            Démarrer mon essai gratuit
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-gray-400 mt-4">14 jours gratuits · Aucune carte requise</p>
        </div>
      </section>

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
            © {new Date().getFullYear()} Gestia — JMB TRADING · Tous droits réservés
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
