export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Receipt,
  Users,
  Mail,
  TrendingUp,
  Megaphone,
  Settings,
  Zap,
  LogOut,
  Target,
} from "lucide-react";
const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
  { href: "/clients", icon: Users, label: "Clients" },
  { href: "/devis", icon: FileText, label: "Devis" },
  { href: "/factures", icon: Receipt, label: "Factures" },
  { href: "/emails", icon: Mail, label: "Emails" },
  { href: "/marketing", icon: Megaphone, label: "Marketing" },
  { href: "/rapports", icon: TrendingUp, label: "Rapports CFO" },
  { href: "/strategie", icon: Target, label: "Stratégie" },
  { href: "/dashboard/equipe", icon: Users, label: "L'équipe" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nom_entreprise")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">Gestia</span>
          </Link>
        </div>

        <div className="p-3 border-b border-gray-100">
          <div className="px-2 py-1.5">
            <p className="text-xs text-gray-400">Entreprise</p>
            <p className="text-sm font-medium text-gray-900 truncate">
              {profile?.nom_entreprise || "Mon Entreprise"}
            </p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100 space-y-0.5">
          <Link
            href="/parametres"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Paramètres
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* CONTENU */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
