export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import ClientsClient from "./clients-client";

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return <ClientsClient clients={clients || []} />;
}
