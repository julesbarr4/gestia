import { createClient } from "@/lib/supabase/server";

export type Plan = "starter" | "essentiel" | "pro";

export const LIMITES = {
  starter: {
    maxGenerations: 5,
    agentsAutorises: ["devis", "factures", "relances"],
  },
  essentiel: {
    maxGenerations: Infinity,
    agentsAutorises: ["devis", "factures", "relances", "support", "rapport"],
  },
  pro: {
    maxGenerations: Infinity,
    agentsAutorises: ["devis", "factures", "relances", "support", "rapport", "marketing", "strategie"],
  },
};

export const AGENT_PLAN_REQUIS: Record<string, Plan> = {
  devis: "starter",
  factures: "starter",
  relances: "starter",
  support: "essentiel",
  rapport: "essentiel",
  marketing: "pro",
  strategie: "pro",
};

export const PLAN_ORDRE: Record<Plan, number> = {
  starter: 0,
  essentiel: 1,
  pro: 2,
};

export async function verifierAccesAgent(userId: string, agent: string): Promise<{
  autorise: boolean;
  erreur?: string;
  planRequis?: string;
  generationsRestantes?: number;
}> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, abonnement_actif, nb_generations_ia")
    .eq("id", userId)
    .single();

  const plan = (profile?.plan || "starter") as Plan;
  const nbGenerations = profile?.nb_generations_ia || 0;
  const limites = LIMITES[plan];

  const planRequis = AGENT_PLAN_REQUIS[agent] || "starter";
  if (PLAN_ORDRE[plan] < PLAN_ORDRE[planRequis]) {
    return {
      autorise: false,
      erreur: `Cette fonctionnalité nécessite le plan ${planRequis === "pro" ? "Pro" : "Essentiel"}.`,
      planRequis,
    };
  }

  if (plan === "starter" && nbGenerations >= limites.maxGenerations) {
    return {
      autorise: false,
      erreur: `Vous avez atteint la limite de ${limites.maxGenerations} générations gratuites. Passez à l'Essentiel pour continuer.`,
      planRequis: "essentiel",
      generationsRestantes: 0,
    };
  }

  return {
    autorise: true,
    generationsRestantes: plan === "starter"
      ? limites.maxGenerations - nbGenerations
      : Infinity,
  };
}

export async function incrementerGenerations(userId: string): Promise<void> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .single();

  // Seul le plan starter est plafonné, donc seul lui a besoin du compteur.
  if (profile?.plan && profile.plan !== "starter") return;

  // Incrément atomique côté base (voir migration 0001) : évite la race
  // condition du read-modify-write où des requêtes concurrentes lisaient
  // toutes la même valeur et dépassaient le quota gratuit.
  const { error } = await supabase.rpc("increment_generations_ia", {
    p_user_id: userId,
  });

  // Repli défensif si la fonction RPC n'est pas encore déployée.
  if (error) {
    const { data: actuel } = await supabase
      .from("profiles")
      .select("nb_generations_ia")
      .eq("id", userId)
      .single();
    await supabase
      .from("profiles")
      .update({ nb_generations_ia: (actuel?.nb_generations_ia || 0) + 1 })
      .eq("id", userId);
  }
}
