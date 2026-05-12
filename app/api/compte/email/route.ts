import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });

  const { email } = await req.json();
  if (!email?.trim()) return NextResponse.json({ erreur: "Email requis" }, { status: 400 });

  const { error } = await supabase.auth.updateUser({ email });
  if (error) return NextResponse.json({ erreur: error.message }, { status: 500 });

  return NextResponse.json({ message: "Un email de confirmation a été envoyé à votre nouvelle adresse." });
}
