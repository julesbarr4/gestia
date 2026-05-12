"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function CompteSection({ email }: { email: string }) {
  const router = useRouter();

  const [nouvelEmail, setNouvelEmail] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [succesEmail, setSuccesEmail] = useState("");
  const [erreurEmail, setErreurEmail] = useState("");

  const [nouveauMdp, setNouveauMdp] = useState("");
  const [confirmMdp, setConfirmMdp] = useState("");
  const [loadingMdp, setLoadingMdp] = useState(false);
  const [succesMdp, setSuccesMdp] = useState("");
  const [erreurMdp, setErreurMdp] = useState("");

  const [showDelete, setShowDelete] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [erreurDelete, setErreurDelete] = useState("");

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 13px",
    border: "1px solid var(--line)", borderRadius: "12px",
    fontSize: "14px", background: "white", color: "var(--ink)",
    outline: "none", boxSizing: "border-box" as const,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "10px", textTransform: "uppercase" as const,
    letterSpacing: "0.14em", color: "var(--ink-3)",
    display: "block", marginBottom: "6px",
    fontFamily: "Geist Mono, monospace",
  };

  async function changerEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!nouvelEmail.trim()) return;
    setLoadingEmail(true);
    setErreurEmail("");
    setSuccesEmail("");

    const res = await fetch("/api/compte/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: nouvelEmail }),
    });
    const data = await res.json();

    if (!res.ok) {
      setErreurEmail(data.erreur || "Erreur");
    } else {
      setSuccesEmail(data.message);
      setNouvelEmail("");
    }
    setLoadingEmail(false);
  }

  async function changerMdp(e: React.FormEvent) {
    e.preventDefault();
    if (nouveauMdp !== confirmMdp) {
      setErreurMdp("Les mots de passe ne correspondent pas.");
      return;
    }
    if (nouveauMdp.length < 8) {
      setErreurMdp("8 caractères minimum.");
      return;
    }
    setLoadingMdp(true);
    setErreurMdp("");
    setSuccesMdp("");

    const res = await fetch("/api/compte/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: nouveauMdp }),
    });
    const data = await res.json();

    if (!res.ok) {
      setErreurMdp(data.erreur || "Erreur");
    } else {
      setSuccesMdp(data.message);
      setNouveauMdp("");
      setConfirmMdp("");
    }
    setLoadingMdp(false);
  }

  async function supprimerCompte() {
    if (confirmText !== "SUPPRIMER") {
      setErreurDelete("Tapez SUPPRIMER en majuscules pour confirmer.");
      return;
    }
    setLoadingDelete(true);
    setErreurDelete("");

    const res = await fetch("/api/compte/supprimer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmation: confirmText }),
    });

    if (res.ok) {
      router.push("/");
    } else {
      const data = await res.json();
      setErreurDelete(data.erreur || "Erreur lors de la suppression");
      setLoadingDelete(false);
    }
  }

  const blocStyle: React.CSSProperties = {
    background: "white", border: "1px solid var(--line)",
    borderRadius: "16px", padding: "24px",
  };

  const eyebrow: React.CSSProperties = {
    fontSize: "10.5px", textTransform: "uppercase" as const,
    letterSpacing: "0.16em", color: "var(--ink-3)",
    fontFamily: "Geist Mono, monospace", marginBottom: "6px",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      <div style={{ marginTop: "12px" }}>
        <p style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace", marginBottom: "6px" }}>MON COMPTE</p>
        <h2 style={{ fontFamily: "Instrument Serif, serif", fontSize: "28px", color: "var(--ink)", lineHeight: 1.1 }}>
          Sécurité et <em>accès.</em>
        </h2>
      </div>

      <div style={blocStyle}>
        <p style={eyebrow}>ADRESSE EMAIL</p>
        <div style={{ padding: "10px 13px", background: "var(--ivory-2)", border: "1px solid var(--line)", borderRadius: "12px", marginBottom: "16px" }}>
          <p style={{ fontSize: "14px", color: "var(--ink)", fontFamily: "Geist Mono, monospace" }}>{email}</p>
        </div>

        <form onSubmit={changerEmail}>
          <label style={labelStyle}>NOUVEL EMAIL</label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="email"
              value={nouvelEmail}
              onChange={(e) => { setNouvelEmail(e.target.value); setErreurEmail(""); setSuccesEmail(""); }}
              placeholder="nouveau@exemple.fr"
              style={{ ...inputStyle, flex: 1 }}
            />
            <button type="submit" disabled={loadingEmail || !nouvelEmail.trim()} style={{ padding: "10px 20px", background: "var(--ink)", color: "var(--ivory)", border: "none", borderRadius: "999px", fontSize: "13px", fontWeight: 500, cursor: loadingEmail ? "not-allowed" : "pointer", opacity: loadingEmail || !nouvelEmail.trim() ? 0.5 : 1, flexShrink: 0 }}>
              {loadingEmail ? "..." : "Changer →"}
            </button>
          </div>
          {erreurEmail && <p style={{ fontSize: "12px", color: "#DC2626", marginTop: "8px" }}>{erreurEmail}</p>}
          {succesEmail && <p style={{ fontSize: "12px", color: "var(--accent)", marginTop: "8px" }}>✓ {succesEmail}</p>}
          <p style={{ fontSize: "11px", color: "var(--ink-3)", marginTop: "8px", lineHeight: 1.5 }}>
            Un email de confirmation sera envoyé à votre nouvelle adresse.
          </p>
        </form>
      </div>

      <div style={blocStyle}>
        <p style={eyebrow}>MOT DE PASSE</p>
        <form onSubmit={changerMdp} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={labelStyle}>NOUVEAU MOT DE PASSE</label>
            <input
              type="password"
              value={nouveauMdp}
              onChange={(e) => { setNouveauMdp(e.target.value); setErreurMdp(""); setSuccesMdp(""); }}
              placeholder="8 caractères minimum"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>CONFIRMER LE MOT DE PASSE</label>
            <input
              type="password"
              value={confirmMdp}
              onChange={(e) => { setConfirmMdp(e.target.value); setErreurMdp(""); }}
              placeholder="Répétez le mot de passe"
              style={inputStyle}
            />
          </div>
          {erreurMdp && <p style={{ fontSize: "12px", color: "#DC2626" }}>{erreurMdp}</p>}
          {succesMdp && <p style={{ fontSize: "12px", color: "var(--accent)" }}>✓ {succesMdp}</p>}
          <div>
            <button
              type="submit"
              disabled={loadingMdp || !nouveauMdp || !confirmMdp}
              style={{ padding: "10px 22px", background: "var(--ink)", color: "var(--ivory)", border: "none", borderRadius: "999px", fontSize: "13px", fontWeight: 500, cursor: loadingMdp ? "not-allowed" : "pointer", opacity: loadingMdp || !nouveauMdp || !confirmMdp ? 0.5 : 1 }}
            >
              {loadingMdp ? "Mise à jour..." : "Mettre à jour →"}
            </button>
          </div>
        </form>
      </div>

      <div style={{ ...blocStyle, border: "1px solid #FECACA" }}>
        <p style={{ ...eyebrow, color: "#DC2626" }}>ZONE DANGEREUSE</p>
        <h3 style={{ fontFamily: "Instrument Serif, serif", fontSize: "18px", color: "var(--ink)", marginBottom: "8px" }}>
          Supprimer mon compte
        </h3>
        <p style={{ fontSize: "13px", color: "var(--ink-2)", lineHeight: 1.6, marginBottom: "16px" }}>
          Cette action est <strong>irréversible</strong>. Toutes vos données (clients, devis, factures, documents) seront définitivement supprimées. Votre abonnement Stripe sera annulé.
        </p>

        {!showDelete ? (
          <button
            onClick={() => setShowDelete(true)}
            style={{ padding: "9px 18px", background: "transparent", color: "#DC2626", border: "1px solid #FECACA", borderRadius: "999px", fontSize: "13px", cursor: "pointer" }}
          >
            Supprimer mon compte
          </button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ padding: "12px 14px", background: "#FEF2F2", borderRadius: "10px", border: "1px solid #FECACA" }}>
              <p style={{ fontSize: "12.5px", color: "#991B1B", fontWeight: 500, marginBottom: "4px" }}>
                Tapez SUPPRIMER pour confirmer
              </p>
              <p style={{ fontSize: "11px", color: "#B91C1C" }}>
                Cette action ne peut pas être annulée.
              </p>
            </div>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => { setConfirmText(e.target.value); setErreurDelete(""); }}
              placeholder="SUPPRIMER"
              style={{ ...inputStyle, border: "1px solid #FECACA" }}
            />
            {erreurDelete && <p style={{ fontSize: "12px", color: "#DC2626" }}>{erreurDelete}</p>}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => { setShowDelete(false); setConfirmText(""); setErreurDelete(""); }}
                style={{ padding: "9px 18px", background: "transparent", border: "1px solid var(--line)", borderRadius: "999px", fontSize: "13px", color: "var(--ink-2)", cursor: "pointer" }}
              >
                Annuler
              </button>
              <button
                onClick={supprimerCompte}
                disabled={loadingDelete || confirmText !== "SUPPRIMER"}
                style={{ padding: "9px 18px", background: confirmText === "SUPPRIMER" ? "#DC2626" : "#FCA5A5", color: "white", border: "none", borderRadius: "999px", fontSize: "13px", fontWeight: 500, cursor: loadingDelete || confirmText !== "SUPPRIMER" ? "not-allowed" : "pointer" }}
              >
                {loadingDelete ? "Suppression..." : "Supprimer définitivement"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
