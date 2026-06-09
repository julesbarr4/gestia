// Fonctions pures de mappage des plans Stripe.
//
// Le plan d'un utilisateur DOIT être dérivé côté serveur de l'identifiant de
// prix Stripe (source de vérité = ce qui est facturé), jamais d'une valeur
// envoyée par le client. Sinon un utilisateur peut souscrire au prix le moins
// cher tout en demandant le plan "pro" dans le corps de la requête.

import type { Plan } from "@/lib/plans/check-plan";

/**
 * Associe un price ID Stripe au plan correspondant, à partir des variables
 * d'environnement. Retourne "starter" si le prix est inconnu.
 */
export function planFromPriceId(
  priceId: string | null | undefined,
  env: NodeJS.ProcessEnv = process.env
): Plan {
  if (!priceId) return "starter";
  if (priceId === env.STRIPE_PRICE_ESSENTIEL) return "essentiel";
  if (priceId === env.STRIPE_PRICE_PRO) return "pro";
  return "starter";
}
