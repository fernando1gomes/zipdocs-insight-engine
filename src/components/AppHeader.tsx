import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef, useState } from "react";
import { ChatCircleDots } from "@phosphor-icons/react";
import logoAsset from "@/assets/vida-em-eixo-logo.png.asset.json";

export function AppHeader() {
  const navigate = useNavigate();
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    router.invalidate();
    navigate({ to: "/auth", replace: true });
  }

  const initials = (displayName || "SM")
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "SM";

  const navItems: Array<{ to: string; label: string }> = [
    { to: "/dashboard", label: "DASHBOARD" },
    { to: "/autoavaliacao", label: "AUTOAVALIAÇÃO" },
    { to: "/impactos", label: "PROGRESSO" },
    { to: "/autorresponsabilidade", label: "ACOMPANHAMENTOS" },
    { to: "/plano-acao", label: "PLANO" },
    { to: "/semana", label: "SEMANA" },
    { to: "/acoes", label: "AÇÕES" },
    { to: "/checkin", label: "CHECK-INS" },
  ];

  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <Link to="/dashboard" className="flex items-center gap-3">
        <img
          src={logoAsset.url}
          alt="Vida em Eixo"
          className="h-12 w-12 rounded-2xl object-contain bg-card shadow-sm"
        />
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-[0.08em] uppercase text-[color:var(--focus)]" style={{ fontFamily: "var(--font-display)" }}>
            Vida em Eixo
          </h1>
          <p className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--primary)] font-semibold">
            Coaching &amp; PNL
          </p>
        </div>
      </Link>
      <nav className="flex items-center gap-1 text-[11px] font-semibold tracking-[0.12em]">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="rounded-full px-3 py-2 text-foreground/70 hover:text-foreground hover:bg-secondary transition"
            activeProps={{ className: "rounded-full px-3 py-2 bg-primary text-primary-foreground" }}
          >
            {item.label}
          </Link>
        ))}
        <Link
          to="/orientadora"
          className="ml-2 relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground/70 hover:bg-secondary transition"
          aria-label="Orientadora IA"
        >
          <ChatCircleDots size={18} weight="light" />
          <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[color:var(--accent)] px-1 text-[9px] font-bold text-white">
            4
          </span>
        </Link>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--primary)] text-[11px] font-bold text-primary-foreground tracking-wider"
            aria-label="Menu do usuário"
          >
            {initials}
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-11 z-20 w-40 rounded-xl border border-border bg-card p-1 shadow-lg">
              <button
                onClick={signOut}
                className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-foreground hover:bg-secondary"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}