/* Gestia — Composants landing premium */

const { useState, useEffect, useRef } = React;

/* ========== UTILITIES ========== */

function cx(...args) {
  return args.filter(Boolean).join(" ");
}

/* ========== ICONS (simple, line, premium) ========== */

const Ico = {
  arrow: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  check: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 12l5 5 11-11" />
    </svg>
  ),
  dot: (p) => (
    <svg viewBox="0 0 8 8" fill="currentColor" {...p}>
      <circle cx="4" cy="4" r="3" />
    </svg>
  ),
  sparkle: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
    </svg>
  ),
  shield: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
    </svg>
  ),
  invoice: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M9 9h6M9 13h6M9 17h4" />
    </svg>
  ),
  mail: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
  chart: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 20V8M10 20V4M16 20v-8M22 20H2" />
    </svg>
  ),
  doc: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M7 3h8l4 4v14H7z" />
      <path d="M14 3v5h5" />
    </svg>
  ),
  megaphone: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 11v2c0 1 .8 2 2 2h2l8 5V4l-8 5H5c-1.2 0-2 .9-2 2zM18 8a4 4 0 010 8" />
    </svg>
  ),
  compass: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </svg>
  ),
  headset: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 14v-2a8 8 0 1116 0v2M4 14h3v5H5a1 1 0 01-1-1zM20 14h-3v5h2a1 1 0 001-1z" />
    </svg>
  ),
  plus: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  minus: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}>
      <path d="M5 12h14" />
    </svg>
  ),
};

/* ========== LOGO ========== */

function Logo({ size = 28, className = "" }) {
  return (
    <span className={cx("inline-flex items-center gap-2.5", className)}>
      <span
        style={{ width: size, height: size }}
        className="relative inline-flex items-center justify-center rounded-[7px] bg-[var(--ink)] text-[var(--ivory)]"
      >
        <span style={{ fontFamily: "Instrument Serif, serif", fontSize: size * 0.7, lineHeight: 1, fontStyle: "italic" }}>g</span>
      </span>
      <span className="font-medium tracking-[-0.01em] text-[var(--ink)]" style={{ fontSize: size * 0.62 }}>
        Gestia
      </span>
    </span>
  );
}

