export const maxDuration = 120;

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { genererRelance } from "@/lib/agents/admin-agent";
import { formatDate } from "@/lib/utils";
import { verifierEtIncrementerGeneration } from "@/lib/plans/check-plan";
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  const acces = await verifierEtIncrementerGeneration(user.id, "relances");
  if (!acces.autorise) {
    return NextResponse.json(
      { erreur: acces.erreur, planRequis: acces.planRequis, limite: true },
      { status: 403 }
    );
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

  try {
    const { data: nbRelancesApres, error: relanceError } = await supabase.rpc(
      "incrementer_relance",
      { p_facture_id: factureId, p_user_id: user.id }
    );

    if (relanceError) {
      if (relanceError.message?.includes("RELANCE_TROP_RAPIDE")) {
        return NextResponse.json(
          { erreur: "Une relance vient d'être générée. Attendez une minute avant d'en envoyer une autre." },
          { status: 429 }
        );
      }
      throw relanceError;
    }

    const nbRelances = (nbRelancesApres as number) - 1;

    const relance = await genererRelance({
      nomClient: facture.clients?.nom || "Client",
      nomEntreprise: profile?.nom_entreprise || "Mon Entreprise",
      numeroFacture: facture.numero,
      montantTTC: facture.total_ttc,
      dateEcheance: formatDate(facture.date_echeance),
      nbRelances,
    });

    await supabase.from("agents_logs").insert({
      user_id: user.id, agent: "admin", action: "generer_relance",
      input: { factureId }, output: { niveau: nbRelancesApres }, statut: "succes",
    });

    return NextResponse.json({ relance, emailDestination: facture.clients?.email });
  } catch (err) {
    await supabase.rpc("rembourser_generation", { p_user_id: user.id });
    console.error("Erreur génération relance:", err);
    return NextResponse.json(
      { erreur: "Erreur lors de la génération. Votre quota n'a pas été débité." },
      { status: 500 }
    );
  }
}
