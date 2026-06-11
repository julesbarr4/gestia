"use client";

import Link from "next/link";
import type { Article } from "@/lib/blog/articles";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/blog/${article.slug}`} style={{ textDecoration: "none" }}>
      <article
        style={{
          background: "white",
          border: "1px solid var(--line)",
          borderRadius: "16px",
          padding: "24px 28px",
          transition: "transform 0.15s, box-shadow 0.15s",
          cursor: "pointer",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "16px",
          alignItems: "start",
        }}
        onMouseOver={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(14,14,14,0.08)";
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span style={{
              fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em",
              background: "color-mix(in oklch, var(--accent) 12%, transparent)",
              color: "var(--accent)", padding: "2px 10px", borderRadius: "999px",
              fontFamily: "Geist Mono, monospace",
            }}>
              {article.categorie}
            </span>
            <span style={{ fontSize: "11px", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace" }}>
              {article.tempsLecture} min de lecture
            </span>
          </div>
          <h2 style={{ fontFamily: "Instrument Serif, serif", fontSize: "22px", color: "var(--ink)", lineHeight: 1.2, marginBottom: "8px" }}>
            {article.titre}
          </h2>
          <p style={{ fontSize: "14px", color: "var(--ink-2)", lineHeight: 1.6 }}>
            {article.description}
          </p>
        </div>
        <div style={{ flexShrink: 0, paddingTop: "4px" }}>
          <span style={{ fontSize: "11px", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace", whiteSpace: "nowrap" }}>
            {new Date(article.datePublication).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>
      </article>
    </Link>
  );
}
