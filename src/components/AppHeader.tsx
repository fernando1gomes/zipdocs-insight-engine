import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export function AppHeader() {
  const navigate = useNavigate();
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", data.user.id)
        .maybeSingle();
      setDisplayName(profile?.display_name ?? data.user.email?.split("@")[0] ?? "");
    });
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    router.invalidate();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <Link to="/dashboard" className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--focus)] text-white text-xl shadow-md">
          🌱
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Roda da Vida Viva</h1>
          <p className="text-xs text-muted-foreground">
            {displayName ? `Olá, ${displayName}` : "Uma visão integrada da sua evolução"}
          </p>
        </div>
      </Link>
      <nav className="flex items-center gap-2 text-sm">
        <Link to="/dashboard" className="rounded-lg px-3 py-2 hover:bg-secondary transition" activeProps={{ className: "rounded-lg px-3 py-2 bg-secondary font-semibold" }}>
          Dashboard
        </Link>
        <Link to="/autoavaliacao" className="rounded-lg px-3 py-2 hover:bg-secondary transition" activeProps={{ className: "rounded-lg px-3 py-2 bg-secondary font-semibold" }}>
          Autoavaliação
        </Link>
        <Link to="/plano-acao" className="rounded-lg px-3 py-2 hover:bg-secondary transition" activeProps={{ className: "rounded-lg px-3 py-2 bg-secondary font-semibold" }}>
          Plano
        </Link>
        <Link to="/acoes" className="rounded-lg px-3 py-2 hover:bg-secondary transition" activeProps={{ className: "rounded-lg px-3 py-2 bg-secondary font-semibold" }}>
          Ações
        </Link>
        <Link to="/checkin" className="rounded-lg px-3 py-2 hover:bg-secondary transition" activeProps={{ className: "rounded-lg px-3 py-2 bg-secondary font-semibold" }}>
          Check-in
        </Link>
        <Link to="/orientadora" className="rounded-lg px-3 py-2 hover:bg-secondary transition" activeProps={{ className: "rounded-lg px-3 py-2 bg-secondary font-semibold" }}>
          💬 IA
        </Link>
        <button
          onClick={signOut}
          className="ml-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-secondary transition"
        >
          Sair
        </button>
      </nav>
    </header>
  );
}