/* ========== NAVBAR ========== */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav
      className={cx(
        "fixed top-0 left-0 right-0 z-40 transition-[backdrop-filter,background-color,border-color] duration-300",
        scrolled ? "bg-[var(--ivory)]/85 backdrop-blur-md border-b border-[var(--line)]" : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-[1240px] mx-auto px-6 h-[72px] flex items-center justify-between">
        <Logo size={28} />
        <div className="hidden md:flex items-center gap-9 text-[14px] text-[var(--ink-2)]">
          <a href="#equipe" className="hover:text-[var(--ink)] transition-colors">L'équipe</a>
          <a href="#fonctionnalites" className="hover:text-[var(--ink)] transition-colors">Fonctionnalités</a>
          <a href="#tarifs" className="hover:text-[var(--ink)] transition-colors">Tarifs</a>
          <a href="#manifeste" className="hover:text-[var(--ink)] transition-colors">Manifeste</a>
        </div>
        <div className="flex items-center gap-1">
          <a href="#" className="text-[14px] text-[var(--ink-2)] hover:text-[var(--ink)] px-3 py-2 transition-colors">Connexion</a>
          <a
            href="#"
            className="text-[14px] bg-[var(--ink)] text-[var(--ivory)] hover:bg-[var(--accent)] px-4 py-2 rounded-full font-medium transition-colors inline-flex items-center gap-1.5"
          >
            Démarrer
            <Ico.arrow className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ========== HERO ========== */

function Hero() {
  return (
    <section className="relative pt-[140px] pb-20 px-6 overflow-hidden">
      {/* subtle horizontal grain */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% 0%, color-mix(in oklch, var(--accent) 12%, transparent), transparent 60%)",
        }}
      />
      <div className="relative max-w-[1240px] mx-auto">
        {/* top line */}
        <div className="flex items-center justify-center gap-2 mb-10 text-[12px] tracking-[0.18em] uppercase text-[var(--ink-3)]">
          <span className="h-px w-12 bg-[var(--line)]" />
          <span>Gestia · Conforme facturation électronique 2026</span>
          <span className="h-px w-12 bg-[var(--line)]" />
        </div>

        <h1 className="text-center font-normal tracking-[-0.025em] text-[var(--ink)] mb-7"
            style={{ fontFamily: "Instrument Serif, serif", fontSize: "clamp(48px, 7.4vw, 104px)", lineHeight: 0.96 }}>
          Le cabinet exécutif
          <br />
          <span className="italic text-[var(--accent)]">qui ne dort jamais.</span>
        </h1>

        <p className="text-center text-[18px] md:text-[19px] text-[var(--ink-2)] max-w-[640px] mx-auto leading-[1.55] mb-10">
          Gestia est une équipe de cinq agents intelligents — administratif, support, finance, marketing, stratégie —
          qui prennent en charge la gestion de votre entreprise. Gagnez 5h par semaine dès le premier jour.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3">
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-[var(--ink)] text-[var(--ivory)] hover:bg-[var(--accent)] px-6 py-3.5 rounded-full font-medium text-[15px] transition-colors"
          >
            Démarrer en 2 minutes
            <Ico.arrow className="w-4 h-4" />
          </a>
          <a
            href="#equipe"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-medium text-[15px] text-[var(--ink)] hover:bg-[var(--ink)]/[0.05] transition-colors"
          >
            Rencontrer l'équipe
          </a>
        </div>
        <p className="text-center text-[13px] text-[var(--ink-3)]">
          14 jours d'essai · sans carte bancaire · résiliable en un clic
        </p>

        {/* Hero device */}
        <div className="mt-20">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}

/* ========== DASHBOARD MOCKUP (hero device) ========== */

function DashboardMockup() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 2400);
    return () => clearInterval(t);
  }, []);

  const stats = [
    { label: "Trésorerie", val: "84 320,50 €", delta: "+12,4%", trend: "up" },
    { label: "À encaisser", val: "23 400,00 €", delta: "5 factures", trend: "flat" },
    { label: "Marge nette", val: "31,8 %", delta: "+2,1 pts", trend: "up" },
  ];

  const feed = [
    { who: "Hugo", role: "CFO", action: "a bouclé le rapport hebdo · 3 alertes triées", time: "il y a 2 min", color: "#7c3aed" },
    { who: "Cyprien", role: "CMO", action: "a programmé 4 posts pour LinkedIn", time: "il y a 11 min", color: "#ea580c" },
    { who: "Léa", role: "Support", action: "a répondu à 9 emails — 0 escalade", time: "il y a 18 min", color: "#059669" },
    { who: "Inès", role: "Admin", action: "a transformé 2 devis acceptés en factures", time: "il y a 32 min", color: "#2563eb" },
  ];

  return (
    <div className="relative mx-auto max-w-[1140px]">
      {/* outer frame */}
      <div className="rounded-[18px] bg-[var(--ink)] p-2 shadow-[0_30px_80px_-20px_rgba(14,14,14,0.35),0_8px_24px_-8px_rgba(14,14,14,0.18)]">
        <div className="rounded-[12px] bg-[var(--ivory)] overflow-hidden">
          {/* top chrome */}
          <div className="h-9 border-b border-[var(--line)] flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--ink)]/15" />
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--ink)]/15" />
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--ink)]/15" />
            </div>
            <div className="ml-auto text-[11px] text-[var(--ink-3)] font-mono">app.gestia.fr/cockpit</div>
            <div className="ml-auto" />
          </div>

          <div className="grid grid-cols-[200px_1fr] min-h-[460px]">
            {/* sidebar */}
            <aside className="border-r border-[var(--line)] py-4 px-3 bg-[var(--ivory-2)]">
              <div className="px-2 mb-4">
                <Logo size={22} />
              </div>
              <nav className="text-[12.5px] space-y-0.5">
                {[
                  { l: "Cockpit", active: true },
                  { l: "Clients" },
                  { l: "Devis & factures" },
                  { l: "Trésorerie" },
                  { l: "Marketing" },
                  { l: "Boîte de réception" },
                  { l: "Rapports" },
                ].map((it, i) => (
                  <div
                    key={i}
                    className={cx(
                      "px-2.5 py-1.5 rounded-md flex items-center gap-2",
                      it.active ? "bg-[var(--ink)] text-[var(--ivory)]" : "text-[var(--ink-2)]"
                    )}
                  >
                    <span className="w-1 h-1 rounded-full bg-current opacity-60" />
                    {it.l}
                  </div>
                ))}
              </nav>
              <div className="mt-6 pt-4 border-t border-[var(--line)] px-2">
                <div className="text-[10px] uppercase tracking-[0.15em] text-[var(--ink-3)] mb-2">L'équipe</div>
                <div className="flex -space-x-1.5">
                  {[
                    { c: "#2563eb", t: "I" },
                    { c: "#059669", t: "L" },
                    { c: "#7c3aed", t: "H" },
                    { c: "#ea580c", t: "C" },
                    { c: "#111827", t: "A" },
                  ].map((a, i) => (
                    <span
                      key={i}
                      className="w-6 h-6 rounded-full ring-2 ring-[var(--ivory-2)] text-[10px] font-medium text-white flex items-center justify-center"
                      style={{ background: a.c }}
                    >
                      {a.t}
                    </span>
                  ))}
                </div>
              </div>
            </aside>

            {/* main */}
            <main className="p-6">
              <div className="flex items-baseline justify-between mb-1">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.15em] text-[var(--ink-3)] mb-1">Mercredi 29 avril 2026</div>
                  <h3 style={{ fontFamily: "Instrument Serif, serif" }} className="text-[28px] tracking-tight text-[var(--ink)]">
                    Bonjour Jules — voici votre semaine
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-[11.5px] text-[var(--ink-2)] bg-[var(--ivory-2)] border border-[var(--line)] px-2.5 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                  5 agents actifs
                </div>
              </div>

              {/* stats */}
              <div className="grid grid-cols-3 gap-3 mt-5">
                {stats.map((s, i) => (
                  <div key={i} className="border border-[var(--line)] rounded-lg p-3.5 bg-white">
                    <div className="text-[10.5px] uppercase tracking-[0.12em] text-[var(--ink-3)] mb-1.5">{s.label}</div>
                    <div className="font-mono text-[18px] tracking-tight text-[var(--ink)]" style={{ fontFeatureSettings: '"tnum"' }}>
                      {s.val}
                    </div>
                    <div className={cx("text-[11px] mt-1 inline-flex items-center gap-1", s.trend === "up" ? "text-[var(--accent)]" : "text-[var(--ink-3)]")}>
                      <Ico.dot className="w-1.5 h-1.5" />
                      {s.delta}
                    </div>
                  </div>
                ))}
              </div>

              {/* chart + feed */}
              <div className="grid grid-cols-[1fr_240px] gap-4 mt-4">
                <div className="border border-[var(--line)] rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[12px] font-medium text-[var(--ink)]">Trésorerie · 90 jours</div>
                    <div className="flex gap-1 text-[10.5px] text-[var(--ink-3)]">
                      <span className="px-1.5 py-0.5 rounded bg-[var(--ivory-2)]">7j</span>
                      <span className="px-1.5 py-0.5 rounded bg-[var(--ink)] text-[var(--ivory)]">30j</span>
                      <span className="px-1.5 py-0.5 rounded bg-[var(--ivory-2)]">90j</span>
                    </div>
                  </div>
                  <Sparkline />
                </div>
                <div className="border border-[var(--line)] rounded-lg p-3 bg-white">
                  <div className="text-[10.5px] uppercase tracking-[0.12em] text-[var(--ink-3)] mb-2.5">Activité de l'équipe</div>
                  <div className="space-y-2.5">
                    {feed.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex gap-2 text-[11.5px] leading-snug">
                        <span
                          className="mt-0.5 w-5 h-5 shrink-0 rounded-full text-white text-[9.5px] font-medium flex items-center justify-center"
                          style={{ background: f.color }}
                        >
                          {f.who[0]}
                        </span>
                        <div className="min-w-0">
                          <div>
                            <span className="font-medium text-[var(--ink)]">{f.who}</span>
                            <span className="text-[var(--ink-3)]"> · {f.role}</span>
                          </div>
                          <div className="text-[var(--ink-2)] truncate">{f.action}</div>
                          <div className="text-[10px] text-[var(--ink-3)] font-mono mt-0.5">{f.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* floating callouts */}
      <FloatingCallout
        position="left"
        top="22%"
        title="Devis · Atelier Mira"
        body="Généré et envoyé en 28 sec · Inès, Admin"
      />
      <FloatingCallout
        position="right"
        top="58%"
        title="Email reçu — Mme Lefèvre"
        body="Réponse rédigée · en attente de validation"
      />
    </div>
  );
}

