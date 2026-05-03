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

export default function LandingPage() {
  return (
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
  );
}
