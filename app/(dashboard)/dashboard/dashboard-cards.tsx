"use client";

import { useState } from "react";

export function SummaryCard({
  href,
  dark = false,
  eyebrow,
  value,
  valueColor,
  sub,
  subColor,
}: {
  href: string;
  dark?: boolean;
  eyebrow: string;
  value: string;
  valueColor?: string;
  sub?: string;
  subColor?: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      style={{
        textDecoration: "none",
        display: "block",
        background: dark ? "var(--ink)" : "white",
        border: dark ? "none" : "1px solid var(--line)",
        borderRadius: "16px",
        padding: "24px",
        cursor: "pointer",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered
          ? dark
            ? "0 18px 40px -22px rgba(14,14,14,0.35)"
            : "0 18px 40px -22px rgba(14,14,14,0.18)"
          : "none",
        transition: "transform 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <p style={{
        fontSize: "10.5px",
        textTransform: "uppercase",
        letterSpacing: "0.16em",
        color: dark ? "rgba(251,248,243,0.5)" : "var(--ink-3)",
        marginBottom: "16px",
      }}>
        {eyebrow}
      </p>
      <p style={{
        fontFamily: "Instrument Serif, serif",
        fontSize: "32px",
        color: valueColor || (dark ? "var(--ivory)" : "var(--ink)"),
        lineHeight: 1.06,
        marginBottom: "6px",
      }}>
        {value}
      </p>
      {sub && (
        <p style={{
          fontSize: "12px",
          fontFamily: "Geist Mono, monospace",
          color: subColor || (dark ? "oklch(0.42 0.07 155)" : "var(--ink-3)"),
        }}>
          {sub}
        </p>
      )}
      <p style={{
        fontSize: "11px",
        color: dark ? "rgba(251,248,243,0.35)" : "var(--ink-3)",
        marginTop: "16px",
      }}>
        Ouvrir →
      </p>
    </a>
  );
}

export function ActionLink({ href, label, sub, color, initiale }: {
  href: string; label: string; sub: string; color: string; initiale: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <a href={href} style={{ textDecoration: "none" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "9px 10px",
        borderRadius: "10px",
        background: hovered ? "var(--ivory-2)" : "transparent",
        transition: "background 0.12s",
        cursor: "pointer",
      }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{
          width: "30px", height: "30px", borderRadius: "50%",
          background: color,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white",
          fontFamily: "Instrument Serif, serif",
          fontStyle: "italic",
          fontSize: "14px",
          flexShrink: 0,
        }}>{initiale}</div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "13px", color: "var(--ink)", fontWeight: 500 }}>{label}</p>
          <p style={{ fontSize: "11px", color: "var(--ink-3)" }}>{sub}</p>
        </div>
      </div>
    </a>
  );
}
