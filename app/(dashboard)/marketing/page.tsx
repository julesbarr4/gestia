"use client";

import { useState } from "react";
import { Loader2, Copy, CheckCircle } from "lucide-react";

interface ContenuMarketing {
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  newsletter?: { sujet: string; corps: string };
  hashtags: string[];
}

const RESEAUX = [
  { id: "linkedin", label: "LinkedIn" },
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "newsletter", label: "Newsletter" },
];

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

export default function MarketingPage() {
  const [sujet, setSujet] = useState("");
  const [reseaux, setReseaux] = useState<string[]>(["linkedin"]);
  const [tonalite, setTonalite] = useState("professionnel");
  const [loading, setLoading] = useState(false);
  const [contenu, setContenu] = useState<ContenuMarketing | null>(null);
  const [erreur, setErreur] = useState("");
  const [copiePour, setCopiePour] = useState<string | null>(null);

  function toggleReseau(r: string) {
    setReseaux((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );
  }

  async function generer(e: React.FormEvent) {
    e.preventDefault();
    if (reseaux.length === 0) return;
    setLoading(true);
    setErreur("");

    const res = await fetch("/api/agents/marketing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sujet, reseaux, tonalite }),
    });

    const data = await res.json();

    if (res.status === 403) {
      setErreur(data.erreur || "Fonctionnalité réservée à un plan supérieur");
      setLoading(false);
      return;
    }

    if (!res.ok) {
      setErreur(data.erreur || "Erreur");
      setLoading(false);
      return;
    }

    setContenu(data.contenu);
    setLoading(false);
  }

  function copier(texte: string, cle: string) {
    navigator.clipboard.writeText(texte);
    setCopiePour(cle);
    setTimeout(() => setCopiePour(null), 2000);
  }

  return (
    <div style={{ padding: "40px", background: "var(--ivory)", minHeight: "100%", maxWidth: "960px" }}>
      <div style={{ marginBottom: "40px" }}>
        <p style={{ fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", marginBottom: "8px" }}>
          MARKETING
        </p>
        <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "36px", fontWeight: 400, color: "var(--ink)", lineHeight: 1.1 }}>
          Créer du contenu avec <span style={{ fontStyle: "italic" }}>Cyprien.</span>
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: contenu ? "400px 1fr" : "1fr", gap: "24px", maxWidth: contenu ? "100%" : "560px" }}>
        <form onSubmit={generer} style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {erreur && (
            <div style={{ background: "#fef2f2", color: "#991b1b", fontSize: "13px", padding: "12px 16px", borderRadius: "8px", fontFamily: "Geist, sans-serif" }}>
              {erreur}
            </div>
          )}

          <div>
            <label style={labelStyle}>Sujet / thème du contenu</label>
            <textarea
              value={sujet}
              onChange={(e) => setSujet(e.target.value)}
              required
              rows={4}
              style={{ ...inputStyle, resize: "none" }}
              placeholder="Ex : Lancement de notre nouveau service de livraison express, promotion -20% ce week-end..."
            />
          </div>

          <div>
            <label style={labelStyle}>Réseaux</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {RESEAUX.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => toggleReseau(r.id)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontFamily: "Geist, sans-serif",
                    fontWeight: 500,
                    border: "1px solid",
                    cursor: "pointer",
                    background: reseaux.includes(r.id) ? "var(--ink)" : "transparent",
                    color: reseaux.includes(r.id) ? "var(--ivory)" : "var(--ink-2)",
                    borderColor: reseaux.includes(r.id) ? "var(--ink)" : "var(--line)",
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Tonalité</label>
            <select
              value={tonalite}
              onChange={(e) => setTonalite(e.target.value)}
              style={inputStyle}
            >
              <option value="professionnel">Professionnel</option>
              <option value="decontracte">Décontracté</option>
              <option value="inspirant">Inspirant</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || reseaux.length === 0}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: loading || reseaux.length === 0 ? "var(--ink-3)" : "var(--ink)",
              color: "var(--ivory)",
              borderRadius: "999px",
              padding: "12px 24px",
              fontSize: "13px",
              fontFamily: "Geist, sans-serif",
              fontWeight: 500,
              border: "none",
              cursor: loading || reseaux.length === 0 ? "not-allowed" : "pointer",
              alignSelf: "flex-start",
            }}
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Cyprien rédige votre contenu...</>
            ) : (
              "Générer le contenu →"
            )}
          </button>
        </form>

        {contenu && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "var(--ivory-2)", border: "1px solid var(--line)", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#ea580c", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "16px", fontFamily: "Instrument Serif, serif", fontStyle: "italic", flexShrink: 0 }}>
                C
              </div>
              <div>
                <p style={{ fontSize: "14px", fontFamily: "Geist, sans-serif", fontWeight: 600, color: "var(--ink)", marginBottom: "2px" }}>Créé par Cyprien</p>
                <p style={{ fontSize: "11px", fontFamily: "Geist, sans-serif", color: "var(--ink-3)" }}>Directeur marketing IA</p>
              </div>
            </div>

            {Object.entries(contenu)
              .filter(([k]) => k !== "hashtags" && k !== "newsletter")
              .map(([reseau, texte]) => (
                <div key={reseau} style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", padding: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                    <p style={{ fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontWeight: 500 }}>
                      {reseau}
                    </p>
                    <button
                      onClick={() => copier(texte as string, reseau)}
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontFamily: "Geist, sans-serif", color: "var(--accent)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      {copiePour === reseau ? (
                        <><CheckCircle className="w-3 h-3" />Copié !</>
                      ) : (
                        <><Copy className="w-3 h-3" />Copier</>
                      )}
                    </button>
                  </div>
                  <p style={{ fontSize: "13px", fontFamily: "Geist, sans-serif", color: "var(--ink-2)", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                    {texte as string}
                  </p>
                </div>
              ))}

            {contenu.newsletter && (
              <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", padding: "24px" }}>
                <p style={{ fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontWeight: 500, marginBottom: "16px" }}>
                  NEWSLETTER
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                      <p style={{ fontSize: "10.5px", fontFamily: "Geist, sans-serif", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.12em" }}>Objet</p>
                      <button
                        onClick={() => copier(contenu.newsletter!.sujet, "newsletter-sujet")}
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontFamily: "Geist, sans-serif", color: "var(--accent)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        {copiePour === "newsletter-sujet" ? <><CheckCircle className="w-3 h-3" />Copié !</> : <><Copy className="w-3 h-3" />Copier</>}
                      </button>
                    </div>
                    <p style={{ fontSize: "13px", fontFamily: "Geist, sans-serif", color: "var(--ink)", fontWeight: 600 }}>{contenu.newsletter.sujet}</p>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                      <p style={{ fontSize: "10.5px", fontFamily: "Geist, sans-serif", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.12em" }}>Corps</p>
                      <button
                        onClick={() => copier(contenu.newsletter!.corps, "newsletter-corps")}
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontFamily: "Geist, sans-serif", color: "var(--accent)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        {copiePour === "newsletter-corps" ? <><CheckCircle className="w-3 h-3" />Copié !</> : <><Copy className="w-3 h-3" />Copier</>}
                      </button>
                    </div>
                    <p style={{ fontSize: "13px", fontFamily: "Geist, sans-serif", color: "var(--ink-2)", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{contenu.newsletter.corps}</p>
                  </div>
                </div>
              </div>
            )}

            {contenu.hashtags?.length > 0 && (
              <div style={{ background: "var(--ivory-2)", border: "1px solid var(--line)", borderRadius: "16px", padding: "20px" }}>
                <p style={{ fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontWeight: 500, marginBottom: "12px" }}>
                  HASHTAGS SUGGÉRÉS
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {contenu.hashtags.map((h) => (
                    <span key={h} style={{ background: "white", border: "1px solid var(--line)", color: "var(--accent)", borderRadius: "999px", padding: "3px 10px", fontSize: "12px", fontFamily: "Geist Mono, monospace" }}>
                      {h.startsWith("#") ? h : `#${h}`}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
