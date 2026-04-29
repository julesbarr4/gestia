"use client";

import { useState } from "react";

const ITEMS = [
  {
    q: "Mes données sont-elles en sécurité ?",
    a: "Hébergement souverain en France, chiffrement de bout en bout, conformité RGPD. Vos données ne servent jamais à entraîner les modèles. Vous pouvez les exporter ou les supprimer à tout moment.",
  },
  {
    q: "Les agents IA peuvent-ils faire des erreurs ?",
    a: "Oui — comme un humain. C'est pour ça que vous gardez la validation finale sur les actions sensibles : envois, paiements, communications externes. Pour le reste, ils apprennent de vos corrections.",
  },
  {
    q: "Faut-il un comptable en plus ?",
    a: "Pour la production courante, non — Inès remplace l'essentiel. Pour la clôture annuelle et les déclarations fiscales, oui : un expert-comptable reste recommandé. Gestia s'intègre proprement à son logiciel.",
  },
  {
    q: "Puis-je intégrer mes outils existants ?",
    a: "Oui : banques (Bridge, Powens), email (Gmail, Outlook), Stripe, comptabilité (Pennylane, QuickBooks), Notion, Linear. Plus de 40 intégrations natives.",
  },
  {
    q: "Combien de temps pour être opérationnel ?",
    a: "10 minutes pour l'inscription et la connexion à votre banque. 24h pour qu'Inès comprenne vos modèles de devis et factures. Une semaine pour que toute l'équipe soit calibrée à votre voix.",
  },
  {
    q: "Que se passe-t-il si j'arrête ?",
    a: "Vous récupérez l'intégralité de vos données — clients, factures, historiques — au format ouvert. Aucune rétention, aucune pénalité. Promis.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number>(0);

  return (
    <section className="py-28 px-6">
      <div className="max-w-[920px] mx-auto">
        <div className="max-w-[680px] mx-auto text-center">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-3)] mb-5">
            Questions fréquentes
          </div>
          <h2
            className="font-normal tracking-[-0.02em] text-[var(--ink)] font-serif"
            style={{ fontSize: "clamp(36px, 4.6vw, 60px)", lineHeight: 1.04 }}
          >
            Tout ce que vous vouliez savoir
            <br />
            <em className="italic">sans oser le demander.</em>
          </h2>
        </div>

        <div className="mt-14 border-t border-[var(--line)]">
          {ITEMS.map((item, i) => (
            <div key={i} className="border-b border-[var(--line)]">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex items-center justify-between gap-6 py-6 text-left"
              >
                <span
                  className="text-[18px] tracking-tight text-[var(--ink)] font-serif"
                >
                  {item.q}
                </span>
                <span className="w-8 h-8 rounded-full border border-[var(--line)] flex items-center justify-center text-[var(--ink-2)] shrink-0">
                  {open === i ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-3.5 h-3.5">
                      <path d="M5 12h14" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-3.5 h-3.5">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  )}
                </span>
              </button>
              <div
                className="overflow-hidden transition-[max-height,opacity] duration-300"
                style={{
                  maxHeight: open === i ? 200 : 0,
                  opacity: open === i ? 1 : 0,
                }}
              >
                <p className="text-[15px] text-[var(--ink-2)] leading-[1.6] pb-6 max-w-[680px]">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
