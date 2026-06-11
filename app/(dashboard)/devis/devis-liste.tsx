"use client";
import { useRouter } from "next/navigation";
import { formatEuros } from "@/lib/utils";

const BADGE: Record<string, React.CSSProperties> = {
  brouillon: { background: "#E2E8F0", color: "#475569", border: "1px solid #CBD5E1" },
  envoye:    { background: "#DBEAFE", color: "#1D4ED8", border: "1px solid #93C5FD" },
  accepte:   { background: "#DCFCE7", color: "#15803D", border: "1px solid #86EFAC" },
  refuse:    { background: "#FEE2E2", color: "#B91C1C", border: "1px solid #FCA5A5" },
  expire:    { background: "#FEF3C7", color: "#92400E", border: "1px solid #FCD34D" },
};

const LABELS: Record<string, string> = {
  brouillon: "Brouillon", envoye: "Envoyé", accepte: "Accepté", refuse: "Refusé", expire: "Expiré",
};

interface Devis {
  id: string;
  numero: string;
  statut: string;
  total_ttc: number;
  date_emission: string;
  clients: { nom?: string } | null;
}

export function DevisListe({ devis, total = 0 }: { devis: Devis[]; total?: number }) {
  const router = useRouter();

  return (
    <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.5fr 1fr 0.8fr 0.8fr", padding: "12px 24px", background: "var(--ivory-2)", borderBottom: "1px solid var(--line)" }}>
        {["NUMÉRO", "CLIENT", "DATE", "STATUT", "MONTANT TTC"].map(h => (
          <span key={h} style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace" }}>{h}</span>
        ))}
      </div>
      {devis.map((d, i) => (
        <div
          key={d.id}
          onClick={() => router.push(`/devis/${d.id}`)}
          style={{ display: "grid", gridTemplateColumns: "1.2fr 1.5fr 1fr 0.8fr 0.8fr", padding: "14px 24px", alignItems: "center", borderBottom: i < devis.length - 1 ? "1px solid var(--line)" : "none", cursor: "pointer", transition: "background 0.1s" }}
          onMouseOver={(e) => (e.currentTarget.style.background = "var(--ivory-2)")}
          onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <p style={{ fontSize: "13px", fontFamily: "Geist Mono, monospace", color: "var(--ink)", fontWeight: 500 }}>{d.numero}</p>
          <p style={{ fontSize: "14px", fontFamily: "Instrument Serif, serif", color: "var(--ink)" }}>{d.clients?.nom || "—"}</p>
          <p style={{ fontSize: "12px", fontFamily: "Geist Mono, monospace", color: "var(--ink-3)" }}>{new Date(d.date_emission).toLocaleDateString("fr-FR")}</p>
          <span style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.12em", padding: "3px 10px", borderRadius: "999px", fontFamily: "Geist Mono, monospace", whiteSpace: "nowrap", ...(BADGE[d.statut] || BADGE.brouillon) }}>{LABELS[d.statut] || d.statut}</span>
          <p style={{ fontSize: "13px", fontFamily: "Geist Mono, monospace", color: "var(--ink)", fontWeight: 500, textAlign: "right" }}>{formatEuros(d.total_ttc)}</p>
        </div>
      ))}
      {total > 50 && (
        <div style={{ padding: "14px 24px", borderTop: "1px solid var(--line)", background: "var(--ivory-2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: "12px", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace" }}>
            50 plus récents affichés sur {total} devis au total
          </p>
          <p style={{ fontSize: "11px", color: "var(--ink-3)" }}>
            Bientôt : recherche et filtres
          </p>
        </div>
      )}
    </div>
  );
}
