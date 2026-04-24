export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { formatEuros } from "@/lib/utils";
import { FileText, Receipt, Users, AlertTriangle, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import { isDemoMode } from "@/lib/demo/is-demo";
import { MOCK_USER } from "@/lib/demo/mock-data";
import { getMockSupabaseClient } from "@/lib/demo/mock-supabase";

export default async function DashboardPage() {
  // demo bypass
  let user: any, supabase: any;
  if (isDemoMode()) {
    user = MOCK_USER;
    supabase = getMockSupabaseClient();
  } else {
    supabase = await createClient();
    const { data: { user: u } } = await supabase.auth.getUser();
    user = u;
  }

  const debutMois = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

  const [
    { count: nbClients },
    { count: nbDevis },
    { count: nbFactures },
    { data: facturesImpayees },
    { data: facturesMois },
    { data: derniersLogs },
  ] = await Promise.all([
    supabase.from("clients").select("*", { count: "exact", head: true }).eq("user_id", user!.id),
    supabase.from("devis").select("*", { count: "exact", head: true }).eq("user_id", user!.id),
    supabase.from("factures").select("*", { count: "exact", head: true }).eq("user_id", user!.id),
    supabase.from("factures").select("total_ttc, numero, clients(nom)").eq("user_id", user!.id).in("statut", ["envoyee", "en_retard"]),
    supabase.from("factures").select("total_ttc").eq("user_id", user!.id).eq("statut", "payee").gte("created_at", debutMois),
    supabase.from("agents_logs").select("agent, action, created_at").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(5),
  ]);

  const caMois = (facturesMois || []).reduce((s: number, f: any) => s + f.total_ttc, 0);
  const montantImpaye = (facturesImpayees || []).reduce((s: number, f: any) => s + f.total_ttc, 0);

  const STATS = [
    { label: "CA ce mois", valeur: formatEuros(caMois), icon: TrendingUp, couleur: "text-green-600", bg: "bg-green-50" },
    { label: "Clients", valeur: String(nbClients || 0), icon: Users, couleur: "text-blue-600", bg: "bg-blue-50" },
    { label: "Devis", valeur: String(nbDevis || 0), icon: FileText, couleur: "text-purple-600", bg: "bg-purple-50" },
    { label: "Factures", valeur: String(nbFactures || 0), icon: Receipt, couleur: "text-orange-600", bg: "bg-orange-50" },
  ];

  const agentLabel: Record<string, string> = {
    "admin-agent": "Agent Admin",
    "support-agent": "Agent Support",
    "cfo-agent": "Agent CFO",
    "ceo-agent": "Augustin",
    "cmo-agent": "Agent CMO",
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 text-sm mt-1">Vue d'ensemble de votre activité</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100">
            <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center mb-3`}>
              <s.icon className={`w-4 h-4 ${s.couleur}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{s.valeur}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* FACTURES IMPAYÉES */}
        {(facturesImpayees?.length || 0) > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h2 className="font-semibold text-gray-900">Factures impayées</h2>
              <span className="ml-auto text-sm font-semibold text-red-600">
                {formatEuros(montantImpaye)}
              </span>
            </div>
            <div className="space-y-2">
              {facturesImpayees?.map((f: any) => (
                <div key={f.numero} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{f.numero}</span>
                    <span className="text-xs text-gray-400 ml-2">
                      {(f.clients as { nom?: string } | null)?.nom || "Client"}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{formatEuros(f.total_ttc)}</span>
                </div>
              ))}
            </div>
            <Link
              href="/factures"
              className="mt-4 block text-center text-sm text-blue-600 hover:underline"
            >
              Voir toutes les factures →
            </Link>
          </div>
        )}

        {/* ACTIONS RAPIDES */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-blue-500" />
            <h2 className="font-semibold text-gray-900">Actions rapides</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Nouveau devis IA", href: "/devis/nouveau", couleur: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
              { label: "Nouvelle facture IA", href: "/factures/nouvelle", couleur: "bg-purple-50 text-purple-700 hover:bg-purple-100" },
              { label: "Analyser un email", href: "/emails", couleur: "bg-green-50 text-green-700 hover:bg-green-100" },
              { label: "Rapport financier", href: "/rapports", couleur: "bg-orange-50 text-orange-700 hover:bg-orange-100" },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className={`${a.couleur} text-center text-sm font-medium py-3 rounded-lg transition-colors`}
              >
                {a.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ACTIVITÉ DES AGENTS */}
        {(derniersLogs?.length || 0) > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-6 lg:col-span-2">
            <h2 className="font-semibold text-gray-900 mb-4">Activité récente des agents IA</h2>
            <div className="space-y-2">
              {derniersLogs?.map((log: any, i: number) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700">
                    {agentLabel[log.agent] || log.agent}
                  </span>
                  <span className="text-sm text-gray-400">— {log.action.replace(/_/g, " ")}</span>
                  <span className="ml-auto text-xs text-gray-300">
                    {new Date(log.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
