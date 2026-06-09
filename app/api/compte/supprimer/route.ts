import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });

  const { confirmation } = await req.json();
  if (confirmation !== "SUPPRIMER") {
    return NextResponse.json({ erreur: "Confirmation incorrecte" }, { status: 400 });
  }

  // Purge RGPD transactionnelle : la RPC supprime TOUTES les tables liées à
  // l'utilisateur (voir supabase/migrations/0002_rgpd_suppression_compte.sql)
  // dans une transaction unique. En cas d'échec, rien n'est supprimé — on ne
  // laisse jamais un compte dans un état partiellement purgé.
  const { error: erreurPurge } = await supabase.rpc("supprimer_compte_utilisateur");
  if (erreurPurge) {
    console.error("Échec purge RGPD:", erreurPurge);
    return NextResponse.json(
      { erreur: "La suppression du compte a échoué. Aucune donnée n'a été supprimée, veuillez réessayer." },
      { status: 500 }
    );
  }

  // Révocation de l'authentification Supabase (supprime l'utilisateur
  // d'auth.users et invalide toutes ses sessions).
  const { createClient: createAdmin } = await import("@supabase/supabase-js");
  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { error: erreurAuth } = await admin.auth.admin.deleteUser(user.id);
  if (erreurAuth) {
    console.error("Échec suppression auth:", erreurAuth);
    return NextResponse.json(
      { erreur: "Vos données ont été supprimées mais la désactivation du compte a échoué. Contactez le support." },
      { status: 500 }
    );
  }

  await supabase.auth.signOut();

  return NextResponse.json({ message: "Compte supprimé" });
}
