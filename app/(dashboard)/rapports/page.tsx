"use client";

import { useState } from "react";
import { Loader2, TrendingUp, CheckCircle, AlertTriangle, Lightbulb, Target } from "lucide-react";

interface Rapport {
  resumeExecutif: string;
  pointsForts: string[];
  pointsVigilance: string[];
  recommandations: string[];
  objectifsSemaineSuivante: string[];
}

interface Metriques {
  caSemaine: number;
  caMois: number;
  caMoisPrecedent: number;
  montantImpaye: number;
  tauxAcceptation: number;
}

function formatEuros(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}

export default function RapportsPage() {
  const [loading, setLoading] = useState(false);
  const [rapport, setRapport] = useState<Rapport | null>(null);
  const [metriques, setMetriques] = useState<Metriques | null>(null);
  const [erreur, setErreur] = useState("");

  async function genererRapport() {
    setLoading(true);
    setErreur("");

    const res = await fetch("/api/agents/rapport", { method: "POST" });
    const data = await res.json();

    if (!res.ok) {
      setErreur(data.erreur || "Erreur lors de la génération");
      setLoading(false);
      return;
    }

    setRapport(data.rapport);
    setMetriques(data.metriques);
    setLoading(false);
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapport hebdomadaire</h1>
          <p className="text-sm text-gray-500 mt-1">
            Hugo, votre CFO IA, analyse vos chiffres et vous guide semaine après semaine.
          </p>
        </div>
        <button
          onClick={genererRapport}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Hugo analyse vos chiffres...</>
          ) : (
            <><TrendingUp className="w-4 h-4" />Générer le rapport</>
          )}
        </button>
      </div>

      {erreur && (
        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg mb-6">{erreur}</div>
      )}

      {metriques && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {[
            { label: "CA semaine", valeur: formatEuros(metriques.caSemaine) },
            { label: "CA mois", valeur: formatEuros(metriques.caMois) },
            { label: "CA mois préc.", valeur: formatEuros(metriques.caMoisPrecedent) },
            { label: "Impayés", valeur: formatEuros(metriques.montantImpaye), rouge: true },
            { label: "Taux accept. devis", valeur: `${metriques.tauxAcceptation}%` },
          ].map((m) => (
            <div key={m.label} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className={`text-lg font-bold ${m.rouge ? "text-red-600" : "text-gray-900"}`}>
                {m.valeur}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{m.label}</div>
            </div>
          ))}
        </div>
      )}

      {rapport && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                H
              </div>
              <div>
                <p className="font-semibold text-gray-900">Analyse de Hugo</p>
                <p className="text-xs text-gray-500">Votre directeur financier IA</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Résumé exécutif
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{rapport.resumeExecutif}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Points forts
              </h3>
              <ul className="space-y-2">
                {rapport.pointsForts.map((p, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Points de vigilance
              </h3>
              <ul className="space-y-2">
                {rapport.pointsVigilance.map((p, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-purple-500" />
                Recommandations
              </h3>
              <ul className="space-y-2">
                {rapport.recommandations.map((r, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" />
                Objectifs semaine prochaine
              </h3>
              <ul className="space-y-2">
                {rapport.objectifsSemaineSuivante.map((o, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {!rapport && !loading && (
        <div className="text-center py-16 text-gray-400 text-sm">
          Cliquez sur &quot;Générer le rapport&quot; pour lancer l'analyse de votre agent CFO.
        </div>
      )}
    </div>
  );
}
