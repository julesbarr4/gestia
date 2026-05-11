export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { DocumentForm } from "@/app/(dashboard)/components/document-form";

export default async function NouveauDevisPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: clients } = await supabase
    .from("clients")
    .select("id, nom, email, ville, siret, telephone, adresse, code_postal, numero_tva")
    .eq("user_id", user!.id)
    .order("nom", { ascending: true });

  return (
    <DocumentForm
      type="devis"
      clients={clients || []}
      agentEndpoint="/api/agents/devis"
      sauvegardeEndpoint="/api/devis"
      retourHref="/devis"
      titreIA="Générer avec Inès →"
    />
  );
}
