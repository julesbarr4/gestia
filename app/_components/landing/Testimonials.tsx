const TEMOIGNAGES = [
  {
    quote:
      "J'économise 5h par semaine sur l'admin. Les devis sont impeccables et les clients me paient plus vite grâce aux relances auto.",
    name: "Sophie M.",
    role: "Graphiste freelance",
    initial: "S",
    color: "#2563eb",
  },
  {
    quote:
      "Le rapport hebdomadaire m'a permis de voir que 40% de mon CA venait d'un seul client. J'ai pu diversifier à temps.",
    name: "Thomas R.",
    role: "Consultant en marketing",
    initial: "T",
    color: "#7c3aed",
  },
  {
    quote:
      "Les réponses emails automatiques m'ont sauvé la mise pendant mes vacances. Aucun client n'a attendu plus de 5 minutes.",
    name: "Amina B.",
    role: "Gérante boutique en ligne",
    initial: "A",
    color: "#059669",
  },
];

export default function Testimonials() {
  return (
    <section className="py-28 px-6 bg-[var(--ink)] text-[var(--ivory)] relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 50% 100%, color-mix(in oklch, var(--accent) 22%, transparent), transparent 70%)",
        }}
      />
      <div className="relative max-w-[1240px] mx-auto">
        <div className="text-center max-w-[700px] mx-auto">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--ivory)]/40 mb-5">
            Témoignages
          </div>
          <h2
            className="font-normal tracking-[-0.02em] mb-5 font-serif"
            style={{ fontSize: "clamp(36px, 4.6vw, 60px)", lineHeight: 1.04 }}
          >
            Ils ont repris
            <br />
            <em className="italic text-[var(--accent)]">la main sur leur temps.</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mt-16">
          {TEMOIGNAGES.map((t, i) => (
            <figure
              key={i}
              className="rounded-2xl border border-white/10 p-7 bg-white/[0.03] backdrop-blur-sm flex flex-col"
            >
              <blockquote
                className="text-[16px] leading-[1.55] text-[var(--ivory)]/90 flex-1 font-serif italic"
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3 mt-7 pt-5 border-t border-white/10">
                <span
                  className="w-10 h-10 rounded-full text-white text-[15px] flex items-center justify-center font-serif"
                  style={{ background: t.color }}
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
