import { createClient } from "@/lib/supabase/server";

export async function prochainNumeroDevis(userId: string): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("prochain_numero_document", {
    p_user_id: userId,
    p_type: "devis",
  });
  const annee = new Date().getFullYear();
  return `DEV-${annee}-${String(data).padStart(4, "0")}`;
}

export async function prochainNumeroFacture(userId: string): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("prochain_numero_document", {
    p_user_id: userId,
    p_type: "facture",
  });
  const annee = new Date().getFullYear();
  return `FAC-${annee}-${String(data).padStart(4, "0")}`;
}
