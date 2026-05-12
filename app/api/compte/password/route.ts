import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });

  const { password } = await req.json();
  if (!password || password.length < 8) {
    return NextResponse.json({ erreur: "Le mot de passe doit contenir au moins 8 caractères" }, { status: 400 });
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return NextResponse.json({ erreur: error.message }, { status: 500 });

  return NextResponse.json({ message: "Mot de passe mis à jour avec succès." });
}
