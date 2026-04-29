export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NavItems } from "./nav-item";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  let nomEntreprise = "Mon Entreprise";
  let plan = "starter";

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: profile } = await supabase
      .from("profiles")
      .select("nom_entreprise, plan")
      .eq("id", user.id)
      .single();

    if (profile?.nom_entreprise) nomEntreprise = profile.nom_entreprise;
    if (profile?.plan) plan = profile.plan;
  } catch {
    redirect("/login");
  }

  const initiale = nomEntreprise.charAt(0).toUpperCase();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--ivory)" }}>
      <aside style={{
        width: "240px", flexShrink: 0, position: "fixed",
        top: 0, left: 0, height: "100vh",
        background: "var(--ivory)", borderRight: "1px solid var(--line)",
        display: "flex", flexDirection: "column", zIndex: 40,
      }}>
        <div style={{ padding: "20px", borderBottom: "1px solid var(--line)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <div style={{
              width: "30px", height: "30px", background: "var(--ink)",
              borderRadius: "7px", display: "flex", alignItems: "center",
              justifyContent: "center", color: "var(--ivory)",
              fontFamily: "Instrument Serif, serif", fontStyle: "italic", fontSize: "17px",
            }}>g</div>
            <span style={{ fontFamily: "Instrument Serif, serif", fontSize: "17px", color: "var(--ink)", letterSpacing: "-0.02em" }}>
              Gestia
            </span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: "var(--ivory-2)", borderRadius: "10px", padding: "8px 10px",
          }}>
            <div style={{
              width: "26px", height: "26px", background: "var(--ink)", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--ivory)", fontFamily: "Instrument Serif, serif",
              fontStyle: "italic", fontSize: "13px", flexShrink: 0,
            }}>{initiale}</div>
            <div style={{ minWidth: 0 }}>
              <p style={{
                fontSize: "12px", fontWeight: 500, color: "var(--ink)",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>{nomEntreprise}</p>
              <p style={{ fontSize: "10px", color: "var(--ink-3)" }}>
                {plan === "pro" ? "Plan Pro" : "Plan Starter"}
              </p>
            </div>
          </div>
        </div>

        <NavItems />

        <div style={{ padding: "14px 20px", borderTop: "1px solid var(--line)" }}>
          <form action="/api/auth/signout" method="POST">
            <button type="submit" style={{
              width: "100%", textAlign: "left", fontSize: "13px",
              color: "var(--ink-3)", background: "none", border: "none",
              cursor: "pointer", padding: "6px 0",
            }}>
              Déconnexion →
            </button>
          </form>
          <p style={{ fontSize: "9px", letterSpacing: "0.18em", color: "var(--ink-3)", textTransform: "uppercase", marginTop: "10px", marginBottom: "4px" }}>
            PROPULSÉ PAR
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{
              width: "16px", height: "16px", background: "var(--ink)", borderRadius: "3px",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--ivory)", fontFamily: "Instrument Serif, serif",
              fontStyle: "italic", fontSize: "9px",
            }}>g</div>
            <span style={{ fontSize: "11px", color: "var(--ink-2)", fontWeight: 500 }}>Gestia</span>
          </div>
        </div>
      </aside>

      <div style={{ marginLeft: "240px", flex: 1, display: "flex", flexDirection: "column" }}>
        <header style={{
          position: "sticky", top: 0, zIndex: 30, height: "52px",
          background: "rgba(251,248,243,0.92)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--line)",
          display: "flex", alignItems: "center", padding: "0 36px",
        }}>
          <p style={{
            fontSize: "11px", fontFamily: "Geist Mono, monospace",
            color: "var(--ink-3)", letterSpacing: "0.04em",
          }}>
            gestia.fr / <span style={{ color: "var(--ink)" }}>dashboard</span>
          </p>
        </header>
        <main style={{ flex: 1, padding: "36px 40px" }}>{children}</main>
      </div>
    </div>
  );
}
