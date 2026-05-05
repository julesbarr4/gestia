"use client";
import { useState } from "react";

interface Ligne {
  description: string;
  quantite: number;
  prixUnitaireHT: number;
  totalHT: number;
}

interface Props {
  lignes: Ligne[];
  tauxTVA: number;
  conditions?: string | null;
  notes?: string | null;
  nomSuggere?: string;
}

export function SauvegarderModeleBtn({ lignes, tauxTVA, conditions, notes, nomSuggere }: Props) {
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState(nomSuggere || "");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [succes, setSucces] = useState(false);
  const [erreur, setErreur] = useState("");

  async function sauvegarder() {
    if (!nom.trim()) { setErreur("Donnez un nom à ce modèle"); return; }
    setLoading(true);
    setErreur("");

    const res = await fetch("/api/modeles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, description, lignes, taux_tva: tauxTVA, conditions, notes }),
    });

    const data = await res.json();
    if (!res.ok) { setErreur(data.erreur || "Erreur"); setLoading(false); return; }

    setSucces(true);
    setTimeout(() => { setOpen(false); setSucces(false); }, 1500);
    setLoading(false);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 13px",
    border: "1px solid var(--line)", borderRadius: "12px",
    fontSize: "14px", background: "white", color: "var(--ink)",
    outline: "none", boxSizing: "border-box" as const,
  };

  return (
    <>
      <button onClick={() => setOpen(true)} style={{
        fontSize: "12px", color: "var(--ink-2)",
        background: "transparent", border: "1px solid var(--line)",
        borderRadius: "999px", padding: "6px 14px", cursor: "pointer",
      }}>
        ☆ Sauvegarder comme modèle
      </button>

      {open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(14,14,14,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px",
        }} onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div style={{
            background: "var(--ivory)", borderRadius: "20px",
            padding: "32px", maxWidth: "460px", width: "100%",
          }}>
            <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace", marginBottom: "8px" }}>
              NOUVEAU MODÈLE
            </p>
            <h2 style={{ fontFamily: "Instrument Serif, serif", fontSize: "24px", color: "var(--ink)", marginBottom: "20px" }}>
              <em>Sauvegarder ce devis</em> comme modèle.
            </h2>

            {succes ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p style={{ fontFamily: "Instrument Serif, serif", fontSize: "18px", color: "var(--accent)" }}>
                  ✓ Modèle sauvegardé !
                </p>
              </div>
            ) : (
              <>
                {erreur && (
                  <div style={{ background: "#FEF2F2", color: "#991B1B", fontSize: "13px", padding: "10px 14px", borderRadius: "10px", border: "1px solid #FECACA", marginBottom: "14px" }}>
                    {erreur}
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace", display: "block", marginBottom: "6px" }}>
                      NOM DU MODÈLE *
                    </label>
                    <input style={inputStyle} value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex: Rénovation salle de bain, Site vitrine, Mission conseil..." />
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace", display: "block", marginBottom: "6px" }}>
                      DESCRIPTION (optionnel)
                    </label>
                    <input style={inputStyle} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Pour les rénovations résidentielles standard" />
                  </div>
                  <div style={{ padding: "12px 14px", background: "var(--ivory-2)", borderRadius: "10px", border: "1px solid var(--line)" }}>
                    <p style={{ fontSize: "11px", color: "var(--ink-3)" }}>
                      {lignes.length} ligne{lignes.length > 1 ? "s" : ""} · TVA {tauxTVA}%
                      {conditions ? " · Conditions incluses" : ""}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button onClick={() => setOpen(false)} style={{ padding: "10px 20px", background: "transparent", border: "1px solid var(--line)", borderRadius: "999px", fontSize: "13px", color: "var(--ink-2)", cursor: "pointer" }}>
                    Annuler
                  </button>
                  <button onClick={sauvegarder} disabled={loading} style={{ padding: "10px 22px", background: "var(--ink)", color: "var(--ivory)", border: "none", borderRadius: "999px", fontSize: "13px", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
                    {loading ? "Sauvegarde..." : "Sauvegarder →"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
