import Link from "next/link";
import { Zap } from "lucide-react";
import { TEAM_AGENTS } from "@/lib/agents/team-data";

export default function EquipePage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Gestia</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="/#fonctionnalites" className="hover:text-gray-900 transition-colors">
              Fonctionnalités
            </a>
            <Link href="/equipe" className="text-gray-900 font-medium transition-colors">
              L&apos;équipe
            </Link>
            <a href="/#tarifs" className="hover:text-gray-900 transition-colors">
              Tarifs
            </a>
            <a href="/#temoignages" className="hover:text-gray-900 transition-colors">
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

      <section className="pt-32 pb-16 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
            5 agents IA
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Rencontrez votre <span className="text-blue-600">équipe Gestia</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            5 experts IA qui travaillent 24/7 pour gérer votre administratif, vos finances, vos
            clients et votre stratégie. L&apos;équivalent d&apos;un cabinet complet, pour 99€/mois.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAM_AGENTS.map((agent) => (
            <div
              key={agent.id}
              style={{
                backgroundColor: agent.style.cardBg,
                borderColor: agent.style.cardBorder,
              }}
              className="border rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              <div
                style={{ backgroundColor: agent.style.accentBg }}
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-md"
              >
                {agent.initiale}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{agent.prenom}</h3>
              <p style={{ color: agent.style.textColor }} className="text-sm font-medium mb-3">
                {agent.role}
              </p>
              <p className="text-gray-700 font-medium mb-4">{agent.baseline}</p>
              <p className="text-sm text-gray-600 mb-5">{agent.description}</p>
              <div className="space-y-2 mb-5">
                {agent.missions.map((m, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span style={{ color: agent.style.textColor }}>✓</span>
                    <span>{m}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 italic border-t border-gray-200 pt-4">
                {agent.pourQui}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Prêt à rencontrer votre équipe ?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            14 jours d&apos;essai gratuit, sans carte bancaire. Résiliez à tout moment.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Commencer gratuitement
          </Link>
        </div>
      </section>

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
            <Link href="/cgv" className="hover:text-gray-600">
              CGV
            </Link>
            <Link href="/confidentialite" className="hover:text-gray-600">
              Confidentialité
            </Link>
            <Link href="/contact" className="hover:text-gray-600">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
