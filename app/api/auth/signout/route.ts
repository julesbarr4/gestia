import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isDemoMode } from "@/lib/demo/is-demo";

export async function POST() {
  if (isDemoMode()) redirect("/");
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
