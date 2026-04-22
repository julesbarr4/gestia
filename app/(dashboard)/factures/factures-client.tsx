"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Receipt, Bell, X, Loader2 } from "lucide-react";
import { formatEuros, formatDate } from "@/lib/utils";

const STATUT_LABELS: Record<string, { label: string; couleur: string }> = {
  brouillon: { label: "Brouillon", couleur: "bg-gray-100 text-gray-600" },
  envoyee: { label: "Envoyée", couleur: "bg-blue-100 text-blue-600" },
  payee: { label: "Payée", couleur: "bg-green-100 text-green-600" },
  en_retard: { label: "En retard", couleur: "bg-red-100 text-red-600" },
  annulee: { label: "Annulée", couleur: "bg-gray-100 text-gray-400" },
};

const NIVEAU_LABELS = [
  { label: "Cordiale", couleur: "bg-blue-100 text-blue-700" },
  { label: "Ferme", couleur: "bg-amber-100 text-amber-700" },
  { label: "Mise en demeure", couleur: "bg-red-100 text-red-700" },
];

interface Facture {
  id: string;
  numero: string;
  statut: string;
  date_echeance: string | null;
  total_ttc: number;
  nb_relances: number;
  clients: { nom?: string } | null;
}

interface RelanceGeneree {
  sujet: string;
  corps: string;
  niveau: number;
}

export default function FacturesClient({ factures }: { factures: Facture[] }) {
  const [relanceActive, setRelanceActive] = useState<Facture | null>(null);
  const [relanceGeneree, setRelanceGeneree] = useState<RelanceGeneree | null>(null);
  const [loadingRelance, setLoadingRelance] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [sujetEdite, setSujetEdite] = useState("");
  const [corpsEdite, setCorpsEdite] = useState("");

  async function lancerRelance(facture: Facture) {
    setRelanceActive(facture);
    setRelanceGeneree(null);
    setLoadingRelance(true);

    const res = await fetch("/api/agents/relances", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ factureId: facture.id }),
    });

    const data = await res.json();
    const rg: RelanceGeneree = {
      sujet: data.relance?.sujet || data.sujet || "",
      corps: data.relance?.corps || data.corps || "",
      niveau: (facture.nb_relances || 0) + 1,
    };
    setRelanceGeneree(rg);
    setSujetEdite(rg.sujet);
    setCorpsEdite(rg.corps);
    setLoadingRelance(false);
  }

  function fermerModal() {
    setRelanceActive(null);
    setRelanceGeneree(null);
    setLoadingRelance(false);
  }

  function marquerEnvoyee() {
    const nom = relanceActive?.clients?.nom || "le client";
    fermerModal();
    setToast(`Relance envoyée à ${nom}`);
    setTimeout(() => setToast(null), 3000);
  }

  const niveauIdx = relanceActive ? Math.min(relanceActive.nb_relances || 0, 2) : 0;
  const niveauLabel = NIVEAU_LABELS[niveauIdx];

  return (
    <div className="p-8">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Factures</h1>
          <p className="text-sm text-gray-500 mt-1">{factures?.length || 0} factures au total</p>
        </div>
        <Link
          href="/factures/nouvelle"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvelle facture IA
        </Link>
      </div>

      {(!factures || factures.length === 0) ? (
        <div className="text-center py-16">
          <Receipt className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Aucune facture pour l'instant</p>
          <Link
            href="/factures/nouvelle"
            className="mt-4 inline-flex items-center gap-1 text-blue-600 text-sm hover:underline"
          >
            <Plus className="w-4 h-4" />
            Créer ma première facture par IA
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Numéro</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Client</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Échéance</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Statut</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Relances</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">Montant TTC</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {factures.map((f) => {
                const statut = STATUT_LABELS[f.statut] || STATUT_LABELS.brouillon;
                const peutRelancer = f.statut === "envoyee" || f.statut === "en_retard";
                return (
                  <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{f.numero}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {(f.clients as { nom?: string } | null)?.nom || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {f.date_echeance ? formatDate(f.date_echeance) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statut.couleur}`}>
                        {statut.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{f.nb_relances}x</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      {formatEuros(f.total_ttc)}
                    </td>
                    <td className="px-4 py-3">
                      {peutRelancer ? (
                        <button
                          onClick={() => lancerRelance(f)}
                          className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg text-xs font-medium transition-colors"
                        >
                          <Bell className="w-3 h-3" />
                          Relancer
                        </button>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {relanceActive && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-8 shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-lg font-bold text-gray-900">
                  Relance facture {relanceActive.numero}
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${niveauLabel.couleur}`}>
                  Niveau {niveauIdx + 1} — {niveauLabel.label}
                </span>
              </div>
              <button onClick={fermerModal} className="text-gray-400 hover:text-gray-600 transition-colors ml-4">
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingRelance ? (
              <div className="flex items-center gap-3 py-12 justify-center text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Inès rédige la relance...</span>
              </div>
            ) : relanceGeneree ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Sujet</label>
                  <input
                    type="text"
                    value={sujetEdite}
                    onChange={(e) => setSujetEdite(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Corps de l'email</label>
                  <textarea
                    value={corpsEdite}
                    onChange={(e) => setCorpsEdite(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-64 resize-y"
                  />
                </div>
              </div>
            ) : null}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={fermerModal}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={marquerEnvoyee}
                disabled={loadingRelance || !relanceGeneree}
                className="px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Marquer comme envoyée
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
