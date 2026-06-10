export const maxDuration = 120;

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { genererFacture } from "@/lib/agents/admin-agent";
import { prochainNumeroFacture } from "@/lib/documents/numerotation";
import { calculerTotauxDocument } from "@/lib/documents/totaux";
import { verifierEtIncrementerGeneration } from "@/lib/plans/check-plan";
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  const acces = await verifierEtIncrementerGeneration(user.id, "factures");
  if (!acces.autorise) {
    return NextResponse.json(
      { erreur: acces.erreur, planRequis: acces.planRequis, limite: true },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { descriptionPrestations, clientId, nomClient, devisId, devisReference } = body;

  if (!descriptionPrestations || !nomClient) {
    return NextResponse.json(
      { erreur: "descriptionPrestations et nomClient sont requis" },
      { status: 400 }
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nom_entreprise")
    .eq("id", user.id)
    .single();

  const nomEntreprise = profile?.nom_entreprise || "Mon Entreprise";
  const debut = Date.now();

  try {
    const document = await genererFacture({
      descriptionPrestations,
      nomClient,
      nomEntreprise,
      devisReference,
    });

    const resultat = calculerTotauxDocument(document.lignes);
    if (!resultat.ok) {
      await supabase.rpc("rembourser_generation", { p_user_id: user.id });
      return NextResponse.json(
        { erreur: `Document généré invalide : ${resultat.erreur}` },
        { status: 502 }
      );
    }
    const totaux = resultat.totaux;

    const numero = await prochainNumeroFacture(user.id);
    const dateEcheance = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const { data: facture, error } = await supabase
      .from("factures")
      .insert({
        user_id: user.id,
        client_id: clientId || null,
        devis_id: devisId || null,
        numero,
        titre: document.titre,
        lignes: totaux.lignes,
        total_ht: totaux.totalHT,
        taux_tva: totaux.tauxTVA,
        total_tva: totaux.totalTVA,
        total_ttc: totaux.totalTTC,
        notes: document.notes,
        conditions: document.conditions,
        date_echeance: dateEcheance,
        genere_par_ia: true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ erreur: error.message }, { status: 500 });
    }

    await supabase.from("agents_logs").insert({
      user_id: user.id,
      agent: "admin-agent",
      action: "generer_facture",
      input: { descriptionPrestations, nomClient },
      output: { factureId: facture.id, numero },
      duree_ms: Date.now() - debut,
    });

    return NextResponse.json({ facture, document });
  } catch (err) {
    await supabase.rpc("rembourser_generation", { p_user_id: user.id });
    console.error("Erreur génération facture:", err);
    return NextResponse.json(
      { erreur: "Erreur lors de la génération. Votre quota n'a pas été débité." },
      { status: 500 }
    );
  }
}
