import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateFacturXML } from "@/lib/facturx/generate-xml";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });

  const { data: facture } = await supabase
    .from("factures")
    .select("*, clients(nom, siret, email, adresse, code_postal, ville)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!facture) return NextResponse.json({ erreur: "Facture introuvable" }, { status: 404 });


  const { data: profile } = await supabase
    .from("profiles")
    .select("nom_entreprise, siret, numero_tva, adresse, code_postal, ville, iban, bic, mention_tva_debits, type_operation")
    .eq("id", user.id)
    .single();

  if (!profile?.siret) {
    return NextResponse.json(
      { erreur: "Votre SIRET est manquant. Complétez vos paramètres avant de télécharger le Factur-X." },
      { status: 400 }
    );
  }

  const client = facture.clients as {
    nom?: string; siret?: string; email?: string;
    adresse?: string; code_postal?: string; ville?: string;
  } | null;

  const lignes = (facture.lignes as Array<{
    description: string;
    quantite: number;
    prixUnitaireHT: number;
    totalHT: number;
  }>) || [];

  const xml = generateFacturXML({
    numero: facture.numero,
    dateEmission: facture.date_emission,
    dateEcheance: facture.date_echeance,
    typeOperation: (profile.type_operation as "biens" | "prestations" | "mixte") || "prestations",
    mentionTvaDebits: profile.mention_tva_debits || false,

    emetteurNom: profile.nom_entreprise || "Mon Entreprise",
    emetteurSiret: profile.siret,
    emetteurNumeroTva: profile.numero_tva,
    emetteurAdresse: profile.adresse,
    emetteurCodePostal: profile.code_postal,
    emetteurVille: profile.ville,

    clientNom: client?.nom || "Client",
    clientSiret: client?.siret,
    clientAdresse: client?.adresse,
    clientCodePostal: client?.code_postal,
    clientVille: client?.ville,

    lignes: lignes.map(l => ({
      ...l,
      tauxTVA: facture.taux_tva,
    })),

    totalHT: facture.total_ht,
    totalTVA: facture.total_tva,
    totalTTC: facture.total_ttc,
    tauxTVA: facture.taux_tva,

    iban: profile.iban,
    bic: profile.bic,
  });

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Content-Disposition": `attachment; filename="factur-x-${facture.numero}.xml"`,
    },
  });
}
