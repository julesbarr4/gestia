"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  devisId: string;
  devisNumero: string;
}

export function ConvertirEnFactureBtn({ devisId, devisNumero }: Props) {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [erreur, setErreur] = useState("");
  const router = useRouter();

  async function convertir() {
    setLoading(true);
    setErreur("");

    const res = await fetch(`/api/devis/${devisId}/convertir`, {
      method: "POST",
    });

    const data = await res.json();

    if (!res.ok) {
      setErreur(data.erreur || "Erreur lors de la conversion");
      setLoading(false);
      setConfirm(false);
      return;
    }

    router.push(`/factures/${data.facture.id}`);
  }

  return (
    <>
      <button
        onClick={() => setConfirm(true)}
        style={{
          fontSize: "12px",
          color: "var(--ivory)",
          background: "oklch(0.42 0.07 155)",
          border: "none",
          borderRadius: "999px",
          padding: "6px 16px",
          cursor: "pointer",
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        ↗ Convertir en facture
      </button>

      {confirm && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(14,14,14,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px",
        }}>
          <div style={{
            background: "var(--ivory)", borderRadius: "20px",
            padding: "36px", maxWidth: "420px", width: "100%",
          }}>
            <p style={{
              fontSize: "10px", textTransform: "uppercase",
              letterSpacing: "0.16em", color: "var(--ink-3)",
              fontFamily: "Geist Mono, monospace", marginBottom: "10px",
            }}>
              CONVERSION
            </p>
            <h2 style={{
              fontFamily: "Instrument Serif, serif",
              fontSize: "26px", color: "var(--ink)",
              lineHeight: 1.1, marginBottom: "12px",
            }}>
              Convertir <em>{devisNumero}</em><br />en facture ?
            </h2>
            <p style={{
              fontSize: "14px", color: "var(--ink-2)",
              lineHeight: 1.6, marginBottom: "24px",
            }}>
              Une nouvelle facture sera créée avec les mêmes lignes, montants et informations client. Le devis restera accessible.
            </p>

            {erreur && (
              <div style={{
                background: "#FEF2F2", color: "#991B1B",
                fontSize: "13px", padding: "10px 14px",
                borderRadius: "10px", border: "1px solid #FECACA",
                marginBottom: "16px",
              }}>
                {erreur}
              </div>
            )}

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={() => { setConfirm(false); setErreur(""); }}
                disabled={loading}
                style={{
                  padding: "10px 20px", background: "transparent",
                  border: "1px solid var(--line)", borderRadius: "999px",
                  fontSize: "13px", color: "var(--ink-2)", cursor: "pointer",
                }}
              >
                Annuler
              </button>
              <button
                onClick={convertir}
                disabled={loading}
                style={{
                  padding: "10px 22px",
                  background: loading ? "var(--ink-3)" : "oklch(0.42 0.07 155)",
                  color: "var(--ivory)", border: "none",
                  borderRadius: "999px", fontSize: "13px",
                  fontWeight: 500, cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Conversion..." : "Créer la facture →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
