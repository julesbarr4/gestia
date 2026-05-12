"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { GestiaLogo } from "@/app/components/logo";

const ETAPES = ["Compte", "Entreprise", "Plan"];

const TYPES_ACTIVITE = [
  "Artisan", "Commerçant", "Freelance", "Profession libérale",
  "Auto-entrepreneur", "TPE (2-10 salariés)", "Autre",
];

const PLANS = [
  {
    id: "starter",
    nom: "Gratuit",
    prix: 0,
    cible: "Pour découvrir",
    features: ["5 devis avec Inès", "5 factures avec Inès", "Export PDF", "Factur-X RFE 2026"],
    highlighted: false,
  },
  {
    id: "essentiel",
    nom: "Essentiel",
    prix: 19,
    cible: "Artisans & commerçants",
    features: ["Devis & factures illimités", "Inès + Léa + Hugo", "Relances automatiques", "Export PDF + Factur-X"],
    highlighted: true,
  },
  {
    id: "pro",
    nom: "Pro",
    prix: 39,
    cible: "TPE 2-10 salariés",
    features: ["Tout l'Essentiel", "Cyprien (marketing)", "Augustin (stratégie)", "Support prioritaire"],
    highlighted: false,
  },
];

export default function SignupPage({
  priceIdEssentiel = "",
  priceIdPro = "",
}: {
  priceIdEssentiel?: string;
  priceIdPro?: string;
}) {
  const [etape, setEtape] = useState(0);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [nomEntreprise, setNomEntreprise] = useState("");
  const [typeActivite, setTypeActivite] = useState("");
  const [ville, setVille] = useState("");

  const [planChoisi, setPlanChoisi] = useState("starter");

  const supabase = createClient();

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px",
    border: "1px solid var(--line)", borderRadius: "12px",
    fontSize: "14.5px", background: "white",
    color: "var(--ink)", outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "10.5px", textTransform: "uppercase" as const,
    letterSpacing: "0.14em", color: "var(--ink-3)",
    display: "block", marginBottom: "6px",
    fontFamily: "Geist Mono, monospace",
  };

  async function handleEtape1(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErreur("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nom_entreprise: "" },
      },
    });

    if (error) {
      setErreur(
        error.message.includes("already registered")
          ? "Un compte existe déjà avec cet email."
          : error.message
      );
      setLoading(false);
      return;
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      console.warn("Auto-login failed:", loginError.message);
    }

    if (data.user) setUserId(data.user.id);
    setLoading(false);
    setEtape(1);
  }

  async function handleEtape2(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErreur("");

    if (!nomEntreprise.trim()) {
      setErreur("Le nom de votre entreprise est requis.");
      setLoading(false);
      return;
    }

    if (userId) {
      await supabase
        .from("profiles")
        .update({
          nom_entreprise: nomEntreprise.trim(),
          ville: ville || null,
        })
        .eq("id", userId);
    }

    setLoading(false);
    setEtape(2);
  }

  async function handleEtape3(planId: string) {
    setPlanChoisi(planId);
    setLoading(true);
    setErreur("");

    if (userId) {
      await supabase
        .from("profiles")
        .update({
          nom_entreprise: nomEntreprise.trim(),
          ville: ville || null,
        })
        .eq("id", userId);
    }

    if (planId === "starter") {
      setSucces(true);
      setLoading(false);
      return;
    }

    const priceId = planId === "pro" ? priceIdPro : priceIdEssentiel;

    if (!priceId) {
      setErreur("Configuration Stripe manquante.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId, plan: planId }),
    });

    const data = await res.json();

    if (!res.ok || !data.url) {
      setErreur(data.erreur || "Erreur lors de la redirection vers le paiement.");
      setLoading(false);
      return;
    }

    window.location.href = data.url;
  }

  if (succes) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--ivory)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
        <div style={{ textAlign: "center", maxWidth: "460px" }}>
          <Link href="/" style={{ display: "inline-flex", marginBottom: "32px" }}>
            <GestiaLogo sizeSceau={36} sizeTexte={18} fondClair={true} />
          </Link>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "color-mix(in oklch, var(--accent) 12%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "24px" }}>
            ✓
          </div>
          <p style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace", marginBottom: "10px" }}>
            COMPTE CRÉÉ
          </p>
          <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "36px", color: "var(--ink)", marginBottom: "12px", lineHeight: 1.1 }}>
            Bienvenue sur <em>Gestia !</em>
          </h1>
          <p style={{ fontSize: "15px", color: "var(--ink-2)", lineHeight: 1.6, marginBottom: "28px" }}>
            Votre compte est prêt. Commencez à générer vos premiers devis avec Inès.
          </p>
          <a href="/dashboard" style={{
            display: "inline-block",
            background: "var(--ink)", color: "var(--ivory)",
            borderRadius: "999px", padding: "12px 28px",
            fontSize: "14px", fontWeight: 500, textDecoration: "none",
          }}>
            Accéder à mon espace →
          </a>
          <p style={{ fontSize: "12px", color: "var(--ink-3)", marginTop: "16px" }}>
            Vous pourrez upgrader votre plan à tout moment depuis votre espace.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", minHeight: "100vh" }}>

        <div style={{ background: "var(--ivory)", display: "flex", flexDirection: "column", padding: "40px 64px", minHeight: "100vh" }}>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "48px" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <GestiaLogo sizeSceau={30} sizeTexte={16} fondClair={true} />
            </Link>
            <p style={{ fontSize: "12px", color: "var(--ink-3)" }}>
              Déjà un compte ?{" "}
              <Link href="/login" style={{ color: "var(--ink)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                Connexion
              </Link>
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "36px" }}>
            {ETAPES.map((label, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  opacity: i > etape ? 0.4 : 1,
                }}>
                  <div style={{
                    width: "22px", height: "22px", borderRadius: "50%",
                    background: i < etape ? "var(--accent)" : i === etape ? "var(--ink)" : "var(--line)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "10px", color: i < etape ? "var(--ivory)" : i === etape ? "var(--ivory)" : "var(--ink-3)",
                    fontFamily: "Geist Mono, monospace", fontWeight: 500,
                    flexShrink: 0,
                  }}>
                    {i < etape ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize: "12px", color: i === etape ? "var(--ink)" : "var(--ink-3)", fontWeight: i === etape ? 500 : 400 }}>
                    {label}
                  </span>
                </div>
                {i < ETAPES.length - 1 && (
                  <div style={{ width: "24px", height: "1px", background: "var(--line)" }} />
                )}
              </div>
            ))}
          </div>

          {etape === 0 && (
            <form onSubmit={handleEtape1} style={{ maxWidth: "400px" }}>
              <p style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", marginBottom: "8px", fontFamily: "Geist Mono, monospace" }}>
                ÉTAPE 1
              </p>
              <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "38px", lineHeight: 1.06, color: "var(--ink)", marginBottom: "28px" }}>
                Créez votre <em>compte.</em>
              </h1>

              {erreur && (
                <div style={{ background: "#FEF2F2", color: "#991B1B", fontSize: "13px", padding: "10px 14px", borderRadius: "10px", border: "1px solid #FECACA", marginBottom: "16px" }}>
                  {erreur}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={labelStyle}>Email professionnel</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.fr" required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Mot de passe</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8 caractères minimum" required minLength={8} style={inputStyle} />
                </div>
                <button type="submit" disabled={loading} style={{ width: "100%", padding: "13px", background: "var(--ink)", color: "var(--ivory)", border: "none", borderRadius: "999px", fontSize: "14px", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "6px" }}>
                  {loading && <span style={{ width: "14px", height: "14px", border: "2px solid rgba(251,248,243,0.4)", borderTopColor: "var(--ivory)", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />}
                  Continuer →
                </button>
                <p style={{ fontSize: "11px", color: "var(--ink-3)", textAlign: "center" }}>
                  En créant un compte, vous acceptez nos{" "}
                  <Link href="/cgv" style={{ color: "var(--ink-2)", textDecoration: "underline" }}>CGV</Link>
                </p>
              </div>
            </form>
          )}

          {etape === 1 && (
            <form onSubmit={handleEtape2} style={{ maxWidth: "400px" }}>
              <p style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", marginBottom: "8px", fontFamily: "Geist Mono, monospace" }}>
                ÉTAPE 2
              </p>
              <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "38px", lineHeight: 1.06, color: "var(--ink)", marginBottom: "6px" }}>
                Votre <em>entreprise.</em>
              </h1>
              <p style={{ fontSize: "14px", color: "var(--ink-2)", marginBottom: "28px" }}>
                Ces informations apparaîtront sur vos devis et factures.
              </p>

              {erreur && (
                <div style={{ background: "#FEF2F2", color: "#991B1B", fontSize: "13px", padding: "10px 14px", borderRadius: "10px", border: "1px solid #FECACA", marginBottom: "16px" }}>
                  {erreur}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={labelStyle}>Nom de l'entreprise *</label>
                  <input type="text" value={nomEntreprise} onChange={(e) => setNomEntreprise(e.target.value)} placeholder="Boulangerie Martin, Dupont Plomberie..." required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Type d'activité</label>
                  <select value={typeActivite} onChange={(e) => setTypeActivite(e.target.value)} style={inputStyle}>
                    <option value="">Sélectionnez...</option>
                    {TYPES_ACTIVITE.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Ville</label>
                  <input type="text" value={ville} onChange={(e) => setVille(e.target.value)} placeholder="Paris, Lyon, Marseille..." style={inputStyle} />
                </div>
                <button type="submit" disabled={loading} style={{ width: "100%", padding: "13px", background: "var(--ink)", color: "var(--ivory)", border: "none", borderRadius: "999px", fontSize: "14px", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, marginTop: "6px" }}>
                  {loading ? "Enregistrement..." : "Continuer →"}
                </button>
              </div>
            </form>
          )}

          {etape === 2 && (
            <div style={{ maxWidth: "520px" }}>
              <p style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", marginBottom: "8px", fontFamily: "Geist Mono, monospace" }}>
                ÉTAPE 3
              </p>
              <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "38px", lineHeight: 1.06, color: "var(--ink)", marginBottom: "6px" }}>
                Choisissez votre <em>plan.</em>
              </h1>
              <p style={{ fontSize: "14px", color: "var(--ink-2)", marginBottom: "28px" }}>
                Commencez gratuitement, sans carte bancaire. Changez de plan à tout moment.
              </p>

              {erreur && (
                <div style={{ background: "#FEF2F2", color: "#991B1B", fontSize: "13px", padding: "10px 14px", borderRadius: "10px", border: "1px solid #FECACA", marginBottom: "16px" }}>
                  {erreur}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {PLANS.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => handleEtape3(plan.id)}
                    disabled={loading}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "16px 20px",
                      background: plan.highlighted ? "var(--ink)" : "white",
                      border: plan.highlighted ? "none" : "1px solid var(--line)",
                      borderRadius: "14px", cursor: loading ? "not-allowed" : "pointer",
                      textAlign: "left" as const, opacity: loading ? 0.6 : 1,
                      position: "relative",
                      transition: "transform 0.1s",
                    }}
                  >
                    {plan.highlighted && (
                      <span style={{ position: "absolute", top: "-10px", left: "20px", fontSize: "9.5px", textTransform: "uppercase", letterSpacing: "0.12em", background: "var(--accent)", color: "var(--ivory)", padding: "2px 10px", borderRadius: "999px", fontFamily: "Geist Mono, monospace" }}>
                        Recommandé
                      </span>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "6px" }}>
                        <span style={{ fontFamily: "Instrument Serif, serif", fontSize: "20px", color: plan.highlighted ? "var(--ivory)" : "var(--ink)" }}>
                          {plan.nom}
                        </span>
                        <span style={{ fontSize: "13px", color: plan.highlighted ? "rgba(251,248,243,0.5)" : "var(--ink-3)" }}>
                          {plan.prix === 0 ? "Gratuit" : `${plan.prix}€/mois`}
                        </span>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {plan.features.map((f) => (
                          <span key={f} style={{ fontSize: "11px", color: plan.highlighted ? "rgba(251,248,243,0.65)" : "var(--ink-3)" }}>
                            ✓ {f}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span style={{ fontSize: "18px", color: plan.highlighted ? "rgba(251,248,243,0.6)" : "var(--ink-3)", flexShrink: 0, marginLeft: "16px" }}>
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ background: "var(--ink)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 56px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, oklch(0.42 0.07 155) 0%, transparent 70%)", opacity: 0.2 }} />

          {etape === 0 && (
            <>
              <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(251,248,243,0.4)", marginBottom: "24px", fontFamily: "Geist Mono, monospace" }}>VOTRE ÉQUIPE IA</p>
              <blockquote style={{ fontFamily: "Instrument Serif, serif", fontStyle: "italic", fontSize: "28px", lineHeight: 1.25, color: "var(--ivory)", marginBottom: "36px", letterSpacing: "-0.01em" }}>
                "Votre équipe IA vous attend."
              </blockquote>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {[
                  { initial: "I", name: "Inès", color: "#2563eb" },
                  { initial: "L", name: "Léa", color: "#059669" },
                  { initial: "H", name: "Hugo", color: "#7c3aed" },
                  { initial: "C", name: "Cyprien", color: "#ea580c" },
                  { initial: "A", name: "Augustin", color: "#111827", border: "1px solid rgba(255,255,255,0.2)" },
                ].map((a) => (
                  <div key={a.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: a.color, border: a.border, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "Instrument Serif, serif", fontStyle: "italic", fontSize: "20px" }}>
                      {a.initial}
                    </div>
                    <span style={{ fontSize: "11px", color: "rgba(251,248,243,0.5)" }}>{a.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {etape === 1 && (
            <>
              <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(251,248,243,0.4)", marginBottom: "24px", fontFamily: "Geist Mono, monospace" }}>POURQUOI C'EST IMPORTANT</p>
              <blockquote style={{ fontFamily: "Instrument Serif, serif", fontStyle: "italic", fontSize: "28px", lineHeight: 1.25, color: "var(--ivory)", marginBottom: "24px" }}>
                "Inès connaît votre entreprise par cœur."
              </blockquote>
              <p style={{ fontSize: "14px", color: "rgba(251,248,243,0.55)", lineHeight: 1.6 }}>
                Ces informations permettent à Inès de générer des devis et factures avec les bonnes mentions légales, au bon nom, avec la bonne mise en page.
              </p>
            </>
          )}

          {etape === 2 && (
            <>
              <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(251,248,243,0.4)", marginBottom: "24px", fontFamily: "Geist Mono, monospace" }}>SANS ENGAGEMENT</p>
              <blockquote style={{ fontFamily: "Instrument Serif, serif", fontStyle: "italic", fontSize: "28px", lineHeight: 1.25, color: "var(--ivory)", marginBottom: "24px" }}>
                "Commencez gratuitement.<br/>Upgradez quand vous êtes prêt."
              </blockquote>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {["Résiliable à tout moment", "Pas de carte bancaire pour le gratuit", "Données hébergées en France", "Conforme RGPD"].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ color: "oklch(0.42 0.07 155)", flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: "13.5px", color: "rgba(251,248,243,0.7)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
