import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });

  const { confirmation } = await req.json();
  if (confirmation !== "SUPPRIMER") {
    return NextResponse.json({ erreur: "Confirmation incorrecte" }, { status: 400 });
  }

  await supabase.from("clients").delete().eq("user_id", user.id);
  await supabase.from("devis").delete().eq("user_id", user.id);
  await supabase.from("factures").delete().eq("user_id", user.id);
  await supabase.from("agents_logs").delete().eq("user_id", user.id);
  await supabase.from("profiles").delete().eq("id", user.id);

  await supabase.auth.signOut();

  const { createClient: createAdmin } = await import("@supabase/supabase-js");
  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  await admin.auth.admin.deleteUser(user.id);

  return NextResponse.json({ message: "Compte supprimé" });
}
