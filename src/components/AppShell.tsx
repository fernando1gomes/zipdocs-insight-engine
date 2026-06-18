import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: "🎯" },
  { to: "/checkin", label: "Check-in", icon: "📝" },
  { to: "/acoes", label: "Ações", icon: "⚡" },
  { to: "/alertas", label: "Alertas", icon: "🔔" },
  { to: "/historico", label: "Histórico", icon: "📈" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const path = useRouterState({ select: (s) => s.location.pathname });

  async function logout() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    toast.success("Você saiu.");
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card/60 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-[1500px] px-4 md:px-8 h-14 flex items-center justify-between gap-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <span className="font-extrabold tracking-tight">Roda da Vida Viva</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => {
              const active = path === n.to;
              return (
                <Link key={n.to} to={n.to}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60"}`}>
                  <span className="mr-1.5">{n.icon}</span>{n.label}
                </Link>
              );
            })}
          </nav>
          <button onClick={logout}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-secondary">
            Sair
          </button>
        </div>
        <nav className="md:hidden flex overflow-x-auto gap-1 px-4 pb-2">
          {NAV.map((n) => {
            const active = path === n.to;
            return (
              <Link key={n.to} to={n.to}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition ${active ? "bg-secondary" : "text-muted-foreground"}`}>
                {n.icon} {n.label}
              </Link>
            );
          })}
        </nav>
      </header>
      {children}
    </div>
  );
}