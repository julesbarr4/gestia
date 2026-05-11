"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ClientModal } from "./client-modal";

interface Client {
  id: string;
  nom: string;
  email?: string | null;
  telephone?: string | null;
  ville?: string | null;
  siret?: string | null;
  notes?: string | null;
  adresse?: string | null;
  code_postal?: string | null;
  numero_tva?: string | null;
  created_at: string;
}

export default function ClientsClient({ clients: initialClients }: { clients: Client[] }) {
  const [clients] = useState(initialClients);
  const [showModal, setShowModal] = useState(false);
  const [clientEdit, setClientEdit] = useState<Client | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const router = useRouter();

  const rafraichir = useCallback(() => {
    router.refresh();
    setShowModal(false);
    setClientEdit(null);
  }, [router]);

  async function supprimerClient(id: string) {
    setLoadingDelete(true);
    await fetch(`/api/clients/${id}`, { method: "DELETE" });
    setConfirmDelete(null);
    setLoadingDelete(false);
    router.refresh();
  }

  return (
    <div style={{ maxWidth: "1000px" }}>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <p style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", marginBottom: "6px", fontFamily: "Geist Mono, monospace" }}>CLIENTS</p>
          <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "38px", lineHeight: 1.06, color: "var(--ink)" }}>
            Vos <em>clients.</em>
          </h1>
        </div>
        <button
          onClick={() => { setClientEdit(null); setShowModal(true); }}
          style={{ padding: "10px 22px", background: "var(--ink)", color: "var(--ivory)", border: "none", borderRadius: "999px", fontSize: "13.5px", fontWeight: 500, cursor: "pointer" }}
        >
          Nouveau client →
        </button>
      </div>

      {clients.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <p style={{ fontFamily: "Instrument Serif, serif", fontSize: "24px", color: "var(--ink)", marginBottom: "10px" }}>
            Aucun client pour le moment.
          </p>
          <p style={{ fontSize: "14px", color: "var(--ink-3)", marginBottom: "28px" }}>
            Ajoutez votre premier client pour commencer.
          </p>
          <button
            onClick={() => setShowModal(true)}
            style={{ padding: "11px 24px", background: "var(--ink)", color: "var(--ivory)", border: "none", borderRadius: "999px", fontSize: "13.5px", fontWeight: 500, cursor: "pointer" }}
          >
            Ajouter un client →
          </button>
        </div>
      ) : (
        <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 80px", padding: "12px 24px", background: "var(--ivory-2)", borderBottom: "1px solid var(--line)" }}>
            {["NOM", "EMAIL", "TÉLÉPHONE", "VILLE", ""].map((h) => (
              <p key={h} style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace" }}>{h}</p>
            ))}
          </div>

          {clients.map((client, i) => (
            <div
              key={client.id}
              onClick={() => router.push(`/clients/${client.id}`)}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1.5fr 1fr 1fr 80px",
                padding: "16px 24px",
                alignItems: "center",
                borderBottom: i < clients.length - 1 ? "1px solid var(--line)" : "none",
                cursor: "pointer",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "var(--ivory-2)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div>
                <p style={{ fontFamily: "Instrument Serif, serif", fontSize: "15px", color: "var(--ink)" }}>{client.nom}</p>
                {client.siret && <p style={{ fontSize: "11px", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace", marginTop: "2px" }}>SIRET {client.siret}</p>}
              </div>
              <p style={{ fontSize: "12.5px", color: "var(--ink-2)", fontFamily: "Geist Mono, monospace" }}>{client.email || "—"}</p>
              <p style={{ fontSize: "12.5px", color: "var(--ink-2)", fontFamily: "Geist Mono, monospace" }}>{client.telephone || "—"}</p>
              <p style={{ fontSize: "13px", color: "var(--ink-2)" }}>{client.ville || "—"}</p>

              <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                <button
                  onClick={(e) => { e.stopPropagation(); setClientEdit(client); setShowModal(true); }}
                  style={{ padding: "5px 12px", background: "var(--ivory-2)", border: "1px solid var(--line)", borderRadius: "999px", fontSize: "11.5px", color: "var(--ink-2)", cursor: "pointer" }}
                >
                  Modifier
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDelete(client.id); }}
                  style={{ padding: "5px 12px", background: "transparent", border: "1px solid #FECACA", borderRadius: "999px", fontSize: "11.5px", color: "#DC2626", cursor: "pointer" }}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ClientModal
          client={clientEdit}
          onClose={() => { setShowModal(false); setClientEdit(null); }}
          onSuccess={rafraichir}
        />
      )}

      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(14,14,14,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "var(--ivory)", borderRadius: "20px", padding: "32px", maxWidth: "400px", width: "100%", textAlign: "center" }}>
            <p style={{ fontFamily: "Instrument Serif, serif", fontSize: "22px", color: "var(--ink)", marginBottom: "10px" }}>
              Supprimer ce client ?
            </p>
            <p style={{ fontSize: "14px", color: "var(--ink-3)", marginBottom: "28px", lineHeight: 1.5 }}>
              Cette action est irréversible. Les devis et factures associés seront conservés.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{ padding: "10px 22px", background: "transparent", border: "1px solid var(--line)", borderRadius: "999px", fontSize: "13.5px", color: "var(--ink-2)", cursor: "pointer" }}
              >
                Annuler
              </button>
              <button
                onClick={() => supprimerClient(confirmDelete)}
                disabled={loadingDelete}
                style={{ padding: "10px 22px", background: "#DC2626", color: "white", border: "none", borderRadius: "999px", fontSize: "13.5px", fontWeight: 500, cursor: "pointer" }}
              >
                {loadingDelete ? "Suppression..." : "Supprimer définitivement"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
