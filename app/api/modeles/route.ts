import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });

  const { data, error } = await supabase
    .from("modeles_devis")
    .select("*")
    .eq("user_id", user.id)
    .order("utilise_count", { ascending: false });

  if (error) return NextResponse.json({ erreur: error.message }, { status: 500 });
  return NextResponse.json({ modeles: data });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });

  const { nom, description, lignes, taux_tva, conditions, notes } = await req.json();

  if (!nom?.trim()) return NextResponse.json({ erreur: "Le nom est requis" }, { status: 400 });
  if (!lignes?.length) return NextResponse.json({ erreur: "Le modèle doit avoir au moins une ligne" }, { status: 400 });

  const { data, error } = await supabase
    .from("modeles_devis")
    .insert({
      user_id: user.id,
      nom: nom.trim(),
      description: description || null,
      lignes,
      taux_tva: taux_tva || 20,
      conditions: conditions || null,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ erreur: error.message }, { status: 500 });
  return NextResponse.json({ modele: data });
}
