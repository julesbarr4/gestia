"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, X, Loader2 } from "lucide-react";
import { formatEuros, formatDate } from "@/lib/utils";

type StatutStyle = { label: string; background: string; color: string };

const STATUTS: Record<string, StatutStyle> = {
  brouillon: { label: "Brouillon", background: "var(--line)", color: "var(--ink-3)" },
  envoyee: { label: "Envoyée", background: "var(--ivory-2)", color: "var(--ink-2)" },
  payee: { label: "Payée", background: "color-mix(in oklch, var(--accent) 14%, transparent)", color: "var(--accent)" },
  en_retard: { label: "En retard", background: "#7a1d1d", color: "var(--ivory)" },
  annulee: { label: "Annulée", background: "var(--line)", color: "var(--ink-3)" },
};

const NIVEAU_LABELS = [
  { label: "Cordiale", background: "var(--ivory-2)", color: "var(--ink-2)" },
  { label: "Ferme", background: "#fef3c7", color: "#92400e" },
  { label: "Mise en demeure", background: "#7a1d1d", color: "var(--ivory)" },
];

interface Facture {
  id: string;
  numero: string;
  statut: string;
  date_echeance: string | null;
  total_ttc: number;
  nb_relances: number;
  clients: { nom?: string } | null;
}

interface RelanceGeneree {
  sujet: string;
  corps: string;
  niveau: number;
}

