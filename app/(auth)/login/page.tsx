"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErreur("");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        setErreur("Votre email n'est pas encore confirmé. Vérifiez votre boîte mail.");
      } else if (error.message.includes("Invalid login credentials")) {
        setErreur("Email ou mot de passe incorrect.");
      } else {
        setErreur(error.message);
      }
      setLoading(false);
      return;
    }

    if (!data.user) {
      setErreur("Connexion impossible. Réessayez.");
      setLoading(false);
      return;
    }

    router.refresh();
    setTimeout(() => {
      router.push("/dashboard");
    }, 100);
  }

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <form onSubmit={handleLogin} style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", minHeight: "100vh" }}>
        <div style={{ background: "var(--ivory)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 64px", minHeight: "100vh" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", marginBottom: "56px" }}>
            <div style={{ width: "28px", height: "28px", background: "var(--ink)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ivory)", fontFamily: "Instrument Serif, serif", fontStyle: "italic", fontSize: "16px" }}>g</div>
            <span style={{ fontFamily: "Instrument Serif, serif", fontSize: "17px", color: "var(--ink)", letterSpacing: "-0.02em" }}>Gestia</span>
          </Link>

          <p style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--ink-3)", marginBottom: "12px", fontFamily: "Geist Mono, monospace" }}>ESPACE CLIENT</p>
          <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "42px", lineHeight: 1.04, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: "8px" }}>
            Bon retour<br /><em>parmi nous.</em>
          </h1>
          <p style={{ fontSize: "15px", color: "var(--ink-2)", marginBottom: "40px", lineHeight: 1.55 }}>
            Connectez-vous à votre espace Gestia.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "380px" }}>
            {erreur && (
              <div style={{ background: "#FEF2F2", color: "#991B1B", fontSize: "13px", padding: "10px 14px", borderRadius: "10px", border: "1px solid #FECACA" }}>
                {erreur}
              </div>
            )}
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
                placeholder="••••••••"
                required
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
              Se connecter →
            </button>
          </div>

          <p style={{ fontSize: "13px", color: "var(--ink-3)", marginTop: "28px" }}>
            Pas encore de compte ?{" "}
            <Link href="/signup" style={{ color: "var(--ink)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
              Créer un compte gratuit
            </Link>
          </p>

          <p style={{ fontSize: "11px", color: "var(--ink-3)", marginTop: "40px", fontFamily: "Geist Mono, monospace" }}>
            © 2026 Gestia · JMB Trading · Connexion chiffrée ·{" "}
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "5px", height: "5px", background: "var(--accent)", borderRadius: "50%", display: "inline-block" }} />
              Données hébergées en France
            </span>
          </p>
        </div>

        <div style={{
          background: "var(--ink)", display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "60px 56px", position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: "-100px", left: "-100px",
            width: "400px", height: "400px", borderRadius: "50%",
            background: "radial-gradient(circle, oklch(0.42 0.07 155) 0%, transparent 70%)",
            opacity: 0.25,
          }} />
          <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(251,248,243,0.4)", marginBottom: "32px", fontFamily: "Geist Mono, monospace" }}>
            PORTAIL GESTIA
          </p>
          <blockquote style={{
            fontFamily: "Instrument Serif, serif", fontStyle: "italic",
            fontSize: "32px", lineHeight: 1.2, color: "var(--ivory)",
            marginBottom: "40px", letterSpacing: "-0.01em",
          }}>
            "J'économise 5h par semaine sur mon admin. Inès gère tout."
          </blockquote>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "56px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              background: "oklch(0.42 0.07 155)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--ivory)", fontFamily: "Instrument Serif, serif",
              fontStyle: "italic", fontSize: "18px",
            }}>S</div>
            <div>
              <p style={{ fontSize: "14px", color: "var(--ivory)", fontWeight: 500 }}>Sophie M.</p>
              <p style={{ fontSize: "12px", color: "rgba(251,248,243,0.5)", fontStyle: "italic" }}>Graphiste freelance</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "32px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "32px" }}>
            {[
              { val: "5h", label: "économisées / semaine" },
              { val: "500+", label: "entrepreneurs actifs" },
              { val: "98%", label: "de satisfaction" },
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
