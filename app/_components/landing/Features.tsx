import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

function SectionHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
}) {
  return (
    <div className="max-w-[680px]">
      <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-3)] mb-5">{eyebrow}</div>
      <h2
        className="font-normal tracking-[-0.02em] text-[var(--ink)] mb-5 font-serif"
        style={{ fontSize: "clamp(36px, 4.6vw, 60px)", lineHeight: 1.04 }}
      >
        {title}
      </h2>
      {intro && <p className="text-[16.5px] text-[var(--ink-2)] leading-[1.55]">{intro}</p>}
    </div>
  );
}

function FeatureCard({
  className,
  tag,
  title,
  body,
  visual,
  compact,
}: {
  className?: string;
  tag: string;
  title: string;
  body: string;
  visual: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={cn("rounded-2xl bg-white border border-[var(--line)] overflow-hidden flex flex-col", className)}>
      <div className={cn("p-7 pb-5 flex-1", compact && "p-6 pb-4")}>
        <div className="text-[10.5px] uppercase tracking-[0.18em] text-[var(--accent)] mb-3">{tag}</div>
        <h3
          className="text-[var(--ink)] font-normal tracking-[-0.015em] mb-3 font-serif"
          style={{ fontSize: compact ? "26px" : "30px", lineHeight: 1.1 }}
        >
          {title}
        </h3>
        <p className="text-[14.5px] text-[var(--ink-2)] leading-[1.55] max-w-[460px]">{body}</p>
      </div>
      <div className={cn("relative px-7 pb-7", compact && "px-6 pb-6")}>{visual}</div>
    </div>
  );
}

function InvoiceVisual() {
  return (
    <div className="relative h-[300px]">
      <div className="absolute top-0 left-0 right-0 bg-[var(--ivory-2)] border border-[var(--line)] rounded-xl p-3 flex items-center gap-2.5">
        <span
          className="w-6 h-6 rounded-full bg-[#2563eb] text-white text-[10px] flex items-center justify-center font-serif"
        >
          I
        </span>
        <div className="text-[12.5px] text-[var(--ink-2)] flex-1 truncate">
          Devis pour Atelier Mira · refonte identité visuelle · 5 200 €
        </div>
        <span className="text-[10.5px] font-mono text-[var(--accent)] flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" /> 28s
        </span>
      </div>
      <div className="absolute top-[60px] left-4 right-4 bottom-0 bg-white border border-[var(--line)] rounded-t-lg p-5 shadow-[0_-2px_24px_-12px_rgba(14,14,14,0.12)]">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.16em] text-[var(--ink-3)]">Devis</div>
            <div className="font-mono text-[12px] text-[var(--ink)] mt-0.5">DV-2026-0418</div>
          </div>
          <Logo size={20} />
        </div>
        <div className="space-y-1.5 mb-4">
          <div className="h-2 bg-[var(--line)] rounded w-3/4" />
          <div className="h-2 bg-[var(--line)] rounded w-1/2" />
        </div>
        <div className="space-y-1.5">
          {(["Audit de l'existant", "Direction artistique", "Charte graphique complète", "Déclinaisons print & digital"] as const).map((l, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto_auto] gap-3 items-center text-[11.5px] py-1 border-b border-[var(--line)]">
              <span className="text-[var(--ink)]">{l}</span>
              <span className="font-mono text-[var(--ink-3)]">1</span>
              <span className="font-mono text-[var(--ink)]">
                {[800, 1400, 1800, 1200][i].toLocaleString("fr-FR")} €
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t-2 border-[var(--ink)]">
          <span className="text-[12px] text-[var(--ink-2)]">Total HT</span>
          <span className="font-mono text-[15px] text-[var(--ink)]">5 200,00 €</span>
        </div>
      </div>
    </div>
  );
}

function EmailVisual() {
  const items = [
    { from: "Camille L.", subject: "Question sur le délai", state: "Léa répond…", live: true },
    { from: "Atelier Mira", subject: "Validation du devis", state: "Répondu · 11h02", live: false },
    { from: "Studio Hêtre", subject: "Facture #428", state: "Escaladé à vous", live: false },
  ];
  return (
    <div className="bg-[var(--ivory-2)] rounded-xl border border-[var(--line)] divide-y divide-[var(--line)]">
      {items.map((m, i) => (
        <div key={i} className="px-3.5 py-2.5 grid grid-cols-[auto_1fr_auto] items-center gap-3">
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: i === 0 ? "var(--accent)" : "var(--ink-3)",
              opacity: i === 0 ? 1 : 0.3,
            }}
          />
          <div className="min-w-0">
            <div className="text-[12.5px] text-[var(--ink)] font-medium truncate">{m.from}</div>
            <div className="text-[11.5px] text-[var(--ink-3)] truncate">{m.subject}</div>
          </div>
          <div className={cn("text-[10.5px] font-mono", m.live ? "text-[var(--accent)]" : "text-[var(--ink-3)]")}>
            {m.live && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent)] mr-1 animate-pulse" />
            )}
            {m.state}
          </div>
        </div>
      ))}
    </div>
  );
}

