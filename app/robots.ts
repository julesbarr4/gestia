import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/equipe", "/contact"],
        disallow: [
          "/dashboard",
          "/dashboard/",
          "/devis/",
          "/factures/",
          "/clients/",
          "/parametres/",
          "/upgrade/",
          "/emails/",
          "/rapports/",
          "/marketing/",
          "/strategie/",
          "/modeles/",
          "/api/",
          "/auth/",
          "/login",
          "/signup",
        ],
      },
      {
        userAgent: "GPTBot",
        disallow: ["/"],
      },
      {
        userAgent: "Claude-Web",
        disallow: ["/"],
      },
    ],
    sitemap: "https://gestia-beta.vercel.app/sitemap.xml",
    host: "https://gestia-beta.vercel.app",
  };
}
