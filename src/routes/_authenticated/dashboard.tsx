import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LifeWheel } from "@/components/LifeWheel";
import { PillarCard } from "@/components/PillarCard";
import { RadialWheel } from "@/components/RadialWheel";
import { AppHeader } from "@/components/AppHeader";
import { overallBalance, statusFromScore, type Pillar } from "@/lib/pillars";
import { usePillars } from "@/lib/usePillars";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Roda da Vida Viva" },
      { name: "description", content: "Visão integrada dos seus 11 pilares." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data, isLoading } = usePillars();
  const pillars = data?.pillars ?? [];
  const [hovered, setHovered] = useState<number | null>(null);
  const balance = useMemo(() => overallBalance(pillars), [pillars]);

  const priorities = useMemo(
    () =>
      [...pillars]
        .filter((p) => statusFromScore(p.score) !== "balanced")
        .sort((a, b) => a.score - b.score)
        .slice(0, 5),
    [pillars]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Carregando seus pilares...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1500px] px-4 py-6 md:px-8 md:py-8">
        <AppHeader />

        <div className="hidden xl:grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <RadialWheel pillars={pillars} balance={balance} hovered={hovered} onHover={setHovered} />
          <div className="flex flex-col gap-4">
            <PrioritiesCard priorities={priorities} onHover={setHovered} />
            <NextActionCard />
          </div>
        </div>

        <div className="xl:hidden grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl bg-card p-6 shadow-sm border border-border/60">
              <LifeWheel pillars={pillars} balance={balance} hovered={hovered} onHover={setHovered} />
            </div>
            <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {pillars.map((p) => (
                <Link key={p.id} to="/pilar/$id" params={{ id: String(p.id) }} className="block">
                  <PillarCard pillar={p} hovered={hovered === p.id} onHover={setHovered} />
                </Link>
              ))}
            </section>
          </div>
          <div className="flex flex-col gap-4">
            <PrioritiesCard priorities={priorities} onHover={setHovered} />
            <NextActionCard />
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <Legend />
          <TipCard />
        </div>
      </div>
    </div>
  );
}

function Legend() {
  const items = [
    { label: "Equilibrado", color: "var(--balanced)" },
    { label: "Atenção", color: "var(--attention)" },
    { label: "Crítico", color: "var(--critical)" },
    { label: "Sem dados", color: "var(--empty)" },
    { label: "Foco estratégico", color: "var(--focus)" },
  ];
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Legenda</div>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-2 text-xs text-foreground">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: it.color }} />
            {it.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function TipCard() {
  return (
    <div className="rounded-2xl border border-[color:var(--attention)]/30 bg-[color:var(--attention-soft)]/40 p-4">
      <div className="flex items-start gap-3">
        <div className="text-xl">💡</div>
        <p className="text-sm text-foreground leading-relaxed">
          <span className="font-semibold">Dica:</span> pequenas ações consistentes nos pilares certos geram equilíbrio sem sobrecarga.
        </p>
      </div>
    </div>
  );
}

function PrioritiesCard({ priorities, onHover }: { priorities: Pillar[]; onHover: (id: number | null) => void }) {
  const navigate = useNavigate();
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-lg">🎯</span>
        <h2 className="text-lg font-bold">Prioridades da semana</h2>
      </div>
      {priorities.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum pilar em atenção. Avalie seus pilares para começar.
        </p>
      ) : (
        <ol className="flex flex-col gap-2">
          {priorities.map((p, i) => (
            <li
              key={p.id}
              onMouseEnter={() => onHover(p.id)}
              onMouseLeave={() => onHover(null)}
              onClick={() => navigate({ to: "/pilar/$id", params: { id: String(p.id) } })}
              className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-secondary cursor-pointer transition"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">Cuidar de {p.shortName}</div>
                <div className="text-xs text-muted-foreground truncate">Score atual: {p.score.toFixed(1)}</div>
              </div>
              <span className="text-lg">{p.icon}</span>
            </li>
          ))}
        </ol>
      )}
      <div className="mt-4 flex flex-col gap-2">
        <Link
          to="/checkin"
          className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95 transition flex items-center justify-between"
        >
          <span className="flex items-center gap-2">📅 Novo check-in</span>
          <span>›</span>
        </Link>
        <Link
          to="/acoes"
          className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition flex items-center justify-between"
        >
          <span className="flex items-center gap-2">⚡ Minhas ações</span>
          <span>›</span>
        </Link>
      </div>
    </div>
  );
}

function NextActionCard() {
  const { data } = useQuery({
    queryKey: ["next_action"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pillar_actions")
        .select("id, title, pillar_id")
        .in("status", ["pending", "overdue"])
        .order("next_due_date", { ascending: true, nullsFirst: false })
        .limit(1)
        .maybeSingle();
      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">Próxima melhor ação</h2>
        <span className="text-[color:var(--attention)]">★</span>
      </div>
      <div className="rounded-xl bg-[color:var(--primary)]/5 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">⏰</div>
          <p className="text-sm font-medium text-foreground leading-snug">
            {data?.title ?? "Você ainda não criou nenhuma ação. Defina um passo concreto."}
          </p>
        </div>
        <Link
          to="/acoes"
          className="mt-4 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95 transition flex items-center justify-center gap-2"
        >
          {data ? "Ver minhas ações" : "Criar primeira ação"} <span>›</span>
        </Link>
      </div>
    </div>
  );
}