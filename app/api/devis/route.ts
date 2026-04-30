import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });

  const body = await req.json();
  const {
    clientId, nomClient, lignes, totalHT, totalTVA, totalTTC,
    tauxTVA, conditionsPaiement, reference, notes, validite,
  } = body;

  const numero = reference || `DEV-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`;
  const dateValidite = validite
    ? new Date(Date.now() + Number(validite) * 86400000).toISOString().split("T")[0]
    : null;

  const { data, error } = await supabase
    .from("devis")
    .insert({
      user_id: user.id,
      client_id: clientId || null,
      numero,
      titre: `Devis ${nomClient}`,
      statut: "brouillon",
      lignes,
      total_ht: totalHT,
      taux_tva: tauxTVA,
      total_tva: totalTVA,
      total_ttc: totalTTC,
      notes: notes || null,
      conditions: conditionsPaiement,
      date_validite: dateValidite,
      genere_par_ia: true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ erreur: error.message }, { status: 500 });
  return NextResponse.json({ devis: data });
}
