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

export async function verifierEtIncrementerGeneration(userId: string, agent: string): Promise<{
  autorise: boolean;
  erreur?: string;
  planRequis?: string;
}> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, abonnement_actif, nb_generations_ia")
    .eq("id", userId)
    .single();

  const plan = (profile?.plan || "starter") as Plan;
  const abonnementActif = profile?.abonnement_actif ?? true;
  const planEffectif: Plan = (plan !== "starter" && !abonnementActif) ? "starter" : plan;

  const planRequis = AGENT_PLAN_REQUIS[agent] || "starter";
  if (PLAN_ORDRE[planEffectif] < PLAN_ORDRE[planRequis]) {
    return {
      autorise: false,
      erreur: `Cette fonctionnalité nécessite le plan ${planRequis === "pro" ? "Pro" : "Essentiel"}.${!abonnementActif && plan !== "starter" ? " Votre abonnement est inactif." : ""}`,
      planRequis,
    };
  }

  if (planEffectif === "starter") {
    const { data, error } = await supabase.rpc("verifier_et_incrementer_generation", {
      p_user_id: userId,
      p_max: LIMITES.starter.maxGenerations,
    });

    if (error || !data) {
      return { autorise: false, erreur: "Impossible de vérifier votre quota." };
    }

    if (!data.autorise) {
      return {
        autorise: false,
        erreur: `Vous avez atteint la limite de ${LIMITES.starter.maxGenerations} générations IA gratuites (devis, factures et relances confondus). Passez à l'Essentiel pour continuer.`,
        planRequis: "essentiel",
      };
    }
  }

  return { autorise: true };
}
