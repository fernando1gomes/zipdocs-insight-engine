import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — Roda da Vida Viva" },
      { name: "description", content: "Entre na sua conta da Roda da Vida Viva e acompanhe seu equilíbrio nos 11 pilares." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin, data: { display_name: name } },
        });
        if (error) throw error;
      }
      toast.success(mode === "signin" ? "Bem-vindo!" : "Conta criada!");
      navigate({ to: "/dashboard" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Falha na autenticação";
      toast.error(msg);
    } finally { setLoading(false); }
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (result.error) toast.error(result.error.message || "Erro Google");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center mb-6 text-2xl font-extrabold tracking-tight text-foreground">
          🌱 Roda da Vida Viva
        </Link>
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="mb-4 flex gap-2 rounded-xl bg-secondary p-1">
            <button onClick={() => setMode("signin")} className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${mode==="signin" ? "bg-card shadow" : "text-muted-foreground"}`}>Entrar</button>
            <button onClick={() => setMode("signup")} className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${mode==="signup" ? "bg-card shadow" : "text-muted-foreground"}`}>Cadastrar</button>
          </div>
          <form onSubmit={submit} className="flex flex-col gap-3">
            {mode === "signup" && (
              <input type="text" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm" required />
            )}
            <input type="email" placeholder="email@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm" required />
            <input type="password" placeholder="senha" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm" required minLength={6} />
            <button type="submit" disabled={loading}
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95 disabled:opacity-50">
              {loading ? "Aguarde..." : mode === "signin" ? "Entrar" : "Criar conta"}
            </button>
          </form>
          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> ou <div className="h-px flex-1 bg-border" />
          </div>
          <button onClick={google}
            className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition">
            Continuar com Google
          </button>
        </div>
      </div>
    </div>
  );
}