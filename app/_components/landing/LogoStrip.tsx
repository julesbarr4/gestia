const ITEMS = [
  { label: "ATELIER MIRA", serif: false, italic: true },
  { label: "BUREAU NORD", serif: true, italic: false },
  { label: "Studio Hêtre", serif: false, italic: false },
  { label: "Maison Vidal", serif: true, italic: true },
  { label: "L'OFFICINE", serif: false, italic: false },
  { label: "Comptoir 14", serif: true, italic: false },
];

export default function LogoStrip() {
  return (
    <section className="border-y border-[var(--line)] py-8 px-6">
      <div className="max-w-[1240px] mx-auto">
        <div className="text-center text-[11px] uppercase tracking-[0.2em] text-[var(--ink-3)] mb-6">
          1 200+ dirigeants, freelances et PME utilisent Gestia
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-70">
          {ITEMS.map((item, i) => (
            <span
              key={i}
              className="text-[var(--ink)] text-[15px] tracking-[0.06em]"
              style={{
                fontFamily: item.serif
                  ? "var(--font-instrument-serif), serif"
                  : "var(--font-geist), sans-serif",
                fontStyle: item.italic ? "italic" : "normal",
                fontWeight: item.serif ? 400 : 500,
              }}
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
