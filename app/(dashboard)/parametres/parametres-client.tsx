"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface Profile {
  nom_entreprise?: string | null;
  siret?: string | null;
  telephone?: string | null;
  adresse?: string | null;
  code_postal?: string | null;
  ville?: string | null;
  plan?: string | null;
  abonnement_actif?: boolean | null;
  numero_tva?: string | null;
  iban?: string | null;
  bic?: string | null;
  site_web?: string | null;
  couleur_principale?: string | null;
  mention_rge?: string | null;
  mention_assurance?: string | null;
  mention_garantie?: string | null;
  mention_tva_debits?: boolean | null;
  type_operation?: string | null;
  mention_legale_custom?: string | null;
  pied_de_page?: string | null;
}

interface Props {
  profile: Profile | null;
  email: string;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid var(--line)",
  borderRadius: "8px",
  padding: "10px 14px",
  fontSize: "14px",
  fontFamily: "Geist, sans-serif",
  color: "var(--ink)",
  background: "white",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "10.5px",
  fontFamily: "Geist, sans-serif",
  textTransform: "uppercase" as const,
  letterSpacing: "0.16em",
  color: "var(--ink-3)",
  marginBottom: "6px",
  fontWeight: 500,
};

export default function ParametresClient({ profile, email }: Props) {
  const [form, setForm] = useState({
    nom_entreprise: profile?.nom_entreprise || "",
    siret: profile?.siret || "",
    telephone: profile?.telephone || "",
    adresse: profile?.adresse || "",
    code_postal: profile?.code_postal || "",
    ville: profile?.ville || "",
    numero_tva: profile?.numero_tva || "",
    iban: profile?.iban || "",
    bic: profile?.bic || "",
    site_web: profile?.site_web || "",
    couleur_principale: profile?.couleur_principale || "#0E0E0E",
    mention_rge: profile?.mention_rge || "",
    mention_assurance: profile?.mention_assurance || "",
    mention_garantie: profile?.mention_garantie || "",
    mention_tva_debits: profile?.mention_tva_debits || false,
    type_operation: profile?.type_operation || "prestations",
    mention_legale_custom: profile?.mention_legale_custom || "",
    pied_de_page: profile?.pied_de_page || "",
  });

  const [loading, setLoading] = useState(false);
  const [succes, setSucces] = useState(false);
  const [erreur, setErreur] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSucces(false);
    setErreur("");
  }

  function handleCheck(name: string, value: boolean) {
    setForm((prev) => ({ ...prev, [name]: value }));
    setSucces(false);
  }

  function handleSelect(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
    setSucces(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSucces(false);
    setErreur("");

    const res = await fetch("/api/profil/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setErreur(data.erreur || "Une erreur est survenue");
    } else {
      setSucces(true);
      setTimeout(() => setSucces(false), 3000);
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: "40px", background: "var(--ivory)", minHeight: "100%", maxWidth: "720px" }}>
      <div style={{ marginBottom: "40px" }}>
        <p style={{ fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", marginBottom: "8px" }}>
          PARAMÈTRES
        </p>
        <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "36px", fontWeight: 400, color: "var(--ink)", lineHeight: 1.1 }}>
          Votre <span style={{ fontStyle: "italic" }}>entreprise.</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", padding: "32px" }}>
          <p style={{ fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontWeight: 500, marginBottom: "6px" }}>
            INFORMATIONS ENTREPRISE
          </p>
          <p style={{ fontSize: "12px", fontFamily: "Geist, sans-serif", color: "var(--ink-3)", marginBottom: "24px" }}>
            Ces informations apparaîtront sur vos devis et factures générés par Inès.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="nom_entreprise" style={labelStyle}>
                Nom de l&apos;entreprise <span style={{ color: "#991b1b", marginLeft: "4px" }}>*</span>
              </label>
              <input
                id="nom_entreprise"
                name="nom_entreprise"
                type="text"
                value={form.nom_entreprise}
                onChange={handleChange}
                placeholder="Ma Boulangerie SAS"
                required
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 style={{ fontFamily: "Instrument Serif, serif", fontSize: "18px", color: "var(--ink)", marginBottom: "4px" }}>
            Identité fiscale
          </h2>
          <p style={{ fontSize: "12px", color: "var(--ink-3)", marginBottom: "20px" }}>
            Ces informations apparaissent sur vos devis et factures. Obligatoires pour la conformité RFE 2026.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            {[
              { name: "numero_tva", label: "N° TVA intracommunautaire", placeholder: "FR 12 345678901" },
              { name: "siret", label: "SIRET", placeholder: "123 456 789 00012" },
              { name: "site_web", label: "Site web", placeholder: "https://mon-site.fr" },
              { name: "telephone", label: "Téléphone", placeholder: "06 12 34 56 78" },
            ].map((champ) => (
              <div key={champ.name}>
                <label style={labelStyle}>{champ.label}</label>
                <input
                  name={champ.name}
                  value={form[champ.name as keyof typeof form] as string}
                  onChange={handleChange}
                  placeholder={champ.placeholder}
                  style={inputStyle}
                />
              </div>
            ))}
            <div style={{ gridColumn: "span 2" }}>
              <label style={labelStyle}>Adresse complète</label>
              <input name="adresse" value={form.adresse} onChange={handleChange} placeholder="10 rue de la Paix" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Code postal</label>
              <input name="code_postal" value={form.code_postal} onChange={handleChange} placeholder="75001" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Ville</label>
              <input name="ville" value={form.ville} onChange={handleChange} placeholder="Paris" style={inputStyle} />
            </div>
          </div>
        </div>

        <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", padding: "24px" }}>
          <h2 style={{ fontFamily: "Instrument Serif, serif", fontSize: "18px", color: "var(--ink)", marginBottom: "4px" }}>
            Coordonnées bancaires
          </h2>
          <p style={{ fontSize: "12px", color: "var(--ink-3)", marginBottom: "20px" }}>
            Affichées sur vos factures pour faciliter le virement de vos clients.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "14px" }}>
            <div>
              <label style={labelStyle}>IBAN</label>
              <input
                name="iban"
                value={form.iban}
                onChange={handleChange}
                placeholder="FR76 1234 5678 9012 3456 7890 123"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>BIC / SWIFT</label>
              <input
                name="bic"
                value={form.bic}
                onChange={handleChange}
                placeholder="BNPAFRPP"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <h2 style={{ fontFamily: "Instrument Serif, serif", fontSize: "18px", color: "var(--ink)" }}>
              Paramètres TVA
            </h2>
            <span style={{
              fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.14em",
              background: "color-mix(in oklch, var(--accent) 12%, transparent)",
              color: "var(--accent)", padding: "2px 8px", borderRadius: "999px",
              fontFamily: "Geist Mono, monospace",
            }}>RFE 2026</span>
          </div>
          <p style={{ fontSize: "12px", color: "var(--ink-3)", marginBottom: "20px" }}>
            Nouvelles mentions obligatoires à partir du 1er septembre 2027 pour les TPE/PME.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Catégorie d&apos;opération</label>
              <select
                value={form.type_operation}
                onChange={(e) => handleSelect("type_operation", e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="prestations">Prestations de services uniquement</option>
                <option value="biens">Livraisons de biens uniquement</option>
                <option value="mixte">Prestations de services ET livraisons de biens</option>
              </select>
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.mention_tva_debits}
                onChange={(e) => handleCheck("mention_tva_debits", e.target.checked)}
                style={{ width: "16px", height: "16px", marginTop: "2px", flexShrink: 0 }}
              />
              <div>
                <p style={{ fontSize: "13.5px", color: "var(--ink)", fontWeight: 500 }}>
                  Option TVA sur les débits
                </p>
                <p style={{ fontSize: "11px", color: "var(--ink-3)", marginTop: "2px", lineHeight: 1.5 }}>
                  Si vous avez opté pour le paiement de la TVA sur les débits (et non sur les encaissements), cochez cette case. La mention apparaîtra sur vos factures.
                </p>
              </div>
            </label>
          </div>
        </div>

        <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", padding: "24px" }}>
          <h2 style={{ fontFamily: "Instrument Serif, serif", fontSize: "18px", color: "var(--ink)", marginBottom: "4px" }}>
            Mentions spécifiques
          </h2>
          <p style={{ fontSize: "12px", color: "var(--ink-3)", marginBottom: "20px" }}>
            Mentions professionnelles qui apparaissent en bas de vos documents.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={labelStyle}>Mention RGE (artisans)</label>
              <input
                name="mention_rge"
                value={form.mention_rge}
                onChange={handleChange}
                placeholder="RGE Qualibat n°XXXX — Certificat valable jusqu'au JJ/MM/AAAA"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Assurance décennale</label>
              <input
                name="mention_assurance"
                value={form.mention_assurance}
                onChange={handleChange}
                placeholder="Assurance décennale : Allianz n°XXXXXXX — valable jusqu'au JJ/MM/AAAA"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Garantie</label>
              <input
                name="mention_garantie"
                value={form.mention_garantie}
                onChange={handleChange}
                placeholder="Garantie parfait achèvement 1 an — Garantie décennale 10 ans"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Mention légale personnalisée</label>
              <textarea
                name="mention_legale_custom"
                value={form.mention_legale_custom}
                onChange={(e) => setForm(prev => ({ ...prev, mention_legale_custom: e.target.value }))}
                placeholder="Ex: Dispensé d'immatriculation au RCS — TVA non applicable art. 293B du CGI..."
                rows={2}
                style={{ ...inputStyle, resize: "none" as const }}
              />
            </div>
            <div>
              <label style={labelStyle}>Pied de page personnalisé</label>
              <textarea
                name="pied_de_page"
                value={form.pied_de_page}
                onChange={(e) => setForm(prev => ({ ...prev, pied_de_page: e.target.value }))}
                placeholder="Ex: Merci pour votre confiance. Pour toute question, contactez-nous à contact@monentreprise.fr"
                rows={2}
                style={{ ...inputStyle, resize: "none" as const }}
              />
            </div>
          </div>
        </div>

        <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", padding: "32px" }}>
          <p style={{ fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontWeight: 500, marginBottom: "6px" }}>
            COMPTE
          </p>
          <p style={{ fontSize: "12px", fontFamily: "Geist, sans-serif", color: "var(--ink-3)", marginBottom: "20px" }}>
            L&apos;adresse email ne peut pas être modifiée depuis cette page.
          </p>
          <div>
            <label style={labelStyle}>Email</label>
            <div style={{ ...inputStyle, background: "var(--ivory-2)", color: "var(--ink-3)", cursor: "not-allowed" }}>
              {email}
            </div>
          </div>
        </div>

        <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", padding: "32px" }}>
          <p style={{ fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontWeight: 500, marginBottom: "20px" }}>
            PLAN ACTUEL
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
            <span style={{
              display: "inline-block",
              background: "color-mix(in oklch, var(--accent) 14%, transparent)",
              color: "var(--accent)",
              borderRadius: "999px",
              padding: "4px 14px",
              fontSize: "11px",
              fontFamily: "Geist, sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontWeight: 600,
            }}>
              {profile?.plan === "pro" ? "Pro" : "Starter"}
            </span>
            <span style={{ fontSize: "13px", fontFamily: "Geist, sans-serif", color: "var(--ink-3)" }}>
              {profile?.abonnement_actif ? "Abonnement actif" : "Période d'essai"}
            </span>
          </div>
          <p style={{ fontSize: "12px", fontFamily: "Geist, sans-serif", color: "var(--ink-3)" }}>
            Pour changer de plan, contactez-nous à{" "}
            <a href="mailto:contact@gestia.fr" style={{ color: "var(--accent)", textDecoration: "none" }}>
              contact@gestia.fr
            </a>
          </p>
        </div>

        <div style={{
          background: "var(--ivory-2)", border: "1px solid var(--line)",
          borderRadius: "16px", padding: "24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span style={{
              fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.14em",
              background: "color-mix(in oklch, var(--accent) 12%, transparent)",
              color: "var(--accent)", padding: "3px 10px", borderRadius: "999px",
              fontFamily: "Geist Mono, monospace",
            }}>RFE 2026</span>
            <h2 style={{ fontFamily: "Instrument Serif, serif", fontSize: "17px", color: "var(--ink)" }}>
              Réforme de la Facturation Électronique
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { date: "1er sept. 2026", desc: "Obligation de RECEVOIR des factures électroniques — toutes entreprises" },
              { date: "1er sept. 2027", desc: "Obligation d'ÉMETTRE des factures électroniques — TPE/PME/auto-entrepreneurs" },
            ].map((item) => (
              <div key={item.date} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "10.5px", fontFamily: "Geist Mono, monospace", color: "var(--accent)", flexShrink: 0, marginTop: "1px" }}>
                  {item.date}
                </span>
                <p style={{ fontSize: "13px", color: "var(--ink-2)", lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "14px", padding: "12px 14px", background: "white", borderRadius: "10px", border: "1px solid var(--line)" }}>
            <p style={{ fontSize: "12px", color: "var(--ink-2)", lineHeight: 1.6 }}>
              <strong style={{ color: "var(--ink)" }}>Gestia génère déjà le format Factur-X</strong> (PDF visuel + XML CII embarqué, profil BASIC, conforme EN 16931).
              Pour l&apos;émission obligatoire en 2027, vous devrez également transmettre via une <strong>Plateforme Agréée (PDP)</strong>.
              Gestia intégrera cette fonctionnalité avant septembre 2027.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: loading ? "var(--ink-3)" : "var(--ink)",
              color: "var(--ivory)",
              borderRadius: "999px",
              padding: "12px 24px",
              fontSize: "13px",
              fontFamily: "Geist, sans-serif",
              fontWeight: 500,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Enregistrement...</>
            ) : (
              "Enregistrer les modifications"
            )}
          </button>

          {succes && (
            <p style={{ fontSize: "13px", fontFamily: "Geist, sans-serif", color: "var(--accent)", fontWeight: 500 }}>
              Modifications enregistrées
            </p>
          )}

          {erreur && (
            <p style={{ fontSize: "13px", fontFamily: "Geist, sans-serif", color: "#991b1b" }}>
              {erreur}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
