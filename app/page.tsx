import type { Metadata } from "next";
import { FAQStructuredData } from "@/app/components/structured-data";
import Navbar from "./_components/landing/Navbar";
import Hero from "./_components/landing/Hero";
import LogoStrip from "./_components/landing/LogoStrip";
import TeamSection from "./_components/landing/TeamSection";
import Features from "./_components/landing/Features";
import HowItWorks from "./_components/landing/HowItWorks";
import Testimonials from "./_components/landing/Testimonials";
import Pricing from "./_components/landing/Pricing";
import Manifesto from "./_components/landing/Manifesto";
import FAQ from "./_components/landing/FAQ";
import FinalCTA from "./_components/landing/FinalCTA";
import Footer from "./_components/landing/Footer";

export const metadata: Metadata = {
  title: "Logiciel de devis et facturation IA pour artisans et TPE",
  description:
    "Gestia automatise vos devis, factures et relances grâce à l'IA. Inès génère vos documents en 30 secondes. Conforme Factur-X RFE 2026. Essai gratuit.",
  alternates: {
    canonical: "https://gestia-beta.vercel.app",
  },
  openGraph: {
    title: "Gestia — Logiciel de devis et facturation IA pour artisans",
    description:
      "5 agents IA qui automatisent votre admin. Devis en 30s, facturation conforme RFE 2026, relances automatiques.",
    url: "https://gestia-beta.vercel.app",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function LandingPage() {
  return (
    <>
      <div style={{ minHeight: "100vh", background: "var(--ivory)" }}>
        <Navbar />
        <main>
          <Hero />
          <LogoStrip />
          <TeamSection />
          <Features />
          <HowItWorks />
          <Testimonials />
          <Pricing />
          <Manifesto />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
      </div>
      <FAQStructuredData />
    </>
  );
}
