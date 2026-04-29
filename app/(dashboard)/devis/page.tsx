export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatEuros, formatDate } from "@/lib/utils";
import Link from "next/link";

type StatutStyle = { label: string; background: string; color: string };

const STATUTS: Record<string, StatutStyle> = {
  brouillon: { label: "Brouillon", background: "var(--line)", color: "var(--ink-3)" },
  envoye: { label: "Envoyé", background: "var(--ivory-2)", color: "var(--ink-2)" },
  accepte: { label: "Accepté", background: "color-mix(in oklch, var(--accent) 14%, transparent)", color: "var(--accent)" },
  refuse: { label: "Refusé", background: "var(--line)", color: "var(--ink-3)" },
  expire: { label: "Expiré", background: "var(--line)", color: "var(--ink-3)" },
};

export default async function DevisPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: devis } = await supabase
    .from("devis")
    .select("*, clients(nom)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div style={{ padding: "40px", background: "var(--ivory)", minHeight: "100%" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "40px" }}>
        <div>
          <p style={{ fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", marginBottom: "8px" }}>
            DEVIS
          </p>
          <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "36px", fontWeight: 400, color: "var(--ink)", lineHeight: 1.1 }}>
            Vos <span style={{ fontStyle: "italic" }}>devis.</span>
          </h1>
        </div>
        <Link
          href="/devis/nouveau"
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
          Nouveau devis →
        </Link>
      </div>

      {(!devis || devis.length === 0) ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <h2 style={{ fontFamily: "Instrument Serif, serif", fontSize: "24px", fontWeight: 400, color: "var(--ink-3)", marginBottom: "16px" }}>
            Aucun <span style={{ fontStyle: "italic" }}>devis</span> pour l&apos;instant
          </h2>
          <p style={{ fontSize: "13px", color: "var(--ink-3)", fontFamily: "Geist, sans-serif", marginBottom: "24px" }}>
            Inès génère votre premier devis professionnel en 30 secondes.
          </p>
          <Link
            href="/devis/nouveau"
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
            Créer mon premier devis →
          </Link>
        </div>
      ) : (
        <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--ivory-2)", borderBottom: "1px solid var(--line)" }}>
                <th style={{ textAlign: "left", padding: "12px 24px", fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontWeight: 500 }}>Numéro</th>
                <th style={{ textAlign: "left", padding: "12px 24px", fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontWeight: 500 }}>Client</th>
                <th style={{ textAlign: "right", padding: "12px 24px", fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontWeight: 500 }}>Montant TTC</th>
                <th style={{ textAlign: "left", padding: "12px 24px", fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontWeight: 500 }}>Statut</th>
                <th style={{ textAlign: "left", padding: "12px 24px", fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontWeight: 500 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {devis.map((d: any, i: number) => {
                const statut = STATUTS[d.statut] || STATUTS.brouillon;
                return (
                  <tr
                    key={d.id}
                    style={{ borderBottom: i < devis.length - 1 ? "1px solid var(--line)" : "none" }}
                    className="hover:[background:var(--ivory-2)] transition-colors"
                  >
                    <td style={{ padding: "16px 24px", fontSize: "12px", fontFamily: "Geist Mono, monospace", color: "var(--ink)" }}>
                      {d.numero}
                    </td>
                    <td style={{ padding: "16px 24px", fontSize: "14px", fontFamily: "Instrument Serif, serif", color: "var(--ink)" }}>
                      {(d.clients as { nom?: string } | null)?.nom || "—"}
                    </td>
                    <td style={{ padding: "16px 24px", fontSize: "12px", fontFamily: "Geist Mono, monospace", color: "var(--ink)", textAlign: "right", fontWeight: 600 }}>
                      {formatEuros(d.total_ttc)}
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
                    <td style={{ padding: "16px 24px", fontSize: "12px", fontFamily: "Geist Mono, monospace", color: "var(--ink-3)" }}>
                      {formatDate(d.date_emission)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
