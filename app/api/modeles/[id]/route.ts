import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });

  const { error } = await supabase
    .from("modeles_devis")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ erreur: error.message }, { status: 500 });
  return NextResponse.json({ succes: true });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });

  const body = await req.json();
  const champs: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (body.nom !== undefined) champs.nom = body.nom;
  if (body.utilise_count !== undefined) champs.utilise_count = body.utilise_count;

  const { data, error } = await supabase
    .from("modeles_devis")
    .update(champs)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ erreur: error.message }, { status: 500 });
  return NextResponse.json({ modele: data });
}
