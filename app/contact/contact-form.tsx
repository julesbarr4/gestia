"use client";

import { useState } from "react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  border: "1px solid var(--line)",
  borderRadius: "14px",
  fontSize: "14.5px",
  background: "white",
  color: "var(--ink)",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "Geist, sans-serif",
};

const labelStyle: React.CSSProperties = {
  fontSize: "10.5px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.14em",
  color: "var(--ink-3)",
  display: "block",
  marginBottom: "6px",
  fontFamily: "Geist Mono, monospace",
};

export function ContactForm() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [sujet, setSujet] = useState("");
  const [message, setMessage] = useState("");
  const [envoye, setEnvoye] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEnvoye(true);
    }, 800);
  }

  if (envoye) {
    return (
      <div style={{ padding: "48px 0", textAlign: "center" }}>
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ margin: "0 auto 20px" }}>
          <circle cx="28" cy="28" r="27" stroke="var(--ink)" strokeWidth="2" />
          <path d="M16 28l8 8 16-16" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h2 style={{ fontFamily: "Instrument Serif, serif", fontSize: "24px", color: "var(--ink)", marginBottom: "8px" }}>Message envoyé !</h2>
        <p style={{ fontSize: "14px", color: "var(--ink-2)", marginBottom: "24px" }}>Nous revenons vers vous sous 24h ouvrées.</p>
        <button
          onClick={() => { setEnvoye(false); setNom(""); setEmail(""); setSujet(""); setMessage(""); }}
          style={{ fontSize: "13px", color: "var(--ink-3)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <label style={labelStyle}>Nom</label>
        <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required placeholder="Jean Dupont" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="vous@exemple.fr" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Sujet</label>
        <input type="text" value={sujet} onChange={(e) => setSujet(e.target.value)} required placeholder="Question sur les tarifs, support technique..." style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          placeholder="Décrivez votre demande..."
          style={{ ...inputStyle, resize: "none" }}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "13px 24px", background: "var(--ink)", color: "var(--ivory)",
          border: "none", borderRadius: "999px", fontSize: "14px", fontWeight: 500,
          cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Envoi en cours..." : "Envoyer le message →"}
      </button>
    </form>
  );
}
