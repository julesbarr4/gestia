export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { UpgradeClient } from "./upgrade-client";

export default async function UpgradePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, abonnement_actif, nom_entreprise")
    .eq("id", user!.id)
    .single();

  return (
    <UpgradeClient
      planActuel={profile?.plan || "starter"}
      abonnementActif={profile?.abonnement_actif || false}
    />
  );
}
