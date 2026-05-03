"use client";

import { useState } from "react";
import { formatEuros } from "@/lib/utils";

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

export function CaCard({ caEmis, caEmisPrec, caEncaisse }: {
  caEmis: number;
  caEmisPrec: number;
  caEncaisse: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <a href="/factures" style={{ textDecoration: "none", display: "block" }}>
      <div
        style={{
          background: "var(--ink)", borderRadius: "16px", padding: "24px",
          cursor: "pointer",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          boxShadow: hovered ? "0 18px 40px -22px rgba(14,14,14,0.35)" : "none",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <p style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.16em", color: "rgba(251,248,243,0.5)", marginBottom: "16px" }}>
          CA CE MOIS
        </p>
        <p style={{ fontFamily: "Instrument Serif, serif", fontSize: "32px", color: "var(--ivory)", lineHeight: 1.06, marginBottom: "4px" }}>
          {formatEuros(caEmis)}
        </p>
        {caEmisPrec > 0 && (
          <p style={{
            fontSize: "11px",
            fontFamily: "Geist Mono, monospace",
            color: caEmis >= caEmisPrec ? "oklch(0.42 0.07 155)" : "#DC2626",
            marginTop: "4px",
          }}>
            {caEmis >= caEmisPrec ? "+" : ""}
            {Math.round(((caEmis - caEmisPrec) / caEmisPrec) * 100)}% vs mois dernier
          </p>
        )}
        {caEncaisse < caEmis && (
          <p style={{ fontSize: "11px", fontFamily: "Geist Mono, monospace", color: "rgba(251,248,243,0.5)" }}>
            {formatEuros(caEncaisse)} encaissé · {formatEuros(caEmis - caEncaisse)} à encaisser
          </p>
        )}
        {caEncaisse === caEmis && caEmis > 0 && (
          <p style={{ fontSize: "11px", color: "oklch(0.42 0.07 155)", fontFamily: "Geist Mono, monospace" }}>
            ✓ Tout encaissé
          </p>
        )}
        {caEmis === 0 && (
          <p style={{ fontSize: "11px", color: "rgba(251,248,243,0.35)", fontFamily: "Geist Mono, monospace" }}>
            Créez votre première facture
          </p>
        )}
        <p style={{ fontSize: "11px", color: "rgba(251,248,243,0.35)", marginTop: "16px" }}>Ouvrir →</p>
      </div>
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
