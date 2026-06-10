import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculerTotauxDocument } from "@/lib/documents/totaux";
import { prochainNumeroFacture } from "@/lib/documents/numerotation";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });

  const body = await req.json();
  const {
    clientId, nomClient, lignes, tauxTVA,
    conditionsPaiement, reference, notes, dateEcheance,
  } = body;

  // Les totaux envoyés par le client sont ignorés : la facture est un
  // document légal (Factur-X), ses montants sont recalculés côté serveur.
  const resultat = calculerTotauxDocument(lignes, tauxTVA);
  if (!resultat.ok) {
    return NextResponse.json({ erreur: resultat.erreur }, { status: 400 });
  }
  const totaux = resultat.totaux;

  let clientIdFinal = clientId || null;

  if (!clientIdFinal && body.nomClient?.trim()) {
    const { data: nouveauClient } = await supabase
      .from("clients")
      .insert({
        user_id: user.id,
        nom: body.nomClient.trim(),
        email: body.clientEmail || null,
        telephone: body.clientTelephone || null,
        adresse: body.clientAdresse || null,
        code_postal: body.clientCodePostal || null,
        ville: body.clientVille || null,
        siret: body.clientSiret || null,
      })
      .select("id")
      .single();

    if (nouveauClient) clientIdFinal = nouveauClient.id;
  }

  const numero = reference || await prochainNumeroFacture(user.id);

  const { data, error } = await supabase
    .from("factures")
    .insert({
      user_id: user.id,
      client_id: clientIdFinal,
      numero,
      titre: `Facture ${nomClient}`,
      statut: "brouillon",
      lignes: totaux.lignes,
      total_ht: totaux.totalHT,
      taux_tva: totaux.tauxTVA,
      total_tva: totaux.totalTVA,
      total_ttc: totaux.totalTTC,
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
