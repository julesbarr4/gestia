"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function FactureActions({ id }: { id: string }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function supprimer() {
    setLoading(true);
    await fetch(`/api/factures/${id}`, { method: "DELETE" });
    router.push("/factures");
  }

  return (
    <>
      <button
        onClick={() => setConfirmDelete(true)}
        style={{ fontSize: "12px", color: "#DC2626", background: "transparent", border: "1px solid #FECACA", borderRadius: "999px", padding: "6px 14px", cursor: "pointer" }}
      >
        Supprimer
      </button>

      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(14,14,14,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "var(--ivory)", borderRadius: "20px", padding: "32px", maxWidth: "380px", width: "100%", textAlign: "center" }}>
            <p style={{ fontFamily: "Instrument Serif, serif", fontSize: "22px", color: "var(--ink)", marginBottom: "10px" }}>Supprimer cette facture ?</p>
            <p style={{ fontSize: "13px", color: "var(--ink-3)", marginBottom: "24px" }}>Cette action est irréversible.</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={() => setConfirmDelete(false)} style={{ padding: "9px 20px", background: "transparent", border: "1px solid var(--line)", borderRadius: "999px", fontSize: "13px", color: "var(--ink-2)", cursor: "pointer" }}>Annuler</button>
              <button onClick={supprimer} disabled={loading} style={{ padding: "9px 20px", background: "#DC2626", color: "white", border: "none", borderRadius: "999px", fontSize: "13px", cursor: "pointer" }}>
                {loading ? "..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
