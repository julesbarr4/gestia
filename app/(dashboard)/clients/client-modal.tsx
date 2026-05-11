"use client";

import { useState } from "react";

interface ClientForm {
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  code_postal: string;
  ville: string;
  siret: string;
  numero_tva: string;
  notes: string;
}

interface Props {
  client?: {
    id: string;
    nom: string;
    email?: string | null;
    telephone?: string | null;
    adresse?: string | null;
    code_postal?: string | null;
    ville?: string | null;
    siret?: string | null;
    notes?: string | null;
    numero_tva?: string | null;
  } | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CHAMPS = [
  { name: "nom", label: "NOM", placeholder: "Boulangerie Martin", required: true, colSpan: 2 },
  { name: "email", label: "EMAIL", placeholder: "contact@exemple.fr", required: false, colSpan: 1, type: "email" },
  { name: "telephone", label: "TÉLÉPHONE", placeholder: "06 12 34 56 78", required: false, colSpan: 1 },
  { name: "adresse", label: "ADRESSE", placeholder: "10 rue de la Paix", required: false, colSpan: 2 },
  { name: "code_postal", label: "CODE POSTAL", placeholder: "75001", required: false, colSpan: 1 },
  { name: "ville", label: "VILLE", placeholder: "Paris", required: false, colSpan: 1 },
  { name: "siret", label: "SIRET", placeholder: "123 456 789 00012", required: false, colSpan: 1 },
  { name: "numero_tva", label: "N° TVA", placeholder: "FR 12 345678901", required: false, colSpan: 1 },
  { name: "notes", label: "NOTES", placeholder: "Informations complémentaires...", required: false, colSpan: 2, textarea: true },
];

export function ClientModal({ client, onClose, onSuccess }: Props) {
  const isEdit = !!client;
  const [form, setForm] = useState<ClientForm>({
    nom: client?.nom || "",
    email: client?.email || "",
    telephone: client?.telephone || "",
    adresse: client?.adresse || "",
    code_postal: client?.code_postal || "",
    ville: client?.ville || "",
    siret: client?.siret || "",
    numero_tva: client?.numero_tva || "",
    notes: client?.notes || "",
  });
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErreur("");

    const url = isEdit ? `/api/clients/${client!.id}` : "/api/clients";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setErreur(data.erreur || "Une erreur est survenue");
      setLoading(false);
      return;
    }

    onSuccess();
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(14,14,14,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "var(--ivory)", borderRadius: "20px",
        width: "100%", maxWidth: "560px",
        maxHeight: "90vh", overflowY: "auto",
        padding: "32px",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px" }}>
          <div>
            <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--ink-3)", marginBottom: "6px", fontFamily: "Geist Mono, monospace" }}>
              {isEdit ? "MODIFIER" : "NOUVEAU CLIENT"}
            </p>
            <h2 style={{ fontFamily: "Instrument Serif, serif", fontSize: "26px", color: "var(--ink)", lineHeight: 1.1 }}>
              {isEdit ? <em>{client!.nom}</em> : <em>Ajouter un client.</em>}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: "var(--ivory-2)", border: "none", borderRadius: "8px", width: "32px", height: "32px", cursor: "pointer", fontSize: "18px", color: "var(--ink-3)", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            ×
          </button>
        </div>

        {erreur && (
          <div style={{ background: "#FEF2F2", color: "#991B1B", fontSize: "13px", padding: "10px 14px", borderRadius: "10px", border: "1px solid #FECACA", marginBottom: "16px" }}>
            {erreur}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "24px" }}>
            {CHAMPS.map((champ) => (
              <div key={champ.name} style={{ gridColumn: `span ${champ.colSpan}` }}>
                <label style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-3)", display: "block", marginBottom: "6px", fontFamily: "Geist Mono, monospace" }}>
                  {champ.label}{champ.required && " *"}
                </label>
                {champ.textarea ? (
                  <textarea
                    name={champ.name}
                    value={form[champ.name as keyof ClientForm]}
                    onChange={handleChange}
                    placeholder={champ.placeholder}
                    rows={3}
                    style={{ width: "100%", padding: "10px 13px", border: "1px solid var(--line)", borderRadius: "12px", fontSize: "14px", background: "white", color: "var(--ink)", outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "Geist, sans-serif" }}
                  />
                ) : (
                  <input
                    type={champ.type || "text"}
                    name={champ.name}
                    value={form[champ.name as keyof ClientForm]}
                    onChange={handleChange}
                    placeholder={champ.placeholder}
                    required={champ.required}
                    style={{ width: "100%", padding: "10px 13px", border: "1px solid var(--line)", borderRadius: "12px", fontSize: "14px", background: "white", color: "var(--ink)", outline: "none", boxSizing: "border-box" }}
                  />
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: "10px 20px", background: "transparent", border: "1px solid var(--line)", borderRadius: "999px", fontSize: "13.5px", color: "var(--ink-2)", cursor: "pointer" }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ padding: "10px 24px", background: "var(--ink)", color: "var(--ivory)", border: "none", borderRadius: "999px", fontSize: "13.5px", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}
            >
              {loading ? "Enregistrement..." : isEdit ? "Modifier →" : "Créer le client →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
