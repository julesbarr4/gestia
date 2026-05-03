export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FacturesListe } from "./factures-liste";

export default async function FacturesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: factures } = await supabase
    .from("factures")
    .select("*, clients(nom)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div style={{ padding: "40px", background: "var(--ivory)", minHeight: "100%" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "40px" }}>
        <div>
          <p style={{ fontSize: "10.5px", fontFamily: "Geist Mono, monospace", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", marginBottom: "8px" }}>
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
        <div style={{ textAlign: "center", padding: "80px 24px" }}>
          <p style={{ fontFamily: "Instrument Serif, serif", fontSize: "24px", color: "var(--ink)", marginBottom: "10px" }}>
            Aucune facture pour le moment.
          </p>
          <p style={{ fontSize: "14px", color: "var(--ink-3)", marginBottom: "28px", lineHeight: 1.6 }}>
            Inès est prête à générer votre première facture<br/>en moins de 30 secondes.
          </p>
          <a href="/factures/nouvelle" style={{
            background: "var(--ink)", color: "var(--ivory)", border: "none",
            borderRadius: "999px", padding: "11px 24px", fontSize: "13.5px",
            fontWeight: 500, textDecoration: "none", display: "inline-block",
          }}>
            Générer ma première facture →
          </a>
        </div>
      ) : (
        <FacturesListe factures={factures} />
      )}
    </div>
  );
}
