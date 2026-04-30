import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });

  const body = await req.json();
  const { nom, email, telephone, adresse, code_postal, ville, siret, notes } = body;

  if (!nom?.trim()) return NextResponse.json({ erreur: "Le nom est requis" }, { status: 400 });

  const { data, error } = await supabase
    .from("clients")
    .insert({ user_id: user.id, nom: nom.trim(), email, telephone, adresse, code_postal, ville, siret, notes })
    .select()
    .single();

  if (error) return NextResponse.json({ erreur: error.message }, { status: 500 });
  return NextResponse.json({ client: data });
}
