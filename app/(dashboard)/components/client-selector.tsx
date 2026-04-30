"use client";

import { useState, useRef, useEffect } from "react";

interface Client {
  id: string;
  nom: string;
  email?: string | null;
  ville?: string | null;
}

interface Props {
  clients: Client[];
  value: string;
  onChange: (nom: string, clientId?: string) => void;
  required?: boolean;
}

export function ClientSelector({ clients, value, onChange, required }: Props) {
  const [open, setOpen] = useState(false);
  const [recherche, setRecherche] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const clientsFiltres = clients.filter((c) =>
    c.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  function selectionnerClient(client: Client) {
    setRecherche(client.nom);
    onChange(client.nom, client.id);
    setOpen(false);
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setRecherche(e.target.value);
    onChange(e.target.value, undefined);
    setOpen(true);
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <label style={{
        fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em",
        color: "var(--ink-3)", display: "block", marginBottom: "6px",
        fontFamily: "Geist Mono, monospace",
      }}>
        CLIENT {required && "*"}
      </label>

      <input
        type="text"
        value={recherche}
        onChange={handleInput}
        onFocus={() => setOpen(true)}
        placeholder={clients.length > 0 ? "Choisir ou taper un nom..." : "Nom du client"}
        required={required}
        autoComplete="off"
        style={{
          width: "100%", padding: "11px 14px",
          border: "1px solid var(--line)", borderRadius: "12px",
          fontSize: "14px", background: "white", color: "var(--ink)",
          outline: "none", boxSizing: "border-box" as const,
        }}
      />

      {open && (clientsFiltres.length > 0 || recherche.length > 0) && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
          background: "white", border: "1px solid var(--line)",
          borderRadius: "12px", zIndex: 50, overflow: "hidden",
          boxShadow: "0 8px 24px rgba(14,14,14,0.10)",
          maxHeight: "240px", overflowY: "auto" as const,
        }}>
          {clientsFiltres.map((client) => (
            <button
              key={client.id}
              type="button"
              onClick={() => selectionnerClient(client)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", padding: "11px 16px", background: "none",
                border: "none", borderBottom: "1px solid var(--line)",
                cursor: "pointer", textAlign: "left" as const,
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "var(--ivory-2)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "none")}
            >
              <div>
                <p style={{ fontSize: "14px", color: "var(--ink)", fontFamily: "Instrument Serif, serif" }}>
                  {client.nom}
                </p>
                {client.email && (
                  <p style={{ fontSize: "11px", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace" }}>
                    {client.email}
                  </p>
                )}
              </div>
              {client.ville && (
                <p style={{ fontSize: "11px", color: "var(--ink-3)" }}>{client.ville}</p>
              )}
            </button>
          ))}

          {recherche.trim().length > 0 && !clientsFiltres.find(c => c.nom.toLowerCase() === recherche.toLowerCase()) && (
            <button
              type="button"
              onClick={() => { onChange(recherche.trim(), undefined); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                width: "100%", padding: "11px 16px", background: "none",
                border: "none", cursor: "pointer", textAlign: "left" as const,
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "var(--ivory-2)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "none")}
            >
              <span style={{
                fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em",
                background: "var(--ivory-2)", color: "var(--ink-3)",
                padding: "2px 8px", borderRadius: "999px",
                fontFamily: "Geist Mono, monospace", flexShrink: 0,
              }}>NOUVEAU</span>
              <p style={{ fontSize: "13.5px", color: "var(--ink)" }}>
                Utiliser &ldquo;<strong>{recherche.trim()}</strong>&rdquo;
              </p>
            </button>
          )}

          {clientsFiltres.length === 0 && recherche.trim().length === 0 && (
            <div style={{ padding: "14px 16px" }}>
              <p style={{ fontSize: "13px", color: "var(--ink-3)" }}>Aucun client enregistré.</p>
              <p style={{ fontSize: "11px", color: "var(--ink-3)", marginTop: "4px" }}>
                Tapez un nom pour continuer sans client existant.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
