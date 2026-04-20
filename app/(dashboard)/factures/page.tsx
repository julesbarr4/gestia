import { createClient } from "@/lib/supabase/server";
import { formatEuros, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Plus, Receipt } from "lucide-react";

const STATUT_LABELS: Record<string, { label: string; couleur: string }> = {
  brouillon: { label: "Brouillon", couleur: "bg-gray-100 text-gray-600" },
  envoyee: { label: "Envoyée", couleur: "bg-blue-100 text-blue-600" },
  payee: { label: "Payée", couleur: "bg-green-100 text-green-600" },
  en_retard: { label: "En retard", couleur: "bg-red-100 text-red-600" },
  annulee: { label: "Annulée", couleur: "bg-gray-100 text-gray-400" },
};

export default async function FacturesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: factures } = await supabase
    .from("factures")
    .select("*, clients(nom)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
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
              </tr>
            </thead>
            <tbody>
              {factures.map((f) => {
                const statut = STATUT_LABELS[f.statut] || STATUT_LABELS.brouillon;
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
