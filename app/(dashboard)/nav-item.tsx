"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