function ReportVisual() {
  const bars = [40, 55, 48, 70, 64, 88, 96];
  const days = ["L", "M", "M", "J", "V", "S", "D"];
  return (
    <div className="bg-[var(--ivory-2)] rounded-xl border border-[var(--line)] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10.5px] uppercase tracking-[0.16em] text-[var(--ink-3)]">Semaine 18 · 2026</div>
        <div className="text-[10.5px] font-mono text-[var(--accent)]">▲ 12,4%</div>
      </div>
      <div className="grid grid-cols-7 gap-1.5 h-[60px] items-end">
        {bars.map((h, i) => (
          <div
            key={i}
            className="rounded-sm flex-1"
            style={{
              height: `${h}%`,
              background:
                i === 6
                  ? "var(--accent)"
                  : `color-mix(in oklch, var(--accent) ${20 + i * 8}%, transparent)`,
            }}
          />
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5 mt-2 text-[9.5px] text-[var(--ink-3)] font-mono text-center">
        {days.map((d, i) => <span key={i}>{d}</span>)}
      </div>
    </div>
  );
}

function MarketingVisual() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-[var(--ivory-2)] rounded-xl border border-[var(--line)] p-3.5">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-5 rounded-full bg-[#ea580c] text-white text-[9px] flex items-center justify-center font-serif">
            C
          </span>
          <span className="text-[10.5px] uppercase tracking-[0.14em] text-[var(--ink-3)]">LinkedIn · brouillon</span>
        </div>
        <div className="space-y-1">
          <div className="h-1.5 bg-[var(--line)] rounded w-full" />
          <div className="h-1.5 bg-[var(--line)] rounded w-5/6" />
          <div className="h-1.5 bg-[var(--line)] rounded w-3/4" />
          <div className="h-1.5 bg-[var(--line)] rounded w-4/6" />
        </div>
      </div>
      <div className="bg-[var(--ivory-2)] rounded-xl border border-[var(--line)] p-3.5">
        <div className="text-[10.5px] uppercase tracking-[0.14em] text-[var(--ink-3)] mb-2">Performance · 30j</div>
        <div className="font-mono text-[20px] text-[var(--ink)]" style={{ fontFeatureSettings: '"tnum"' }}>
          +184%
        </div>
        <div className="text-[10.5px] text-[var(--accent)] mt-0.5">portée organique</div>
      </div>
    </div>
  );
}

function StrategyVisual() {
  const priorities = [
    { rank: "01", text: "Doubler la rétention", impact: "Élevé", highlight: true },
    { rank: "02", text: "Lancer offre annuelle", impact: "Moyen", highlight: false },
    { rank: "03", text: "Industrialiser onboarding", impact: "Moyen", highlight: false },
  ];
  return (
    <div className="bg-[var(--ivory-2)] rounded-xl border border-[var(--line)] divide-y divide-[var(--line)]">
      {priorities.map((p, i) => (
        <div key={i} className="px-3.5 py-2.5 grid grid-cols-[auto_1fr_auto] items-center gap-3">
          <span className="font-mono text-[11px] text-[var(--ink-3)]">{p.rank}</span>
          <span className="text-[12.5px] text-[var(--ink)]">{p.text}</span>
          <span
            className={cn(
              "text-[10px] uppercase tracking-[0.14em] px-2 py-0.5 rounded-full",
              p.highlight
                ? "bg-[var(--accent)] text-[var(--ivory)]"
                : "bg-[var(--line)] text-[var(--ink-2)]"
            )}
          >
            {p.impact}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Features() {
  return (
    <section id="fonctionnalites" className="py-28 px-6 bg-[var(--ivory-2)] border-y border-[var(--line)]">
      <div className="max-w-[1240px] mx-auto">
        <SectionHeader
          eyebrow="Le produit"
          title={
            <>
              Toutes les briques de votre cabinet,
              <br />
              <em className="italic">réunies en un seul outil.</em>
            </>
          }
          intro="Devis, factures, relances, support, marketing, finance, stratégie. Plus de jongler entre dix logiciels — un cockpit, une équipe, un abonnement."
        />

        <div className="grid lg:grid-cols-12 gap-5 mt-16">
          <FeatureCard
            className="lg:col-span-7 lg:row-span-2 min-h-[440px]"
            tag="Devis & factures"
            title="Un devis professionnel en moins de 30 secondes."
            body="Décrivez le projet en quelques mots. Inès rédige, met en page, applique vos mentions légales et envoie. Vous validez d'un clic."
            visual={<InvoiceVisual />}
          />
          <FeatureCard
            className="lg:col-span-5"
            tag="Boîte de réception"
            title="Léa lit vos emails clients."
            body="Réponses contextuelles, suivi des fils de conversation, escalade automatique quand un client est mécontent."
            visual={<EmailVisual />}
            compact
          />
          <FeatureCard
            className="lg:col-span-5"
            tag="Rapport financier"
            title="Le lundi matin, votre P&L est sur votre bureau."
            body="Hugo livre une synthèse de votre semaine — chiffre d'affaires, marge, trésorerie, alertes. Lecture en 90 secondes."
            visual={<ReportVisual />}
            compact
          />
          <FeatureCard
            className="lg:col-span-6"
            tag="Marketing"
            title="Cyprien écrit. Vous publiez."
            body="Posts LinkedIn, newsletters, descriptions produit. Il étudie ce qui marche dans votre secteur et reproduit la formule à votre voix."
            visual={<MarketingVisual />}
          />
          <FeatureCard
            className="lg:col-span-6"
            tag="Stratégie"
            title="Augustin vous dit où regarder."
            body="Trois priorités. Pas trente. Chaque trimestre, il analyse vos chiffres, votre marché, et dresse votre feuille de route."
            visual={<StrategyVisual />}
          />
        </div>
      </div>
    </section>
  );
}
