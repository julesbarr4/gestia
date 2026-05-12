"use client";

import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";

interface AnalyseEmail {
  categorie: string;
  urgence: string;
  resume: string;
  sujetReponse: string;
  reponse: string;
}

type UrgenceStyle = { background: string; color: string };

const URGENCE_STYLES: Record<string, UrgenceStyle> = {
  faible: { background: "var(--line)", color: "var(--ink-3)" },
  normale: { background: "var(--ivory-2)", color: "var(--ink-2)" },
  elevee: { background: "#7a1d1d", color: "var(--ivory)" },
};

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

export default function EmailsPage() {
  const [emailDe, setEmailDe] = useState("");
  const [sujet, setSujet] = useState("");
  const [corps, setCorps] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyse, setAnalyse] = useState<AnalyseEmail | null>(null);
  const [erreur, setErreur] = useState("");
  const [copie, setCopie] = useState(false);
  const [ajouterSignatureLea, setAjouterSignatureLea] = useState(false);

  async function analyser(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErreur("");
    setAnalyse(null);

    const res = await fetch("/api/agents/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailDe, sujet, corps, ajouterSignatureLea }),
    });

    const data = await res.json();

    if (res.status === 403) {
      setErreur(data.erreur || "Fonctionnalité réservée à un plan supérieur");
      setLoading(false);
      return;
    }

    if (!res.ok) {
      setErreur(data.erreur || "Erreur lors de l'analyse");
      setLoading(false);
      return;
    }

    setAnalyse(data.analyse);
    setLoading(false);
  }

  function copierReponse() {
    if (analyse?.reponse) {
      navigator.clipboard.writeText(analyse.reponse);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    }
  }

  const urgenceStyle = analyse ? (URGENCE_STYLES[analyse.urgence] || URGENCE_STYLES.normale) : URGENCE_STYLES.normale;

  return (
    <div style={{ padding: "40px", background: "var(--ivory)", minHeight: "100%", maxWidth: "960px" }}>
      <div style={{ marginBottom: "40px" }}>
        <p style={{ fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", marginBottom: "8px" }}>
          SUPPORT
        </p>
        <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "36px", fontWeight: 400, color: "var(--ink)", lineHeight: 1.1 }}>
          Analyser un email avec <span style={{ fontStyle: "italic" }}>Léa.</span>
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: analyse ? "1fr 1fr" : "1fr", gap: "24px", maxWidth: analyse ? "100%" : "560px" }}>
        <form onSubmit={analyser} style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {erreur && (
            <div style={{ background: "#fef2f2", color: "#991b1b", fontSize: "13px", padding: "12px 16px", borderRadius: "8px", fontFamily: "Geist, sans-serif" }}>
              {erreur}
            </div>
          )}

          <div>
            <label style={labelStyle}>De</label>
            <input
              type="email"
              value={emailDe}
              onChange={(e) => setEmailDe(e.target.value)}
              required
              style={inputStyle}
              placeholder="client@exemple.fr"
            />
          </div>

          <div>
            <label style={labelStyle}>Sujet</label>
            <input
              type="text"
              value={sujet}
              onChange={(e) => setSujet(e.target.value)}
              style={inputStyle}
              placeholder="Question sur ma commande..."
            />
          </div>

          <div>
            <label style={labelStyle}>Corps de l&apos;email</label>
            <textarea
              value={corps}
              onChange={(e) => setCorps(e.target.value)}
              required
              rows={8}
              style={{ ...inputStyle, resize: "none" }}
              placeholder="Coller le contenu de l'email ici..."
            />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", fontFamily: "Geist, sans-serif", color: "var(--ink-2)", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={ajouterSignatureLea}
              onChange={(e) => setAjouterSignatureLea(e.target.checked)}
              style={{ width: "16px", height: "16px", accentColor: "var(--ink)" }}
            />
            Ajouter la signature « Généré par Léa »
          </label>

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
              alignSelf: "flex-start",
            }}
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Léa analyse votre email...</>
            ) : (
              "Analyser & répondre →"
            )}
          </button>
        </form>

        {analyse && (
          <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#059669", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "16px", fontFamily: "Instrument Serif, serif", fontStyle: "italic", flexShrink: 0 }}>
                  L
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontFamily: "Geist, sans-serif", fontWeight: 600, color: "var(--ink)" }}>Analyse de Léa</p>
                  <p style={{ fontSize: "11px", fontFamily: "Geist, sans-serif", color: "var(--ink-3)" }}>Responsable service client IA</p>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ background: "var(--ivory-2)", color: "var(--ink-2)", borderRadius: "999px", padding: "3px 10px", fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 500 }}>
                {analyse.categorie}
              </span>
              <span style={{ background: urgenceStyle.background, color: urgenceStyle.color, borderRadius: "999px", padding: "3px 10px", fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 500 }}>
                Urgence {analyse.urgence}
              </span>
            </div>

            <div style={{ background: "var(--ivory-2)", borderRadius: "8px", padding: "14px 16px", fontSize: "13px", fontFamily: "Geist, sans-serif", color: "var(--ink-2)", lineHeight: 1.6 }}>
              <strong style={{ color: "var(--ink)" }}>Résumé :</strong> {analyse.resume}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <label style={labelStyle}>Réponse générée</label>
                <button
                  onClick={copierReponse}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontFamily: "Geist, sans-serif", color: "var(--accent)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  {copie ? (
                    <><CheckCircle className="w-3 h-3" />Copié !</>
                  ) : (
                    "Copier la réponse"
                  )}
                </button>
              </div>
              <p style={{ fontSize: "11px", fontFamily: "Geist Mono, monospace", color: "var(--ink-3)", marginBottom: "8px" }}>
                Objet : <strong style={{ color: "var(--ink-2)" }}>{analyse.sujetReponse}</strong>
              </p>
              <pre style={{ background: "var(--ivory-2)", borderRadius: "8px", padding: "16px", fontSize: "13px", fontFamily: "Geist, sans-serif", color: "var(--ink-2)", whiteSpace: "pre-wrap", lineHeight: 1.6, margin: 0 }}>
                {analyse.reponse}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
