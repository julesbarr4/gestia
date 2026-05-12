"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function UpgradeClient({ planActuel, abonnementActif, priceIdEssentiel, priceIdPro }: {
  planActuel: string;
  abonnementActif: boolean;
  priceIdEssentiel: string;
  priceIdPro: string;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [erreur, setErreur] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const succes = searchParams.get("success") === "true";
  const planUpgrade = searchParams.get("plan");
  const canceled = searchParams.get("canceled") === "true";

  const PLANS = [
    {
      id: "starter",
      nom: "Gratuit",
      prix: 0,
      cible: "Pour découvrir Gestia",
      features: [
        "5 devis générés par Inès",
        "5 factures générées par Inès",
        "Export PDF professionnel",
        "Factur-X conforme RFE 2026",
        "Accès au dashboard",
      ],
      priceId: null,
      highlighted: false,
    },
    {
      id: "essentiel",
      nom: "Essentiel",
      prix: 19,
      cible: "Artisans & commerçants",
      features: [
        "Devis & factures illimités",
        "Inès (Admin) · Léa (Support)",
        "Hugo (CFO) — rapport hebdo",
        "Export PDF + Factur-X",
        "Relances automatiques 3 niveaux",
        "Modèles de devis",
      ],
      priceId: priceIdEssentiel || null,
      highlighted: true,
    },
    {
      id: "pro",
      nom: "Pro",
      prix: 39,
      cible: "TPE 2 à 10 salariés",
      features: [
        "Tout l'Essentiel",
        "Cyprien (CMO) — contenu marketing",
        "Augustin (CEO) — analyse stratégique",
        "Support prioritaire",
        "Accès API (bientôt)",
      ],
      priceId: priceIdPro || null,
      highlighted: false,
    },
  ];

  async function choisirPlan(plan: typeof PLANS[0]) {
    if (!plan.priceId) {
      setErreur(`Price ID manquant pour le plan ${plan.nom}. Vérifiez vos variables d'environnement.`);
      return;
    }
    if (plan.id === planActuel) return;

    setLoading(plan.id);
    setErreur("");

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: plan.priceId, plan: plan.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErreur(`Erreur ${res.status} : ${data.erreur || JSON.stringify(data)}`);
        setLoading(null);
        return;
      }

      if (!data.url) {
        setErreur("Aucune URL de redirection reçue de Stripe.");
        setLoading(null);
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      setErreur(`Erreur réseau : ${err instanceof Error ? err.message : String(err)}`);
      setLoading(null);
    }
  }

  async function gererAbonnement() {
    setLoading("portal");
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (res.ok) window.location.href = data.url;
    else setErreur(data.erreur || "Erreur");
    setLoading(null);
  }

  const ey: React.CSSProperties = {
    fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.16em",
    color: "var(--ink-3)", fontFamily: "Geist Mono, monospace",
  };

  if (succes) {
    return (
      <div style={{ maxWidth: "560px", textAlign: "center", margin: "0 auto", padding: "60px 0" }}>
        <div style={{
          width: "64px", height: "64px", borderRadius: "50%",
          background: "color-mix(in oklch, var(--accent) 12%, transparent)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px",
          fontSize: "28px",
        }}>
          ✓
        </div>
        <p style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace", marginBottom: "12px" }}>
          ABONNEMENT ACTIVÉ
        </p>
        <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "36px", color: "var(--ink)", lineHeight: 1.06, marginBottom: "12px" }}>
          Bienvenue sur le plan <em>{planUpgrade === "pro" ? "Pro" : "Essentiel"} !</em>
        </h1>
        <p style={{ fontSize: "15px", color: "var(--ink-2)", marginBottom: "32px", lineHeight: 1.6 }}>
          Votre abonnement est actif. Tous vos agents IA sont maintenant disponibles.
        </p>
        <a href="/dashboard" style={{
          display: "inline-block",
          background: "var(--ink)", color: "var(--ivory)",
          borderRadius: "999px", padding: "12px 28px",
          fontSize: "14px", fontWeight: 500, textDecoration: "none",
        }}>
          Accéder au dashboard →
        </a>
        <p style={{ fontSize: "12px", color: "var(--ink-3)", marginTop: "16px" }}>
          Une confirmation vous a été envoyée par email.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px" }}>

      {canceled && (
        <div style={{
          background: "var(--ivory-2)", border: "1px solid var(--line)",
          borderRadius: "12px", padding: "12px 16px", marginBottom: "20px",
        }}>
          <p style={{ fontSize: "13px", color: "var(--ink-2)" }}>
            Paiement annulé. Vous pouvez réessayer quand vous voulez.
          </p>
        </div>
      )}

      <div style={{ marginBottom: "36px" }}>
        <p style={ey}>ABONNEMENT</p>
        <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "38px", color: "var(--ink)", lineHeight: 1.06, marginTop: "6px" }}>
          Choisissez votre <em>plan.</em>
        </h1>
        <p style={{ fontSize: "14px", color: "var(--ink-2)", marginTop: "8px" }}>
          Plan actuel :{" "}
          <span style={{ fontWeight: 500, color: "var(--ink)", textTransform: "capitalize" }}>{planActuel}</span>
          {abonnementActif && (
            <span style={{ marginLeft: "8px", fontSize: "11px", background: "color-mix(in oklch, var(--accent) 12%, transparent)", color: "var(--accent)", padding: "2px 8px", borderRadius: "999px", fontFamily: "Geist Mono, monospace" }}>
              Actif ✓
            </span>
          )}
        </p>
      </div>

      {erreur && (
        <div style={{ background: "#FEF2F2", color: "#991B1B", fontSize: "13px", padding: "12px 16px", borderRadius: "12px", border: "1px solid #FECACA", marginBottom: "20px" }}>
          {erreur}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {PLANS.map((plan) => {
          const estActuel = plan.id === planActuel;
          const estHighlighted = plan.highlighted;

          return (
            <div key={plan.id} style={{
              background: estHighlighted ? "var(--ink)" : "white",
              border: estHighlighted ? "none" : "1px solid var(--line)",
              borderRadius: "16px", padding: "28px",
              display: "flex", flexDirection: "column", gap: "16px",
              position: "relative",
            }}>
              {estHighlighted && (
                <span style={{
                  position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
                  fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em",
                  background: "var(--accent)", color: "var(--ivory)",
                  padding: "4px 14px", borderRadius: "999px",
                  fontFamily: "Geist Mono, monospace", whiteSpace: "nowrap",
                }}>
                  Le plus populaire
                </span>
              )}

              <div>
                <p style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.14em", color: estHighlighted ? "rgba(251,248,243,0.5)" : "var(--ink-3)", fontFamily: "Geist Mono, monospace", marginBottom: "6px" }}>
                  {plan.cible}
                </p>
                <p style={{ fontFamily: "Instrument Serif, serif", fontSize: "22px", color: estHighlighted ? "var(--ivory)" : "var(--ink)" }}>
                  {plan.nom}
                </p>
              </div>

              <div>
                <span style={{ fontFamily: "Instrument Serif, serif", fontSize: "42px", color: estHighlighted ? "var(--ivory)" : "var(--ink)", lineHeight: 1 }}>
                  {plan.prix === 0 ? "Gratuit" : `${plan.prix}€`}
                </span>
                {plan.prix > 0 && (
                  <span style={{ fontSize: "13px", color: estHighlighted ? "rgba(251,248,243,0.4)" : "var(--ink-3)", marginLeft: "4px" }}>/mois</span>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: "1px" }}>✓</span>
                    <span style={{ fontSize: "13px", color: estHighlighted ? "rgba(251,248,243,0.8)" : "var(--ink-2)", lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => choisirPlan(plan)}
                disabled={estActuel || loading !== null || plan.priceId === null}
                style={{
                  width: "100%", padding: "12px",
                  background: estActuel
                    ? "rgba(251,248,243,0.1)"
                    : estHighlighted
                    ? "var(--ivory)"
                    : "var(--ink)",
                  color: estActuel
                    ? "rgba(251,248,243,0.4)"
                    : estHighlighted
                    ? "var(--ink)"
                    : "var(--ivory)",
                  border: "none", borderRadius: "999px",
                  fontSize: "13.5px", fontWeight: 500,
                  cursor: estActuel || plan.priceId === null ? "not-allowed" : "pointer",
                  opacity: loading !== null && loading !== plan.id ? 0.5 : 1,
                  transition: "opacity 0.15s",
                }}
              >
                {loading === plan.id
                  ? "Redirection..."
                  : estActuel
                  ? "Plan actuel ✓"
                  : plan.priceId === null
                  ? "Plan gratuit"
                  : `Passer au ${plan.nom} →`}
              </button>
            </div>
          );
        })}
      </div>

      {abonnementActif && (
        <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--ink)" }}>Gérer mon abonnement</p>
            <p style={{ fontSize: "12px", color: "var(--ink-3)", marginTop: "2px" }}>
              Modifier le plan, changer le moyen de paiement, voir les factures Stripe
            </p>
          </div>
          <button
            onClick={gererAbonnement}
            disabled={loading === "portal"}
            style={{ padding: "9px 20px", background: "var(--ivory-2)", border: "1px solid var(--line)", borderRadius: "999px", fontSize: "13px", color: "var(--ink-2)", cursor: "pointer" }}
          >
            {loading === "portal" ? "..." : "Portail Stripe →"}
          </button>
        </div>
      )}

      <div style={{ marginTop: "24px", padding: "16px 20px", background: "var(--ivory-2)", borderRadius: "12px", border: "1px solid var(--line)" }}>
        <p style={{ fontSize: "12px", color: "var(--ink-3)", lineHeight: 1.6 }}>
          🔒 Paiement sécurisé par Stripe · Annulation à tout moment · Facturation mensuelle · Prix HT
        </p>
      </div>
    </div>
  );
}
