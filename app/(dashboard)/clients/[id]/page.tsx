export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatEuros } from "@/lib/utils";
import { StatusBadge } from "@/app/(dashboard)/ui";
import { ClientActions } from "./client-actions";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single();

  if (!client) notFound();

  const [
    { data: devis },
    { data: factures },
    { data: emails },
  ] = await Promise.all([
    supabase
      .from("devis")
      .select("id, numero, statut, total_ttc, date_emission, titre")
      .eq("client_id", id)
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("factures")
      .select("id, numero, statut, total_ttc, date_emission, date_echeance, nb_relances")
      .eq("client_id", id)
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("emails_entrants")
      .select("id, de, sujet, statut, created_at, reponse_ia")
      .eq("client_id", id)
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const caTotal = (factures || [])
    .filter(f => f.statut === "payee")
    .reduce((s, f) => s + f.total_ttc, 0);
  const caEnAttente = (factures || [])
    .filter(f => ["envoyee", "en_retard"].includes(f.statut))
    .reduce((s, f) => s + f.total_ttc, 0);
  const nbDevisAcceptes = (devis || []).filter(d => d.statut === "accepte").length;
  const tauxAcceptation = devis?.length
    ? Math.round((nbDevisAcceptes / devis.length) * 100)
    : 0;

  const ey: React.CSSProperties = {
    fontSize: "10px", textTransform: "uppercase",
    letterSpacing: "0.16em", color: "var(--ink-3)",
    fontFamily: "Geist Mono, monospace",
  };
  const bl: React.CSSProperties = {
    background: "white", border: "1px solid var(--line)",
    borderRadius: "16px", padding: "24px", marginBottom: "16px",
  };

  return (
    <div style={{ maxWidth: "900px" }}>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px", gap: "16px" }}>
        <div>
          <Link href="/clients" style={{ fontSize: "12px", color: "var(--ink-3)", textDecoration: "none", display: "block", marginBottom: "8px" }}>
            ← Retour aux clients
          </Link>
          <p style={ey}>CLIENT</p>
          <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "clamp(26px, 3vw, 36px)", color: "var(--ink)", lineHeight: 1.06, marginTop: "6px" }}>
            <em>{client.nom}</em>
          </h1>
          <p style={{ fontSize: "12px", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace", marginTop: "6px" }}>
            Client depuis le {new Date(client.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", flexShrink: 0, flexWrap: "wrap" as const, justifyContent: "flex-end" }}>
          <Link
            href={`/devis/nouveau`}
            style={{ fontSize: "12px", color: "var(--ivory)", background: "var(--ink)", border: "none", borderRadius: "999px", padding: "6px 14px", textDecoration: "none", fontWeight: 500 }}
          >
            + Nouveau devis
          </Link>
          <ClientActions clientId={client.id} clientNom={client.nom} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
        {[
          { label: "CA encaissé", valeur: formatEuros(caTotal), mono: true },
          { label: "En attente", valeur: formatEuros(caEnAttente), mono: true, warning: caEnAttente > 0 },
          { label: "Devis", valeur: `${devis?.length || 0} (${tauxAcceptation}% accept.)`, mono: false },
          { label: "Factures", valeur: String(factures?.length || 0), mono: false },
        ].map((s) => (
          <div key={s.label} style={{ background: "white", border: "1px solid var(--line)", borderRadius: "14px", padding: "16px" }}>
            <p style={ey}>{s.label}</p>
            <p style={{
              fontSize: s.mono ? "18px" : "16px",
              fontFamily: s.mono ? "Geist Mono, monospace" : "Instrument Serif, serif",
              color: s.warning ? "#92400E" : "var(--ink)",
              marginTop: "6px",
              fontWeight: s.mono ? 400 : 400,
            }}>{s.valeur}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "16px" }}>

        <div>

          <div style={bl}>
            <p style={{ ...ey, marginBottom: "14px" }}>INFORMATIONS</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { label: "Email", valeur: client.email },
                { label: "Téléphone", valeur: client.telephone },
                { label: "Adresse", valeur: [client.adresse, client.code_postal, client.ville].filter(Boolean).join(", ") },
                { label: "SIRET", valeur: client.siret },
                { label: "Notes", valeur: client.notes },
              ].filter(r => r.valeur).map((r) => (
                <div key={r.label}>
                  <p style={{ fontSize: "9.5px", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace", marginBottom: "2px" }}>{r.label}</p>
                  <p style={{ fontSize: "13.5px", color: "var(--ink-2)", wordBreak: "break-word" as const }}>{r.valeur}</p>
                </div>
              ))}
              {!client.email && !client.telephone && !client.siret && (
                <p style={{ fontSize: "13px", color: "var(--ink-3)", fontStyle: "italic" }}>
                  Aucune information renseignée.{" "}
                  <a href={`/clients`} style={{ color: "var(--ink)", textDecoration: "underline" }}>Modifier</a>
                </p>
              )}
            </div>
          </div>

          {(emails?.length || 0) > 0 && (
            <div style={bl}>
              <p style={{ ...ey, marginBottom: "14px" }}>EMAILS ({emails?.length})</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {emails?.map((email) => (
                  <div key={email.id} style={{ padding: "10px 12px", background: "var(--ivory-2)", borderRadius: "10px", border: "1px solid var(--line)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                      <p style={{ fontSize: "12.5px", color: "var(--ink)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const, maxWidth: "180px" }}>
                        {email.sujet || "(sans sujet)"}
                      </p>
                      <span style={{
                        fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.1em",
                        padding: "2px 7px", borderRadius: "999px", flexShrink: 0,
                        background: email.statut === "traite" ? "color-mix(in oklch, var(--accent) 12%, transparent)" : "var(--ivory-2)",
                        color: email.statut === "traite" ? "var(--accent)" : "var(--ink-3)",
                        fontFamily: "Geist Mono, monospace",
                      }}>
                        {email.statut === "traite" ? "Traité" : "En attente"}
                      </span>
                    </div>
                    <p style={{ fontSize: "11px", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace" }}>
                      {new Date(email.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>

          <div style={bl}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <p style={ey}>DEVIS ({devis?.length || 0})</p>
              <Link href="/devis/nouveau" style={{ fontSize: "11px", color: "var(--ink-3)", textDecoration: "none" }}>
                Nouveau →
              </Link>
            </div>
            {(devis?.length || 0) === 0 ? (
              <p style={{ fontSize: "13px", color: "var(--ink-3)", fontStyle: "italic" }}>Aucun devis pour ce client.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {devis?.map((d) => (
                  <Link key={d.id} href={`/devis/${d.id}`} style={{ textDecoration: "none" }}>
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 12px", borderRadius: "10px", border: "1px solid var(--line)",
                      background: "white", transition: "background 0.1s",
                    }}
                      onMouseOver={(e) => (e.currentTarget.style.background = "var(--ivory-2)")}
                      onMouseOut={(e) => (e.currentTarget.style.background = "white")}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "12.5px", fontFamily: "Geist Mono, monospace", color: "var(--ink)", fontWeight: 500 }}>{d.numero}</p>
                        <p style={{ fontSize: "11px", color: "var(--ink-3)", marginTop: "1px" }}>
                          {new Date(d.date_emission).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                        <StatusBadge statut={d.statut} />
                        <p style={{ fontSize: "12.5px", fontFamily: "Geist Mono, monospace", color: "var(--ink)", fontWeight: 500 }}>
                          {formatEuros(d.total_ttc)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div style={bl}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <p style={ey}>FACTURES ({factures?.length || 0})</p>
              <Link href="/factures/nouvelle" style={{ fontSize: "11px", color: "var(--ink-3)", textDecoration: "none" }}>
                Nouvelle →
              </Link>
            </div>
            {(factures?.length || 0) === 0 ? (
              <p style={{ fontSize: "13px", color: "var(--ink-3)", fontStyle: "italic" }}>Aucune facture pour ce client.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {factures?.map((f) => {
                  const retard = f.date_echeance && new Date(f.date_echeance) < new Date() && f.statut !== "payee";
                  return (
                    <Link key={f.id} href={`/factures/${f.id}`} style={{ textDecoration: "none" }}>
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "10px 12px", borderRadius: "10px",
                        border: retard ? "1px solid #FECACA" : "1px solid var(--line)",
                        background: "white", transition: "background 0.1s",
                      }}
                        onMouseOver={(e) => (e.currentTarget.style.background = "var(--ivory-2)")}
                        onMouseOut={(e) => (e.currentTarget.style.background = "white")}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: "12.5px", fontFamily: "Geist Mono, monospace", color: "var(--ink)", fontWeight: 500 }}>{f.numero}</p>
                          <p style={{ fontSize: "11px", color: retard ? "#DC2626" : "var(--ink-3)", marginTop: "1px", fontFamily: "Geist Mono, monospace" }}>
                            {f.date_echeance
                              ? `Échéance ${new Date(f.date_echeance).toLocaleDateString("fr-FR")}`
                              : new Date(f.date_emission).toLocaleDateString("fr-FR")
                            }
                            {f.nb_relances > 0 && ` · ${f.nb_relances} relance${f.nb_relances > 1 ? "s" : ""}`}
                          </p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
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
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
