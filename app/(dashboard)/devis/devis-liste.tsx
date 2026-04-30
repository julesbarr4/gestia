"use client";
import { useRouter } from "next/navigation";
import { formatEuros } from "@/lib/utils";
import { StatusBadge } from "../ui";

interface Devis {
  id: string;
  numero: string;
  statut: string;
  total_ttc: number;
  date_emission: string;
  clients: { nom?: string } | null;
}

export function DevisListe({ devis }: { devis: Devis[] }) {
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
          <StatusBadge statut={d.statut} />
          <p style={{ fontSize: "13px", fontFamily: "Geist Mono, monospace", color: "var(--ink)", fontWeight: 500, textAlign: "right" }}>{formatEuros(d.total_ttc)}</p>
        </div>
      ))}
    </div>
  );
}