export default function FacturesClient({ factures }: { factures: Facture[] }) {
  const [relanceActive, setRelanceActive] = useState<Facture | null>(null);
  const [relanceGeneree, setRelanceGeneree] = useState<RelanceGeneree | null>(null);
  const [loadingRelance, setLoadingRelance] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [sujetEdite, setSujetEdite] = useState("");
  const [corpsEdite, setCorpsEdite] = useState("");

  async function lancerRelance(facture: Facture) {
    setRelanceActive(facture);
    setRelanceGeneree(null);
    setLoadingRelance(true);

    const res = await fetch("/api/agents/relances", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ factureId: facture.id }),
    });

    const data = await res.json();
    const rg: RelanceGeneree = {
      sujet: data.relance?.sujet || data.sujet || "",
      corps: data.relance?.corps || data.corps || "",
      niveau: (facture.nb_relances || 0) + 1,
    };
    setRelanceGeneree(rg);
    setSujetEdite(rg.sujet);
    setCorpsEdite(rg.corps);
    setLoadingRelance(false);
  }

  function fermerModal() {
    setRelanceActive(null);
    setRelanceGeneree(null);
    setLoadingRelance(false);
  }

  function marquerEnvoyee() {
    const nom = relanceActive?.clients?.nom || "le client";
    fermerModal();
    setToast(`Relance envoyée à ${nom}`);
    setTimeout(() => setToast(null), 3000);
  }

  const niveauIdx = relanceActive ? Math.min(relanceActive.nb_relances || 0, 2) : 0;
  const niveauLabel = NIVEAU_LABELS[niveauIdx];

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
  };

  return (
    <div style={{ padding: "40px", background: "var(--ivory)", minHeight: "100%" }}>
      {toast && (
        <div style={{ position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 50, background: "var(--accent)", color: "var(--ivory)", padding: "12px 24px", borderRadius: "999px", fontSize: "13px", fontFamily: "Geist, sans-serif", fontWeight: 500, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
          {toast}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "40px" }}>
        <div>
          <p style={{ fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", marginBottom: "8px" }}>
            FACTURES
          </p>
          <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "36px", fontWeight: 400, color: "var(--ink)", lineHeight: 1.1 }}>
            Vos <span style={{ fontStyle: "italic" }}>factures.</span>
          </h1>
        </div>
        <Link
          href="/factures/nouvelle"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "var(--ink)",
            color: "var(--ivory)",
            borderRadius: "999px",
            padding: "10px 20px",
            fontSize: "13px",
            fontFamily: "Geist, sans-serif",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          Nouvelle facture →
        </Link>
      </div>

      {(!factures || factures.length === 0) ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <h2 style={{ fontFamily: "Instrument Serif, serif", fontSize: "24px", fontWeight: 400, color: "var(--ink-3)", marginBottom: "16px" }}>
            Aucune <span style={{ fontStyle: "italic" }}>facture</span> pour l&apos;instant
          </h2>
          <p style={{ fontSize: "13px", color: "var(--ink-3)", fontFamily: "Geist, sans-serif", marginBottom: "24px" }}>
            Inès génère votre première facture conforme en quelques secondes.
          </p>
          <Link
            href="/factures/nouvelle"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "var(--ink)",
              color: "var(--ivory)",
              borderRadius: "999px",
              padding: "10px 20px",
              fontSize: "13px",
              fontFamily: "Geist, sans-serif",
              textDecoration: "none",
            }}
          >
            Créer ma première facture →
          </Link>
        </div>
      ) : (
        <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--ivory-2)", borderBottom: "1px solid var(--line)" }}>
                {["Numéro", "Client", "Montant TTC", "Échéance", "Statut", "Action"].map((h, i) => (
                  <th
                    key={h}
                    style={{
                      textAlign: i === 2 ? "right" : "left",
                      padding: "12px 24px",
                      fontSize: "10.5px",
                      fontFamily: "Geist, sans-serif",
                      textTransform: "uppercase",
                      letterSpacing: "0.16em",
                      color: "var(--ink-3)",
                      fontWeight: 500,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {factures.map((f, i) => {
                const statut = STATUTS[f.statut] || STATUTS.brouillon;
                const peutRelancer = f.statut === "envoyee" || f.statut === "en_retard";
                return (
                  <tr
                    key={f.id}
                    style={{ borderBottom: i < factures.length - 1 ? "1px solid var(--line)" : "none" }}
                    className="hover:[background:var(--ivory-2)] transition-colors"
                  >
                    <td style={{ padding: "16px 24px", fontSize: "12px", fontFamily: "Geist Mono, monospace", color: "var(--ink)" }}>
                      {f.numero}
                    </td>
                    <td style={{ padding: "16px 24px", fontSize: "14px", fontFamily: "Instrument Serif, serif", color: "var(--ink)" }}>
                      {(f.clients as { nom?: string } | null)?.nom || "—"}
                    </td>
                    <td style={{ padding: "16px 24px", fontSize: "12px", fontFamily: "Geist Mono, monospace", color: "var(--ink)", textAlign: "right", fontWeight: 600 }}>
                      {formatEuros(f.total_ttc)}
                    </td>
                    <td style={{ padding: "16px 24px", fontSize: "12px", fontFamily: "Geist Mono, monospace", color: "var(--ink-3)" }}>
                      {f.date_echeance ? formatDate(f.date_echeance) : "—"}
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <span style={{
                        display: "inline-block",
                        background: statut.background,
                        color: statut.color,
                        borderRadius: "999px",
                        padding: "3px 10px",
                        fontSize: "10.5px",
                        fontFamily: "Geist, sans-serif",
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        fontWeight: 500,
                      }}>
                        {statut.label}
                      </span>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      {peutRelancer ? (
                        <button
                          onClick={() => lancerRelance(f)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            background: "#fef3c7",
                            color: "#92400e",
                            border: "none",
                            borderRadius: "999px",
                            padding: "4px 12px",
                            fontSize: "11px",
                            fontFamily: "Geist, sans-serif",
                            fontWeight: 500,
                            cursor: "pointer",
                          }}
                        >
                          <Bell className="w-3 h-3" />
                          Relancer
                        </button>
                      ) : (
                        <span style={{ color: "var(--line)", fontSize: "12px" }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {relanceActive && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ background: "white", borderRadius: "16px", maxWidth: "640px", width: "100%", padding: "32px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
              <div>
                <p style={{ fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", marginBottom: "6px" }}>
                  RELANCE
                </p>
                <h2 style={{ fontFamily: "Instrument Serif, serif", fontSize: "22px", fontWeight: 400, color: "var(--ink)", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" as const }}>
                  Facture {relanceActive.numero}
                  <span style={{
                    background: niveauLabel.background,
                    color: niveauLabel.color,
                    borderRadius: "999px",
                    padding: "3px 10px",
                    fontSize: "10.5px",
                    fontFamily: "Geist, sans-serif",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    fontWeight: 500,
                  }}>
                    Niveau {niveauIdx + 1} — {niveauLabel.label}
                  </span>
                </h2>
              </div>
              <button
                onClick={fermerModal}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", padding: "4px" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingRelance ? (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "40px 0", justifyContent: "center", color: "var(--ink-3)", fontSize: "13px", fontFamily: "Geist, sans-serif" }}>
                <Loader2 className="w-5 h-5 animate-spin" />
                Inès rédige la relance...
              </div>
            ) : relanceGeneree ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase" as const, letterSpacing: "0.16em", color: "var(--ink-3)", marginBottom: "6px", fontWeight: 500 }}>Sujet</label>
                  <input
                    type="text"
                    value={sujetEdite}
                    onChange={(e) => setSujetEdite(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase" as const, letterSpacing: "0.16em", color: "var(--ink-3)", marginBottom: "6px", fontWeight: 500 }}>Corps de l&apos;email</label>
                  <textarea
                    value={corpsEdite}
                    onChange={(e) => setCorpsEdite(e.target.value)}
                    style={{ ...inputStyle, minHeight: "200px", resize: "vertical" }}
                  />
                </div>
              </div>
            ) : null}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
              <button
                onClick={fermerModal}
                style={{ padding: "10px 20px", fontSize: "13px", fontFamily: "Geist, sans-serif", color: "var(--ink-2)", background: "var(--ivory-2)", border: "none", borderRadius: "999px", cursor: "pointer", fontWeight: 500 }}
              >
                Annuler
              </button>
              <button
                onClick={marquerEnvoyee}
                disabled={loadingRelance || !relanceGeneree}
                style={{
                  padding: "10px 20px",
                  fontSize: "13px",
                  fontFamily: "Geist, sans-serif",
                  color: "var(--ivory)",
                  background: loadingRelance || !relanceGeneree ? "var(--ink-3)" : "var(--accent)",
                  border: "none",
                  borderRadius: "999px",
                  cursor: loadingRelance || !relanceGeneree ? "not-allowed" : "pointer",
                  fontWeight: 500,
                }}
              >
                Marquer comme envoyée
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
