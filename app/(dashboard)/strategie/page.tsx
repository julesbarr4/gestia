"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface AnalyseStrategique {
  diagnostic: string;
  situationStrategique: string;
  tensions: string[];
  axes: Array<{
    titre: string;
    objectif: string;
    actions: string[];
  }>;
  resultatsAttendus: string;
  priorites: Array<{
    action: string;
    impact: string;
    effort: string;
    delai: string;
  }>;
  opportunites: string[];
  risques: string[];
  messageMotivation: string;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid var(--line)",
  borderRadius: "8px",
  padding: "10px 14px",
  fontSize: "14px",
  fontFamily: "Geist, sans-serif",
  color: "var(--ink)",
  background: "white",
  outline: "none",
  boxSizing: "border-box",
  resize: "none" as const,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "10.5px",
  fontFamily: "Geist, sans-serif",
  textTransform: "uppercase" as const,
  letterSpacing: "0.16em",
  color: "var(--ink-3)",
  marginBottom: "6px",
  fontWeight: 500,
};

export default function StrategiePage() {
  const [objectifs, setObjectifs] = useState("");
  const [problemes, setProblemes] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyse, setAnalyse] = useState<AnalyseStrategique | null>(null);
  const [erreur, setErreur] = useState("");

  async function lancer(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErreur("");

    const res = await fetch("/api/agents/ceo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ objectifs, problemes }),
    });

    const data = await res.json();

    if (res.status === 403) {
      setErreur(data.erreur || "Fonctionnalité réservée à un plan supérieur");
      setLoading(false);
      return;
    }

    if (!res.ok) {
      setErreur(data.erreur || "Erreur");
      setLoading(false);
      return;
    }

    setAnalyse(data.analyse);
    setLoading(false);
  }

  return (
    <div style={{ padding: "40px", background: "var(--ivory)", minHeight: "100%", maxWidth: "800px" }}>
      <div style={{ marginBottom: "40px" }}>
        <p style={{ fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", marginBottom: "8px" }}>
          STRATÉGIE
        </p>
        <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "36px", fontWeight: 400, color: "var(--ink)", lineHeight: 1.1 }}>
          Votre analyse stratégique avec <span style={{ fontStyle: "italic" }}>Augustin.</span>
        </h1>
      </div>

      <form onSubmit={lancer} style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", padding: "32px", marginBottom: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label style={labelStyle}>Vos objectifs (optionnel)</label>
          <textarea
            value={objectifs}
            onChange={(e) => setObjectifs(e.target.value)}
            rows={3}
            style={inputStyle}
            placeholder="Ex : doubler mon CA, recruter 2 personnes, lancer une nouvelle offre..."
          />
        </div>
        <div>
          <label style={labelStyle}>Vos problèmes actuels (optionnel)</label>
          <textarea
            value={problemes}
            onChange={(e) => setProblemes(e.target.value)}
            rows={3}
            style={inputStyle}
            placeholder="Ex : dépendance à un gros client, positionnement flou, charge opérationnelle..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: loading ? "var(--ink-3)" : "var(--ink)",
            color: "var(--ivory)",
            borderRadius: "999px",
            padding: "12px 24px",
            fontSize: "13px",
            fontFamily: "Geist, sans-serif",
            fontWeight: 500,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            alignSelf: "flex-start",
          }}
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Augustin analyse votre stratégie...</>
          ) : (
            "Lancer l'analyse stratégique →"
          )}
        </button>
      </form>

      {erreur && (
        <div style={{ background: "#fef2f2", color: "#991b1b", fontSize: "13px", padding: "14px 16px", borderRadius: "8px", marginBottom: "24px", fontFamily: "Geist, sans-serif" }}>
          {erreur}
        </div>
      )}

      {analyse && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ background: "var(--ivory-2)", border: "1px solid var(--line)", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ivory)", fontSize: "20px", fontFamily: "Instrument Serif, serif", fontStyle: "italic", flexShrink: 0 }}>
              A
            </div>
            <div>
              <p style={{ fontSize: "14px", fontFamily: "Geist, sans-serif", fontWeight: 600, color: "var(--ink)", marginBottom: "2px" }}>Analyse d&apos;Augustin</p>
              <p style={{ fontSize: "11px", fontFamily: "Geist, sans-serif", color: "var(--ink-3)" }}>Directeur général IA</p>
            </div>
          </div>

          <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", padding: "28px" }}>
            <p style={{ fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontWeight: 500, marginBottom: "14px" }}>DIAGNOSTIC</p>
            <p style={{ fontSize: "14px", fontFamily: "Geist, sans-serif", color: "var(--ink-2)", lineHeight: 1.7, whiteSpace: "pre-line" }}>
              {analyse.diagnostic}
            </p>
          </div>

          <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", padding: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <div style={{ width: "28px", height: "28px", background: "var(--ink)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ivory)", fontSize: "11px", fontFamily: "Geist, sans-serif", fontWeight: 700 }}>S</div>
              <p style={{ fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontWeight: 500 }}>SITUATION STRATÉGIQUE</p>
            </div>
            <p style={{ fontSize: "14px", fontFamily: "Geist, sans-serif", color: "var(--ink-2)", lineHeight: 1.7 }}>
              {analyse.situationStrategique}
            </p>
          </div>

          <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", padding: "28px", borderLeft: "4px solid #f59e0b" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <div style={{ width: "28px", height: "28px", background: "#f59e0b", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "11px", fontFamily: "Geist, sans-serif", fontWeight: 700 }}>T</div>
              <p style={{ fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontWeight: 500 }}>TENSIONS</p>
            </div>
            <ul style={{ display: "flex", flexDirection: "column", gap: "10px", margin: 0, padding: 0, listStyle: "none" }}>
              {analyse.tensions.map((t, i) => (
                <li key={i} style={{ display: "flex", gap: "10px", fontSize: "13px", fontFamily: "Geist, sans-serif", color: "var(--ink-2)", lineHeight: 1.6 }}>
                  <span style={{ color: "#f59e0b", flexShrink: 0 }}>•</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", padding: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ width: "28px", height: "28px", background: "var(--accent)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "11px", fontFamily: "Geist, sans-serif", fontWeight: 700 }}>A</div>
              <p style={{ fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontWeight: 500 }}>AXES STRATÉGIQUES (90 JOURS)</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {analyse.axes.map((axe, i) => (
                <div key={i} style={{ borderLeft: "2px solid var(--accent)", paddingLeft: "16px" }}>
                  <h3 style={{ fontSize: "14px", fontFamily: "Geist, sans-serif", fontWeight: 600, color: "var(--ink)", marginBottom: "4px" }}>{axe.titre}</h3>
                  <p style={{ fontSize: "12px", fontFamily: "Geist, sans-serif", color: "var(--ink-3)", fontStyle: "italic", marginBottom: "10px" }}>{axe.objectif}</p>
                  <ul style={{ display: "flex", flexDirection: "column", gap: "6px", margin: 0, padding: 0, listStyle: "none" }}>
                    {axe.actions.map((a, j) => (
                      <li key={j} style={{ display: "flex", gap: "8px", fontSize: "13px", fontFamily: "Geist, sans-serif", color: "var(--ink-2)", lineHeight: 1.5 }}>
                        <span style={{ color: "var(--accent)", flexShrink: 0 }}>→</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "var(--ink)", borderRadius: "16px", padding: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <div style={{ width: "28px", height: "28px", background: "rgba(251,248,243,0.15)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ivory)", fontSize: "11px", fontFamily: "Geist, sans-serif", fontWeight: 700 }}>R</div>
              <p style={{ fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "rgba(251,248,243,0.5)", fontWeight: 500 }}>RÉSULTATS ATTENDUS</p>
            </div>
            <p style={{ fontSize: "14px", fontFamily: "Geist, sans-serif", color: "var(--ivory)", lineHeight: 1.7 }}>
              {analyse.resultatsAttendus}
            </p>
          </div>

          <div style={{ padding: "28px 0", textAlign: "center" }}>
            <p style={{ fontSize: "20px", fontFamily: "Instrument Serif, serif", fontStyle: "italic", color: "var(--accent)", lineHeight: 1.5, marginBottom: "10px" }}>
              &ldquo;{analyse.messageMotivation}&rdquo;
            </p>
            <p style={{ fontSize: "12px", fontFamily: "Geist Mono, monospace", color: "var(--ink-3)" }}>— Augustin</p>
          </div>
        </div>
      )}
    </div>
  );
}
