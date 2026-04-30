"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { formatEuros } from "@/lib/utils";
import { ClientSelector } from "@/app/(dashboard)/components/client-selector";

interface LigneDevis {
  description: string;
  quantite: number;
  prixUnitaireHT: number;
  totalHT: number;
}

interface DevisGenere {
  titre: string;
  lignes: LigneDevis[];
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  notes: string;
  conditions: string;
}

interface Client {
  id: string;
  nom: string;
  email?: string | null;
  ville?: string | null;
}

const TVA_OPTIONS = [
  { value: "20", label: "TVA 20% (standard)" },
  { value: "10", label: "TVA 10% (restauration, travaux)" },
  { value: "5.5", label: "TVA 5,5% (alimentaire, livres)" },
  { value: "0", label: "Sans TVA (auto-entrepreneur)" },
];

export default function NouveauDevisClient({ clients }: { clients: Client[] }) {
  const [description, setDescription] = useState("");
  const [nomClient, setNomClient] = useState("");
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  const [tva, setTva] = useState("20");
  const [loading, setLoading] = useState(false);
  const [resultat, setResultat] = useState<DevisGenere | null>(null);
  const [erreur, setErreur] = useState("");
  const router = useRouter();

  async function genererDevis(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErreur("");

    const res = await fetch("/api/agents/devis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ descriptionProjet: description, nomClient, clientId, tva }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErreur(data.erreur || "Erreur lors de la génération");
      setLoading(false);
      return;
    }

    setResultat(data.document);
    setLoading(false);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid var(--line)",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "14px",
    fontFamily: "Geist, sans-serif",
    color: "var(--ink)",
    background: "white",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "10.5px",
    fontFamily: "Geist, sans-serif",
    textTransform: "uppercase" as const,
    letterSpacing: "0.16em",
    color: "var(--ink-3)",
    marginBottom: "6px",
    fontWeight: 500,
  };

  return (
    <div style={{ padding: "40px", background: "var(--ivory)", minHeight: "100%", maxWidth: "720px" }}>
      <div style={{ marginBottom: "40px" }}>
        <Link
          href="/devis"
          style={{ fontSize: "12px", fontFamily: "Geist, sans-serif", color: "var(--ink-3)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "20px" }}
        >
          ← Retour aux devis
        </Link>
        <p style={{ fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", marginBottom: "8px" }}>
          NOUVEAU DEVIS
        </p>
        <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "36px", fontWeight: 400, color: "var(--ink)", lineHeight: 1.1 }}>
          Générer un devis avec <span style={{ fontStyle: "italic" }}>Inès.</span>
        </h1>
      </div>

      {!resultat ? (
        <form onSubmit={genererDevis} style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", padding: "32px" }}>
          {erreur && (
            <div style={{ background: "#fef2f2", color: "#991b1b", fontSize: "13px", padding: "12px 16px", borderRadius: "8px", marginBottom: "24px", fontFamily: "Geist, sans-serif" }}>
              {erreur}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <ClientSelector
              clients={clients}
              value={nomClient}
              onChange={(nom, id) => { setNomClient(nom); setClientId(id); }}
              required
            />

            <div>
              <label style={labelStyle}>Description du projet</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                style={{ ...inputStyle, resize: "none" }}
                placeholder="Ex : Création d'un site web vitrine pour une boulangerie artisanale. Inclure la page d'accueil, la carte, les horaires et un formulaire de contact…"
              />
            </div>

            <div>
              <label style={labelStyle}>Taux de TVA</label>
              <select
                value={tva}
                onChange={(e) => setTva(e.target.value)}
                style={inputStyle}
              >
                {TVA_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: loading ? "var(--ink-3)" : "var(--ink)",
                color: "var(--ivory)",
                borderRadius: "999px",
                padding: "12px 24px",
                fontSize: "13px",
                fontFamily: "Geist, sans-serif",
                fontWeight: 500,
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                alignSelf: "flex-start",
              }}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Inès rédige votre devis...</>
              ) : (
                "Générer le devis →"
              )}
            </button>
          </div>
        </form>
      ) : (
        <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", padding: "32px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px" }}>
            <div>
              <h2 style={{ fontFamily: "Instrument Serif, serif", fontSize: "24px", fontWeight: 400, color: "var(--ink)", marginBottom: "4px" }}>
                {resultat.titre}
              </h2>
              <p style={{ fontSize: "12px", fontFamily: "Geist Mono, monospace", color: "var(--ink-3)" }}>
                Client : {nomClient}
              </p>
            </div>
            <span style={{
              background: "color-mix(in oklch, var(--accent) 14%, transparent)",
              color: "var(--accent)",
              borderRadius: "999px",
              padding: "3px 10px",
              fontSize: "10.5px",
              fontFamily: "Geist, sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontWeight: 500,
            }}>
              Généré par Inès
            </span>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "24px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--line)" }}>
                <th style={{ textAlign: "left", padding: "8px 0", fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontWeight: 500 }}>Description</th>
                <th style={{ textAlign: "right", padding: "8px 0", fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontWeight: 500 }}>Qté</th>
                <th style={{ textAlign: "right", padding: "8px 0", fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontWeight: 500 }}>PU HT</th>
                <th style={{ textAlign: "right", padding: "8px 0", fontSize: "10.5px", fontFamily: "Geist, sans-serif", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontWeight: 500 }}>Total HT</th>
              </tr>
            </thead>
            <tbody>
              {resultat.lignes.map((l, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 0", fontSize: "13px", fontFamily: "Geist, sans-serif", color: "var(--ink-2)" }}>{l.description}</td>
                  <td style={{ padding: "12px 0", textAlign: "right", fontSize: "12px", fontFamily: "Geist Mono, monospace", color: "var(--ink-3)" }}>{l.quantite}</td>
                  <td style={{ padding: "12px 0", textAlign: "right", fontSize: "12px", fontFamily: "Geist Mono, monospace", color: "var(--ink-3)" }}>{formatEuros(l.prixUnitaireHT)}</td>
                  <td style={{ padding: "12px 0", textAlign: "right", fontSize: "12px", fontFamily: "Geist Mono, monospace", color: "var(--ink)", fontWeight: 600 }}>{formatEuros(l.totalHT)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "24px" }}>
            <div style={{ minWidth: "220px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "12px", fontFamily: "Geist Mono, monospace", color: "var(--ink-3)" }}>
                <span>Total HT</span><span>{formatEuros(resultat.totalHT)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "12px", fontFamily: "Geist Mono, monospace", color: "var(--ink-3)" }}>
                <span>TVA</span><span>{formatEuros(resultat.totalTVA)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 6px", fontSize: "14px", fontFamily: "Geist Mono, monospace", color: "var(--ink)", fontWeight: 700, borderTop: "1px solid var(--line)", marginTop: "4px" }}>
                <span>Total TTC</span><span>{formatEuros(resultat.totalTTC)}</span>
              </div>
            </div>
          </div>

          {resultat.notes && (
            <div style={{ background: "var(--ivory-2)", borderRadius: "8px", padding: "16px", marginBottom: "24px", fontSize: "13px", fontFamily: "Geist, sans-serif", color: "var(--ink-2)" }}>
              <strong>Notes :</strong> {resultat.notes}
            </div>
          )}

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => setResultat(null)}
              style={{
                padding: "10px 20px",
                fontSize: "13px",
                fontFamily: "Geist, sans-serif",
                color: "var(--ink-2)",
                background: "transparent",
                border: "1px solid var(--line)",
                borderRadius: "999px",
                cursor: "pointer",
              }}
            >
              Régénérer
            </button>
            <button
              onClick={() => router.push("/devis")}
              style={{
                padding: "10px 20px",
                fontSize: "13px",
                fontFamily: "Geist, sans-serif",
                color: "var(--ivory)",
                background: "var(--accent)",
                border: "none",
                borderRadius: "999px",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Sauvegarder →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
