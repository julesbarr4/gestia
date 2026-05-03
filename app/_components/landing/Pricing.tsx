import Link from "next/link";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Gratuit",
    cible: "Pour découvrir Gestia",
    monthly: 0,
    features: [
      "5 devis générés par Inès",
      "5 factures générées par Inès",
      "Export PDF professionnel",
      "Accès au dashboard",
    ],
    cta: "Commencer gratuitement",
    featured: false,
  },
  {
    name: "Essentiel",
    cible: "Artisans & commerçants",
    monthly: 19,
    features: [
      "Devis & factures illimités",
      "Inès (Admin) · Léa (Support)",
      "Hugo (CFO) — rapport hebdo",
      "Export PDF professionnel",
      "Relances automatiques 3 niveaux",
    ],
    cta: "Démarrer — 14 jours gratuits",
    featured: true,
  },
  {
    name: "Pro",
    cible: "TPE 2 à 10 salariés",
    monthly: 39,
    features: [
      "Tout l'Essentiel",
      "Cyprien (CMO) — contenu marketing",
      "Augustin (CEO) — analyse stratégique",
      "Support prioritaire",
      "Accès API (bientôt)",
    ],
    cta: "Démarrer le Pro",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="tarifs" className="py-28 px-6 bg-[var(--ivory)]">
      <div className="max-w-[1240px] mx-auto">
        <div className="text-center max-w-[680px] mx-auto">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-3)] mb-5">Tarifs</div>
          <h2
            className="font-normal tracking-[-0.02em] text-[var(--ink)] mb-5 font-serif"
            style={{ fontSize: "clamp(36px, 4.6vw, 60px)", lineHeight: 1.04 }}
          >
            Le prix d&apos;un stagiaire.
            <br />
            <em className="italic text-[var(--accent)]">Le travail d&apos;un cabinet.</em>
          </h2>
          <p className="text-[16.5px] text-[var(--ink-2)] leading-[1.55]">
            Pas d&apos;engagement, pas de mauvaise surprise. Vous résiliez quand vous voulez.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mt-14">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "rounded-2xl p-7 flex flex-col relative",
                plan.featured
                  ? "bg-[var(--ink)] text-[var(--ivory)]"
                  : "bg-white border border-[var(--line)]"
              )}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10.5px] uppercase tracking-[0.18em] bg-[var(--accent)] text-[var(--ivory)] px-3 py-1 rounded-full">
                  Recommandé
                </span>
              )}

              <div
                className="text-[12px] uppercase tracking-[0.16em] mb-1.5"
                style={{ color: plan.featured ? "rgba(251,248,243,0.55)" : "var(--ink-3)" }}
              >
                {plan.cible}
              </div>

              <div className="text-[26px] mb-6 font-serif">{plan.name}</div>

              <div className="flex items-baseline gap-1.5 mb-6">
                {plan.monthly === 0 ? (
                  <span
                    className="font-mono text-[44px] tracking-tight"
                    style={{ fontFeatureSettings: '"tnum"' }}
                  >
                    Gratuit
                  </span>
                ) : (
                  <>
                    <span
                      className="font-mono text-[44px] tracking-tight"
                      style={{ fontFeatureSettings: '"tnum"' }}
                    >
                      {plan.monthly}€
                    </span>
                    <span
                      className="text-[13px]"
                      style={{ color: plan.featured ? "rgba(251,248,243,0.55)" : "var(--ink-3)" }}
                    >
                      /mois
                    </span>
                  </>
                )}
              </div>

              <ul className="space-y-2.5 mb-7 flex-1">
                {plan.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-[14px]"
                    style={{ color: plan.featured ? "rgba(251,248,243,0.85)" : "var(--ink)" }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 mt-0.5 shrink-0 text-[var(--accent)]"
                    >
                      <path d="M4 12l5 5 11-11" />
                    </svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={cn(
                  "block text-center py-3 rounded-full font-medium text-[14px] transition-colors",
                  plan.featured
                    ? "bg-[var(--ivory)] text-[var(--ink)] hover:bg-[var(--accent)] hover:text-[var(--ivory)]"
                    : "bg-[var(--ink)] text-[var(--ivory)] hover:bg-[var(--accent)]"
                )}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-[13px] text-[var(--ink-3)]">
          Tous les prix s&apos;entendent HT · Paiement sécurisé · TVA appliquée selon votre pays
        </p>
      </div>
    </section>
  );
}
