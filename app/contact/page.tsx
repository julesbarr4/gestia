import { PublicShell } from "@/app/components/public-layout";
import { ContactForm } from "./contact-form";

export const metadata = {
  title: "Contact — Gestia",
};

export default function ContactPage() {
  return (
    <PublicShell>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "80px 40px" }}>
        <p style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", marginBottom: "12px", fontFamily: "Geist Mono, monospace" }}>CONTACT</p>
        <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "42px", lineHeight: 1.06, color: "var(--ink)", marginBottom: "8px" }}>
          Parlons de<br /><em>votre projet.</em>
        </h1>
        <p style={{ fontSize: "15px", color: "var(--ink-2)", marginBottom: "48px", lineHeight: 1.55 }}>
          Une question sur Gestia ? Notre équipe répond sous 24h.
        </p>

        <ContactForm />

        <div style={{ marginTop: "48px", padding: "24px", background: "var(--ivory-2)", borderRadius: "16px", border: "1px solid var(--line)" }}>
          <p style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", marginBottom: "12px", fontFamily: "Geist Mono, monospace" }}>CONTACT DIRECT</p>
          <p style={{ fontSize: "14px", color: "var(--ink-2)" }}>
            Email : <a href="mailto:contact@gestia.fr" style={{ color: "var(--ink)", textDecoration: "underline", textUnderlineOffset: "3px" }}>contact@gestia.fr</a>
          </p>
          <p style={{ fontSize: "12px", color: "var(--ink-3)", marginTop: "6px", fontFamily: "Geist Mono, monospace" }}>Réponse garantie sous 24h ouvrées</p>
        </div>
      </div>
    </PublicShell>
  );
}
