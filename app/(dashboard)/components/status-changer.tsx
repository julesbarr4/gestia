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

const COLORS: Record<string, React.CSSProperties> = {
  brouillon: { background: "var(--line)", color: "var(--ink-3)" },
  envoye:    { background: "var(--ivory-2)", color: "var(--ink-2)" },
  envoyee:   { background: "var(--ivory-2)", color: "var(--ink-2)" },
  accepte:   { background: "color-mix(in oklch, var(--accent) 12%, transparent)", color: "var(--accent)" },
  payee:     { background: "color-mix(in oklch, var(--accent) 12%, transparent)", color: "var(--accent)" },
  refuse:    { background: "#FEE2E2", color: "#991B1B" },
  annulee:   { background: "#FEE2E2", color: "#991B1B" },
  en_retard: { background: "#7a1d1d", color: "var(--ivory)" },
  expire:    { background: "var(--line)", color: "var(--ink-3)" },
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
          ...(COLORS[statutActuel] || COLORS.brouillon),
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
                <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", marginRight: "8px", ...COLORS[s.value] }} />
                {s.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
