"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatEuros } from "@/lib/utils";

interface LigneFacture {
  description: string;
  quantite: number;
  prixUnitaireHT: number;
  totalHT: number;
}

interface FactureGeneree {
  titre: string;
  lignes: LigneFacture[];
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  notes: string;
  conditions: string;
}

export default function NouvelleFacturePage() {
  const [description, setDescription] = useState("");
  const [nomClient, setNomClient] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultat, setResultat] = useState<FactureGeneree | null>(null);
  const [erreur, setErreur] = useState("");
  const router = useRouter();

  async function genererFacture(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErreur("");

    const res = await fetch("/api/agents/factures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ descriptionPrestations: description, nomClient }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErreur(data.erreur || "Erreur lors de la génération");
      setLoading(false);
      return;
    }

    setResultat(data.document);
    setLoading(false);
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/factures" className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Retour aux factures
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Nouvelle facture par IA</h1>
        <p className="text-sm text-gray-500 mt-1">Décrivez vos prestations, l'IA génère une facture professionnelle.</p>
      </div>

      {!resultat ? (
        <form onSubmit={genererFacture} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5 max-w-xl">
          {erreur && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{erreur}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du client</label>
            <input
              type="text"
              value={nomClient}
              onChange={(e) => setNomClient(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Société ABC"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description des prestations</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Ex : Développement d'un site e-commerce — 15 jours de développement, intégration Stripe, formation équipe..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Génération en cours...</>
            ) : (
              <><Sparkles className="w-4 h-4" />Générer la facture par IA</>
            )}
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{resultat.titre}</h2>
              <p className="text-sm text-gray-400 mt-0.5">Client : {nomClient}</p>
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
              Générée par IA
            </span>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-gray-500 font-medium">Description</th>
                <th className="text-right py-2 text-gray-500 font-medium">Qté</th>
                <th className="text-right py-2 text-gray-500 font-medium">PU HT</th>
                <th className="text-right py-2 text-gray-500 font-medium">Total HT</th>
              </tr>
            </thead>
            <tbody>
              {resultat.lignes.map((l, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-3 text-gray-700">{l.description}</td>
                  <td className="py-3 text-right text-gray-600">{l.quantite}</td>
                  <td className="py-3 text-right text-gray-600">{formatEuros(l.prixUnitaireHT)}</td>
                  <td className="py-3 text-right font-medium text-gray-900">{formatEuros(l.totalHT)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="space-y-1 text-sm min-w-48">
              <div className="flex justify-between text-gray-500">
                <span>Total HT</span><span>{formatEuros(resultat.totalHT)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>TVA 20%</span><span>{formatEuros(resultat.totalTVA)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-200">
                <span>Total TTC</span><span>{formatEuros(resultat.totalTTC)}</span>
              </div>
            </div>
          </div>

          {resultat.conditions && (
            <div className="bg-gray-50 p-4 rounded-lg text-xs text-gray-500">
              {resultat.conditions}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setResultat(null)}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Régénérer
            </button>
            <button
              onClick={() => router.push("/factures")}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Voir mes factures →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
