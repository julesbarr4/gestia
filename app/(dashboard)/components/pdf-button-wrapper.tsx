"use client";
import dynamic from "next/dynamic";

export const BoutonPDF = dynamic(
  () => import("./document-pdf").then((m) => m.BoutonPDF),
  {
    ssr: false,
    loading: () => (
      <button style={{
        fontSize: "12px", color: "#8A8780",
        background: "#F4EFE6", border: "none",
        borderRadius: "999px", padding: "6px 16px", cursor: "not-allowed",
      }}>
        ↓ PDF
      </button>
    ),
  }
);
