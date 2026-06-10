import type { Metadata, Viewport } from "next";
import { OrganizationStructuredData } from "@/app/components/structured-data";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FBF8F3",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://gestia-beta.vercel.app"),
  title: {
    default: "Gestia — Logiciel de devis et facturation IA pour artisans et TPE",
    template: "%s | Gestia",
  },
  description:
    "Gestia automatise vos devis, factures et relances grâce à l'intelligence artificielle. Conforme Factur-X et RFE 2026. Essai gratuit sans carte bancaire.",
  keywords: [
    "logiciel devis facturation",
    "facturation IA artisan",
    "devis automatique TPE",
    "logiciel facture auto-entrepreneur",
    "facturation électronique 2026",
    "Factur-X conforme",
    "gestion administrative PME",
    "devis facture en ligne",
    "logiciel comptabilité artisan",
    "facture automatique IA",
    "relance facture impayée",
    "Inès agent IA facturation",
  ],
  authors: [{ name: "Gestia", url: "https://gestia-beta.vercel.app" }],
  creator: "Gestia",
  publisher: "Gestia",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://gestia-beta.vercel.app",
    siteName: "Gestia",
    title: "Gestia — Logiciel de devis et facturation IA pour artisans et TPE",
    description:
      "Automatisez vos devis, factures et relances avec l'IA. Conforme Factur-X RFE 2026. 5 agents IA dédiés à votre gestion administrative.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gestia — Logiciel de facturation IA pour artisans",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gestia — Logiciel de devis et facturation IA pour artisans",
    description:
      "Automatisez vos devis, factures et relances avec l'IA. Conforme Factur-X RFE 2026.",
    images: ["/og-image.png"],
    creator: "@gestia_fr",
  },
  alternates: {
    canonical: "https://gestia-beta.vercel.app",
    languages: {
      "fr-FR": "https://gestia-beta.vercel.app",
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
  category: "business",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={geistSans.className}>
        <OrganizationStructuredData />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
