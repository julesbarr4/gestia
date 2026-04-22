export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo/is-demo";
import { MOCK_USER } from "@/lib/demo/mock-data";
import { getMockSupabaseClient } from "@/lib/demo/mock-supabase";
import FacturesClient from "./factures-client";

export default async function FacturesPage() {
  let user: any, supabase: any;
  if (isDemoMode()) {
    user = MOCK_USER;
    supabase = getMockSupabaseClient();
  } else {
    supabase = await createClient();
    const { data: { user: u } } = await supabase.auth.getUser();
    user = u;
  }

  const { data: factures } = await supabase
    .from("factures")
    .select("*, clients(nom)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return <FacturesClient factures={factures || []} />;
}
