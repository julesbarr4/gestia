export const maxDuration = 120; // 2 min timeout Vercel

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { genererRelance } from "@/lib/agents/admin-agent";
import { formatDate } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  const { factureId } = await req.json();

  if (!factureId) {
    return NextResponse.json({ erreur: "factureId est requis" }, { status: 400 });
  }

  const { data: facture } = await supabase
    .from("factures")
    .select("*, clients(nom, email)")
    .eq("id", factureId)
    .eq("user_id", user.id)
    .single();

  if (!facture) {
    return NextResponse.json({ erreur: "Facture introuvable" }, { status: 404 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nom_entreprise")
    .eq("id", user.id)
    .single();

  const relance = await genererRelance({
    nomClient: facture.clients?.nom || "Client",
    nomEntreprise: profile?.nom_entreprise || "Mon Entreprise",
    numeroFacture: facture.numero,
    montantTTC: facture.total_ttc,
    dateEcheance: formatDate(facture.date_echeance),
    nbRelances: facture.nb_relances,
  });

  await supabase
    .from("factures")
    .update({
      nb_relances: facture.nb_relances + 1,
      derniere_relance_at: new Date().toISOString(),
    })
    .eq("id", factureId);

  return NextResponse.json({ relance, emailDestination: facture.clients?.email });
}
