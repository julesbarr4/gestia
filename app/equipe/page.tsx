import Link from "next/link";
import { PublicShell } from "@/app/components/public-layout";
import { TEAM_AGENTS } from "@/lib/agents/team-data";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "L'équipe IA — Inès, Léa, Hugo, Cyprien, Augustin",
  description:
    "Rencontrez les 5 agents IA de Gestia : Inès pour la facturation, Léa pour le support client, Hugo pour vos finances, Cyprien pour le marketing, Augustin pour la stratégie.",
  alternates: { canonical: "https://gestia-beta.vercel.app/equipe" },
};

export default function EquipePage() {
  return (
    <PublicShell>
      <div style={{ padding: "100px 40px 60px", textAlign: "center" }}>
        <p style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--ink-3)", marginBottom: "12px", fontFamily: "Geist Mono, monospace" }}>L'ÉQUIPE GESTIA</p>
        <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "48px", lineHeight: 1.06, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: "16px" }}>
          Rencontrez vos <em>5 experts IA.</em>
        </h1>
        <p style={{ fontSize: "16px", color: "var(--ink-2)", maxWidth: "540px", margin: "0 auto", lineHeight: 1.55 }}>
          5 agents spécialisés qui travaillent 24h/24 pour gérer votre administratif, vos finances, vos clients et votre stratégie.
        </p>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 40px 80px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {TEAM_AGENTS.map((agent) => (
          <div key={agent.id} style={{
            background: "white",
            border: "1px solid var(--line)",
            borderRadius: "20px",
            padding: "28px",
            display: "flex",
            flexDirection: "column",
          }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "50%",
              background: agent.style.accentBg,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontFamily: "Instrument Serif, serif",
              fontStyle: "italic", fontSize: "24px",
              marginBottom: "16px",
            }}>
              {agent.initiale}
            </div>
            <p style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-3)", marginBottom: "6px", fontFamily: "Geist Mono, monospace" }}>
              {agent.role}
            </p>
            <h3 style={{ fontFamily: "Instrument Serif, serif", fontSize: "22px", color: "var(--ink)", marginBottom: "6px" }}>{agent.prenom}</h3>
            <p style={{ fontSize: "14px", color: "var(--ink)", fontWeight: 600, marginBottom: "10px" }}>{agent.baseline}</p>
            <p style={{ fontSize: "13.5px", color: "var(--ink-2)", lineHeight: 1.6, marginBottom: "16px", flex: 1 }}>{agent.description}</p>
            <ul style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
              {agent.missions.map((m, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "var(--ink-2)" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", marginTop: "6px", flexShrink: 0 }} />
                  {m}
                </li>
              ))}
            </ul>
            <Link href="/signup" style={{
              display: "inline-block", padding: "9px 18px",
              border: "1px solid var(--line)", borderRadius: "999px",
              fontSize: "13px", color: "var(--ink-2)", textDecoration: "none",
              alignSelf: "flex-start",
            }}>
              Accéder →
            </Link>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--ivory-2)", padding: "80px 40px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Instrument Serif, serif", fontSize: "36px", color: "var(--ink)", marginBottom: "16px", lineHeight: 1.1 }}>
          Prêt à rencontrer <em>votre équipe ?</em>
        </h2>
        <p style={{ fontSize: "15px", color: "var(--ink-2)", marginBottom: "32px" }}>
          14 jours d'essai gratuit, sans carte bancaire.
        </p>
        <Link href="/signup" style={{
          display: "inline-block", padding: "14px 32px",
          background: "var(--ink)", color: "var(--ivory)",
          borderRadius: "999px", fontSize: "15px", fontWeight: 500,
          textDecoration: "none",
        }}>
          Commencer gratuitement →
        </Link>
      </div>
    </PublicShell>
  );
}
