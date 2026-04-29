"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Tableau de bord" },
  { href: "/clients", label: "Clients" },
  { href: "/devis", label: "Devis" },
  { href: "/factures", label: "Factures" },
  { href: "/emails", label: "Emails" },
  { href: "/marketing", label: "Marketing" },
  { href: "/rapports", label: "Rapports" },
  { href: "/strategie", label: "Stratégie" },
  { href: "/dashboard/equipe", label: "L'équipe" },
  { href: "/parametres", label: "Paramètres" },
];

export function NavItems() {
  const pathname = usePathname();
  return (
    <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" as const }}>
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
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
          </Link>
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
