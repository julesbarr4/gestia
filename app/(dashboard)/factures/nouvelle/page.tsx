export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import NouvelleFactureClient from "./nouvelle-facture-client";

export default async function NouvelleFacturePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: clients } = await supabase
    .from("clients")
    .select("id, nom, email, ville")
    .eq("user_id", user!.id)
    .order("nom", { ascending: true });

  return <NouvelleFactureClient clients={clients || []} />;
}
