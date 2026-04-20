import { createClient } from "@/lib/supabase/server";

export default async function ParametresPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-sm text-gray-500 mt-1">Informations de votre entreprise</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
        <div>
          <h2 className="font-semibold text-gray-900 mb-4">Informations entreprise</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {[
              { label: "Nom entreprise", valeur: profile?.nom_entreprise },
              { label: "Email", valeur: user?.email },
              { label: "SIRET", valeur: profile?.siret },
              { label: "Téléphone", valeur: profile?.telephone },
              { label: "Adresse", valeur: profile?.adresse },
              { label: "Ville", valeur: profile?.ville },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-xs text-gray-400 mb-0.5">{f.label}</p>
                <p className="text-gray-700">{f.valeur || <span className="text-gray-300">Non renseigné</span>}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h2 className="font-semibold text-gray-900 mb-2">Plan actuel</h2>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
              {profile?.plan === "pro" ? "Pro" : "Starter"}
            </span>
            <span className="text-sm text-gray-400">
              {profile?.abonnement_actif ? "Abonnement actif" : "Période d'essai"}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-400">
            Pour modifier vos informations ou changer de plan, contactez-nous à{" "}
            <a href="mailto:contact@gestia.fr" className="text-blue-600 hover:underline">
              contact@gestia.fr
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
