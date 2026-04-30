export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import NouveauDevisClient from "./nouveau-devis-client";

export default async function NouveauDevisPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: clients } = await supabase
    .from("clients")
    .select("id, nom, email, ville")
    .eq("user_id", user!.id)
    .order("nom", { ascending: true });

  return <NouveauDevisClient clients={clients || []} />;
}
