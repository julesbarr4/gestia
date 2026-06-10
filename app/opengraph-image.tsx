import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Gestia — Logiciel de facturation IA pour artisans";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0E0E0E",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "serif",
        }}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "40px",
        }}>
          <div style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            border: "3px solid #FBF8F3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "42px",
            color: "#FBF8F3",
          }}>
            G.
          </div>
          <span style={{
            fontSize: "52px",
            color: "#FBF8F3",
            fontStyle: "italic",
          }}>
            Gestia
          </span>
        </div>
        <p style={{
          fontSize: "32px",
          color: "#FBF8F3",
          textAlign: "center",
          lineHeight: 1.2,
          maxWidth: "900px",
          fontStyle: "italic",
          marginBottom: "32px",
        }}>
          Vos devis et factures générés par l'IA en 30 secondes.
        </p>
        <div style={{
          display: "flex",
          gap: "40px",
          marginTop: "20px",
        }}>
          {["Inès", "Léa", "Hugo", "Cyprien", "Augustin"].map((name, i) => {
            const colors = ["#2563eb", "#059669", "#7c3aed", "#ea580c", "#374151"];
            return (
              <div key={name} style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: colors[i],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  color: "white",
                  fontStyle: "italic",
                }}>
                  {name[0]}
                </div>
                <span style={{ fontSize: "14px", color: "rgba(251,248,243,0.6)" }}>{name}</span>
              </div>
            );
          })}
        </div>
        <div style={{
          position: "absolute",
          bottom: "40px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <div style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#15803d",
          }} />
          <span style={{ fontSize: "16px", color: "rgba(251,248,243,0.5)", fontFamily: "monospace" }}>
            Conforme Factur-X · RFE 2026 · Essai gratuit
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
