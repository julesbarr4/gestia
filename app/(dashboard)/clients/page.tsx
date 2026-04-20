export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Users, Plus } from "lucide-react";

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500 mt-1">{clients?.length || 0} clients au total</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Nouveau client
        </button>
      </div>

      {(!clients || clients.length === 0) ? (
        <div className="text-center py-16">
          <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Aucun client pour l'instant</p>
          <p className="text-gray-300 text-xs mt-1">
            Les clients sont créés automatiquement lors de la génération de devis ou factures.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Nom</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Email</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Téléphone</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Ville</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Ajouté le</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{c.nom}</td>
                  <td className="px-4 py-3 text-gray-500">{c.email || "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{c.telephone || "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{c.ville || "—"}</td>
                  <td className="px-4 py-3 text-gray-400">{formatDate(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
