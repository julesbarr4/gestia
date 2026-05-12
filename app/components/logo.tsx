export function GestiaLogo({
  sizeSceau = 28,
  sizeTexte = 16,
  fondClair = true,
}: {
  sizeSceau?: number;
  sizeTexte?: number;
  fondClair?: boolean;
}) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
      <span
        style={{
          width: sizeSceau,
          height: sizeSceau,
          background: fondClair ? "var(--ink)" : "var(--ivory)",
          borderRadius: "7px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: fondClair ? "var(--ivory)" : "var(--ink)",
          fontFamily: "Instrument Serif, serif",
          fontStyle: "italic",
          fontSize: sizeSceau * 0.65,
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        g
      </span>
      <span
        style={{
          fontFamily: "Instrument Serif, serif",
          fontSize: sizeTexte,
          color: fondClair ? "var(--ink)" : "var(--ivory)",
          letterSpacing: "-0.01em",
        }}
      >
        Gestia
      </span>
    </span>
  );
}
