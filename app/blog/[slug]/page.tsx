import { ARTICLES, getArticle } from "@/lib/blog/articles";
import { PublicShell } from "@/app/components/public-layout";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { BreadcrumbStructuredData } from "@/app/components/structured-data";

export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  return {
    title: article.titre,
    description: article.description,
    keywords: article.motsCles,
    alternates: {
      canonical: `https://gestia-beta.vercel.app/blog/${article.slug}`,
    },
    openGraph: {
      title: article.titre,
      description: article.description,
      type: "article",
      publishedTime: article.datePublication,
      modifiedTime: article.dateModification,
      authors: ["Gestia"],
      tags: article.motsCles,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const articlesLies = ARTICLES.filter(
    (a) => a.slug !== article.slug && a.categorie === article.categorie
  ).slice(0, 2);

  const autresArticles = articlesLies.length < 2
    ? [...articlesLies, ...ARTICLES.filter(
        (a) => a.slug !== article.slug && !articlesLies.includes(a)
      ).slice(0, 2 - articlesLies.length)]
    : articlesLies;

  return (
    <PublicShell>
      <BreadcrumbStructuredData items={[
        { name: "Accueil", url: "https://gestia-beta.vercel.app" },
        { name: "Blog", url: "https://gestia-beta.vercel.app/blog" },
        { name: article.titre, url: `https://gestia-beta.vercel.app/blog/${article.slug}` },
      ]} />

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "80px 40px 60px" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px", fontSize: "13px", color: "var(--ink-3)" }}>
          <Link href="/" style={{ color: "var(--ink-3)", textDecoration: "none" }}>Accueil</Link>
          <span>→</span>
          <Link href="/blog" style={{ color: "var(--ink-3)", textDecoration: "none" }}>Blog</Link>
          <span>→</span>
          <span style={{ color: "var(--ink-2)" }}>{article.categorie}</span>
        </div>

        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <span style={{
              fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em",
              background: "color-mix(in oklch, var(--accent) 12%, transparent)",
              color: "var(--accent)", padding: "3px 12px", borderRadius: "999px",
              fontFamily: "Geist Mono, monospace",
            }}>
              {article.categorie}
            </span>
            <span style={{ fontSize: "12px", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace" }}>
              {article.tempsLecture} min de lecture
            </span>
          </div>
          <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "clamp(28px, 4vw, 42px)", lineHeight: 1.1, color: "var(--ink)", marginBottom: "16px" }}>
            {article.titre}
          </h1>
          <p style={{ fontSize: "16px", color: "var(--ink-2)", lineHeight: 1.6, marginBottom: "16px" }}>
            {article.description}
          </p>
          <p style={{ fontSize: "12px", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace" }}>
            Publié le {new Date(article.datePublication).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            {article.dateModification !== article.datePublication && (
              <> · Mis à jour le {new Date(article.dateModification).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</>
            )}
          </p>
        </div>

        <div style={{ height: "1px", background: "var(--line)", marginBottom: "40px" }} />

        <div
          className="prose-gestia"
          dangerouslySetInnerHTML={{ __html: article.contenu }}
        />

        <div style={{ marginTop: "48px", padding: "32px", background: "var(--ink)", borderRadius: "16px", textAlign: "center" }}>
          <p style={{ fontFamily: "Instrument Serif, serif", fontSize: "24px", color: "var(--ivory)", marginBottom: "10px" }}>
            <em>Automatisez votre facturation avec Gestia.</em>
          </p>
          <p style={{ fontSize: "14px", color: "rgba(251,248,243,0.6)", marginBottom: "20px", lineHeight: 1.6 }}>
            Inès génère vos devis et factures conformes en 30 secondes. Essai gratuit, sans carte bancaire.
          </p>
          <Link href="/signup" style={{
            display: "inline-block",
            background: "var(--ivory)", color: "var(--ink)",
            borderRadius: "999px", padding: "12px 28px",
            fontSize: "14px", fontWeight: 500, textDecoration: "none",
          }}>
            Essayer gratuitement →
          </Link>
        </div>

        {autresArticles.length > 0 && (
          <div style={{ marginTop: "48px" }}>
            <p style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace", marginBottom: "20px" }}>
              ARTICLES LIÉS
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              {autresArticles.map((a) => (
                <Link key={a.slug} href={`/blog/${a.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{ padding: "18px", background: "white", border: "1px solid var(--line)", borderRadius: "12px" }}>
                    <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", fontFamily: "Geist Mono, monospace", marginBottom: "6px" }}>
                      {a.categorie}
                    </p>
                    <p style={{ fontFamily: "Instrument Serif, serif", fontSize: "15px", color: "var(--ink)", lineHeight: 1.3 }}>
                      {a.titre}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </PublicShell>
  );
}
