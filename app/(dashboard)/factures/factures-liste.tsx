"use client";
import { useRouter } from "next/navigation";
import { formatEuros, formatDate } from "@/lib/utils";

const BADGE: Record<string, React.CSSProperties> = {
  brouillon: { background: "#E2E8F0", color: "#475569", border: "1px solid #CBD5E1" },
  envoyee:   { background: "#DBEAFE", color: "#1D4ED8", border: "1px solid #93C5FD" },
  payee:     { background: "#DCFCE7", color: "#15803D", border: "1px solid #86EFAC" },
  en_retard: { background: "#7F1D1D", color: "#FEF2F2", border: "1px solid #991B1B" },
  annulee:   { background: "#F3F4F6", color: "#6B7280", border: "1px solid #D1D5DB" },
};

const LABELS: Record<string, string> = {
  brouillon: "Brouillon", envoyee: "Envoyée", payee: "Payée", en_retard: "En retard", annulee: "Annulée",
};

interface Facture {
  id: string;
  numero: string;
  statut: string;
  total_ttc: number;
  date_echeance: string | null;
  clients: { nom?: string } | null;
}

export function FacturesListe({ factures, total = 0 }: { factures: Facture[]; total?: number }) {
  const router = useRouter();

  return (
    <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.5fr 1fr 0.8fr 0.8fr", padding: "12px 24px", background: "var(--ivory-2)", borderBottom: "1px solid var(--line)" }}>
        {["NUMÉRO", "CLIENT", "ÉCHÉANCE", "STATUT", "MONTANT TTC"].map(h => (
          <span key={h} style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace" }}>{h}</span>
        ))}
      </div>
      {factures.map((f, i) => (
        <div
          key={f.id}
          onClick={() => router.push(`/factures/${f.id}`)}
          style={{ display: "grid", gridTemplateColumns: "1.2fr 1.5fr 1fr 0.8fr 0.8fr", padding: "14px 24px", alignItems: "center", borderBottom: i < factures.length - 1 ? "1px solid var(--line)" : "none", cursor: "pointer", transition: "background 0.1s" }}
          onMouseOver={(e) => (e.currentTarget.style.background = "var(--ivory-2)")}
          onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <p style={{ fontSize: "13px", fontFamily: "Geist Mono, monospace", color: "var(--ink)", fontWeight: 500 }}>{f.numero}</p>
          <p style={{ fontSize: "14px", fontFamily: "Instrument Serif, serif", color: "var(--ink)" }}>{f.clients?.nom || "—"}</p>
          <p style={{ fontSize: "12px", fontFamily: "Geist Mono, monospace", color: "var(--ink-3)" }}>{f.date_echeance ? formatDate(f.date_echeance) : "—"}</p>
          <span style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.12em", padding: "3px 10px", borderRadius: "999px", fontFamily: "Geist Mono, monospace", whiteSpace: "nowrap", ...(BADGE[f.statut] || BADGE.brouillon) }}>{LABELS[f.statut] || f.statut}</span>
          <p style={{ fontSize: "13px", fontFamily: "Geist Mono, monospace", color: "var(--ink)", fontWeight: 500, textAlign: "right" }}>{formatEuros(f.total_ttc)}</p>
        </div>
      ))}
      {total > 50 && (
        <div style={{ padding: "14px 24px", borderTop: "1px solid var(--line)", background: "var(--ivory-2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: "12px", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace" }}>
            50 plus récents affichés sur {total} factures au total
          </p>
          <p style={{ fontSize: "11px", color: "var(--ink-3)" }}>
            Bientôt : recherche et filtres
          </p>
        </div>
      )}
    </div>
  );
}
