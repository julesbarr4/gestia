export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { formatEuros } from "@/lib/utils";
import Link from "next/link";
import { AGENT_LABEL, AGENT_COLOR } from "@/lib/agents/team-data";
import { SummaryCard, ActionLink, CaCard } from "./dashboard-cards";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const debutMois = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const debutMoisPrecedent = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString();

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
    supabase.from("factures").select("total_ttc, statut").eq("user_id", user!.id).gte("created_at", debutMois),
    supabase.from("factures").select("total_ttc").eq("user_id", user!.id).gte("created_at", debutMoisPrecedent).lt("created_at", debutMois),
    supabase.from("agents_logs").select("agent, action, created_at").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(5),
    supabase.from("profiles").select("nom_entreprise, siret, numero_tva").eq("id", user!.id).single(),
  ]);

  const toutesFacturesMois = facturesMois || [];
  const caEncaisse = toutesFacturesMois.filter(f => f.statut === "payee").reduce((s, f) => s + f.total_ttc, 0);
  const caEmis = toutesFacturesMois.reduce((s, f) => s + f.total_ttc, 0);
  const caEmisPrec = (facturesMoisPrec || []).reduce((s, f) => s + f.total_ttc, 0);
  const montantImpaye = (facturesImpayees || []).reduce((s, f) => s + f.total_ttc, 0);

  const infosManquantes = !profile?.siret || !profile?.numero_tva;

  const dateAujourdhui = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div style={{ maxWidth: "1100px" }}>

      {infosManquantes && (
        <div style={{
          background: "#FFFBEB", border: "1px solid #FCD34D",
          borderRadius: "12px", padding: "12px 16px",
          marginBottom: "20px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
        }}>
          <div>
            <p style={{ fontSize: "13px", color: "#92400E", fontWeight: 500 }}>
              ⚠️ Informations manquantes pour la conformité RFE 2026
            </p>
            <p style={{ fontSize: "12px", color: "#B45309", marginTop: "2px" }}>
              Complétez votre SIRET et numéro de TVA dans les paramètres pour que vos factures soient conformes.
            </p>
          </div>
          <a href="/parametres" style={{
            fontSize: "12px", color: "#92400E", background: "#FEF3C7",
            border: "1px solid #FCD34D", borderRadius: "999px",
            padding: "6px 14px", textDecoration: "none", flexShrink: 0,
            fontWeight: 500,
          }}>
            Compléter →
          </a>
        </div>
      )}

      <div style={{ marginBottom: "40px" }}>
        <p style={{
          fontSize: "10.5px",
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "var(--ink-3)",
          marginBottom: "8px",
          fontFamily: "Geist Mono, monospace",
        }}>
          {dateAujourdhui}
        </p>
        <h1 style={{
          fontFamily: "Instrument Serif, serif",
          fontSize: "clamp(32px, 3.5vw, 48px)",
          lineHeight: 1.04,
          letterSpacing: "-0.02em",
          color: "var(--ink)",
          marginBottom: "10px",
        }}>
          Bonjour,{" "}
          <em>{profile?.nom_entreprise || "bienvenue"}.</em>
        </h1>
        <p style={{ fontSize: "15px", color: "var(--ink-2)", lineHeight: 1.55 }}>
          Voici l&apos;état de votre activité ce mois.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
        marginBottom: "32px",
      }}>
        <CaCard caEmis={caEmis} caEmisPrec={caEmisPrec} caEncaisse={caEncaisse} />
        <SummaryCard
          href="/factures"
          eyebrow="À ENCAISSER"
          value={formatEuros(montantImpaye)}
          valueColor={montantImpaye > 0 ? "#92400e" : undefined}
          sub={`${facturesImpayees?.length || 0} facture${(facturesImpayees?.length || 0) > 1 ? "s" : ""} en attente`}
        />
        <SummaryCard
          href="/devis"
          eyebrow="ACTIVITÉ"
          value={`${nbDevis || 0} devis`}
          sub={`${nbClients || 0} clients · ${nbFactures || 0} factures`}
        />
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr",
        gap: "20px",
      }}>

        <div style={{
          background: "white",
          border: "1px solid var(--line)",
          borderRadius: "16px",
          padding: "24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <p style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)" }}>
              FACTURES À ENCAISSER
            </p>
            <Link href="/factures" style={{ fontSize: "12px", color: "var(--ink-3)", textDecoration: "none" }}>
              Voir tout →
            </Link>
          </div>

          {(facturesImpayees?.length || 0) === 0 ? (
            <div style={{ padding: "32px 0", textAlign: "center" }}>
              <p style={{ fontFamily: "Instrument Serif, serif", fontSize: "18px", color: "var(--ink)", marginBottom: "6px" }}>
                Tout est à jour.
              </p>
              <p style={{ fontSize: "13px", color: "var(--ink-3)" }}>Aucune facture impayée.</p>
            </div>
          ) : (
            <div>
              {facturesImpayees?.map((f, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom: i < (facturesImpayees?.length || 0) - 1 ? "1px solid var(--line)" : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0,
                      background: f.statut === "en_retard" ? "#7a1d1d" : "#92400e",
                    }} />
                    <div>
                      <p style={{ fontSize: "13.5px", color: "var(--ink)", marginBottom: "2px" }}>
                        {(f.clients as { nom?: string } | null)?.nom || "Client"}
                      </p>
                      <p style={{ fontSize: "11px", fontFamily: "Geist Mono, monospace", color: "var(--ink-3)" }}>
                        {f.numero}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{
                      fontSize: "10.5px",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      padding: "3px 10px",
                      borderRadius: "999px",
                      background: f.statut === "en_retard" ? "#7a1d1d" : "color-mix(in oklch, var(--accent) 14%, transparent)",
                      color: f.statut === "en_retard" ? "var(--ivory)" : "var(--accent)",
                    }}>
                      {f.statut === "en_retard" ? "En retard" : "Envoyée"}
                    </span>
                    <p style={{ fontSize: "14px", fontFamily: "Geist Mono, monospace", fontWeight: 500, color: "var(--ink)", minWidth: "80px", textAlign: "right" }}>
                      {formatEuros(f.total_ttc)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          <div style={{
            background: "white",
            border: "1px solid var(--line)",
            borderRadius: "16px",
            padding: "24px",
          }}>
            <p style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", marginBottom: "16px" }}>
              ACTIONS RAPIDES
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {[
                { label: "Nouveau devis", sub: "Généré par Inès", href: "/devis/nouveau", color: "#2563eb", initiale: "I" },
                { label: "Nouvelle facture", sub: "Générée par Inès", href: "/factures/nouvelle", color: "#2563eb", initiale: "I" },
                { label: "Analyser un email", sub: "Traité par Léa", href: "/emails", color: "#059669", initiale: "L" },
                { label: "Rapport financier", sub: "Analysé par Hugo", href: "/rapports", color: "#7c3aed", initiale: "H" },
              ].map((a) => (
                <ActionLink key={a.href} {...a} />
              ))}
            </div>
          </div>

          {(derniersLogs?.length || 0) > 0 && (
            <div style={{
              background: "white",
              border: "1px solid var(--line)",
              borderRadius: "16px",
              padding: "24px",
            }}>
              <p style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", marginBottom: "16px" }}>
                ACTIVITÉ RÉCENTE
              </p>
              <div>
                {derniersLogs?.map((log, i) => {
                  const prenom = AGENT_LABEL[log.agent?.toLowerCase()] ?? log.agent;
                  const agentColor = AGENT_COLOR[prenom];
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "9px 0",
                      borderBottom: i < (derniersLogs?.length || 0) - 1 ? "1px solid var(--line)" : "none",
                    }}>
                      {agentColor && (
                        <div style={{
                          width: "26px", height: "26px", borderRadius: "50%",
                          background: agentColor.bg,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "white",
                          fontSize: "10px", fontWeight: 500,
                          flexShrink: 0,
                        }}>{agentColor.initiale}</div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "12.5px", color: "var(--ink)", fontStyle: "italic", fontFamily: "Instrument Serif, serif" }}>{prenom}</p>
                        <p style={{ fontSize: "11px", color: "var(--ink-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {log.action.replace(/_/g, " ")}
                        </p>
                      </div>
                      <p style={{ fontSize: "10.5px", fontFamily: "Geist Mono, monospace", color: "var(--ink-3)", flexShrink: 0 }}>
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
