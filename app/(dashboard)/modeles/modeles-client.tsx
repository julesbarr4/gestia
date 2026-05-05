"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Modele {
  id: string;
  nom: string;
  description?: string | null;
  lignes: Array<{ description: string; quantite: number; prixUnitaireHT: number; totalHT: number }>;
  taux_tva: number;
  conditions?: string | null;
  utilise_count: number;
  created_at: string;
}

export default function ModelesClient({ modeles: initialModeles }: { modeles: Modele[] }) {
  const [modeles, setModeles] = useState(initialModeles);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function supprimer(id: string) {
    setLoading(true);
    await fetch(`/api/modeles/${id}`, { method: "DELETE" });
    setConfirmDelete(null);
    setLoading(false);
    router.refresh();
  }

  const eyebrow: React.CSSProperties = {
    fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.16em",
    color: "var(--ink-3)", fontFamily: "Geist Mono, monospace",
  };

  return (
    <div style={{ maxWidth: "900px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <p style={eyebrow}>MODÈLES</p>
          <h1 style={{ fontFamily: "Instrument Serif, serif", fontSize: "38px", color: "var(--ink)", lineHeight: 1.06, marginTop: "6px" }}>
            Vos <em>modèles de devis.</em>
          </h1>
        </div>
        <Link href="/devis/nouveau" style={{
          padding: "10px 22px", background: "var(--ink)", color: "var(--ivory)",
          border: "none", borderRadius: "999px", fontSize: "13.5px",
          fontWeight: 500, textDecoration: "none",
        }}>
          Nouveau devis →
        </Link>
      </div>

      {modeles.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <p style={{ fontFamily: "Instrument Serif, serif", fontSize: "24px", color: "var(--ink)", marginBottom: "10px" }}>
            Aucun modèle pour le moment.
          </p>
          <p style={{ fontSize: "14px", color: "var(--ink-3)", marginBottom: "28px", lineHeight: 1.6 }}>
            Créez un devis avec Inès, puis sauvegardez-le comme modèle<br/>pour le réutiliser rapidement.
          </p>
          <Link href="/devis/nouveau" style={{
            background: "var(--ink)", color: "var(--ivory)", borderRadius: "999px",
            padding: "11px 24px", fontSize: "13.5px", fontWeight: 500, textDecoration: "none",
          }}>
            Créer mon premier devis →
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {modeles.map((m) => (
            <div key={m.id} style={{
              background: "white", border: "1px solid var(--line)",
              borderRadius: "16px", padding: "20px 24px",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px",
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <p style={{ fontFamily: "Instrument Serif, serif", fontSize: "17px", color: "var(--ink)" }}>{m.nom}</p>
                  {m.utilise_count > 0 && (
                    <span style={{ fontSize: "10px", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace", background: "var(--ivory-2)", padding: "2px 8px", borderRadius: "999px", border: "1px solid var(--line)" }}>
                      utilisé {m.utilise_count}×
                    </span>
                  )}
                </div>
                {m.description && <p style={{ fontSize: "13px", color: "var(--ink-3)", marginBottom: "6px" }}>{m.description}</p>}
                <p style={{ fontSize: "11px", color: "var(--ink-3)", fontFamily: "Geist Mono, monospace" }}>
                  {m.lignes.length} ligne{m.lignes.length > 1 ? "s" : ""}
                  · TVA {m.taux_tva}%
                  · Créé le {new Date(m.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <Link href={`/devis/nouveau?modele=${m.id}`} style={{
                  fontSize: "12px", color: "var(--ink)", background: "var(--ivory-2)",
                  border: "1px solid var(--line)", borderRadius: "999px",
                  padding: "6px 14px", textDecoration: "none",
                }}>
                  Utiliser →
                </Link>
                <button onClick={() => setConfirmDelete(m.id)} style={{
                  fontSize: "12px", color: "#DC2626", background: "transparent",
                  border: "1px solid #FECACA", borderRadius: "999px",
                  padding: "6px 14px", cursor: "pointer",
                }}>×</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(14,14,14,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "var(--ivory)", borderRadius: "20px", padding: "32px", maxWidth: "380px", width: "100%", textAlign: "center" }}>
            <p style={{ fontFamily: "Instrument Serif, serif", fontSize: "22px", color: "var(--ink)", marginBottom: "10px" }}>
              Supprimer ce modèle ?
            </p>
            <p style={{ fontSize: "13px", color: "var(--ink-3)", marginBottom: "24px", lineHeight: 1.5 }}>
              Les devis créés depuis ce modèle ne seront pas affectés.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={() => setConfirmDelete(null)} style={{ padding: "9px 20px", background: "transparent", border: "1px solid var(--line)", borderRadius: "999px", fontSize: "13px", color: "var(--ink-2)", cursor: "pointer" }}>Annuler</button>
              <button onClick={() => supprimer(confirmDelete)} disabled={loading} style={{ padding: "9px 20px", background: "#DC2626", color: "white", border: "none", borderRadius: "999px", fontSize: "13px", cursor: "pointer" }}>
                {loading ? "..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
