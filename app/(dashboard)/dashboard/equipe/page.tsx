import Link from "next/link";
import { TEAM_AGENTS } from "@/lib/agents/team-data";

const AGENT_COLORS: Record<string, string> = {
  ines: "#2563eb",
  lea: "#059669",
  hugo: "#7c3aed",
  cyprien: "#ea580c",
  augustin: "#0E0E0E",
};

export default function EquipeDashboardPage() {
  return (
    <div style={{ padding: "40px", background: "var(--ivory)", minHeight: "100%" }}>
      <div style={{ marginBottom: "48px" }}>
        <p style={{ fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", marginBottom: "8px" }}>
          VOTRE ÉQUIPE
        </p>
        <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "36px", fontWeight: 400, color: "var(--ink)", lineHeight: 1.1 }}>
          5 experts qui travaillent <span style={{ fontStyle: "italic" }}>pour vous.</span>
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
        {TEAM_AGENTS.map((agent) => {
          const color = AGENT_COLORS[agent.id] || "var(--ink)";
          return (
            <div
              key={agent.id}
              style={{
                background: "var(--ivory-2)",
                border: "1px solid var(--line)",
                borderRadius: "16px",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "22px",
                    fontFamily: "Instrument Serif, serif",
                    fontStyle: "italic",
                    flexShrink: 0,
                  }}
                >
                  {agent.initiale}
                </div>
              </div>

              <h3 style={{ fontFamily: "Instrument Serif, serif", fontSize: "18px", fontWeight: 400, color: "var(--ink)", marginBottom: "4px" }}>
                {agent.prenom}
              </h3>
              <p style={{ fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontWeight: 500, marginBottom: "12px" }}>
                {agent.role}
              </p>
              <p style={{ fontSize: "13px", fontFamily: "Geist, sans-serif", color: "var(--ink)", fontWeight: 600, marginBottom: "8px" }}>
                {agent.baseline}
              </p>
              <p style={{ fontSize: "13px", fontFamily: "Geist, sans-serif", color: "var(--ink-2)", lineHeight: 1.6, marginBottom: "16px", flex: 1 }}>
                {agent.description}
              </p>

              <ul style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "0 0 20px", padding: 0, listStyle: "none" }}>
                {agent.missions.map((m, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "12px", fontFamily: "Geist, sans-serif", color: "var(--ink-2)", lineHeight: 1.5 }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--accent)", flexShrink: 0, marginTop: "6px" }} />
                    {m}
                  </li>
                ))}
              </ul>

              <Link
                href={agent.lien}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  border: "1px solid var(--line)",
                  borderRadius: "999px",
                  padding: "8px 18px",
                  fontSize: "12px",
                  fontFamily: "Geist, sans-serif",
                  color: "var(--ink-2)",
                  textDecoration: "none",
                  fontWeight: 500,
                  background: "transparent",
                  alignSelf: "flex-start",
                }}
                className="hover:border-[var(--ink)] hover:text-[var(--ink)] transition-colors"
              >
                Accéder →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
