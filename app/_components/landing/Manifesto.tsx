export default function Manifesto() {
  return (
    <section id="manifeste" className="py-28 px-6 bg-[var(--ivory-2)] border-y border-[var(--line)]">
      <div className="max-w-[920px] mx-auto text-center">
        <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-3)] mb-5">
          Manifeste
        </div>
        <p
          className="text-[var(--ink)] tracking-[-0.015em] font-serif"
          style={{ fontSize: "clamp(28px, 3.8vw, 44px)", lineHeight: 1.18 }}
        >
          Diriger une entreprise ne devrait pas être un combat administratif.
          <br />
          <br />
          <em className="italic text-[var(--accent)]">
            Gestia rend le pilotage à ceux qui pilotent
          </em>{" "}
          — pour qu&apos;on ne perde plus une heure à faire ce qu&apos;une équipe entraînée fait en
          une minute.
        </p>
      </div>
    </section>
  );
}
