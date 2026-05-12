"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface Rapport {
  resumeExecutif: string;
  pointsForts: string[];
  pointsVigilance: string[];
  recommandations: string[];
  objectifsSemaineSuivante: string[];
}

interface Metriques {
  caSemaine: number;
  caMois: number;
  caMoisPrecedent: number;
  montantImpaye: number;
  tauxAcceptation: number;
}

function formatEuros(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}

export default function RapportsPage() {
  const [loading, setLoading] = useState(false);
  const [rapport, setRapport] = useState<Rapport | null>(null);
  const [metriques, setMetriques] = useState<Metriques | null>(null);
  const [erreur, setErreur] = useState("");

  async function genererRapport() {
    setLoading(true);
    setErreur("");

    const res = await fetch("/api/agents/rapport", { method: "POST" });
    const data = await res.json();

    if (res.status === 403) {
      setErreur(data.erreur || "Fonctionnalité réservée à un plan supérieur");
      setLoading(false);
      return;
    }

    if (!res.ok) {
      setErreur(data.erreur || "Erreur lors de la génération");
      setLoading(false);
      return;
    }

    setRapport(data.rapport);
    setMetriques(data.metriques);
    setLoading(false);
  }

  const eyebrow: React.CSSProperties = {
    fontSize: "10.5px",
    fontFamily: "Geist, sans-serif",
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    color: "var(--ink-3)",
    fontWeight: 500,
  };

  return (
    <div style={{ padding: "40px", background: "var(--ivory)", minHeight: "100%", maxWidth: "860px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "40px" }}>
        <div>
          <p style={{ ...eyebrow, marginBottom: "8px" }}>RAPPORTS</p>
          <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "36px", fontWeight: 400, color: "var(--ink)", lineHeight: 1.1 }}>
            Votre rapport hebdomadaire avec <span style={{ fontStyle: "italic" }}>Hugo.</span>
          </h1>
        </div>
        <button
          onClick={genererRapport}
          disabled={loading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: loading ? "var(--ink-3)" : "var(--ink)",
            color: "var(--ivory)",
            borderRadius: "999px",
            padding: "10px 20px",
            fontSize: "13px",
            fontFamily: "Geist, sans-serif",
            fontWeight: 500,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            flexShrink: 0,
          }}
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Hugo analyse vos chiffres...</>
          ) : (
            "Générer le rapport →"
          )}
        </button>
      </div>

      {erreur && (
        <div style={{ background: "#fef2f2", color: "#991b1b", fontSize: "13px", padding: "14px 16px", borderRadius: "8px", marginBottom: "24px", fontFamily: "Geist, sans-serif" }}>
          {erreur}
        </div>
      )}

      {metriques && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "CA semaine", valeur: formatEuros(metriques.caSemaine), rouge: false },
            { label: "CA mois", valeur: formatEuros(metriques.caMois), rouge: false },
            { label: "CA mois préc.", valeur: formatEuros(metriques.caMoisPrecedent), rouge: false },
            { label: "Impayés", valeur: formatEuros(metriques.montantImpaye), rouge: true },
            { label: "Taux accept.", valeur: `${metriques.tauxAcceptation}%`, rouge: false },
          ].map((m) => (
            <div key={m.label} style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", padding: "20px" }}>
              <div style={{ fontSize: "18px", fontFamily: "Geist Mono, monospace", fontWeight: 700, color: m.rouge ? "#7a1d1d" : "var(--ink)", marginBottom: "4px" }}>
                {m.valeur}
              </div>
              <div style={{ fontSize: "10.5px", fontFamily: "Geist, sans-serif", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {rapport && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ background: "var(--ivory-2)", border: "1px solid var(--line)", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "20px", fontFamily: "Instrument Serif, serif", fontStyle: "italic", flexShrink: 0 }}>
              H
            </div>
            <div>
              <p style={{ fontSize: "14px", fontFamily: "Geist, sans-serif", fontWeight: 600, color: "var(--ink)", marginBottom: "2px" }}>Analyse de Hugo</p>
              <p style={{ fontSize: "11px", fontFamily: "Geist, sans-serif", color: "var(--ink-3)" }}>Directeur financier IA</p>
            </div>
          </div>

          <div style={{ background: "var(--ink)", borderRadius: "16px", padding: "28px 32px" }}>
            <p style={{ ...eyebrow, color: "rgba(251,248,243,0.5)", marginBottom: "12px" }}>RÉSUMÉ EXÉCUTIF</p>
            <p style={{ fontSize: "14px", fontFamily: "Geist, sans-serif", color: "var(--ivory)", lineHeight: 1.7, whiteSpace: "pre-line" }}>
              {rapport.resumeExecutif}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", padding: "24px" }}>
              <p style={{ ...eyebrow, marginBottom: "16px" }}>POINTS FORTS</p>
              <ul style={{ display: "flex", flexDirection: "column", gap: "10px", margin: 0, padding: 0, listStyle: "none" }}>
                {rapport.pointsForts.map((p, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px", fontFamily: "Geist, sans-serif", color: "var(--ink-2)", lineHeight: 1.5 }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", flexShrink: 0, marginTop: "6px" }} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", padding: "24px" }}>
              <p style={{ ...eyebrow, marginBottom: "16px" }}>POINTS DE VIGILANCE</p>
              <ul style={{ display: "flex", flexDirection: "column", gap: "10px", margin: 0, padding: 0, listStyle: "none" }}>
                {rapport.pointsVigilance.map((p, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px", fontFamily: "Geist, sans-serif", color: "var(--ink-2)", lineHeight: 1.5 }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#f59e0b", flexShrink: 0, marginTop: "6px" }} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", padding: "24px" }}>
              <p style={{ ...eyebrow, marginBottom: "16px" }}>RECOMMANDATIONS</p>
              <ul style={{ display: "flex", flexDirection: "column", gap: "10px", margin: 0, padding: 0, listStyle: "none" }}>
                {rapport.recommandations.map((r, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px", fontFamily: "Geist, sans-serif", color: "var(--ink-2)", lineHeight: 1.5, borderLeft: "2px solid var(--ink)", paddingLeft: "12px" }}>
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ background: "var(--ivory-2)", border: "1px solid var(--line)", borderRadius: "16px", padding: "24px" }}>
              <p style={{ ...eyebrow, marginBottom: "16px" }}>OBJECTIFS SEMAINE PROCHAINE</p>
              <ul style={{ display: "flex", flexDirection: "column", gap: "10px", margin: 0, padding: 0, listStyle: "none" }}>
                {rapport.objectifsSemaineSuivante.map((o, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px", fontFamily: "Geist, sans-serif", color: "var(--ink-2)", lineHeight: 1.5 }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--ink)", flexShrink: 0, marginTop: "6px" }} />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {!rapport && !loading && (
        <div style={{ textAlign: "center", padding: "80px 0", fontSize: "13px", fontFamily: "Geist, sans-serif", color: "var(--ink-3)" }}>
          Cliquez sur &quot;Générer le rapport&quot; pour lancer l&apos;analyse de Hugo.
        </div>
      )}
    </div>
  );
}
