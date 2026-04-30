import { PublicShell } from "./components/public-layout";
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

export default function LandingPage() {
  return (
    <PublicShell>
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
    </PublicShell>
  );
}
