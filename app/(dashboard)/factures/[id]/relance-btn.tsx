"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  factureId: string;
  factureNumero: string;
  nbRelances: number;
  emailClient?: string | null;
}

const NIVEAUX = [
  { label: "Cordiale", color: "#1D4ED8", bg: "#DBEAFE", border: "#93C5FD" },
  { label: "Ferme", color: "#92400E", bg: "#FEF3C7", border: "#FCD34D" },
  { label: "Mise en demeure", color: "#B91C1C", bg: "#FEE2E2", border: "#FCA5A5" },
];

export function RelanceBtn({ factureId, factureNumero, nbRelances, emailClient }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [relance, setRelance] = useState<{ sujet: string; corps: string } | null>(null);
  const [sujetEdite, setSujetEdite] = useState("");
  const [corpsEdite, setCorpsEdite] = useState("");
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState(false);
  const router = useRouter();

  const niveau = NIVEAUX[Math.min(nbRelances, 2)];
  const labelBouton = nbRelances === 0
    ? "Relancer via Inès"
    : `Relance n°${nbRelances + 1} via Inès`;

  async function genererRelance() {
    setOpen(true);
    setLoading(true);
    setErreur("");
    setSucces(false);
    setRelance(null);

    const res = await fetch("/api/agents/relances", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ factureId }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErreur(data.erreur || "Erreur lors de la génération");
      setLoading(false);
      return;
    }

    setSujetEdite(data.relance.sujet);
    setCorpsEdite(data.relance.corps);
    setRelance(data.relance);
    setLoading(false);
  }

  async function marquerEnvoyee() {
    await fetch(`/api/factures/${factureId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut: "envoyee" }),
    });

    setSucces(true);
    setTimeout(() => {
      setOpen(false);
      setSucces(false);
      setRelance(null);
      router.refresh();
    }, 1800);
  }

  function fermer() {
    if (loading) return;
    setOpen(false);
    setRelance(null);
    setErreur("");
    setSucces(false);
  }

  async function copierCorps() {
    await navigator.clipboard.writeText(corpsEdite);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 13px",
    border: "1px solid var(--line)",
    borderRadius: "12px",
    fontSize: "13.5px",
    background: "white",
    color: "var(--ink)",
    outline: "none",
    boxSizing: "border-box" as const,
    fontFamily: "Geist, sans-serif",
  };

  return (
    <>
      <button
        onClick={genererRelance}
        style={{
          fontSize: "12px",
          color: "var(--ivory)",
          background: "#92400E",
          border: "none",
          borderRadius: "999px",
          padding: "6px 16px",
          cursor: "pointer",
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        ✉ {labelBouton}
      </button>

      {open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(14,14,14,0.55)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px",
        }}
          onClick={(e) => e.target === e.currentTarget && fermer()}
        >
          <div style={{
            background: "var(--ivory)",
            borderRadius: "20px",
            width: "100%",
            maxWidth: "580px",
            maxHeight: "90vh",
            overflowY: "auto" as const,
            padding: "32px",
          }}>

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
              <div>
                <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace", marginBottom: "6px" }}>
                  RELANCE — {factureNumero}
                </p>
                <h2 style={{ fontFamily: "Instrument Serif, serif", fontSize: "24px", color: "var(--ink)", lineHeight: 1.1 }}>
                  <em>{loading ? "Inès rédige..." : succes ? "Relance envoyée ✓" : `Relance ${niveau.label.toLowerCase()}`}</em>
                </h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {!loading && !succes && (
                  <span style={{
                    fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em",
                    padding: "4px 12px", borderRadius: "999px",
                    background: niveau.bg, color: niveau.color,
                    border: `1px solid ${niveau.border}`,
                    fontFamily: "Geist Mono, monospace",
                  }}>
                    Niveau {Math.min(nbRelances + 1, 3)} · {niveau.label}
                  </span>
                )}
                <button onClick={fermer} style={{ background: "var(--ivory-2)", border: "none", borderRadius: "8px", width: "30px", height: "30px", cursor: "pointer", fontSize: "16px", color: "var(--ink-3)" }}>×</button>
              </div>
            </div>

            {loading && (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", color: "var(--ink-2)" }}>
                  <span style={{ width: "16px", height: "16px", border: "2px solid var(--line)", borderTopColor: "var(--ink)", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                  <span style={{ fontSize: "14px", fontStyle: "italic", fontFamily: "Instrument Serif, serif" }}>
                    Inès rédige votre relance...
                  </span>
                </div>
              </div>
            )}

            {erreur && (
              <div style={{ background: "#FEF2F2", color: "#991B1B", fontSize: "13px", padding: "10px 14px", borderRadius: "10px", border: "1px solid #FECACA", marginBottom: "16px" }}>
                {erreur}
              </div>
            )}

            {succes && (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <p style={{ fontFamily: "Instrument Serif, serif", fontSize: "20px", color: "var(--ink)", marginBottom: "8px" }}>
                  Relance marquée comme envoyée.
                </p>
                <p style={{ fontSize: "13px", color: "var(--ink-3)" }}>
                  Le compteur de relances a été mis à jour.
                </p>
              </div>
            )}

            {relance && !succes && (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

                {emailClient && (
                  <div style={{ padding: "10px 14px", background: "var(--ivory-2)", borderRadius: "10px", border: "1px solid var(--line)" }}>
                    <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace", marginBottom: "4px" }}>DESTINATAIRE</p>
                    <p style={{ fontSize: "13.5px", color: "var(--ink)", fontFamily: "Geist Mono, monospace" }}>{emailClient}</p>
                  </div>
                )}

                <div>
                  <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace", display: "block", marginBottom: "6px" }}>
                    SUJET
                  </label>
                  <input
                    style={inputStyle}
                    value={sujetEdite}
                    onChange={(e) => setSujetEdite(e.target.value)}
                  />
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                    <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace" }}>
                      CORPS DE L&apos;EMAIL
                    </label>
                    <button
                      onClick={copierCorps}
                      style={{ fontSize: "11px", color: "var(--ink-3)", background: "none", border: "1px solid var(--line)", borderRadius: "999px", padding: "3px 10px", cursor: "pointer" }}
                    >
                      Copier
                    </button>
                  </div>
                  <textarea
                    style={{ ...inputStyle, minHeight: "220px", resize: "vertical" as const }}
                    value={corpsEdite}
                    onChange={(e) => setCorpsEdite(e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "Instrument Serif, serif", fontStyle: "italic", fontSize: "9px" }}>I</div>
                  <p style={{ fontSize: "11px", color: "var(--ink-3)", fontStyle: "italic" }}>Rédigé par Inès — vous pouvez modifier avant d&apos;envoyer</p>
                </div>

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "4px" }}>
                  <button
                    onClick={fermer}
                    style={{ padding: "10px 20px", background: "transparent", border: "1px solid var(--line)", borderRadius: "999px", fontSize: "13px", color: "var(--ink-2)", cursor: "pointer" }}
                  >
                    Fermer
                  </button>
                  <button
                    onClick={marquerEnvoyee}
                    style={{ padding: "10px 22px", background: "var(--ink)", color: "var(--ivory)", border: "none", borderRadius: "999px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}
                  >
                    ✓ Marquer comme envoyée
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
