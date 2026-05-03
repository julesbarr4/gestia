"use client";

import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

const STATS = [
  { label: "Trésorerie", val: "84 320,50 €", delta: "+12,4%", trend: "up" },
  { label: "À encaisser", val: "23 400,00 €", delta: "5 factures", trend: "flat" },
  { label: "Marge nette", val: "31,8 %", delta: "+2,1 pts", trend: "up" },
];

const FEED = [
  { who: "Hugo", role: "CFO", action: "a bouclé le rapport hebdo · 3 alertes triées", time: "il y a 2 min", color: "#7c3aed" },
  { who: "Cyprien", role: "CMO", action: "a programmé 4 posts pour LinkedIn", time: "il y a 11 min", color: "#ea580c" },
  { who: "Léa", role: "Support", action: "a répondu à 9 emails — 0 escalade", time: "il y a 18 min", color: "#059669" },
];

const SPARKLINE_POINTS = [40, 55, 50, 62, 58, 70, 64, 76, 73, 88, 84, 96, 92, 110, 105, 122, 116, 134, 128, 148];

function Sparkline() {
  const w = 600, h = 130;
  const max = Math.max(...SPARKLINE_POINTS);
  const min = Math.min(...SPARKLINE_POINTS);
  const stepX = w / (SPARKLINE_POINTS.length - 1);
  const path = SPARKLINE_POINTS
    .map((p, i) => {
      const x = i * stepX;
      const y = h - ((p - min) / (max - min)) * (h - 16) - 8;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const areaPath = `${path} L${w},${h} L0,${h} Z`;
  const lastY = h - ((SPARKLINE_POINTS[SPARKLINE_POINTS.length - 1] - min) / (max - min)) * (h - 16) - 8;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[110px]" preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark-fill-landing" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((y, i) => (
        <line key={i} x1="0" x2={w} y1={h * y} y2={h * y} stroke="var(--line)" strokeDasharray="2,4" strokeWidth="1" />
      ))}
      <path d={areaPath} fill="url(#spark-fill-landing)" />
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={lastY} r="3.5" fill="var(--accent)" />
      <circle cx={w} cy={lastY} r="6" fill="var(--accent)" opacity="0.2" />
    </svg>
  );
}

function FloatingCallout({
  position,
  top,
  title,
  body,
}: {
  position: "left" | "right";
  top: string;
  title: string;
  body: string;
}) {
  return (
    <div
      className={cn(
        "hidden lg:block absolute bg-white border border-[var(--line)] rounded-xl p-3.5 w-[260px] shadow-[0_12px_32px_-12px_rgba(14,14,14,0.18)]",
        position === "left" ? "-left-6" : "-right-6"
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

export default function DashboardMockup() {
  return (
    <div className="relative mx-auto max-w-[1140px]">
      <div className="rounded-[18px] bg-[var(--ink)] p-2 shadow-[0_30px_80px_-20px_rgba(14,14,14,0.35),0_8px_24px_-8px_rgba(14,14,14,0.18)]">
        <div className="rounded-[12px] bg-[var(--ivory)] overflow-hidden">
          {/* chrome bar */}
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
                ].map((item, i) => (
                  <div
                    key={i}
                    className={cn(
                      "px-2.5 py-1.5 rounded-md flex items-center gap-2",
                      item.active
                        ? "bg-[var(--ink)] text-[var(--ivory)]"
                        : "text-[var(--ink-2)]"
                    )}
                  >
                    <span className="w-1 h-1 rounded-full bg-current opacity-60" />
                    {item.l}
                  </div>
                ))}
              </nav>
              <div className="mt-6 pt-4 border-t border-[var(--line)] px-2">
                <div className="text-[10px] uppercase tracking-[0.15em] text-[var(--ink-3)] mb-2">L&apos;équipe</div>
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
                  <div className="text-[11px] uppercase tracking-[0.15em] text-[var(--ink-3)] mb-1">
                    Mercredi 29 avril 2026
                  </div>
                  <h3
                    className="text-[28px] tracking-tight text-[var(--ink)] font-serif"
                  >
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
                {STATS.map((s, i) => (
                  <div key={i} className="border border-[var(--line)] rounded-lg p-3.5 bg-white">
                    <div className="text-[10.5px] uppercase tracking-[0.12em] text-[var(--ink-3)] mb-1.5">
                      {s.label}
                    </div>
                    <div
                      className="font-mono text-[18px] tracking-tight text-[var(--ink)]"
                      style={{ fontFeatureSettings: '"tnum"' }}
                    >
                      {s.val}
                    </div>
                    <div
                      className={cn(
                        "text-[11px] mt-1 inline-flex items-center gap-1",
                        s.trend === "up" ? "text-[var(--accent)]" : "text-[var(--ink-3)]"
                      )}
                    >
                      <svg viewBox="0 0 8 8" fill="currentColor" className="w-1.5 h-1.5">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
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
                  <div className="text-[10.5px] uppercase tracking-[0.12em] text-[var(--ink-3)] mb-2.5">
                    Activité de l&apos;équipe
                  </div>
                  <div className="space-y-2.5">
                    {FEED.map((f, i) => (
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
