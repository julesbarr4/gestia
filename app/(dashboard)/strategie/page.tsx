"use client";

import { useState } from "react";
import { Loader2, Target } from "lucide-react";

interface AnalyseStrategique {
  diagnostic: string;
  situationStrategique: string;
  tensions: string[];
  axes: Array<{
    titre: string;
    objectif: string;
    actions: string[];
  }>;
  resultatsAttendus: string;
  priorites: Array<{
    action: string;
    impact: string;
    effort: string;
    delai: string;
  }>;
  opportunites: string[];
  risques: string[];
  messageMotivation: string;
}

export default function StrategiePage() {
  const [objectifs, setObjectifs] = useState("");
  const [problemes, setProblemes] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyse, setAnalyse] = useState<AnalyseStrategique | null>(null);
  const [erreur, setErreur] = useState("");

  async function lancer(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErreur("");

    const res = await fetch("/api/agents/ceo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ objectifs, problemes }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErreur(data.erreur || "Erreur");
      setLoading(false);
      return;
    }

    setAnalyse(data.analyse);
    setLoading(false);
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Stratégie</h1>
        <p className="text-sm text-gray-500 mt-1">
          Augustin, votre CEO IA, analyse votre situation et définit 3 axes prioritaires sur 90
          jours.
        </p>
      </div>

      <form onSubmit={lancer} className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">Vos objectifs (optionnel)</span>
          <textarea
            value={objectifs}
            onChange={(e) => setObjectifs(e.target.value)}
            placeholder="Ex: doubler mon CA, recruter 2 personnes, lancer une nouvelle offre..."
            className="mt-1 block w-full rounded-lg border-gray-300 focus:border-gray-900 focus:ring-gray-900 text-sm"
            rows={2}
          />
        </label>
        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">
            Vos problèmes actuels (optionnel)
          </span>
          <textarea
            value={problemes}
            onChange={(e) => setProblemes(e.target.value)}
            placeholder="Ex: dépendance à un gros client, positionnement flou, charge opérationnelle..."
            className="mt-1 block w-full rounded-lg border-gray-300 focus:border-gray-900 focus:ring-gray-900 text-sm"
            rows={2}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 inline-flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Augustin analyse votre stratégie...
            </>
          ) : (
            <>
              <Target className="w-4 h-4" />
              Lancer l&apos;analyse stratégique
            </>
          )}
        </button>
      </form>

      {analyse && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-lg">
                A
              </div>
              <div>
                <p className="font-semibold text-gray-900">Analyse d&apos;Augustin</p>
                <p className="text-xs text-gray-500">Votre directeur général IA</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Diagnostic</h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {analyse.diagnostic}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                S
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Situation stratégique</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{analyse.situationStrategique}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                T
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Tensions</h2>
            </div>
            <ul className="space-y-2">
              {analyse.tensions.map((t, i) => (
                <li key={i} className="text-gray-700 flex gap-2">
                  <span className="text-orange-500">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Axes stratégiques (90 jours)</h2>
            </div>
            <div className="space-y-4">
              {analyse.axes.map((axe, i) => (
                <div key={i} className="border-l-4 border-blue-600 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{axe.titre}</h3>
                  <p className="text-sm text-gray-600 mb-2 italic">{axe.objectif}</p>
                  <ul className="space-y-1">
                    {axe.actions.map((a, j) => (
                      <li key={j} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-blue-600">→</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                R
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Résultats attendus</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{analyse.resultatsAttendus}</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 text-white">
            <p className="text-lg italic leading-relaxed">&quot;{analyse.messageMotivation}&quot;</p>
            <p className="text-sm text-gray-400 mt-3">— Augustin</p>
          </div>
        </div>
      )}

      {erreur && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mt-4">
          {erreur}
        </div>
      )}
    </div>
  );
}
