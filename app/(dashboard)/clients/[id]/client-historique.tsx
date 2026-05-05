"use client";
import Link from "next/link";
import { formatEuros } from "@/lib/utils";
import { StatusBadge } from "@/app/(dashboard)/ui";

interface Devis {
  id: string; numero: string; statut: string;
  total_ttc: number; date_emission: string;
}

interface Facture {
  id: string; numero: string; statut: string; total_ttc: number;
  date_emission: string; date_echeance?: string | null; nb_relances: number;
}

export function DevisHistorique({ devis }: { devis: Devis[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {devis.map((d) => (
        <Link key={d.id} href={`/devis/${d.id}`} style={{ textDecoration: "none" }}>
          <div
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: "10px", border: "1px solid var(--line)", background: "white", cursor: "pointer", transition: "background 0.1s" }}
            onMouseOver={(e) => (e.currentTarget.style.background = "var(--ivory-2)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "white")}
          >
            <div>
              <p style={{ fontSize: "12.5px", fontFamily: "Geist Mono, monospace", color: "var(--ink)", fontWeight: 500 }}>{d.numero}</p>
              <p style={{ fontSize: "11px", color: "var(--ink-3)", marginTop: "1px" }}>
                {new Date(d.date_emission).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <StatusBadge statut={d.statut} />
              <p style={{ fontSize: "12.5px", fontFamily: "Geist Mono, monospace", color: "var(--ink)", fontWeight: 500 }}>
                {formatEuros(d.total_ttc)}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function FacturesHistorique({ factures }: { factures: Facture[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {factures.map((f) => {
        const retard = f.date_echeance && new Date(f.date_echeance) < new Date() && f.statut !== "payee";
        return (
          <Link key={f.id} href={`/factures/${f.id}`} style={{ textDecoration: "none" }}>
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: "10px", border: retard ? "1px solid #FECACA" : "1px solid var(--line)", background: "white", cursor: "pointer", transition: "background 0.1s" }}
              onMouseOver={(e) => (e.currentTarget.style.background = "var(--ivory-2)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "white")}
            >
              <div>
                <p style={{ fontSize: "12.5px", fontFamily: "Geist Mono, monospace", color: "var(--ink)", fontWeight: 500 }}>{f.numero}</p>
                <p style={{ fontSize: "11px", color: retard ? "#DC2626" : "var(--ink-3)", marginTop: "1px", fontFamily: "Geist Mono, monospace" }}>
                  {f.date_echeance
                    ? `Échéance ${new Date(f.date_echeance).toLocaleDateString("fr-FR")}`
                    : new Date(f.date_emission).toLocaleDateString("fr-FR")}
                  {f.nb_relances > 0 && ` · ${f.nb_relances} relance${f.nb_relances > 1 ? "s" : ""}`}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <StatusBadge statut={f.statut} />
                <p style={{ fontSize: "12.5px", fontFamily: "Geist Mono, monospace", color: "var(--ink)", fontWeight: 500 }}>
                  {formatEuros(f.total_ttc)}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
