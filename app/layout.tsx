import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  weight: ["300", "400", "500", "600"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ["400", "500"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: "Gestia — Le cabinet exécutif qui ne dort jamais",
  description:
    "Gestia est une équipe de cinq agents intelligents — administratif, support, finance, marketing, stratégie — qui prennent en charge la gestion de votre entreprise.",
  keywords: ["gestion administrative", "IA", "devis", "factures", "entrepreneur", "PME"],
  openGraph: {
    title: "Gestia — Le cabinet exécutif qui ne dort jamais",
    description: "Automatisez votre admin avec l'IA. Pour les entrepreneurs français.",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body className={geistSans.className}>{children}</body>
    </html>
  );
}
