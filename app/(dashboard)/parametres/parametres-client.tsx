"use client";

import { useState } from "react";
import { Loader2, Save, CheckCircle } from "lucide-react";

interface Profile {
  nom_entreprise?: string | null;
  siret?: string | null;
  telephone?: string | null;
  adresse?: string | null;
  code_postal?: string | null;
  ville?: string | null;
  plan?: string | null;
  abonnement_actif?: boolean | null;
}

interface Props {
  profile: Profile | null;
  email: string;
}

export default function ParametresClient({ profile, email }: Props) {
  const [form, setForm] = useState({
    nom_entreprise: profile?.nom_entreprise || "",
    siret: profile?.siret || "",
    telephone: profile?.telephone || "",
    adresse: profile?.adresse || "",
    code_postal: profile?.code_postal || "",
    ville: profile?.ville || "",
  });

  const [loading, setLoading] = useState(false);
  const [succes, setSucces] = useState(false);
  const [erreur, setErreur] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSucces(false);
    setErreur("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSucces(false);
    setErreur("");

    const res = await fetch("/api/profil/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setErreur(data.erreur || "Une erreur est survenue");
    } else {
      setSucces(true);
      setTimeout(() => setSucces(false), 3000);
    }

    setLoading(false);
  }

  const CHAMPS = [
    {
      name: "nom_entreprise",
      label: "Nom de l'entreprise",
      placeholder: "Ma Boulangerie SAS",
      type: "text",
      required: true,
      colSpan: "sm:col-span-2",
    },
    {
      name: "siret",
      label: "SIRET",
      placeholder: "123 456 789 00012",
      type: "text",
      required: false,
      colSpan: "",
    },
    {
      name: "telephone",
      label: "Téléphone",
      placeholder: "06 12 34 56 78",
      type: "tel",
      required: false,
      colSpan: "",
    },
    {
      name: "adresse",
      label: "Adresse",
      placeholder: "10 rue de la Paix",
      type: "text",
      required: false,
      colSpan: "sm:col-span-2",
    },
    {
      name: "code_postal",
      label: "Code postal",
      placeholder: "75001",
      type: "text",
      required: false,
      colSpan: "",
    },
    {
      name: "ville",
      label: "Ville",
      placeholder: "Paris",
      type: "text",
      required: false,
      colSpan: "",
    },
  ];

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-sm text-gray-500 mt-1">
          Informations de votre entreprise utilisées sur vos devis et factures
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Informations entreprise</h2>
          <p className="text-xs text-gray-400 mb-5">
            Ces informations apparaîtront sur vos devis et factures générés par Inès.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CHAMPS.map((champ) => (
              <div key={champ.name} className={champ.colSpan}>
                <label
                  htmlFor={champ.name}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {champ.label}
                  {champ.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  id={champ.name}
                  name={champ.name}
                  type={champ.type}
                  value={form[champ.name as keyof typeof form]}
                  onChange={handleChange}
                  placeholder={champ.placeholder}
                  required={champ.required}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Compte</h2>
          <p className="text-xs text-gray-400 mb-4">
            L'adresse email ne peut pas être modifiée depuis cette page.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-3 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Plan actuel</h2>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
              {profile?.plan === "pro" ? "Pro" : "Starter"}
            </span>
            <span className="text-sm text-gray-400">
              {profile?.abonnement_actif ? "Abonnement actif" : "Période d'essai"}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Pour changer de plan, contactez-nous à{" "}
            <a href="mailto:contact@gestia.fr" className="text-blue-600 hover:underline">
              contact@gestia.fr
            </a>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Enregistrer les modifications
              </>
            )}
          </button>

          {succes && (
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Modifications enregistrées
            </div>
          )}

          {erreur && (
            <p className="text-red-500 text-sm">{erreur}</p>
          )}
        </div>
      </form>
    </div>
  );
}
