import Link from "next/link";

export function PublicNavbar() {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      height: "56px",
      background: "rgba(251,248,243,0.92)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--line)",
      display: "flex", alignItems: "center",
      padding: "0 40px",
      justifyContent: "space-between",
    }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
        <div style={{
          width: "28px", height: "28px", background: "var(--ink)",
          borderRadius: "6px", display: "flex", alignItems: "center",
          justifyContent: "center", color: "var(--ivory)",
          fontFamily: "Instrument Serif, serif", fontStyle: "italic", fontSize: "16px",
        }}>g</div>
        <span style={{ fontFamily: "Instrument Serif, serif", fontSize: "17px", color: "var(--ink)", letterSpacing: "-0.02em" }}>
          Gestia
        </span>
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
        <Link href="/#fonctionnalites" style={{ fontSize: "13.5px", color: "var(--ink-2)", textDecoration: "none" }}>Fonctionnalités</Link>
        <Link href="/equipe" style={{ fontSize: "13.5px", color: "var(--ink-2)", textDecoration: "none" }}>L'équipe</Link>
        <Link href="/#tarifs" style={{ fontSize: "13.5px", color: "var(--ink-2)", textDecoration: "none" }}>Tarifs</Link>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Link href="/login" style={{ fontSize: "13.5px", color: "var(--ink-2)", textDecoration: "none" }}>
          Connexion
        </Link>
        <Link href="/signup" style={{
          fontSize: "13.5px", color: "var(--ivory)",
          background: "var(--ink)", borderRadius: "999px",
          padding: "8px 18px", textDecoration: "none",
          fontWeight: 500,
        }}>
          Essai gratuit →
        </Link>
      </div>
    </nav>
  );
}

export function PublicFooter() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", padding: "48px 40px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <div style={{
            width: "22px", height: "22px", background: "var(--ink)", borderRadius: "5px",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--ivory)", fontFamily: "Instrument Serif, serif",
            fontStyle: "italic", fontSize: "12px",
          }}>g</div>
          <span style={{ fontFamily: "Instrument Serif, serif", fontSize: "15px", color: "var(--ink)" }}>Gestia</span>
        </div>
        <p style={{ fontSize: "12px", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace" }}>
          © {new Date().getFullYear()} Gestia — JMB TRADING
        </p>
        <div style={{ display: "flex", gap: "24px" }}>
          {[
            { label: "CGV", href: "/cgv" },
            { label: "Confidentialité", href: "/confidentialite" },
            { label: "Contact", href: "/contact" },
          ].map((l) => (
            <Link key={l.href} href={l.href} style={{ fontSize: "13px", color: "var(--ink-3)", textDecoration: "none" }}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--ivory)" }}>
      <PublicNavbar />
      <div style={{ paddingTop: "56px" }}>
        {children}
      </div>
      <PublicFooter />
    </div>
  );
}
