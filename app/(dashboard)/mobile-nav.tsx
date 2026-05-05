"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BOTTOM_ITEMS = [
  { href: "/dashboard", label: "Accueil", icon: "⌂" },
  { href: "/devis", label: "Devis", icon: "📄" },
  { href: "/factures", label: "Factures", icon: "🧾" },
  { href: "/clients", label: "Clients", icon: "👤" },
  { href: "/menu", label: "Menu", icon: "☰" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav data-bottom-nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      zIndex: 50, height: "64px",
      background: "rgba(251,248,243,0.96)",
      backdropFilter: "blur(12px)",
      borderTop: "1px solid var(--line)",
      display: "flex", alignItems: "stretch",
    }}>
      {BOTTOM_ITEMS.map((item) => {
        const isActive = item.href !== "/menu" && (
          pathname === item.href || pathname.startsWith(item.href + "/")
        );
        return (
          <Link
            key={item.href}
            href={item.href === "/menu" ? "#" : item.href}
            style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: "3px",
              textDecoration: "none", color: isActive ? "var(--ink)" : "var(--ink-3)",
              fontSize: "10px", fontFamily: "Geist, sans-serif",
              fontWeight: isActive ? 500 : 400,
            }}
            onClick={item.href === "/menu" ? (e) => {
              e.preventDefault();
              document.getElementById("mobile-drawer")?.classList.toggle("open");
            } : undefined}
          >
            <span style={{ fontSize: "18px", lineHeight: 1 }}>{item.icon}</span>
            <span>{item.label}</span>
            {isActive && (
              <span style={{
                position: "absolute", bottom: "4px",
                width: "4px", height: "4px", borderRadius: "50%",
                background: "var(--ink)",
              }} />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileMenuButton() {
  return (
    <button
      className="show-mobile"
      onClick={() => {
        document.getElementById("mobile-drawer")?.classList.toggle("open");
        document.getElementById("mobile-overlay")?.style.setProperty("opacity", "1");
        document.getElementById("mobile-overlay")?.style.setProperty("pointer-events", "auto");
      }}
      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "var(--ink)", padding: "4px", display: "none" }}
    >
      ☰
    </button>
  );
}

export function MobileDrawer({ nomEntreprise, initiale, plan }: {
  nomEntreprise: string;
  initiale: string;
  plan: string;
}) {
  const pathname = usePathname();

  const ALL_ITEMS = [
    { href: "/dashboard", label: "Accueil" },
    { href: "/clients", label: "Mes clients" },
    { href: "/devis", label: "Mes devis" },
    { href: "/factures", label: "Mes factures" },
    { href: "/modeles", label: "Mes modèles" },
    null,
    { href: "/emails", label: "Répondre aux emails" },
    { href: "/rapports", label: "Mes chiffres" },
    { href: "/marketing", label: "Mon contenu" },
    { href: "/strategie", label: "Mon plan" },
    null,
    { href: "/dashboard/equipe", label: "L'équipe Gestia" },
    { href: "/parametres", label: "Mon compte" },
  ];

  function close() {
    document.getElementById("mobile-drawer")?.classList.remove("open");
  }

  return (
    <>
      <div
        id="mobile-overlay"
        onClick={close}
        style={{
          position: "fixed", inset: 0, zIndex: 48,
          background: "rgba(14,14,14,0.4)",
          opacity: 0, pointerEvents: "none",
          transition: "opacity 0.25s",
        }}
      />

      <div
        id="mobile-drawer"
        style={{
          position: "fixed", top: 0, right: "-280px", height: "100vh",
          width: "280px", zIndex: 49,
          background: "var(--ivory)", borderLeft: "1px solid var(--line)",
          display: "flex", flexDirection: "column",
          transition: "right 0.25s ease",
          overflowY: "auto",
        }}
      >
        <div style={{ padding: "20px", borderBottom: "1px solid var(--line)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "28px", height: "28px", background: "var(--ink)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ivory)", fontFamily: "Instrument Serif, serif", fontStyle: "italic", fontSize: "16px" }}>g</div>
              <span style={{ fontFamily: "Instrument Serif, serif", fontSize: "16px", color: "var(--ink)" }}>Gestia</span>
            </div>
            <button onClick={close} style={{ background: "none", border: "none", fontSize: "20px", color: "var(--ink-3)", cursor: "pointer", padding: "4px" }}>×</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--ivory-2)", borderRadius: "10px", padding: "8px 10px" }}>
            <div style={{ width: "26px", height: "26px", background: "var(--ink)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ivory)", fontFamily: "Instrument Serif, serif", fontStyle: "italic", fontSize: "13px", flexShrink: 0 }}>{initiale}</div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: "12px", fontWeight: 500, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nomEntreprise}</p>
              <p style={{ fontSize: "10px", color: "var(--ink-3)" }}>{plan === "pro" ? "Plan Pro" : "Plan Starter"}</p>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {ALL_ITEMS.map((item, i) => {
            if (!item) return (
              <div key={i} style={{ height: "1px", background: "var(--line)", margin: "8px 10px" }} />
            );
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href} onClick={close} style={{
                display: "flex", alignItems: "center",
                padding: "10px 12px", borderRadius: "9px",
                fontSize: "14px", color: isActive ? "var(--ivory)" : "var(--ink-2)",
                background: isActive ? "var(--ink)" : "transparent",
                textDecoration: "none", marginBottom: "2px",
                fontWeight: isActive ? 500 : 400,
              }}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "14px 20px", borderTop: "1px solid var(--line)" }}>
          <form action="/api/auth/signout" method="POST">
            <button type="submit" style={{ width: "100%", textAlign: "left", fontSize: "13px", color: "var(--ink-3)", background: "none", border: "none", cursor: "pointer", padding: "6px 0" }}>
              Déconnexion →
            </button>
          </form>
        </div>
      </div>

      <style>{`
        #mobile-drawer.open { right: 0 !important; }
        #mobile-drawer.open ~ * #mobile-overlay,
        #mobile-overlay { transition: opacity 0.25s; }
        #mobile-drawer.open + #mobile-overlay { opacity: 1 !important; pointer-events: auto !important; }
      `}</style>
    </>
  );
}
