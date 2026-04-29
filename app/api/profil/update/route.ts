import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json();
  const {
    nom_entreprise,
    siret,
    telephone,
    adresse,
    code_postal,
    ville,
  } = body;

  const { error } = await supabase
    .from("profiles")
    .update({
      nom_entreprise: nom_entreprise || null,
      siret: siret || null,
      telephone: telephone || null,
      adresse: adresse || null,
      code_postal: code_postal || null,
      ville: ville || null,
    })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ erreur: error.message }, { status: 500 });
  }

  return NextResponse.json({ succes: true });
}
