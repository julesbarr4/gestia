"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const AGENTS = [
  {
    initial: "I",
    name: "Inès",
    role: "Assistante administrative",
    color: "#2563eb",
    desc: "12 ans en cabinet d'expertise comptable. Maîtrise toutes les normes françaises : TVA, mentions légales, facturation électronique 2026.",
    skills: ["Devis en 30 secondes", "Factures conformes", "Relances avec 3 niveaux de ton"],
  },
  {
    initial: "L",
    name: "Léa",
    role: "Responsable service client",
    color: "#059669",
    desc: "8 ans en customer success. A géré plus de 50 000 tickets clients et sait désescalader même les situations les plus tendues.",
    skills: ["Analyse des emails entrants", "Réponses empathiques", "Adaptation du ton"],
  },
  {
    initial: "H",
    name: "Hugo",
    role: "Directeur financier",
    color: "#7c3aed",
    desc: "15 ans en direction financière PME. Reconnaît un problème de trésorerie ou un client toxique en 30 secondes de lecture.",
    skills: ["Analyse CA, impayés, devis", "Points forts et tensions", "3 actions concrètes / semaine"],
  },
  {
    initial: "C",
    name: "Cyprien",
    role: "Directeur marketing",
    color: "#ea580c",
    desc: "10 ans en content marketing, plus de 5 000 posts produits pour des marques TPE/PME. Maîtrise les algorithmes des réseaux français.",
    skills: ["Posts LinkedIn, Instagram, Facebook", "Newsletters prêtes à envoyer", "Ton adapté par plateforme"],
  },
  {
    initial: "A",
    name: "Augustin",
    role: "Directeur général",
    color: "#111827",
    desc: "20 ans d'accompagnement de dirigeants. Ancien consultant en stratégie, voit plus loin que les chiffres de la semaine.",
    skills: ["Diagnostic stratégique STAR", "Tensions structurelles", "3 axes prioritaires sur 90 jours"],
  },
];

function AgentCard({ agent }: { agent: (typeof AGENTS)[number] }) {
  return (
    <div className="rounded-2xl bg-[var(--ink)] text-[var(--ivory)] p-7 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-20 pointer-events-none"
        style={{ background: agent.color }}
      />
      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <span
            className="w-14 h-14 rounded-full text-white text-[22px] flex items-center justify-center font-serif"
            style={{ background: agent.color }}
          >
            {agent.initial}
          </span>
          <div>
            <div className="text-[20px] font-serif">{agent.name}</div>
            <div className="text-[12.5px] uppercase tracking-[0.16em] text-[var(--ivory)]/55">
              {agent.role}
            </div>
          </div>
        </div>

        <p className="text-[14px] leading-[1.55] text-[var(--ivory)]/85 mb-6">{agent.desc}</p>

        <div className="space-y-2 mb-6">
          <div className="text-[10.5px] uppercase tracking-[0.18em] text-[var(--ivory)]/40 mb-2">
            Compétences clés
          </div>
          {agent.skills.map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-[13px] text-[var(--ivory)]/85">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0" style={{ color: agent.color }}>
                <path d="M4 12l5 5 11-11" />
              </svg>
              {s}
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-5">
          <div className="text-[10.5px] uppercase tracking-[0.18em] text-[var(--ivory)]/40 mb-2">
            Cette semaine
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { k: "Tâches", v: "47" },
              { k: "Temps", v: "5h12" },
              { k: "Économies", v: "1 240€" },
            ].map((s, i) => (
              <div key={i}>
                <div className="font-mono text-[18px]" style={{ fontFeatureSettings: '"tnum"' }}>
                  {s.v}
                </div>
                <div className="text-[10.5px] text-[var(--ivory)]/40 uppercase tracking-[0.14em] mt-0.5">
                  {s.k}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TeamSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="equipe" className="py-28 px-6 bg-[var(--ivory)]">
      <div className="max-w-[1240px] mx-auto">
        <div className="max-w-[680px]">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-3)] mb-5">
            L&apos;équipe Gestia
          </div>
          <h2
            className="font-normal tracking-[-0.02em] text-[var(--ink)] mb-5 font-serif"
            style={{ fontSize: "clamp(36px, 4.6vw, 60px)", lineHeight: 1.04 }}
          >
            Cinq spécialistes.
            <br />
            <em className="italic text-[var(--accent)]">Un seul abonnement.</em>
          </h2>
          <p className="text-[16.5px] text-[var(--ink-2)] leading-[1.55]">
            5 experts IA qui travaillent 24/7 pour gérer votre administratif, vos finances, vos
            clients et votre stratégie. L&apos;équivalent d&apos;un cabinet complet, pour 99€/mois.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 mt-16 items-start">
          {/* liste gauche */}
          <div className="border-t border-[var(--line)]">
            {AGENTS.map((agent, i) => (
              <button
                key={i}
                onMouseEnter={() => setActiveIndex(i)}
                onFocus={() => setActiveIndex(i)}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "w-full text-left grid grid-cols-[auto_1fr_auto] items-center gap-5 py-5 border-b border-[var(--line)] transition-opacity group",
                  activeIndex === i ? "opacity-100" : "opacity-60 hover:opacity-100"
                )}
              >
                <span
                  className="w-12 h-12 rounded-full text-white text-[18px] flex items-center justify-center shrink-0 font-serif"
                  style={{ background: agent.color }}
                >
                  {agent.initial}
                </span>
                <span>
                  <span className="block text-[18px] tracking-tight text-[var(--ink)] font-serif">
                    {agent.name}
                    <span className="text-[var(--ink-3)] italic"> · {agent.role}</span>
                  </span>
                  <span className="block text-[13.5px] text-[var(--ink-2)] mt-0.5 leading-snug">
                    {agent.desc}
                  </span>
                </span>
                <span className="text-[var(--ink-3)] group-hover:text-[var(--ink)] transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </button>
            ))}
          </div>

          {/* carte droite sticky */}
          <div className="lg:sticky lg:top-24">
            <AgentCard agent={AGENTS[activeIndex]} />
          </div>
        </div>
      </div>
    </section>
  );
}
