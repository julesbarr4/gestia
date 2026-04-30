export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatEuros } from "@/lib/utils";
import { StatusChanger } from "@/app/(dashboard)/components/status-changer";
import { FactureActions } from "./facture-actions";

export default async function FactureDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: facture } = await supabase
    .from("factures")
    .select("*, clients(nom, email, telephone, adresse, code_postal, ville, siret)")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single();

  if (!facture) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("nom_entreprise, adresse, code_postal, ville, siret, telephone, email")
    .eq("id", user!.id)
    .single();

  const lignes = (facture.lignes as Array<{
    description: string;
    quantite: number;
    prixUnitaireHT: number;
    totalHT: number;
  }>) || [];

  const client = facture.clients as {
    nom?: string; email?: string; telephone?: string;
    adresse?: string; code_postal?: string; ville?: string; siret?: string;
  } | null;

  const eyebrow: React.CSSProperties = {
    fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.16em",
    color: "var(--ink-3)", fontFamily: "Geist Mono, monospace",
  };
  const bloc: React.CSSProperties = {
    background: "white", border: "1px solid var(--line)",
    borderRadius: "16px", padding: "24px", marginBottom: "16px",
  };

  const echeanceDepassee = facture.date_echeance && new Date(facture.date_echeance) < new Date() && facture.statut !== "payee";

  return (
    <div style={{ maxWidth: "800px" }}>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <Link href="/factures" style={{ fontSize: "12px", color: "var(--ink-3)", textDecoration: "none", display: "block", marginBottom: "8px" }}>← Retour aux factures</Link>
          <p style={eyebrow}>FACTURE</p>
          <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "clamp(26px, 3vw, 36px)", color: "var(--ink)", lineHeight: 1.06, marginTop: "6px" }}>
            {facture.numero} — <em>{client?.nom || facture.titre}</em>
          </h1>
          <p style={{ fontSize: "12px", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace", marginTop: "6px" }}>
            Émise le {new Date(facture.date_emission).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          {facture.date_echeance && (
            <p style={{ fontSize: "12px", color: echeanceDepassee ? "#DC2626" : "var(--ink-3)", fontFamily: "Geist Mono, monospace" }}>
              Échéance : {new Date(facture.date_echeance).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              {facture.nb_relances > 0 && ` · ${facture.nb_relances} relance(s) envoyée(s)`}
            </p>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <StatusChanger type="facture" id={facture.id} statutActuel={facture.statut} />
          <FactureActions id={facture.id} />
        </div>
      </div>

      <div style={{ ...bloc, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <div>
          <p style={{ ...eyebrow, marginBottom: "10px" }}>ÉMETTEUR</p>
          <p style={{ fontFamily: "Instrument Serif, serif", fontSize: "16px", color: "var(--ink)", marginBottom: "4px" }}>{profile?.nom_entreprise || "Votre entreprise"}</p>
          {profile?.adresse && <p style={{ fontSize: "13px", color: "var(--ink-2)" }}>{profile.adresse}</p>}
          {(profile?.code_postal || profile?.ville) && <p style={{ fontSize: "13px", color: "var(--ink-2)" }}>{profile.code_postal} {profile.ville}</p>}
          {profile?.siret && <p style={{ fontSize: "11px", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace", marginTop: "4px" }}>SIRET {profile.siret}</p>}
          {profile?.email && <p style={{ fontSize: "11px", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace" }}>{profile.email}</p>}
        </div>
        <div>
          <p style={{ ...eyebrow, marginBottom: "10px" }}>CLIENT</p>
          {client ? (
            <>
              <p style={{ fontFamily: "Instrument Serif, serif", fontSize: "16px", color: "var(--ink)", marginBottom: "4px" }}>{client.nom}</p>
              {client.adresse && <p style={{ fontSize: "13px", color: "var(--ink-2)" }}>{client.adresse}</p>}
              {(client.code_postal || client.ville) && <p style={{ fontSize: "13px", color: "var(--ink-2)" }}>{client.code_postal} {client.ville}</p>}
              {client.siret && <p style={{ fontSize: "11px", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace", marginTop: "4px" }}>SIRET {client.siret}</p>}
              {client.email && <p style={{ fontSize: "11px", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace" }}>{client.email}</p>}
            </>
          ) : (
            <p style={{ fontSize: "14px", color: "var(--ink-2)" }}>{facture.titre?.replace("Facture ", "") || "—"}</p>
          )}
        </div>
      </div>

      <div style={bloc}>
        <p style={{ ...eyebrow, marginBottom: "16px" }}>DÉTAIL DES PRESTATIONS</p>
        <div style={{ display: "grid", gridTemplateColumns: "3fr 60px 110px 110px", gap: "6px", marginBottom: "8px" }}>
          {["DESCRIPTION", "QTÉ", "PRIX HT", "TOTAL HT"].map(h => (
            <span key={h} style={{ ...eyebrow }}>{h}</span>
          ))}
        </div>
        {lignes.map((ligne, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "3fr 60px 110px 110px", gap: "6px", padding: "10px 0", borderBottom: i < lignes.length - 1 ? "1px solid var(--line)" : "none", alignItems: "center" }}>
            <p style={{ fontSize: "14px", color: "var(--ink)" }}>{ligne.description}</p>
            <p style={{ fontSize: "13px", color: "var(--ink-2)", fontFamily: "Geist Mono, monospace", textAlign: "center" }}>{ligne.quantite}</p>
            <p style={{ fontSize: "13px", color: "var(--ink-2)", fontFamily: "Geist Mono, monospace", textAlign: "right" }}>{formatEuros(ligne.prixUnitaireHT)}</p>
            <p style={{ fontSize: "13px", fontFamily: "Geist Mono, monospace", color: "var(--ink)", fontWeight: 500, textAlign: "right" }}>{formatEuros(ligne.totalHT)}</p>
          </div>
        ))}

        <div style={{ marginTop: "16px", padding: "16px", background: "var(--ivory-2)", borderRadius: "12px" }}>
          {[
            { label: "Total HT", val: formatEuros(facture.total_ht) },
            { label: `TVA ${facture.taux_tva}%`, val: formatEuros(facture.total_tva) },
          ].map(r => (
            <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: "13px" }}>
              <span style={{ color: "var(--ink-2)" }}>{r.label}</span>
              <span style={{ fontFamily: "Geist Mono, monospace", color: "var(--ink)" }}>{r.val}</span>
            </div>
          ))}
          <div style={{ height: "1px", background: "var(--line)", margin: "10px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--ink)" }}>Total TTC</span>
            <span style={{ fontFamily: "Instrument Serif, serif", fontSize: "24px", color: "var(--ink)" }}>{formatEuros(facture.total_ttc)}</span>
          </div>
        </div>
      </div>

      {facture.notes && (
        <div style={bloc}>
          <p style={{ ...eyebrow, marginBottom: "8px" }}>NOTES</p>
          <p style={{ fontSize: "13.5px", color: "var(--ink-2)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{facture.notes}</p>
        </div>
      )}

      {facture.genere_par_ia && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 0" }}>
          <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "Instrument Serif, serif", fontStyle: "italic", fontSize: "11px" }}>I</div>
          <p style={{ fontSize: "11.5px", color: "var(--ink-3)", fontStyle: "italic" }}>Générée par Inès, votre assistante administrative Gestia</p>
        </div>
      )}
    </div>
  );
}
