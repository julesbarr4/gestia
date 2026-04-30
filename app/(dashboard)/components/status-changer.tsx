"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  type: "devis" | "facture";
  id: string;
  statutActuel: string;
}

const STATUTS_DEVIS = [
  { value: "brouillon", label: "Brouillon" },
  { value: "envoye", label: "Envoyé" },
  { value: "accepte", label: "Accepté" },
  { value: "refuse", label: "Refusé" },
  { value: "expire", label: "Expiré" },
];

const STATUTS_FACTURE = [
  { value: "brouillon", label: "Brouillon" },
  { value: "envoyee", label: "Envoyée" },
  { value: "payee", label: "Payée" },
  { value: "en_retard", label: "En retard" },
  { value: "annulee", label: "Annulée" },
];

const BADGE: Record<string, React.CSSProperties> = {
  brouillon: { background: "#E2E8F0", color: "#475569", border: "1px solid #CBD5E1" },
  envoye:    { background: "#DBEAFE", color: "#1D4ED8", border: "1px solid #93C5FD" },
  envoyee:   { background: "#DBEAFE", color: "#1D4ED8", border: "1px solid #93C5FD" },
  accepte:   { background: "#DCFCE7", color: "#15803D", border: "1px solid #86EFAC" },
  payee:     { background: "#DCFCE7", color: "#15803D", border: "1px solid #86EFAC" },
  refuse:    { background: "#FEE2E2", color: "#B91C1C", border: "1px solid #FCA5A5" },
  annulee:   { background: "#F3F4F6", color: "#6B7280", border: "1px solid #D1D5DB" },
  en_retard: { background: "#7F1D1D", color: "#FEF2F2", border: "1px solid #991B1B" },
  expire:    { background: "#FEF3C7", color: "#92400E", border: "1px solid #FCD34D" },
};

export function StatusChanger({ type, id, statutActuel }: Props) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const statuts = type === "devis" ? STATUTS_DEVIS : STATUTS_FACTURE;

  async function changerStatut(nouveauStatut: string) {
    setLoading(true);
    setOpen(false);
    const endpoint = type === "devis" ? `/api/devis/${id}` : `/api/factures/${id}`;
    await fetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut: nouveauStatut }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        style={{
          fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.12em",
          padding: "5px 12px", borderRadius: "999px", border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "Geist Mono, monospace",
          display: "flex", alignItems: "center", gap: "5px",
          ...(BADGE[statutActuel] || BADGE.brouillon),
        }}
      >
        {statuts.find(s => s.value === statutActuel)?.label || statutActuel}
        <span style={{ fontSize: "8px" }}>▾</span>
      </button>

      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setOpen(false)} />
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0,
            background: "white", border: "1px solid var(--line)",
            borderRadius: "12px", zIndex: 50, overflow: "hidden",
            boxShadow: "0 8px 24px rgba(14,14,14,0.10)", minWidth: "150px",
          }}>
            {statuts.filter(s => s.value !== statutActuel).map((s) => (
              <button
                key={s.value}
                onClick={() => changerStatut(s.value)}
                style={{
                  display: "block", width: "100%", padding: "9px 14px",
                  background: "none", border: "none", borderBottom: "1px solid var(--line)",
                  cursor: "pointer", textAlign: "left" as const, fontSize: "13px",
                  color: "var(--ink-2)",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "var(--ivory-2)")}
                onMouseOut={(e) => (e.currentTarget.style.background = "none")}
              >
                <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", marginRight: "8px", ...BADGE[s.value] }} />
                {s.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
