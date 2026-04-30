export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DevisListe } from "./devis-liste";

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
          <p style={{ fontSize: "10.5px", fontFamily: "Geist Mono, monospace", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", marginBottom: "8px" }}>
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
        <DevisListe devis={devis} />
      )}
    </div>
  );
}
