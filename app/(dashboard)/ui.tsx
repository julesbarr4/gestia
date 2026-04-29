export function PageHeader({ eyebrow, titre, action }: {
  eyebrow: string;
  titre: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "32px" }}>
      <div>
        <p style={{ fontSize: "10.5px", textTransform: "uppercase" as const, letterSpacing: "0.16em", color: "var(--ink-3)", marginBottom: "6px", fontFamily: "Geist Mono, monospace" }}>
          {eyebrow}
        </p>
        <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "clamp(26px, 3vw, 38px)", lineHeight: 1.06, letterSpacing: "-0.02em", color: "var(--ink)" }}>
          {titre}
        </h1>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: "16px", padding: "24px", ...style }}>
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "10.5px", textTransform: "uppercase" as const, letterSpacing: "0.16em", color: "var(--ink-3)", marginBottom: "14px", fontFamily: "Geist Mono, monospace" }}>
      {children}
    </p>
  );
}

export function StatusBadge({ statut }: { statut: string }) {
  const styles: Record<string, React.CSSProperties> = {
    payee:     { background: "color-mix(in oklch, oklch(0.42 0.07 155) 14%, transparent)", color: "oklch(0.42 0.07 155)" },
    accepte:   { background: "color-mix(in oklch, oklch(0.42 0.07 155) 14%, transparent)", color: "oklch(0.42 0.07 155)" },
    en_retard: { background: "#7a1d1d", color: "#FBF8F3" },
    envoyee:   { background: "#F4EFE6", color: "#4A4A47" },
    envoye:    { background: "#F4EFE6", color: "#4A4A47" },
    brouillon: { background: "#E5DFD2", color: "#8A8780" },
    refuse:    { background: "#FEE2E2", color: "#991B1B" },
    expire:    { background: "#E5DFD2", color: "#8A8780" },
  };
  const labels: Record<string, string> = {
    payee: "Payée", accepte: "Accepté", en_retard: "En retard",
    envoyee: "Envoyée", envoye: "Envoyé", brouillon: "Brouillon",
    refuse: "Refusé", expire: "Expiré",
  };
  return (
    <span style={{
      fontSize: "10.5px", textTransform: "uppercase" as const,
      letterSpacing: "0.12em", padding: "3px 10px", borderRadius: "999px",
      fontFamily: "Geist Mono, monospace", whiteSpace: "nowrap" as const,
      ...(styles[statut] || { background: "#E5DFD2", color: "#8A8780" }),
    }}>
      {labels[statut] || statut}
    </span>
  );
}

export function BtnPrimary({ children, type = "button", onClick, disabled, style }: {
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: "var(--ink)", color: "var(--ivory)",
        border: "none", borderRadius: "999px",
        padding: "10px 22px", fontSize: "13.5px", fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "background 0.15s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
