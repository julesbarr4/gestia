"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, Mail, Phone, MapPin, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [sujet, setSujet] = useState("");
  const [message, setMessage] = useState("");
  const [envoye, setEnvoye] = useState(false);
  const [loading, setLoading] = useState(false);

  const year = new Date().getFullYear();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEnvoye(true);
    }, 800);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Gestia</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Connexion
            </Link>
            <Link href="/signup" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Essai gratuit
            </Link>
          </div>
        </div>
      </nav>

      {/* CONTENU */}
      <main className="pt-28 pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Contactez-nous</h1>
            <p className="text-gray-500">Notre équipe vous répond sous 24h.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-12">
            {/* FORMULAIRE */}
            <div>
              {envoye ? (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Message envoyé !</h2>
                  <p className="text-gray-500 text-sm">Nous revenons vers vous sous 24h.</p>
                  <button
                    onClick={() => { setEnvoye(false); setNom(""); setEmail(""); setSujet(""); setMessage(""); }}
                    className="mt-6 text-sm text-blue-600 hover:underline"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                    <input
                      type="text"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                    <input
                      type="text"
                      value={sujet}
                      onChange={(e) => setSujet(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Question sur les tarifs, support technique..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Décrivez votre demande..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Envoi en cours..." : "Envoyer le message"}
                  </button>
                </form>
              )}
            </div>

            {/* INFOS DE CONTACT */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-6 space-y-5">
                <h2 className="font-semibold text-gray-900">Nos coordonnées</h2>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Email</p>
                    <a href="mailto:contact@gestia.fr" className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                      contact@gestia.fr
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Téléphone</p>
                    <p className="text-sm font-medium text-gray-900">+33 1 23 45 67 89</p>
                    <p className="text-xs text-gray-400">Lun–Ven · 9h–18h</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Adresse</p>
                    <p className="text-sm font-medium text-gray-900">JMB TRADING</p>
                    <p className="text-sm text-gray-500">12 rue de l'Innovation<br />75001 Paris, France</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Support prioritaire</h3>
                <p className="text-sm text-gray-600">
                  Les clients Pro bénéficient d'un support prioritaire avec une réponse garantie sous <strong>4h</strong> en
                  jours ouvrés.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-gray-900">Gestia</span>
          </div>
          <p className="text-sm text-gray-400">
            © {year} Gestia — JMB TRADING · Tous droits réservés
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/cgv" className="hover:text-gray-600">CGV</Link>
            <Link href="/confidentialite" className="hover:text-gray-600">Confidentialité</Link>
            <Link href="/contact" className="hover:text-gray-600">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
