import Link from "next/link";
import DashboardMockup from "./DashboardMockup";

export default function Hero() {
  return (
    <section className="relative pt-[140px] pb-20 px-6 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% 0%, color-mix(in oklch, var(--accent) 12%, transparent), transparent 60%)",
        }}
      />
      <div className="relative max-w-[1240px] mx-auto">
        {/* surtitre */}
        <div className="flex items-center justify-center gap-2 mb-10 text-[12px] tracking-[0.18em] uppercase text-[var(--ink-3)]">
          <span className="h-px w-12 bg-[var(--line)]" />
          <span>Gestia · Conforme facturation électronique 2026</span>
          <span className="h-px w-12 bg-[var(--line)]" />
        </div>

        <h1
          className="text-center font-normal tracking-[-0.025em] text-[var(--ink)] mb-7 font-serif"
          style={{ fontSize: "clamp(48px, 7.4vw, 104px)", lineHeight: 0.96 }}
        >
          Le cabinet exécutif
          <br />
          <em className="italic text-[var(--accent)]">qui ne dort jamais.</em>
        </h1>

        <p className="text-center text-[18px] md:text-[19px] text-[var(--ink-2)] max-w-[640px] mx-auto leading-[1.55] mb-10">
          Gestia est une équipe de cinq agents intelligents — administratif, support, finance,
          marketing, stratégie — qui prennent en charge la gestion de votre entreprise.
          Gagnez 5h par semaine dès le premier jour.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-[var(--ink)] text-[var(--ivory)] hover:bg-[var(--accent)] px-6 py-3.5 rounded-full font-medium text-[15px] transition-colors"
          >
            Démarrer en 2 minutes
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <a
            href="#equipe"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-medium text-[15px] text-[var(--ink)] hover:bg-[var(--ink)]/[0.05] transition-colors"
          >
            Rencontrer l&apos;équipe
          </a>
        </div>

        <p className="text-center text-[13px] text-[var(--ink-3)]">
          14 jours d&apos;essai · sans carte bancaire · résiliable en un clic
        </p>

        <div className="mt-20">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}
