"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { formatEuros } from "@/lib/utils";
import { ClientSelector } from "@/app/(dashboard)/components/client-selector";

interface LigneFacture {
  description: string;
  quantite: number;
  prixUnitaireHT: number;
  totalHT: number;
}

interface FactureGeneree {
  titre: string;
  lignes: LigneFacture[];
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

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid var(--line)",
  borderRadius: "14px",
  padding: "10px 14px",
  fontSize: "14px",
  color: "var(--ink)",
  background: "white",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "10.5px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.16em",
  color: "var(--ink-3)",
  marginBottom: "6px",
  fontFamily: "Geist Mono, monospace",
};

export default function NouvelleFactureClient({ clients }: { clients: Client[] }) {
  const [description, setDescription] = useState("");
  const [nomClient, setNomClient] = useState("");
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [resultat, setResultat] = useState<FactureGeneree | null>(null);
  const [erreur, setErreur] = useState("");
  const router = useRouter();

  async function genererFacture(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErreur("");

    const res = await fetch("/api/agents/factures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ descriptionPrestations: description, nomClient, clientId }),
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

  return (
    <div style={{ maxWidth: "720px" }}>
      <div style={{ marginBottom: "32px" }}>
        <Link
          href="/factures"
          style={{ fontSize: "12px", fontFamily: "Geist Mono, monospace", color: "var(--ink-3)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "20px" }}
        >
          ← Retour aux factures
        </Link>
        <p style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", marginBottom: "8px", fontFamily: "Geist Mono, monospace" }}>
          NOUVELLE FACTURE
        </p>
        <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "clamp(28px, 3vw, 42px)", lineHeight: 1.06, letterSpacing: "-0.02em", color: "var(--ink)" }}>
          Générer une facture <em>avec Inès.</em>
        </h1>
      </div>

      {!resultat ? (
        <form onSubmit={genererFacture} style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", padding: "32px" }}>
          {erreur && (
            <div style={{ background: "#fef2f2", color: "#991b1b", fontSize: "13px", padding: "12px 16px", borderRadius: "8px", marginBottom: "24px" }}>
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
              <label style={labelStyle}>Description des prestations</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                style={{ ...inputStyle, resize: "none" }}
                placeholder="Ex : Développement d'un site e-commerce — 15 jours de développement, intégration Stripe, formation équipe..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: loading ? "var(--ink-3)" : "var(--ink)",
                color: "var(--ivory)", borderRadius: "999px",
                padding: "12px 24px", fontSize: "13px", fontWeight: 500,
                border: "none", cursor: loading ? "not-allowed" : "pointer",
                alignSelf: "flex-start",
              }}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Inès génère votre facture...</>
              ) : (
                "Générer la facture →"
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
              color: "var(--accent)", borderRadius: "999px", padding: "3px 10px",
              fontSize: "10.5px", fontFamily: "Geist Mono, monospace",
              textTransform: "uppercase", letterSpacing: "0.12em",
            }}>
              Généré par Inès
            </span>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "24px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--line)" }}>
                {["Description", "Qté", "PU HT", "Total HT"].map((h, i) => (
                  <th key={h} style={{ textAlign: i === 0 ? "left" : "right", padding: "8px 0", fontSize: "10.5px", fontFamily: "Geist Mono, monospace", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resultat.lignes.map((l, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 0", fontSize: "13px", color: "var(--ink-2)" }}>{l.description}</td>
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
                <span>TVA 20%</span><span>{formatEuros(resultat.totalTVA)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 6px", fontSize: "14px", fontFamily: "Geist Mono, monospace", color: "var(--ink)", fontWeight: 700, borderTop: "1px solid var(--line)", marginTop: "4px" }}>
                <span>Total TTC</span><span>{formatEuros(resultat.totalTTC)}</span>
              </div>
            </div>
          </div>

          {resultat.conditions && (
            <div style={{ background: "var(--ivory-2)", borderRadius: "8px", padding: "16px", marginBottom: "24px", fontSize: "13px", color: "var(--ink-2)" }}>
              {resultat.conditions}
            </div>
          )}

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => setResultat(null)}
              style={{
                padding: "10px 20px", fontSize: "13px", color: "var(--ink-2)",
                background: "transparent", border: "1px solid var(--line)",
                borderRadius: "999px", cursor: "pointer",
              }}
            >
              Régénérer
            </button>
            <button
              onClick={() => router.push("/factures")}
              style={{
                padding: "10px 20px", fontSize: "13px", color: "var(--ivory)",
                background: "var(--ink)", border: "none", borderRadius: "999px",
                cursor: "pointer", fontWeight: 500,
              }}
            >
              Voir mes factures →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
