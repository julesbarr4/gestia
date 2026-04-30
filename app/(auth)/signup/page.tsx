"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AGENTS = [
  { initial: "I", name: "Inès", color: "#2563eb" },
  { initial: "L", name: "Léa", color: "#059669" },
  { initial: "H", name: "Hugo", color: "#7c3aed" },
  { initial: "C", name: "Cyprien", color: "#ea580c" },
  { initial: "A", name: "Augustin", color: "#111827" },
];

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nomEntreprise, setNomEntreprise] = useState("");
  const [loading, setLoading] = useState(false);
  const [succes, setSucces] = useState(false);
  const [erreur, setErreur] = useState("");
  const supabase = createClient();
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErreur("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nom_entreprise: nomEntreprise },
      },
    });

    if (error) {
      setErreur(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase
        .from("profiles")
        .update({ nom_entreprise: nomEntreprise })
        .eq("id", data.user.id);
    }

    setSucces(true);
    setLoading(false);
  }

  if (succes) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--ivory)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
        <div style={{ textAlign: "center", maxWidth: "420px" }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ margin: "0 auto 24px" }}>
            <circle cx="32" cy="32" r="31" stroke="var(--ink)" strokeWidth="2" />
            <path d="M18 32l10 10 18-18" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "36px", color: "var(--ink)", marginBottom: "12px", lineHeight: 1.1 }}>
            Vérifiez votre email.
          </h1>
          <p style={{ fontSize: "15px", color: "var(--ink-2)", lineHeight: 1.55 }}>
            Un lien de confirmation a été envoyé à <strong>{email}</strong>. Cliquez dessus pour activer votre compte.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <form onSubmit={handleSignup} style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", minHeight: "100vh" }}>
        <div style={{ background: "var(--ivory)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 64px", minHeight: "100vh" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", marginBottom: "56px" }}>
            <div style={{ width: "28px", height: "28px", background: "var(--ink)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ivory)", fontFamily: "Instrument Serif, serif", fontStyle: "italic", fontSize: "16px" }}>g</div>
            <span style={{ fontFamily: "Instrument Serif, serif", fontSize: "17px", color: "var(--ink)", letterSpacing: "-0.02em" }}>Gestia</span>
          </Link>

          <p style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--ink-3)", marginBottom: "12px", fontFamily: "Geist Mono, monospace" }}>CRÉER UN COMPTE</p>
          <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "42px", lineHeight: 1.04, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: "8px" }}>
            Démarrez<br /><em>gratuitement.</em>
          </h1>
          <p style={{ fontSize: "15px", color: "var(--ink-2)", marginBottom: "40px", lineHeight: 1.55 }}>
            14 jours d'essai · Sans carte bancaire
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "380px" }}>
            {erreur && (
              <div style={{ background: "#FEF2F2", color: "#991B1B", fontSize: "13px", padding: "10px 14px", borderRadius: "10px", border: "1px solid #FECACA" }}>
                {erreur}
              </div>
            )}
            <div>
              <label style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-3)", display: "block", marginBottom: "6px" }}>Nom de l'entreprise</label>
              <input
                type="text"
                value={nomEntreprise}
                onChange={(e) => setNomEntreprise(e.target.value)}
                placeholder="Mon Entreprise SAS"
                required
                style={{ width: "100%", padding: "11px 14px", border: "1px solid var(--line)", borderRadius: "var(--radius)", fontSize: "14.5px", background: "white", color: "var(--ink)", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-3)", display: "block", marginBottom: "6px" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.fr"
                required
                style={{ width: "100%", padding: "11px 14px", border: "1px solid var(--line)", borderRadius: "var(--radius)", fontSize: "14.5px", background: "white", color: "var(--ink)", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-3)", display: "block", marginBottom: "6px" }}>Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8 caractères minimum"
                required
                minLength={8}
                style={{ width: "100%", padding: "11px 14px", border: "1px solid var(--line)", borderRadius: "var(--radius)", fontSize: "14.5px", background: "white", color: "var(--ink)", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "13px", background: "var(--ink)", color: "var(--ivory)",
                border: "none", borderRadius: "999px", fontSize: "14px", fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                marginTop: "6px",
              }}
            >
              {loading && <span style={{ width: "14px", height: "14px", border: "2px solid rgba(251,248,243,0.4)", borderTopColor: "var(--ivory)", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />}
              Créer mon compte →
            </button>
            <p style={{ fontSize: "11px", color: "var(--ink-3)", textAlign: "center" }}>
              En créant un compte, vous acceptez nos{" "}
              <Link href="/cgv" style={{ color: "var(--ink-2)", textDecoration: "underline" }}>CGV</Link>{" "}
              et notre{" "}
              <Link href="/confidentialite" style={{ color: "var(--ink-2)", textDecoration: "underline" }}>politique de confidentialité</Link>.
            </p>
          </div>

          <p style={{ fontSize: "13px", color: "var(--ink-3)", marginTop: "28px" }}>
            Déjà un compte ?{" "}
            <Link href="/login" style={{ color: "var(--ink)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
              Se connecter
            </Link>
          </p>
        </div>

        <div style={{
          background: "var(--ink)", display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "60px 56px", position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: "-100px", right: "-100px",
            width: "400px", height: "400px", borderRadius: "50%",
            background: "radial-gradient(circle, oklch(0.42 0.07 155) 0%, transparent 70%)",
            opacity: 0.2,
          }} />
          <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(251,248,243,0.4)", marginBottom: "32px", fontFamily: "Geist Mono, monospace" }}>
            VOTRE ÉQUIPE IA
          </p>
          <blockquote style={{
            fontFamily: "Instrument Serif, serif", fontStyle: "italic",
            fontSize: "30px", lineHeight: 1.25, color: "var(--ivory)",
            marginBottom: "40px", letterSpacing: "-0.01em",
          }}>
            "Votre équipe IA vous attend."
          </blockquote>
          <div style={{ display: "flex", gap: "20px", marginBottom: "48px" }}>
            {AGENTS.map((a) => (
              <div key={a.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  background: a.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--ivory)", fontFamily: "Instrument Serif, serif",
                  fontStyle: "italic", fontSize: "17px",
                }}>{a.initial}</div>
                <span style={{ fontSize: "11px", color: "rgba(251,248,243,0.55)" }}>{a.name}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "32px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "32px" }}>
            {[
              { val: "14j", label: "d'essai gratuit" },
              { val: "0€", label: "carte bancaire" },
              { val: "5min", label: "pour démarrer" },
            ].map((s) => (
              <div key={s.label}>
                <p style={{ fontFamily: "Instrument Serif, serif", fontSize: "28px", color: "var(--ivory)", lineHeight: 1 }}>{s.val}</p>
                <p style={{ fontSize: "11px", color: "rgba(251,248,243,0.4)", marginTop: "4px" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </form>
    </>
  );
}
