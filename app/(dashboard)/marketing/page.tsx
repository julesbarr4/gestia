"use client";

import { useState } from "react";
import { Loader2, Megaphone, Copy, CheckCircle } from "lucide-react";

interface ContenuMarketing {
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  newsletter?: { sujet: string; corps: string };
  hashtags: string[];
}

export default function MarketingPage() {
  const [sujet, setSujet] = useState("");
  const [reseaux, setReseaux] = useState<string[]>(["linkedin"]);
  const [tonalite, setTonalite] = useState("professionnel");
  const [loading, setLoading] = useState(false);
  const [contenu, setContenu] = useState<ContenuMarketing | null>(null);
  const [erreur, setErreur] = useState("");
  const [copiePour, setCopiePour] = useState<string | null>(null);

  function toggleReseau(r: string) {
    setReseaux((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );
  }

  async function generer(e: React.FormEvent) {
    e.preventDefault();
    if (reseaux.length === 0) return;
    setLoading(true);
    setErreur("");

    const res = await fetch("/api/agents/marketing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sujet, reseaux, tonalite }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErreur(data.erreur || "Erreur");
      setLoading(false);
      return;
    }

    setContenu(data.contenu);
    setLoading(false);
  }

  function copier(texte: string, cle: string) {
    navigator.clipboard.writeText(texte);
    setCopiePour(cle);
    setTimeout(() => setCopiePour(null), 2000);
  }

  const RESEAUX = [
    { id: "linkedin", label: "LinkedIn" },
    { id: "instagram", label: "Instagram" },
    { id: "facebook", label: "Facebook" },
    { id: "newsletter", label: "Newsletter" },
  ];

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contenu marketing</h1>
        <p className="text-sm text-gray-500 mt-1">
          Cyprien, votre CMO IA, génère du contenu prêt à publier sur vos canaux.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={generer} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-blue-500" />
            Paramètres
          </h2>

          {erreur && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{erreur}</div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Sujet / thème du post</label>
            <textarea
              value={sujet}
              onChange={(e) => setSujet(e.target.value)}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Ex : Lancement de notre nouveau service de livraison express, promotion -20% ce week-end..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Réseaux sociaux</label>
            <div className="flex flex-wrap gap-2">
              {RESEAUX.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => toggleReseau(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    reseaux.includes(r.id)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Tonalité</label>
            <select
              value={tonalite}
              onChange={(e) => setTonalite(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="professionnel">Professionnel</option>
              <option value="decontracte">Décontracté</option>
              <option value="inspirant">Inspirant</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || reseaux.length === 0}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Cyprien rédige votre contenu...</>
            ) : (
              "Générer le contenu"
            )}
          </button>
        </form>

        {contenu && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  C
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Créé par Cyprien</p>
                  <p className="text-xs text-gray-500">Votre directeur marketing IA</p>
                </div>
              </div>
            </div>

            {Object.entries(contenu)
              .filter(([k]) => k !== "hashtags" && k !== "newsletter")
              .map(([reseau, texte]) => (
                <div key={reseau} className="bg-white rounded-xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900 capitalize">{reseau}</h3>
                    <button
                      onClick={() => copier(texte as string, reseau)}
                      className="text-xs text-blue-600 flex items-center gap-1 hover:underline"
                    >
                      {copiePour === reseau ? (
                        <><CheckCircle className="w-3 h-3" />Copié !</>
                      ) : (
                        <><Copy className="w-3 h-3" />Copier</>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{texte as string}</p>
                </div>
              ))}

            {contenu.newsletter && (
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-medium text-gray-900 mb-3">Newsletter</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-gray-500">Objet de l&apos;email</p>
                      <button
                        onClick={() => copier(contenu.newsletter!.sujet, "newsletter-sujet")}
                        className="text-xs text-blue-600 flex items-center gap-1 hover:underline"
                      >
                        {copiePour === "newsletter-sujet" ? (
                          <><CheckCircle className="w-3 h-3" />Copié !</>
                        ) : (
                          <><Copy className="w-3 h-3" />Copier</>
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">{contenu.newsletter.sujet}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-gray-500">Corps de l&apos;email</p>
                      <button
                        onClick={() => copier(contenu.newsletter!.corps, "newsletter-corps")}
                        className="text-xs text-blue-600 flex items-center gap-1 hover:underline"
                      >
                        {copiePour === "newsletter-corps" ? (
                          <><CheckCircle className="w-3 h-3" />Copié !</>
                        ) : (
                          <><Copy className="w-3 h-3" />Copier</>
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{contenu.newsletter.corps}</p>
                  </div>
                </div>
              </div>
            )}

            {contenu.hashtags?.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-500 mb-2">Hashtags suggérés</p>
                <div className="flex flex-wrap gap-1">
                  {contenu.hashtags.map((h) => (
                    <span key={h} className="text-xs bg-white border border-gray-200 text-blue-600 px-2 py-0.5 rounded-full">
                      {h.startsWith("#") ? h : `#${h}`}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
