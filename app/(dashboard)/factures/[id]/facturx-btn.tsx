"use client";
import { useState } from "react";

interface Props {
  factureId: string;
  factureNumero: string;
  hasSiret: boolean;
}

export function FacturXBtn({ factureId, factureNumero, hasSiret }: Props) {
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  async function telecharger() {
    if (!hasSiret) {
      setErreur("Complétez votre SIRET dans les paramètres d'abord.");
      setTimeout(() => setErreur(""), 4000);
      return;
    }

    setLoading(true);
    setErreur("");

    const res = await fetch(`/api/facturx/${factureId}`);

    if (!res.ok) {
      const data = await res.json();
      setErreur(data.erreur || "Erreur");
      setLoading(false);
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `factur-x-${factureNumero}.xml`;
    a.click();
    URL.revokeObjectURL(url);
    setLoading(false);
  }

  return (
    <div>
      <button
        onClick={telecharger}
        disabled={loading}
        style={{
          fontSize: "12px",
          color: loading ? "var(--ink-3)" : "var(--ivory)",
          background: loading ? "var(--ivory-2)" : "oklch(0.42 0.07 155)",
          border: "none",
          borderRadius: "999px",
          padding: "6px 14px",
          cursor: loading ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          fontWeight: 500,
        }}
      >
        {loading ? "Génération..." : "↓ Factur-X (XML)"}
      </button>
      {erreur && (
        <p style={{ fontSize: "11px", color: "#DC2626", marginTop: "4px" }}>{erreur}</p>
      )}
    </div>
  );
}
