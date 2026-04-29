import Link from "next/link";
import { TEAM_AGENTS } from "@/lib/agents/team-data";

export default function EquipeDashboardPage() {
  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Votre équipe</h1>
        <p className="text-sm text-gray-500 mt-1">
          5 experts IA qui travaillent pour vous 24/7. Cliquez sur un agent pour accéder à son
          espace de travail.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TEAM_AGENTS.map((agent) => (
          <div
            key={agent.id}
            style={{
              backgroundColor: agent.style.cardBg,
              borderColor: agent.style.cardBorder,
            }}
            className="border rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                style={{ backgroundColor: agent.style.accentBg }}
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md"
              >
                {agent.initiale}
              </div>
              <Link
                href={agent.lien}
                style={{ backgroundColor: agent.style.accentBg }}
                className="text-xs font-medium px-3 py-1.5 rounded-lg text-white hover:opacity-90 transition-opacity"
              >
                Ouvrir →
              </Link>
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
    </div>
  );
}
