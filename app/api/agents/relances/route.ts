export const maxDuration = 120; // 2 min timeout Vercel

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { genererRelance } from "@/lib/agents/admin-agent";
import { formatDate } from "@/lib/utils";
import { isDemoMode } from "@/lib/demo/is-demo";
import { mockGenererRelance } from "@/lib/demo/mock-agents";
import { MOCK_FACTURES, MOCK_PROFILE } from "@/lib/demo/mock-data";

export async function POST(req: NextRequest) {
  if (isDemoMode()) {
    const { factureId } = await req.json();
    const facture = MOCK_FACTURES.find((f) => f.id === factureId);

    if (!facture) {
      return NextResponse.json({ erreur: "Facture introuvable" }, { status: 404 });
    }

    const relance = await mockGenererRelance({
      nomClient: facture.clients?.nom || "Client",
      nomEntreprise: MOCK_PROFILE.nom_entreprise,
      numeroFacture: facture.numero,
      montantTTC: facture.total_ttc,
      dateEcheance: facture.date_echeance || "",
      nbRelances: facture.nb_relances || 0,
    });

    const clientEmail = (facture.clients as { nom?: string; email?: string } | null)?.email;
    return NextResponse.json({ relance, emailDestination: clientEmail || "client@exemple.fr" });
  }

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
