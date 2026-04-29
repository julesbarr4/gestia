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

const CHAMPS = [
  { name: "nom_entreprise", label: "Nom de l'entreprise", placeholder: "Ma Boulangerie SAS", type: "text", required: true, full: true },
  { name: "siret", label: "SIRET", placeholder: "123 456 789 00012", type: "text", required: false, full: false },
  { name: "telephone", label: "Téléphone", placeholder: "06 12 34 56 78", type: "tel", required: false, full: false },
  { name: "adresse", label: "Adresse", placeholder: "10 rue de la Paix", type: "text", required: false, full: true },
  { name: "code_postal", label: "Code postal", placeholder: "75001", type: "text", required: false, full: false },
  { name: "ville", label: "Ville", placeholder: "Paris", type: "text", required: false, full: false },
];

export default function ParametresClient({ profile, email }: Props) {
  const [form, setForm] = useState({
    nom_entreprise: profile?.nom_entreprise || "",
    siret: profile?.siret || "",
    telephone: profile?.telephone || "",
    adresse: profile?.adresse || "",
    code_postal: profile?.code_postal || "",
    ville: profile?.ville || "",
  });

  const [loading, setLoading] = useState(false);
  const [succes, setSucces] = useState(false);
  const [erreur, setErreur] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSucces(false);
    setErreur("");
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
            {CHAMPS.map((champ) => (
              <div key={champ.name} style={{ gridColumn: champ.full ? "1 / -1" : "auto" }}>
                <label htmlFor={champ.name} style={labelStyle}>
                  {champ.label}
                  {champ.required && <span style={{ color: "#991b1b", marginLeft: "4px" }}>*</span>}
                </label>
                <input
                  id={champ.name}
                  name={champ.name}
                  type={champ.type}
                  value={form[champ.name as keyof typeof form]}
                  onChange={handleChange}
                  placeholder={champ.placeholder}
                  required={champ.required}
                  style={inputStyle}
                />
              </div>
            ))}
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
