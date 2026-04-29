export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div style={{ padding: "40px", background: "var(--ivory)", minHeight: "100%" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "40px" }}>
        <div>
          <p style={{ fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", marginBottom: "8px" }}>
            CLIENTS
          </p>
          <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "36px", fontWeight: 400, color: "var(--ink)", lineHeight: 1.1 }}>
            Vos <span style={{ fontStyle: "italic" }}>clients.</span>
          </h1>
        </div>
        <Link
          href="/clients/nouveau"
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
          Nouveau client →
        </Link>
      </div>

      {(!clients || clients.length === 0) ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <h2 style={{ fontFamily: "Instrument Serif, serif", fontSize: "24px", fontWeight: 400, color: "var(--ink-3)", marginBottom: "16px" }}>
            Aucun <span style={{ fontStyle: "italic" }}>client</span> pour l&apos;instant
          </h2>
          <p style={{ fontSize: "13px", color: "var(--ink-3)", fontFamily: "Geist, sans-serif", marginBottom: "24px" }}>
            Les clients sont créés automatiquement lors de la génération de devis ou factures.
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
            Créer un premier devis →
          </Link>
        </div>
      ) : (
        <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--ivory-2)", borderBottom: "1px solid var(--line)" }}>
                <th style={{ textAlign: "left", padding: "12px 24px", fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontWeight: 500 }}>Nom</th>
                <th style={{ textAlign: "left", padding: "12px 24px", fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontWeight: 500 }}>Email</th>
                <th style={{ textAlign: "left", padding: "12px 24px", fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontWeight: 500 }}>Téléphone</th>
                <th style={{ textAlign: "left", padding: "12px 24px", fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontWeight: 500 }}>Ville</th>
                <th style={{ textAlign: "left", padding: "12px 24px", fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontWeight: 500 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c: any, i: number) => (
                <tr
                  key={c.id}
                  style={{ borderBottom: i < clients.length - 1 ? "1px solid var(--line)" : "none" }}
                  className="hover:[background:var(--ivory-2)] transition-colors"
                >
                  <td style={{ padding: "16px 24px", fontSize: "14px", fontFamily: "Instrument Serif, serif", color: "var(--ink)" }}>
                    {c.nom}
                  </td>
                  <td style={{ padding: "16px 24px", fontSize: "12px", fontFamily: "Geist Mono, monospace", color: "var(--ink-3)" }}>
                    {c.email || "—"}
                  </td>
                  <td style={{ padding: "16px 24px", fontSize: "12px", fontFamily: "Geist Mono, monospace", color: "var(--ink-3)" }}>
                    {c.telephone || "—"}
                  </td>
                  <td style={{ padding: "16px 24px", fontSize: "13px", fontFamily: "Geist, sans-serif", color: "var(--ink-2)" }}>
                    {c.ville || "—"}
                  </td>
                  <td style={{ padding: "16px 24px", fontSize: "12px", fontFamily: "Geist Mono, monospace", color: "var(--ink-3)" }}>
                    {formatDate(c.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
