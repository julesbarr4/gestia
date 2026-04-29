export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { formatEuros } from "@/lib/utils";
import { FileText, Receipt, Users, TrendingUp, Zap, ArrowUpRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { AGENT_LABEL, AGENT_COLOR } from "@/lib/agents/team-data";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const debutMois = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const debutMoisPrecedent = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString();
  const finMoisPrecedent = new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString();

  const [
    { count: nbClients },
    { count: nbDevis },
    { count: nbFactures },
    { data: facturesImpayees },
    { data: facturesMois },
    { data: facturesMoisPrec },
    { data: derniersLogs },
    { data: profile },
  ] = await Promise.all([
    supabase.from("clients").select("*", { count: "exact", head: true }).eq("user_id", user!.id),
    supabase.from("devis").select("*", { count: "exact", head: true }).eq("user_id", user!.id),
    supabase.from("factures").select("*", { count: "exact", head: true }).eq("user_id", user!.id),
    supabase.from("factures").select("total_ttc, numero, statut, clients(nom)").eq("user_id", user!.id).in("statut", ["envoyee", "en_retard"]).order("created_at", { ascending: false }).limit(4),
    supabase.from("factures").select("total_ttc").eq("user_id", user!.id).eq("statut", "payee").gte("created_at", debutMois),
    supabase.from("factures").select("total_ttc").eq("user_id", user!.id).eq("statut", "payee").gte("created_at", debutMoisPrecedent).lte("created_at", finMoisPrecedent),
    supabase.from("agents_logs").select("agent, action, created_at").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(6),
    supabase.from("profiles").select("nom_entreprise").eq("id", user!.id).single(),
  ]);

  const caMois = (facturesMois || []).reduce((s, f) => s + f.total_ttc, 0);
  const caMoisPrec = (facturesMoisPrec || []).reduce((s, f) => s + f.total_ttc, 0);
  const montantImpaye = (facturesImpayees || []).reduce((s, f) => s + f.total_ttc, 0);
  const progressionCA = caMoisPrec > 0 ? Math.round(((caMois - caMoisPrec) / caMoisPrec) * 100) : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-8">

        <div className="mb-8">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-1">
            {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Bonjour, {profile?.nom_entreprise || "bienvenue"} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">Voici l'état de votre activité ce mois</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">CA ce mois</p>
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <p className="text-3xl font-semibold text-slate-900">{formatEuros(caMois)}</p>
            {progressionCA !== null && (
              <p className={`text-xs mt-2 font-medium flex items-center gap-1 ${progressionCA >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                <ArrowUpRight className="w-3 h-3" />
                {progressionCA >= 0 ? "+" : ""}{progressionCA}% vs mois dernier
              </p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Impayés</p>
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                <Receipt className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <p className={`text-3xl font-semibold ${montantImpaye > 0 ? "text-amber-600" : "text-slate-900"}`}>
              {formatEuros(montantImpaye)}
            </p>
            <p className="text-xs mt-2 text-slate-400">
              {facturesImpayees?.length || 0} facture{(facturesImpayees?.length || 0) > 1 ? "s" : ""} en attente
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Clients</p>
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-semibold text-slate-900">{nbClients || 0}</p>
            <p className="text-xs mt-2 text-slate-400">au total</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Devis</p>
              <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-violet-600" />
              </div>
            </div>
            <p className="text-3xl font-semibold text-slate-900">{nbDevis || 0}</p>
            <p className="text-xs mt-2 text-slate-400">{nbFactures || 0} factures émises</p>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-slate-900">Factures à encaisser</h2>
              <Link href="/factures" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Voir tout <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {(facturesImpayees?.length || 0) === 0 ? (
              <div className="py-10 text-center">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Receipt className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-sm font-medium text-slate-700">Aucun impayé</p>
                <p className="text-xs text-slate-400 mt-1">Toutes vos factures sont à jour</p>
              </div>
            ) : (
              <div className="space-y-2">
                {facturesImpayees?.map((f, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${f.statut === "en_retard" ? "bg-red-400" : "bg-amber-400"}`} />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{(f.clients as { nom?: string } | null)?.nom || "Client"}</p>
                        <p className="text-xs text-slate-400">{f.numero}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${f.statut === "en_retard" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"}`}>
                        {f.statut === "en_retard" ? "En retard" : "Envoyée"}
                      </span>
                      <p className="text-sm font-semibold text-slate-900 min-w-[80px] text-right">{formatEuros(f.total_ttc)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Zap className="w-4 h-4 text-blue-500" />
              <h2 className="text-sm font-semibold text-slate-900">Actions rapides</h2>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { label: "Nouveau devis", sub: "Généré par Inès", href: "/devis/nouveau", color: "#2563EB", initiale: "I" },
                { label: "Nouvelle facture", sub: "Générée par Inès", href: "/factures/nouvelle", color: "#2563EB", initiale: "I" },
                { label: "Analyser un email", sub: "Traité par Léa", href: "/emails", color: "#059669", initiale: "L" },
                { label: "Rapport financier", sub: "Analysé par Hugo", href: "/rapports", color: "#7C3AED", initiale: "H" },
              ].map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0" style={{ backgroundColor: a.color }}>
                    {a.initiale}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{a.label}</p>
                    <p className="text-xs text-slate-400">{a.sub}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {(derniersLogs?.length || 0) > 0 && (
            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-5">Activité récente</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {derniersLogs?.map((log, i) => {
                  const prenom = AGENT_LABEL[log.agent?.toLowerCase()] ?? log.agent;
                  const agentColor = AGENT_COLOR[prenom];
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                      {agentColor ? (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                          style={{ backgroundColor: agentColor.bg }}
                        >
                          {agentColor.initiale}
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-700 truncate">{prenom}</p>
                        <p className="text-xs text-slate-400 truncate">{log.action.replace(/_/g, " ")}</p>
                      </div>
                      <p className="text-xs text-slate-300 flex-shrink-0">
                        {new Date(log.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
