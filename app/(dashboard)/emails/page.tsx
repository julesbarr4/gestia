"use client";

import { useState } from "react";
import { Loader2, Sparkles, Mail, AlertCircle, CheckCircle } from "lucide-react";

interface AnalyseEmail {
  categorie: string;
  urgence: string;
  resume: string;
  sujetReponse: string;
  reponse: string;
}

const URGENCE_COULEURS: Record<string, string> = {
  faible: "bg-gray-100 text-gray-600",
  normale: "bg-blue-100 text-blue-600",
  elevee: "bg-red-100 text-red-600",
};

export default function EmailsPage() {
  const [emailDe, setEmailDe] = useState("");
  const [sujet, setSujet] = useState("");
  const [corps, setCorps] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyse, setAnalyse] = useState<AnalyseEmail | null>(null);
  const [erreur, setErreur] = useState("");
  const [copie, setCopie] = useState(false);
  const [ajouterSignatureLea, setAjouterSignatureLea] = useState(false);

  async function analyser(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErreur("");
    setAnalyse(null);

    const res = await fetch("/api/agents/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailDe, sujet, corps, ajouterSignatureLea }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErreur(data.erreur || "Erreur lors de l'analyse");
      setLoading(false);
      return;
    }

    setAnalyse(data.analyse);
    setLoading(false);
  }

  function copierReponse() {
    if (analyse?.reponse) {
      navigator.clipboard.writeText(analyse.reponse);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Agent Support Emails</h1>
        <p className="text-sm text-gray-500 mt-1">
          Collez un email client et l'IA génère une réponse professionnelle.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* FORMULAIRE */}
        <form onSubmit={analyser} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-500" />
            Email reçu
          </h2>
          {erreur && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {erreur}
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">De</label>
            <input
              type="email"
              value={emailDe}
              onChange={(e) => setEmailDe(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="client@exemple.fr"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Sujet</label>
            <input
              type="text"
              value={sujet}
              onChange={(e) => setSujet(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Question sur ma commande..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Corps de l'email</label>
            <textarea
              value={corps}
              onChange={(e) => setCorps(e.target.value)}
              required
              rows={8}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Coller le contenu de l'email ici..."
            />
          </div>
          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={ajouterSignatureLea}
              onChange={(e) => setAjouterSignatureLea(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Ajouter la signature « Généré par Léa » en bas de la réponse
          </label>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Léa analyse votre email...</>
            ) : (
              <><Sparkles className="w-4 h-4" />Analyser & répondre</>
            )}
          </button>
        </form>

        {/* RÉSULTAT */}
        {analyse && (
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Analyse de Léa</h2>
            <p className="text-xs text-gray-400 -mt-2">Votre responsable service client IA</p>

            <div className="flex gap-2 flex-wrap">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {analyse.categorie}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${URGENCE_COULEURS[analyse.urgence]}`}>
                Urgence : {analyse.urgence}
              </span>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
              <strong>Résumé :</strong> {analyse.resume}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-500">Réponse générée</label>
                <button
                  onClick={copierReponse}
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                  {copie ? (
                    <><CheckCircle className="w-3 h-3" />Copié !</>
                  ) : (
                    "Copier"
                  )}
                </button>
              </div>
              <div className="text-xs text-gray-500 mb-1">
                Objet : <strong>{analyse.sujetReponse}</strong>
              </div>
              <pre className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 whitespace-pre-wrap font-sans">
                {analyse.reponse}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
