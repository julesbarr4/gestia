export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import ModelesClient from "./modeles-client";

export default async function ModelesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: modeles } = await supabase
    .from("modeles_devis")
    .select("*")
    .eq("user_id", user!.id)
    .order("utilise_count", { ascending: false });

  return <ModelesClient modeles={modeles || []} />;
}
