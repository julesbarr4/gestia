import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestia — Votre assistant administratif IA",
  description:
    "Gestia automatise votre gestion administrative grâce à l'intelligence artificielle. Devis, factures, relances et emails — gérés pour vous.",
  keywords: ["gestion administrative", "IA", "devis", "factures", "entrepreneur", "PME"],
  openGraph: {
    title: "Gestia — Votre assistant administratif IA",
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
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
