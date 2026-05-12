import { createClient } from "@/lib/supabase/server";

export type Plan = "starter" | "essentiel" | "pro";

export const LIMITES = {
  starter: {
    maxGenerations: 5,
    agentsAutorises: ["devis", "factures", "relances", "support", "rapport", "marketing", "strategie"],
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
  support: "starter",
  rapport: "starter",
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
    .select("plan, nb_generations_ia")
    .eq("id", userId)
    .single();

  if (profile?.plan === "starter" || !profile?.plan) {
    await supabase
      .from("profiles")
      .update({ nb_generations_ia: (profile?.nb_generations_ia || 0) + 1 })
      .eq("id", userId);
  }
}
