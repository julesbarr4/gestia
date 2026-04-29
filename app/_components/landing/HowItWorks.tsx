const STEPS = [
  {
    n: "01",
    t: "Vous décrivez votre entreprise",
    d: "Quelques minutes. Activité, ton de voix, mentions légales, clients récurrents. Gestia apprend votre contexte.",
  },
  {
    n: "02",
    t: "L'équipe se met au travail",
    d: "Inès prépare vos modèles. Hugo importe vos chiffres. Léa analyse vos derniers échanges. Le cockpit s'allume.",
  },
  {
    n: "03",
    t: "Vous validez. Ils exécutent.",
    d: "Devis envoyés, factures encaissées, relances faites, emails répondus. Vous gardez la main sur tout — d'un seul écran.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-[1240px] mx-auto">
        <div className="max-w-[680px]">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-3)] mb-5">
            Comment ça marche
          </div>
          <h2
            className="font-normal tracking-[-0.02em] text-[var(--ink)] font-serif"
            style={{ fontSize: "clamp(36px, 4.6vw, 60px)", lineHeight: 1.04 }}
          >
            Trois étapes pour{" "}
            <em className="italic">déléguer en toute sérénité</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)] rounded-2xl overflow-hidden mt-14">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-[var(--ivory)] p-8">
              <div className="font-mono text-[12px] text-[var(--ink-3)] mb-12">{s.n}</div>
              <h3
                className="text-[24px] tracking-tight text-[var(--ink)] mb-3 font-serif"
              >
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
