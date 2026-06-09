// Validation des chemins de redirection post-authentification.
//
// Le paramètre `next` d'un callback OAuth est contrôlé par l'attaquant
// (lien forgé). Sans validation, `new URL(next, origin)` suit une URL absolue
// comme "https://evil.com" → redirection ouverte exploitable en phishing.

/**
 * Retourne un chemin interne sûr (commençant par "/" mais pas "//"), ou la
 * valeur de repli si `next` est absent, externe ou malformé.
 */
export function chemininInterneSur(
  next: string | null | undefined,
  repli = "/dashboard"
): string {
  if (!next) return repli;

  // Doit être un chemin absolu interne : "/quelque-chose".
  // On rejette "//evil.com" (protocol-relative) et "/\evil.com".
  if (!next.startsWith("/")) return repli;
  if (next.startsWith("//") || next.startsWith("/\\")) return repli;

  // Rejette toute tentative d'URL absolue glissée dans le chemin.
  if (/^\/+[a-z][a-z0-9+.-]*:/i.test(next)) return repli;

  return next;
}
