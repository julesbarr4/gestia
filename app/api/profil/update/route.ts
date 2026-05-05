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
    nom_entreprise, siret, telephone, adresse, code_postal, ville,
    numero_tva, iban, bic, site_web, couleur_principale,
    mention_rge, mention_assurance, mention_garantie,
    mention_tva_debits, type_operation,
    mention_legale_custom, pied_de_page,
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
      numero_tva: numero_tva || null,
      iban: iban || null,
      bic: bic || null,
      site_web: site_web || null,
      couleur_principale: couleur_principale || "#0E0E0E",
      mention_rge: mention_rge || null,
      mention_assurance: mention_assurance || null,
      mention_garantie: mention_garantie || null,
      mention_tva_debits: mention_tva_debits ?? false,
      type_operation: type_operation || "prestations",
      mention_legale_custom: mention_legale_custom || null,
      pied_de_page: pied_de_page || null,
    })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ erreur: error.message }, { status: 500 });
  }

  return NextResponse.json({ succes: true });
}
