"use client";
import { useRouter } from "next/navigation";
import { formatEuros, formatDate } from "@/lib/utils";
import { StatusBadge } from "../ui";

interface Facture {
  id: string;
  numero: string;
  statut: string;
  total_ttc: number;
  date_echeance: string | null;
  clients: { nom?: string } | null;
}

export function FacturesListe({ factures }: { factures: Facture[] }) {
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
          <StatusBadge statut={f.statut} />
          <p style={{ fontSize: "13px", fontFamily: "Geist Mono, monospace", color: "var(--ink)", fontWeight: 500, textAlign: "right" }}>{formatEuros(f.total_ttc)}</p>
        </div>
      ))}
    </div>
  );
}
