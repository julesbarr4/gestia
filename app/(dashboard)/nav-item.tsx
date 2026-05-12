"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS: Array<{
  href: string;
  label: string;
  separator?: boolean;
  badge?: string;
}> = [
  { href: "/dashboard", label: "Accueil" },
  { href: "/clients", label: "Mes clients" },
  { href: "/devis", label: "Mes devis" },
  { href: "/factures", label: "Mes factures" },
  { href: "/modeles", label: "Mes modèles" },

  { href: "/emails", label: "Répondre aux emails", separator: true },
  { href: "/rapports", label: "Mes chiffres" },
  { href: "/marketing", label: "Mon contenu", badge: "Pro" },
  { href: "/strategie", label: "Mon plan", badge: "Pro" },

  { href: "/dashboard/equipe", label: "L'équipe Gestia", separator: true },
  { href: "/upgrade", label: "⭐ Changer de plan", separator: true },
  { href: "/parametres", label: "Mon compte" },
];

export function NavItems() {
  const pathname = usePathname();

  return (
    <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" as const }}>
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <div key={item.href}>
            {item.separator && (
              <div style={{
                height: "1px",
                background: "var(--line)",
                margin: "8px 10px",
              }} />
            )}
            <Link
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 12px",
                borderRadius: "9px",
                fontSize: "13.5px",
                color: isActive ? "var(--ivory)" : "var(--ink-2)",
                background: isActive ? "var(--ink)" : "transparent",
                textDecoration: "none",
                marginBottom: "2px",
                fontWeight: isActive ? 500 : 400,
                transition: "background 0.15s, color 0.15s",
              }}
            >
              {item.label}
              {item.badge && (
                <span style={{
                  marginLeft: "auto",
                  fontSize: "8.5px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  background: "color-mix(in oklch, var(--accent) 15%, transparent)",
                  color: "var(--accent)",
                  padding: "1px 6px",
                  borderRadius: "999px",
                  fontFamily: "Geist Mono, monospace",
                }}>
                  {item.badge}
                </span>
              )}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}

export function NavItem({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "8px 12px",
        borderRadius: "9px",
        fontSize: "13.5px",
        color: isActive ? "var(--ivory)" : "var(--ink-2)",
        background: isActive ? "var(--ink)" : "transparent",
        textDecoration: "none",
        marginBottom: "2px",
        transition: "background 0.15s, color 0.15s",
        fontWeight: isActive ? 500 : 400,
      }}
    >
      {label}
    </Link>
  );
}
