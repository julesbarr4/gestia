export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import FacturesClient from "./factures-client";

export default async function FacturesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: factures } = await supabase
    .from("factures")
    .select("*, clients(nom)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return <FacturesClient factures={factures || []} />;
}
