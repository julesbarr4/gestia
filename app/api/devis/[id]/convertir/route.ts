import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });

  const { data: devis, error: devisError } = await supabase
    .from("devis")
    .select("*, clients(id, nom, email)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (devisError || !devis) {
    return NextResponse.json({ erreur: "Devis introuvable" }, { status: 404 });
  }

  if (devis.statut !== "accepte") {
    return NextResponse.json(
      { erreur: "Seul un devis accepté peut être converti en facture" },
      { status: 400 }
    );
  }

  const annee = new Date().getFullYear();
  const { count } = await supabase
    .from("factures")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const numero = `FAC-${annee}-${String((count || 0) + 1).padStart(4, "0")}`;

  const dateEcheance = new Date();
  dateEcheance.setDate(dateEcheance.getDate() + 30);

  const { data: facture, error: factureError } = await supabase
    .from("factures")
    .insert({
      user_id: user.id,
      client_id: devis.client_id || null,
      devis_id: devis.id,
      numero,
      titre: devis.titre?.replace("Devis", "Facture") || `Facture ${(devis.clients as { nom?: string } | null)?.nom || ""}`,
      statut: "brouillon",
      lignes: devis.lignes,
      total_ht: devis.total_ht,
      taux_tva: devis.taux_tva,
      total_tva: devis.total_tva,
      total_ttc: devis.total_ttc,
      notes: devis.notes || null,
      conditions: devis.conditions || "Paiement sous 30 jours. En cas de retard, pénalités de 3× le taux légal.",
      date_echeance: dateEcheance.toISOString().split("T")[0],
      genere_par_ia: devis.genere_par_ia,
      nb_relances: 0,
    })
    .select()
    .single();

  if (factureError || !facture) {
    return NextResponse.json({ erreur: factureError?.message || "Erreur création facture" }, { status: 500 });
  }

  await supabase
    .from("agents_logs")
    .insert({
      user_id: user.id,
      agent: "admin",
      action: "conversion_devis_facture",
      input: { devis_id: devis.id, devis_numero: devis.numero },
      output: { facture_id: facture.id, facture_numero: facture.numero },
      statut: "succes",
    });

  return NextResponse.json({ facture });
}
