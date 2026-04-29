export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatEuros, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";

const STATUT_LABELS: Record<string, { label: string; couleur: string }> = {
  brouillon: { label: "Brouillon", couleur: "bg-gray-100 text-gray-600" },
  envoye: { label: "Envoyé", couleur: "bg-blue-100 text-blue-600" },
  accepte: { label: "Accepté", couleur: "bg-green-100 text-green-600" },
  refuse: { label: "Refusé", couleur: "bg-red-100 text-red-600" },
  expire: { label: "Expiré", couleur: "bg-amber-100 text-amber-600" },
};

export default async function DevisPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: devis } = await supabase
    .from("devis")
    .select("*, clients(nom)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Devis</h1>
          <p className="text-sm text-gray-500 mt-1">{devis?.length || 0} devis au total</p>
        </div>
        <Link
          href="/devis/nouveau"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau devis IA
        </Link>
      </div>

      {(!devis || devis.length === 0) ? (
        <div className="text-center py-16">
          <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Aucun devis pour l'instant</p>
          <Link
            href="/devis/nouveau"
            className="mt-4 inline-flex items-center gap-1 text-blue-600 text-sm hover:underline"
          >
            <Plus className="w-4 h-4" />
            Créer mon premier devis par IA
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Numéro</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Client</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Date</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Statut</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">Montant TTC</th>
              </tr>
            </thead>
            <tbody>
              {devis.map((d: any) => {
                const statut = STATUT_LABELS[d.statut] || STATUT_LABELS.brouillon;
                return (
                  <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{d.numero}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {(d.clients as { nom?: string } | null)?.nom || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(d.date_emission)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statut.couleur}`}>
                        {statut.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      {formatEuros(d.total_ttc)}
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
