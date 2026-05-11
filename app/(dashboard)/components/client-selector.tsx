"use client";
import { useState, useRef, useEffect } from "react";

interface Client {
  id: string;
  nom: string;
  email?: string | null;
  ville?: string | null;
  siret?: string | null;
  telephone?: string | null;
  adresse?: string | null;
  code_postal?: string | null;
  numero_tva?: string | null;
}

interface Props {
  clients: Client[];
  value: string;
  clientId?: string;
  onChange: (nom: string, clientId?: string, client?: Client) => void;
  required?: boolean;
}

export function ClientSelector({ clients, value, clientId, onChange, required }: Props) {
  const [open, setOpen] = useState(false);
  const [recherche, setRecherche] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const clientsFiltres = clients.filter((c) =>
    c.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  const clientSelectionne = clients.find((c) => c.id === clientId);

  function selectionnerClient(client: Client) {
    setRecherche(client.nom);
    onChange(client.nom, client.id, client);
    setOpen(false);
  }

  if (clientSelectionne && !open) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: "var(--ivory-2)", border: "1px solid var(--line)", borderRadius: "12px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ivory)", fontFamily: "Instrument Serif, serif", fontStyle: "italic", fontSize: "14px", flexShrink: 0 }}>
            {clientSelectionne.nom.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "14px", fontFamily: "Instrument Serif, serif", color: "var(--ink)" }}>
              {clientSelectionne.nom}
            </p>
            <p style={{ fontSize: "11px", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace", marginTop: "2px" }}>
              {[
                clientSelectionne.email,
                clientSelectionne.adresse && clientSelectionne.ville
                  ? `${clientSelectionne.adresse}, ${clientSelectionne.code_postal} ${clientSelectionne.ville}`
                  : clientSelectionne.ville,
              ].filter(Boolean).join(" · ")}
            </p>
          </div>
          <span style={{ fontSize: "9.5px", textTransform: "uppercase", letterSpacing: "0.14em", background: "color-mix(in oklch, var(--accent) 12%, transparent)", color: "var(--accent)", padding: "2px 8px", borderRadius: "999px" }}>Enregistré</span>
          <button type="button" onClick={() => { setOpen(true); onChange("", undefined, undefined); }} style={{ fontSize: "12px", color: "var(--ink-3)", background: "none", border: "1px solid var(--line)", borderRadius: "999px", padding: "4px 10px", cursor: "pointer" }}>Changer</button>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <input
        type="text"
        value={recherche}
        onChange={(e) => { setRecherche(e.target.value); onChange(e.target.value, undefined, undefined); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={clients.length > 0 ? "Rechercher ou taper un nom..." : "Nom du client"}
        required={required}
        autoComplete="off"
        style={{ width: "100%", padding: "11px 14px", border: "1px solid var(--line)", borderRadius: "12px", fontSize: "14px", background: "white", color: "var(--ink)", outline: "none", boxSizing: "border-box" as const }}
      />
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "white", border: "1px solid var(--line)", borderRadius: "12px", zIndex: 50, overflow: "hidden", boxShadow: "0 8px 24px rgba(14,14,14,0.10)", maxHeight: "220px", overflowY: "auto" as const }}>
          {clientsFiltres.map((client) => (
            <button key={client.id} type="button" onClick={() => selectionnerClient(client)}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "10px 14px", background: "none", border: "none", borderBottom: "1px solid var(--line)", cursor: "pointer", textAlign: "left" as const }}
              onMouseOver={(e) => (e.currentTarget.style.background = "var(--ivory-2)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "none")}
            >
              <div>
                <p style={{ fontSize: "14px", color: "var(--ink)", fontFamily: "Instrument Serif, serif" }}>{client.nom}</p>
                <p style={{ fontSize: "11px", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace" }}>
                  {[client.email, client.ville].filter(Boolean).join(" · ")}
                </p>
              </div>
              <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
                {client.siret && (
                  <p style={{ fontSize: "10px", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace" }}>
                    {client.siret}
                  </p>
                )}
              </div>
            </button>
          ))}
          {recherche.trim().length > 0 && !clientsFiltres.find(c => c.nom.toLowerCase() === recherche.toLowerCase()) && (
            <button type="button" onClick={() => { onChange(recherche.trim(), undefined, undefined); setOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "10px 14px", background: "none", border: "none", cursor: "pointer" }}
              onMouseOver={(e) => (e.currentTarget.style.background = "var(--ivory-2)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "none")}
            >
              <span style={{ fontSize: "9.5px", textTransform: "uppercase", letterSpacing: "0.12em", background: "var(--ivory-2)", color: "var(--ink-3)", padding: "2px 8px", borderRadius: "999px" }}>NOUVEAU</span>
              <p style={{ fontSize: "13.5px", color: "var(--ink)" }}>Utiliser &ldquo;<strong>{recherche.trim()}</strong>&rdquo;</p>
            </button>
          )}
          {clients.length === 0 && recherche.trim().length === 0 && (
            <div style={{ padding: "14px 16px" }}>
              <p style={{ fontSize: "13px", color: "var(--ink-3)" }}>Aucun client enregistré — tapez un nom.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
