import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-[920px] mx-auto text-center">
        <h2
          className="font-normal tracking-[-0.025em] text-[var(--ink)] mb-7 font-serif"
          style={{ fontSize: "clamp(44px, 6vw, 80px)", lineHeight: 1 }}
        >
          Votre cabinet vous attend.
          <br />
          <em className="italic text-[var(--accent)]">Faites les présentations.</em>
        </h2>

        <p className="text-[17px] text-[var(--ink-2)] max-w-[520px] mx-auto leading-[1.55] mb-10">
          14 jours d&apos;essai. Pas de carte requise. Vos premiers devis, factures et rapports en
          moins d&apos;une heure.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-[var(--ink)] text-[var(--ivory)] hover:bg-[var(--accent)] px-7 py-4 rounded-full font-medium text-[15.5px] transition-colors"
          >
            Démarrer maintenant
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-medium text-[15.5px] text-[var(--ink)] hover:bg-[var(--ink)]/[0.05] transition-colors"
          >
            Réserver une démo
          </Link>
        </div>
      </div>
    </section>
  );
}
