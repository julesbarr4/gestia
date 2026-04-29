export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { NavItem } from "./nav-item";

const NAV_ITEMS = [
  { label: "Tableau de bord", href: "/dashboard" },
  { label: "Clients", href: "/clients" },
  { label: "Devis", href: "/devis" },
  { label: "Factures", href: "/factures" },
  { label: "Emails", href: "/emails" },
  { label: "Marketing", href: "/marketing" },
  { label: "Rapports", href: "/rapports" },
  { label: "Stratégie", href: "/strategie" },
  { label: "L'équipe", href: "/equipe" },
  { label: "Paramètres", href: "/parametres" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        width: "260px",
        flexShrink: 0,
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        background: "var(--ivory)",
        borderRight: "1px solid var(--line)",
        display: "flex",
        flexDirection: "column",
        zIndex: 40,
      }}>

        <div style={{
          padding: "20px",
          borderBottom: "1px solid var(--line)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <div style={{
              width: "32px", height: "32px",
              background: "var(--ink)",
              borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--ivory)",
              fontFamily: "Instrument Serif, serif",
              fontStyle: "italic",
              fontSize: "18px",
            }}>g</div>
            <span style={{
              fontFamily: "Instrument Serif, serif",
              fontSize: "17px",
              color: "var(--ink)",
              letterSpacing: "-0.02em",
            }}>Gestia</span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: "var(--ivory-2)",
            borderRadius: "10px",
            padding: "8px 10px",
          }}>
            <div style={{
              width: "28px", height: "28px",
              background: "var(--ink)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--ivory)",
              fontFamily: "Instrument Serif, serif",
              fontStyle: "italic",
              fontSize: "14px",
              flexShrink: 0,
            }}>{initiale}</div>
            <div style={{ minWidth: 0 }}>
              <p style={{
                fontSize: "12.5px",
                fontWeight: 500,
                color: "var(--ink)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>{nomEntreprise}</p>
              <p style={{ fontSize: "10.5px", color: "var(--ink-3)" }}>
                {plan === "pro" ? "Plan Pro" : "Plan Starter"}
              </p>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        <div style={{
          padding: "14px 20px",
          borderTop: "1px solid var(--line)",
        }}>
          <p style={{ fontSize: "9.5px", letterSpacing: "0.18em", color: "var(--ink-3)", textTransform: "uppercase", marginBottom: "6px" }}>
            PROPULSÉ PAR
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "18px", height: "18px",
              background: "var(--ink)",
              borderRadius: "4px",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--ivory)",
              fontFamily: "Instrument Serif, serif",
              fontStyle: "italic",
              fontSize: "10px",
            }}>g</div>
            <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--ink-2)" }}>Gestia</span>
          </div>
        </div>

      </aside>

      <div style={{ marginLeft: "260px", flex: 1, display: "flex", flexDirection: "column" }}>

        <header style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          height: "56px",
          background: "rgba(251,248,243,0.90)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--line)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
        }}>
          <p style={{
            fontSize: "11.5px",
            fontFamily: "Geist Mono, monospace",
            color: "var(--ink-3)",
            letterSpacing: "0.04em",
          }}>
            gestia.fr / <span style={{ color: "var(--ink)" }}>dashboard</span>
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Link href="/parametres" style={{ fontSize: "13px", color: "var(--ink-2)", textDecoration: "none" }}>
              Paramètres
            </Link>
            <form action="/api/auth/signout" method="POST">
              <button type="submit" style={{
                fontSize: "13px",
                color: "var(--ink-2)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}>
                Déconnexion
              </button>
            </form>
          </div>
        </header>

        <main style={{ flex: 1, padding: "40px" }}>
          {children}
        </main>

      </div>
    </div>
  );
}