function Sparkline() {
  // deterministic curve (so SSR === CSR)
  const points = [40, 55, 50, 62, 58, 70, 64, 76, 73, 88, 84, 96, 92, 110, 105, 122, 116, 134, 128, 148];
  const w = 600, h = 130;
  const max = Math.max(...points), min = Math.min(...points);
  const stepX = w / (points.length - 1);
  const path = points
    .map((p, i) => {
      const x = i * stepX;
      const y = h - ((p - min) / (max - min)) * (h - 16) - 8;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const areaPath = `${path} L${w},${h} L0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[110px]" preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* grid */}
      {[0.25, 0.5, 0.75].map((y, i) => (
        <line key={i} x1="0" x2={w} y1={h * y} y2={h * y} stroke="var(--line)" strokeDasharray="2,4" strokeWidth="1" />
      ))}
      <path d={areaPath} fill="url(#spark-fill)" />
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* end dot */}
      <circle cx={w} cy={h - ((points[points.length - 1] - min) / (max - min)) * (h - 16) - 8} r="3.5" fill="var(--accent)" />
      <circle cx={w} cy={h - ((points[points.length - 1] - min) / (max - min)) * (h - 16) - 8} r="6" fill="var(--accent)" opacity="0.2" />
    </svg>
  );
}

function FloatingCallout({ position, top, title, body }) {
  const isLeft = position === "left";
  return (
    <div
      className={cx(
        "hidden lg:block absolute bg-white border border-[var(--line)] rounded-xl p-3.5 w-[260px] shadow-[0_12px_32px_-12px_rgba(14,14,14,0.18)]",
        isLeft ? "-left-6" : "-right-6"
      )}
      style={{ top }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
        <span className="text-[10.5px] uppercase tracking-[0.14em] text-[var(--ink-3)]">{title}</span>
      </div>
      <div className="text-[12.5px] text-[var(--ink)] leading-snug">{body}</div>
    </div>
  );
}

/* ========== LOGO STRIP ========== */

function LogoStrip() {
  const items = [
    "ATELIER MIRA",
    "BUREAU NORD",
    "Studio Hêtre",
    "Maison Vidal",
    "L'OFFICINE",
    "Comptoir 14",
  ];
  return (
    <section className="border-y border-[var(--line)] py-8 px-6">
      <div className="max-w-[1240px] mx-auto">
        <div className="text-center text-[11px] uppercase tracking-[0.2em] text-[var(--ink-3)] mb-6">
          1 200+ dirigeants, freelances et PME utilisent Gestia
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-70">
          {items.map((l, i) => (
            <span
              key={i}
              className="text-[var(--ink)] text-[15px] tracking-[0.06em]"
              style={{ fontFamily: i % 2 ? "Instrument Serif, serif" : "Geist, sans-serif", fontStyle: i % 3 === 0 ? "italic" : "normal", fontWeight: i % 2 ? 400 : 500 }}
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== AGENTS / TEAM ========== */

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

function TeamSection() {
  const [hover, setHover] = useState(0);
  return (
    <section id="equipe" className="py-28 px-6 bg-[var(--ivory)]">
      <div className="max-w-[1240px] mx-auto">
        <SectionHeader
          eyebrow="L'équipe Gestia"
          title={<>Cinq spécialistes.<br /><em className="text-[var(--accent)]" style={{ fontStyle: "italic" }}>Un seul abonnement.</em></>}
          intro="5 experts IA qui travaillent 24/7 pour gérer votre administratif, vos finances, vos clients et votre stratégie. L'équivalent d'un cabinet complet, pour 99€/mois."
        />

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 mt-16 items-start">
          {/* Left: list */}
          <div className="border-t border-[var(--line)]">
            {AGENTS.map((a, i) => (
              <button
                key={i}
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                className={cx(
                  "w-full text-left grid grid-cols-[auto_1fr_auto] items-center gap-5 py-5 border-b border-[var(--line)] transition-colors group",
                  hover === i ? "" : "opacity-60 hover:opacity-100"
                )}
              >
                <span
                  className="w-12 h-12 rounded-full text-white text-[18px] flex items-center justify-center shrink-0"
                  style={{ background: a.color, fontFamily: "Instrument Serif, serif" }}
                >
                  {a.initial}
                </span>
                <span>
                  <span className="block text-[18px] tracking-tight text-[var(--ink)]" style={{ fontFamily: "Instrument Serif, serif" }}>
                    {a.name}
                    <span className="text-[var(--ink-3)] italic"> · {a.role}</span>
                  </span>
                  <span className="block text-[13.5px] text-[var(--ink-2)] mt-0.5 leading-snug">{a.desc}</span>
                </span>
                <span className="text-[var(--ink-3)] group-hover:text-[var(--ink)] transition-colors">
                  <Ico.arrow className="w-4 h-4" />
                </span>
              </button>
            ))}
          </div>

          {/* Right: detail card */}
          <div className="lg:sticky lg:top-24">
            <AgentCard agent={AGENTS[hover]} />
          </div>
        </div>
      </div>
    </section>
  );
}

function AgentCard({ agent }) {
  return (
    <div className="rounded-2xl bg-[var(--ink)] text-[var(--ivory)] p-7 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-30 blur-2xl"
        style={{ background: agent.color }}
      />
      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <span
            className="w-14 h-14 rounded-full text-white text-[22px] flex items-center justify-center"
            style={{ background: agent.color, fontFamily: "Instrument Serif, serif" }}
          >
            {agent.initial}
          </span>
          <div>
            <div className="text-[20px]" style={{ fontFamily: "Instrument Serif, serif" }}>{agent.name}</div>
            <div className="text-[12.5px] uppercase tracking-[0.16em] text-[var(--ivory)]/55">{agent.role}</div>
          </div>
        </div>

        <div className="text-[14px] leading-[1.55] text-[var(--ivory)]/85 mb-6">
          {agent.desc}
        </div>

        <div className="space-y-2 mb-6">
          <div className="text-[10.5px] uppercase tracking-[0.18em] text-[var(--ivory)]/40 mb-2">Compétences clés</div>
          {agent.skills.map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-[13px] text-[var(--ivory)]/85">
              <Ico.check className="w-3.5 h-3.5" style={{ color: agent.color }} />
              {s}
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-5">
          <div className="text-[10.5px] uppercase tracking-[0.18em] text-[var(--ivory)]/40 mb-2">Cette semaine</div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { k: "Tâches", v: "47" },
              { k: "Temps", v: "5h12" },
              { k: "Économies", v: "1 240€" },
            ].map((s, i) => (
              <div key={i}>
                <div className="font-mono text-[18px]" style={{ fontFeatureSettings: '"tnum"' }}>{s.v}</div>
                <div className="text-[10.5px] text-[var(--ivory)]/40 uppercase tracking-[0.14em] mt-0.5">{s.k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== SECTION HEADER ========== */

function SectionHeader({ eyebrow, title, intro, align = "left" }) {
  return (
    <div className={cx("max-w-[680px]", align === "center" && "mx-auto text-center")}>
      <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-3)] mb-5">{eyebrow}</div>
      <h2
        className="font-normal tracking-[-0.02em] text-[var(--ink)] mb-5"
        style={{ fontFamily: "Instrument Serif, serif", fontSize: "clamp(36px, 4.6vw, 60px)", lineHeight: 1.04 }}
      >
        {title}
      </h2>
      {intro && <p className="text-[16.5px] text-[var(--ink-2)] leading-[1.55]">{intro}</p>}
    </div>
  );
}

/* ========== FEATURES ========== */

function Features() {
  return (
    <section id="fonctionnalites" className="py-28 px-6 bg-[var(--ivory-2)] border-y border-[var(--line)]">
      <div className="max-w-[1240px] mx-auto">
        <SectionHeader
          eyebrow="Le produit"
          title={<>Toutes les briques de votre cabinet,<br /><em style={{ fontStyle: "italic" }}>réunies en un seul outil.</em></>}
          intro="Devis, factures, relances, support, marketing, finance, stratégie. Plus de jongler entre dix logiciels — un cockpit, une équipe, un abonnement."
        />

        <div className="grid lg:grid-cols-12 gap-5 mt-16">
          {/* big card: invoice */}
          <FeatureCard
            className="lg:col-span-7 lg:row-span-2 min-h-[440px]"
            tag="Devis & factures"
            title="Un devis professionnel en moins de 30 secondes."
            body="Décrivez le projet en quelques mots. Inès rédige, met en page, applique vos mentions légales et envoie. Vous validez d'un clic."
            visual={<InvoiceVisual />}
          />
          {/* email */}
          <FeatureCard
            className="lg:col-span-5"
            tag="Boîte de réception"
            title="Léa lit vos emails clients."
            body="Réponses contextuelles, suivi des fils de conversation, escalade automatique quand un client est mécontent."
            visual={<EmailVisual />}
            compact
          />
          {/* finance */}
          <FeatureCard
            className="lg:col-span-5"
            tag="Rapport financier"
            title="Le lundi matin, votre P&L est sur votre bureau."
            body="Hugo livre une synthèse de votre semaine — chiffre d'affaires, marge, trésorerie, alertes. Lecture en 90 secondes."
            visual={<ReportVisual />}
            compact
          />
          {/* marketing */}
          <FeatureCard
            className="lg:col-span-6"
            tag="Marketing"
            title="Cyprien écrit. Vous publiez."
            body="Posts LinkedIn, newsletters, descriptions produit. Il étudie ce qui marche dans votre secteur et reproduit la formule à votre voix."
            visual={<MarketingVisual />}
          />
          {/* strategy */}
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

function FeatureCard({ className, tag, title, body, visual, compact }) {
  return (
    <div className={cx("rounded-2xl bg-white border border-[var(--line)] overflow-hidden flex flex-col", className)}>
      <div className={cx("p-7 pb-5 flex-1", compact && "p-6 pb-4")}>
        <div className="text-[10.5px] uppercase tracking-[0.18em] text-[var(--accent)] mb-3">{tag}</div>
        <h3
          className="text-[var(--ink)] font-normal tracking-[-0.015em] mb-3"
          style={{ fontFamily: "Instrument Serif, serif", fontSize: compact ? "26px" : "30px", lineHeight: 1.1 }}
        >
          {title}
        </h3>
        <p className="text-[14.5px] text-[var(--ink-2)] leading-[1.55] max-w-[460px]">{body}</p>
      </div>
      <div className={cx("relative px-7 pb-7", compact && "px-6 pb-6")}>
        {visual}
      </div>
    </div>
  );
}

/* feature visuals */

function InvoiceVisual() {
  return (
    <div className="relative h-[300px]">
      {/* prompt bar */}
      <div className="absolute top-0 left-0 right-0 bg-[var(--ivory-2)] border border-[var(--line)] rounded-xl p-3 flex items-center gap-2.5">
        <span className="w-6 h-6 rounded-full bg-[#2563eb] text-white text-[10px] flex items-center justify-center" style={{ fontFamily: "Instrument Serif, serif" }}>I</span>
        <div className="text-[12.5px] text-[var(--ink-2)] flex-1 truncate">
          Devis pour Atelier Mira · refonte identité visuelle · 5 200 €
        </div>
        <span className="text-[10.5px] font-mono text-[var(--accent)] flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" /> 28s
        </span>
      </div>
      {/* document */}
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
          {["Audit de l'existant", "Direction artistique", "Charte graphique complète", "Déclinaisons print & digital"].map((l, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto_auto] gap-3 items-center text-[11.5px] py-1 border-b border-[var(--line)]">
              <span className="text-[var(--ink)]">{l}</span>
              <span className="font-mono text-[var(--ink-3)]">1</span>
              <span className="font-mono text-[var(--ink)]">{[800, 1400, 1800, 1200][i].toLocaleString("fr-FR")} €</span>
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
    { from: "Atelier Mira", subject: "Validation du devis", state: "Répondu · 11h02" },
    { from: "Studio Hêtre", subject: "Facture #428", state: "Escaladé à vous" },
  ];
  return (
    <div className="bg-[var(--ivory-2)] rounded-xl border border-[var(--line)] divide-y divide-[var(--line)]">
      {items.map((m, i) => (
        <div key={i} className="px-3.5 py-2.5 grid grid-cols-[auto_1fr_auto] items-center gap-3">
          <span className="w-2 h-2 rounded-full" style={{ background: i === 0 ? "var(--accent)" : "var(--ink-3)", opacity: i === 0 ? 1 : 0.3 }} />
          <div className="min-w-0">
            <div className="text-[12.5px] text-[var(--ink)] font-medium truncate">{m.from}</div>
            <div className="text-[11.5px] text-[var(--ink-3)] truncate">{m.subject}</div>
          </div>
          <div className={cx("text-[10.5px] font-mono", m.live ? "text-[var(--accent)]" : "text-[var(--ink-3)]")}>
            {m.live && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent)] mr-1 animate-pulse" />}
            {m.state}
          </div>
        </div>
      ))}
    </div>
  );
}

function ReportVisual() {
  return (
    <div className="bg-[var(--ivory-2)] rounded-xl border border-[var(--line)] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10.5px] uppercase tracking-[0.16em] text-[var(--ink-3)]">Semaine 18 · 2026</div>
        <div className="text-[10.5px] font-mono text-[var(--accent)]">▲ 12,4%</div>
      </div>
      <div className="grid grid-cols-7 gap-1.5 h-[60px] items-end">
        {[40, 55, 48, 70, 64, 88, 96].map((h, i) => (
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
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => <span key={i}>{d}</span>)}
      </div>
    </div>
  );
}

function MarketingVisual() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-[var(--ivory-2)] rounded-xl border border-[var(--line)] p-3.5">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-5 rounded-full bg-[#ea580c] text-white text-[9px] flex items-center justify-center" style={{ fontFamily: "Instrument Serif, serif" }}>C</span>
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
        <div className="font-mono text-[20px] text-[var(--ink)]" style={{ fontFeatureSettings: '"tnum"' }}>+184%</div>
        <div className="text-[10.5px] text-[var(--accent)] mt-0.5">portée organique</div>
      </div>
    </div>
  );
}

function StrategyVisual() {
  const priorities = [
    { rank: "01", text: "Doubler la rétention", impact: "Élevé" },
    { rank: "02", text: "Lancer offre annuelle", impact: "Moyen" },
    { rank: "03", text: "Industrialiser onboarding", impact: "Moyen" },
  ];
  return (
    <div className="bg-[var(--ivory-2)] rounded-xl border border-[var(--line)] divide-y divide-[var(--line)]">
      {priorities.map((p, i) => (
        <div key={i} className="px-3.5 py-2.5 grid grid-cols-[auto_1fr_auto] items-center gap-3">
          <span className="font-mono text-[11px] text-[var(--ink-3)]">{p.rank}</span>
          <span className="text-[12.5px] text-[var(--ink)]">{p.text}</span>
          <span className={cx("text-[10px] uppercase tracking-[0.14em] px-2 py-0.5 rounded-full", i === 0 ? "bg-[var(--accent)] text-[var(--ivory)]" : "bg-[var(--line)] text-[var(--ink-2)]")}>
            {p.impact}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ========== HOW IT WORKS ========== */

function HowItWorks() {
  const steps = [
    { n: "01", t: "Vous décrivez votre entreprise", d: "Quelques minutes. Activité, ton de voix, mentions légales, clients récurrents. Gestia apprend votre contexte." },
    { n: "02", t: "L'équipe se met au travail", d: "Inès prépare vos modèles. Hugo importe vos chiffres. Léa analyse vos derniers échanges. Le cockpit s'allume." },
    { n: "03", t: "Vous validez. Ils exécutent.", d: "Devis envoyés, factures encaissées, relances faites, emails répondus. Vous gardez la main sur tout — d'un seul écran." },
  ];
  return (
    <section className="py-28 px-6">
      <div className="max-w-[1240px] mx-auto">
        <SectionHeader
          eyebrow="Comment ça marche"
          title={<>Trois étapes pour <em style={{ fontStyle: "italic" }}>déléguer en toute sérénité</em></>}
        />
        <div className="grid md:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)] rounded-2xl overflow-hidden mt-14">
          {steps.map((s) => (
            <div key={s.n} className="bg-[var(--ivory)] p-8">
              <div className="font-mono text-[12px] text-[var(--ink-3)] mb-12">{s.n}</div>
              <h3 className="text-[24px] tracking-tight text-[var(--ink)] mb-3" style={{ fontFamily: "Instrument Serif, serif" }}>
                {s.t}
              </h3>
              <p className="text-[14.5px] text-[var(--ink-2)] leading-[1.55]">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== TESTIMONIALS ========== */

const TEMOIGNAGES = [
  {
    quote: "J'économise 5h par semaine sur l'admin. Les devis sont impeccables et les clients me paient plus vite grâce aux relances auto.",
    name: "Sophie M.",
    role: "Graphiste freelance",
    initial: "S",
    color: "#2563eb",
  },
  {
    quote: "Le rapport hebdomadaire m'a permis de voir que 40% de mon CA venait d'un seul client. J'ai pu diversifier à temps.",
    name: "Thomas R.",
    role: "Consultant en marketing",
    initial: "T",
    color: "#7c3aed",
  },
  {
    quote: "Les réponses emails automatiques m'ont sauvé la mise pendant mes vacances. Aucun client n'a attendu plus de 5 minutes.",
    name: "Amina B.",
    role: "Gérante boutique en ligne",
    initial: "A",
    color: "#059669",
  },
];

function Testimonials() {
  return (
    <section className="py-28 px-6 bg-[var(--ink)] text-[var(--ivory)] relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: "radial-gradient(ellipse 60% 50% at 50% 100%, color-mix(in oklch, var(--accent) 22%, transparent), transparent 70%)",
        }}
      />
      <div className="relative max-w-[1240px] mx-auto">
        <div className="text-center max-w-[700px] mx-auto">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--ivory)]/40 mb-5">Témoignages</div>
          <h2 className="font-normal tracking-[-0.02em] mb-5" style={{ fontFamily: "Instrument Serif, serif", fontSize: "clamp(36px, 4.6vw, 60px)", lineHeight: 1.04 }}>
            Ils ont repris<br /><em style={{ fontStyle: "italic", color: "var(--accent)" }}>la main sur leur temps.</em>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5 mt-16">
          {TEMOIGNAGES.map((t, i) => (
            <figure key={i} className="rounded-2xl border border-white/10 p-7 bg-white/[0.03] backdrop-blur-sm flex flex-col">
              <blockquote className="text-[16px] leading-[1.55] text-[var(--ivory)]/90 flex-1" style={{ fontFamily: "Instrument Serif, serif" }}>
                "{t.quote}"
              </blockquote>
              <figcaption className="flex items-center gap-3 mt-7 pt-5 border-t border-white/10">
                <span
                  className="w-10 h-10 rounded-full text-white text-[15px] flex items-center justify-center"
                  style={{ background: t.color, fontFamily: "Instrument Serif, serif" }}
                >
                  {t.initial}
                </span>
                <div>
                  <div className="text-[13.5px] font-medium">{t.name}</div>
                  <div className="text-[12px] text-[var(--ivory)]/55">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== PRICING ========== */

function Pricing() {
  const plans = [
    {
      name: "Starter",
      cible: "Freelances & micro-entrepreneurs",
      monthly: 49,
      features: ["10 devis / mois par IA", "10 factures / mois", "Relances automatiques", "Rapport financier hebdo", "Support email"],
      cta: "Commencer gratuitement",
      featured: false,
    },
    {
      name: "Pro",
      cible: "PME 1 à 10 salariés",
      monthly: 99,
      features: ["Devis & factures illimités", "Agent support emails IA", "Contenu marketing IA", "Analyse stratégique CEO IA", "Support prioritaire"],
      cta: "Essai 14 jours gratuit",
      featured: true,
    },
  ];
  return (
    <section id="tarifs" className="py-28 px-6 bg-[var(--ivory)]">
      <div className="max-w-[1240px] mx-auto">
        <div className="text-center max-w-[680px] mx-auto">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-3)] mb-5">Tarifs</div>
          <h2 className="font-normal tracking-[-0.02em] text-[var(--ink)] mb-5" style={{ fontFamily: "Instrument Serif, serif", fontSize: "clamp(36px, 4.6vw, 60px)", lineHeight: 1.04 }}>
            Le prix d'un stagiaire.<br /><em style={{ fontStyle: "italic", color: "var(--accent)" }}>Le travail d'un cabinet.</em>
          </h2>
          <p className="text-[16.5px] text-[var(--ink-2)] leading-[1.55] mb-8">
            Pas d'engagement, pas de mauvaise surprise. Vous résiliez quand vous voulez.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-5 mt-14 max-w-[820px] mx-auto">
          {plans.map((p) => (
            <div
              key={p.name}
              className={cx(
                "rounded-2xl p-7 flex flex-col",
                p.featured
                  ? "bg-[var(--ink)] text-[var(--ivory)] relative"
                  : "bg-white border border-[var(--line)]"
              )}
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10.5px] uppercase tracking-[0.18em] bg-[var(--accent)] text-[var(--ivory)] px-3 py-1 rounded-full">
                  Recommandé
                </span>
              )}
              <div className="text-[12px] uppercase tracking-[0.16em] mb-1.5" style={{ color: p.featured ? "rgba(251,248,243,0.55)" : "var(--ink-3)" }}>
                {p.cible}
              </div>
              <div className="text-[26px] mb-6" style={{ fontFamily: "Instrument Serif, serif" }}>
                {p.name}
              </div>
              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="font-mono text-[44px] tracking-tight" style={{ fontFeatureSettings: '"tnum"' }}>
                  {p.monthly}€
                </span>
                <span className="text-[13px]" style={{ color: p.featured ? "rgba(251,248,243,0.55)" : "var(--ink-3)" }}>
                  /mois
                </span>
              </div>
              <ul className="space-y-2.5 mb-7 flex-1">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px]" style={{ color: p.featured ? "rgba(251,248,243,0.85)" : "var(--ink)" }}>
                    <Ico.check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: p.featured ? "var(--accent)" : "var(--accent)" }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className={cx(
                  "block text-center py-3 rounded-full font-medium text-[14px] transition-colors",
                  p.featured
                    ? "bg-[var(--ivory)] text-[var(--ink)] hover:bg-[var(--accent)] hover:text-[var(--ivory)]"
                    : "bg-[var(--ink)] text-[var(--ivory)] hover:bg-[var(--accent)]"
                )}
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center text-[13px] text-[var(--ink-3)]">
          Tous les prix s'entendent HT · Paiement sécurisé · TVA appliquée selon votre pays
        </div>
      </div>
    </section>
  );
}

/* ========== FAQ ========== */

function FAQ() {
  const items = [
    { q: "Mes données sont-elles en sécurité ?", a: "Hébergement souverain en France, chiffrement de bout en bout, conformité RGPD. Vos données ne servent jamais à entraîner les modèles. Vous pouvez les exporter ou les supprimer à tout moment." },
    { q: "Les agents IA peuvent-ils faire des erreurs ?", a: "Oui — comme un humain. C'est pour ça que vous gardez la validation finale sur les actions sensibles : envois, paiements, communications externes. Pour le reste, ils apprennent de vos corrections." },
    { q: "Faut-il un comptable en plus ?", a: "Pour la production courante, non — Margaux remplace l'essentiel. Pour la clôture annuelle et les déclarations fiscales, oui : un expert-comptable reste recommandé. Gestia s'intègre proprement à son logiciel." },
    { q: "Puis-je intégrer mes outils existants ?", a: "Oui : banques (Bridge, Powens), email (Gmail, Outlook), Stripe, comptabilité (Pennylane, QuickBooks), Notion, Linear. Plus de 40 intégrations natives." },
    { q: "Combien de temps pour être opérationnel ?", a: "10 minutes pour l'inscription et la connexion à votre banque. 24h pour qu'Adrien comprenne vos modèles de devis et factures. Une semaine pour que toute l'équipe soit calibrée à votre voix." },
    { q: "Que se passe-t-il si j'arrête ?", a: "Vous récupérez l'intégralité de vos données — clients, factures, historiques — au format ouvert. Aucune rétention, aucune pénalité. Promis." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="py-28 px-6">
      <div className="max-w-[920px] mx-auto">
        <SectionHeader
          eyebrow="Questions fréquentes"
          title={<>Tout ce que vous vouliez savoir<br /><em style={{ fontStyle: "italic" }}>sans oser le demander.</em></>}
          align="center"
        />
        <div className="mt-14 border-t border-[var(--line)]">
          {items.map((it, i) => (
            <div key={i} className="border-b border-[var(--line)]">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex items-center justify-between gap-6 py-6 text-left"
              >
                <span className="text-[18px] tracking-tight text-[var(--ink)]" style={{ fontFamily: "Instrument Serif, serif" }}>
                  {it.q}
                </span>
                <span className="w-8 h-8 rounded-full border border-[var(--line)] flex items-center justify-center text-[var(--ink-2)] shrink-0">
                  {open === i ? <Ico.minus className="w-3.5 h-3.5" /> : <Ico.plus className="w-3.5 h-3.5" />}
                </span>
              </button>
              <div
                className="overflow-hidden transition-[max-height,opacity] duration-300"
                style={{ maxHeight: open === i ? 200 : 0, opacity: open === i ? 1 : 0 }}
              >
                <p className="text-[15px] text-[var(--ink-2)] leading-[1.6] pb-6 max-w-[680px]">{it.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== MANIFESTO ========== */

function Manifesto() {
  return (
    <section id="manifeste" className="py-28 px-6 bg-[var(--ivory-2)] border-y border-[var(--line)]">
      <div className="max-w-[920px] mx-auto text-center">
        <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-3)] mb-5">Manifeste</div>
        <p
          className="text-[var(--ink)] tracking-[-0.015em]"
          style={{ fontFamily: "Instrument Serif, serif", fontSize: "clamp(28px, 3.8vw, 44px)", lineHeight: 1.18 }}
        >
          Diriger une entreprise ne devrait pas être un combat administratif.<br /><br />
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>Gestia rend le pilotage à ceux qui pilotent</em>{" "}
          — pour qu'on ne perde plus une heure à faire ce qu'une équipe entraînée fait en une minute.
        </p>
      </div>
    </section>
  );
}

/* ========== FINAL CTA ========== */

function FinalCTA() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-[920px] mx-auto text-center">
        <h2
          className="font-normal tracking-[-0.025em] text-[var(--ink)] mb-7"
          style={{ fontFamily: "Instrument Serif, serif", fontSize: "clamp(44px, 6vw, 80px)", lineHeight: 1 }}
        >
          Votre cabinet vous attend.<br />
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>Faites les présentations.</em>
        </h2>
        <p className="text-[17px] text-[var(--ink-2)] max-w-[520px] mx-auto leading-[1.55] mb-10">
          14 jours d'essai. Pas de carte requise. Vos premiers devis, factures et rapports en moins d'une heure.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="#" className="inline-flex items-center gap-2 bg-[var(--ink)] text-[var(--ivory)] hover:bg-[var(--accent)] px-7 py-4 rounded-full font-medium text-[15.5px] transition-colors">
            Démarrer maintenant <Ico.arrow className="w-4 h-4" />
          </a>
          <a href="#" className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-medium text-[15.5px] text-[var(--ink)] hover:bg-[var(--ink)]/[0.05] transition-colors">
            Réserver une démo
          </a>
        </div>
      </div>
    </section>
  );
}

/* ========== FOOTER ========== */

function Footer() {
  return (
    <footer className="border-t border-[var(--line)] py-12 px-6 bg-[var(--ivory)]">
      <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
        <Logo size={26} />
        <p className="text-[13px] text-[var(--ink-3)] text-center">
          © {new Date().getFullYear()} Gestia — JMB TRADING · Tous droits réservés
        </p>
        <div className="flex gap-6 text-[13px] text-[var(--ink-3)]">
          <a href="/cgv" className="hover:text-[var(--ink)] transition-colors">CGV</a>
          <a href="/confidentialite" className="hover:text-[var(--ink)] transition-colors">Confidentialité</a>
          <a href="/contact" className="hover:text-[var(--ink)] transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}

/* ========== EXPORT TO WINDOW ========== */

Object.assign(window, {
  cx,
  Ico,
  Logo,
  Navbar,
  Hero,
  LogoStrip,
  TeamSection,
  Features,
  HowItWorks,
  Testimonials,
  Pricing,
  FAQ,
  Manifesto,
  FinalCTA,
  Footer,
});
