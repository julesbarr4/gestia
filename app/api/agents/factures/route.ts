export const maxDuration = 120; // 2 min timeout Vercel

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { genererFacture } from "@/lib/agents/admin-agent";
import { genererNumeroDocument } from "@/lib/utils";
import { isDemoMode } from "@/lib/demo/is-demo";
import { mockGenererFacture } from "@/lib/demo/mock-agents";

export async function POST(req: NextRequest) {
  // demo bypass
  if (isDemoMode()) {
    const body = await req.json();
    const { descriptionPrestations, clientId, nomClient, devisId, devisReference } = body;
    if (!descriptionPrestations || !nomClient) {
      return NextResponse.json({ erreur: "descriptionPrestations et nomClient sont requis" }, { status: 400 });
    }
    const document = await mockGenererFacture({ descriptionPrestations, nomClient, devisReference });
    const dateEcheance = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const facture = {
      id: crypto.randomUUID(),
      user_id: "demo-user-id",
      client_id: clientId || null,
      devis_id: devisId || null,
      numero: genererNumeroDocument("FAC", Math.floor(Math.random() * 90) + 10),
      titre: document.titre,
      statut: "brouillon",
      lignes: document.lignes,
      total_ht: document.totalHT,
      total_tva: document.totalTVA,
      total_ttc: document.totalTTC,
      notes: document.notes,
      conditions: document.conditions,
      date_emission: new Date().toISOString().split("T")[0],
      date_echeance: dateEcheance,
      genere_par_ia: true,
      nb_relances: 0,
      created_at: new Date().toISOString(),
    };
    return NextResponse.json({ facture, document });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
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

  const document = await genererFacture({
    descriptionPrestations,
    nomClient,
    nomEntreprise,
    devisReference,
  });

  const { count } = await supabase
    .from("factures")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const numero = genererNumeroDocument("FAC", (count || 0) + 1);
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
      lignes: document.lignes,
      total_ht: document.totalHT,
      total_tva: document.totalTVA,
      total_ttc: document.totalTTC,
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
}
