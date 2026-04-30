import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });

  const body = await req.json();
  const {
    clientId, nomClient, lignes, totalHT, totalTVA, totalTTC,
    tauxTVA, conditionsPaiement, reference, notes, dateEcheance,
  } = body;

  const numero = reference || `FAC-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`;

  const { data, error } = await supabase
    .from("factures")
    .insert({
      user_id: user.id,
      client_id: clientId || null,
      numero,
      titre: `Facture ${nomClient}`,
      statut: "brouillon",
      lignes,
      total_ht: totalHT,
      taux_tva: tauxTVA,
      total_tva: totalTVA,
      total_ttc: totalTTC,
      notes: notes || null,
      conditions: conditionsPaiement,
      date_echeance: dateEcheance || null,
      genere_par_ia: true,
      nb_relances: 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ erreur: error.message }, { status: 500 });
  return NextResponse.json({ facture: data });
}
