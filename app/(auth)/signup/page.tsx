"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Loader2, CheckCircle } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nomEntreprise, setNomEntreprise] = useState("");
  const [loading, setLoading] = useState(false);
  const [succes, setSucces] = useState(false);
  const [erreur, setErreur] = useState("");
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErreur("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nom_entreprise: nomEntreprise },
      },
    });

    if (error) {
      setErreur(error.message);
      setLoading(false);
      return;
    }

    setSucces(true);
    setLoading(false);
  }

  if (succes) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vérifiez votre email</h1>
          <p className="text-gray-500 text-sm">
            Un lien de confirmation a été envoyé à <strong>{email}</strong>. Cliquez dessus pour
            activer votre compte.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Gestia</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
          <p className="text-gray-500 text-sm mt-1">14 jours gratuits, sans carte bancaire</p>
        </div>

        <form onSubmit={handleSignup} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          {erreur && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{erreur}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de votre entreprise</label>
            <input
              type="text"
              value={nomEntreprise}
              onChange={(e) => setNomEntreprise(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mon Entreprise SAS"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email professionnel</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="vous@exemple.fr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="8 caractères minimum"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Créer mon compte gratuit
          </button>
          <p className="text-xs text-gray-400 text-center">
            En créant un compte, vous acceptez nos{" "}
            <a href="#" className="underline">CGV</a> et notre{" "}
            <a href="#" className="underline">politique de confidentialité</a>.
          </p>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-blue-600 font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
