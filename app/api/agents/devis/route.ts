export const maxDuration = 120; // 2 min timeout Vercel

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { genererDevis } from "@/lib/agents/admin-agent";
import { genererNumeroDocument } from "@/lib/utils";
import { isDemoMode } from "@/lib/demo/is-demo";
import { mockGenererDevis } from "@/lib/demo/mock-agents";

export async function POST(req: NextRequest) {
  // demo bypass
  if (isDemoMode()) {
    const body = await req.json();
    const { descriptionProjet, clientId, nomClient } = body;
    if (!descriptionProjet || !nomClient) {
      return NextResponse.json({ erreur: "descriptionProjet et nomClient sont requis" }, { status: 400 });
    }
    const document = await mockGenererDevis({ descriptionProjet, nomClient });
    const devis = {
      id: crypto.randomUUID(),
      user_id: "demo-user-id",
      client_id: clientId || null,
      numero: genererNumeroDocument("DEV", Math.floor(Math.random() * 90) + 10),
      titre: document.titre,
      statut: "brouillon",
      lignes: document.lignes,
      total_ht: document.totalHT,
      total_tva: document.totalTVA,
      total_ttc: document.totalTTC,
      notes: document.notes,
      conditions: document.conditions,
      date_emission: new Date().toISOString().split("T")[0],
      date_validite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      genere_par_ia: true,
      created_at: new Date().toISOString(),
    };
    return NextResponse.json({ devis, document });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json();
  const { descriptionProjet, clientId, nomClient } = body;

  if (!descriptionProjet || !nomClient) {
    return NextResponse.json(
      { erreur: "descriptionProjet et nomClient sont requis" },
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
  const document = await genererDevis({ descriptionProjet, nomClient, nomEntreprise });

  const { count } = await supabase
    .from("devis")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const numero = genererNumeroDocument("DEV", (count || 0) + 1);

  const { data: devis, error } = await supabase
    .from("devis")
    .insert({
      user_id: user.id,
      client_id: clientId || null,
      numero,
      titre: document.titre,
      lignes: document.lignes,
      total_ht: document.totalHT,
      total_tva: document.totalTVA,
      total_ttc: document.totalTTC,
      notes: document.notes,
      conditions: document.conditions,
      date_validite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      genere_par_ia: true,
      prompt_ia: descriptionProjet,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ erreur: error.message }, { status: 500 });
  }

  await supabase.from("agents_logs").insert({
    user_id: user.id,
    agent: "admin-agent",
    action: "generer_devis",
    input: { descriptionProjet, nomClient },
    output: { devisId: devis.id, numero },
    duree_ms: Date.now() - debut,
  });

  return NextResponse.json({ devis, document });
}
