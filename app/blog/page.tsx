import { ARTICLES } from "@/lib/blog/articles";
import { PublicShell } from "@/app/components/public-layout";
import { ArticleCard } from "./article-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Conseils facturation et gestion pour artisans",
  description:
    "Guides pratiques sur la facturation, les devis et la gestion administrative pour artisans, auto-entrepreneurs et TPE françaises.",
  alternates: { canonical: "https://gestia-beta.vercel.app/blog" },
};

export default function BlogPage() {
  return (
    <PublicShell>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "80px 40px 60px" }}>
        <p style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--ink-3)", marginBottom: "12px", fontFamily: "Geist Mono, monospace" }}>
          BLOG GESTIA
        </p>
        <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "48px", lineHeight: 1.06, color: "var(--ink)", marginBottom: "16px" }}>
          Conseils pour <em>mieux gérer votre entreprise.</em>
        </h1>
        <p style={{ fontSize: "16px", color: "var(--ink-2)", marginBottom: "48px", lineHeight: 1.6, maxWidth: "600px" }}>
          Guides pratiques sur la facturation, les devis et la gestion administrative pour artisans, auto-entrepreneurs et TPE françaises.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {ARTICLES.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </PublicShell>
  );
}
