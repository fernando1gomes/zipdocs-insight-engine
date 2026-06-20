import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LifeWheel } from "@/components/LifeWheel";
import { PillarCard } from "@/components/PillarCard";
import { RadialWheel } from "@/components/RadialWheel";
import { AppHeader } from "@/components/AppHeader";
import { overallBalance, statusFromScore, priorityFromScore, type Pillar } from "@/lib/pillars";
import { usePillars } from "@/lib/usePillars";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PILLAR_IMPACTS, INFLUENCE_WEIGHT, influenceLabel } from "@/lib/impacts";
import { Bell, Leaf, Lightbulb, Star, Target, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Vida em Eixo" },
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

        <ImpactPrioritiesBlock pillars={pillars} />

        <AlertsPanel />
      </div>
    </div>
  );
}

function ImpactPrioritiesBlock({ pillars }: { pillars: Pillar[] }) {
  const items = useMemo(() => {
    return PILLAR_IMPACTS.map((imp) => {
      const up = pillars.find((p) => p.id === imp.systemPillarId);
      const score = up?.score ?? 0;
      if (score <= 0) return null;
      return {
        impact: imp,
        score,
        priority: (10 - score) * INFLUENCE_WEIGHT[imp.influence],
      };
    })
      .filter((x): x is { impact: typeof PILLAR_IMPACTS[number]; score: number; priority: number } => x !== null)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3);
  }, [pillars]);

  if (items.length === 0) return null;

  const priorityLabel = (i: number) => (i === 0 ? "Máxima" : "Alta");

  return (
    <section className="mt-8 rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Leaf className="h-4 w-4 text-[color:var(--primary)]" strokeWidth={1.75} />
          <h2 className="text-[12px] font-bold uppercase tracking-[0.18em] text-foreground">
            Seus Pilares de Maior Impacto Agora
          </h2>
        </div>
        <Link
          to="/impactos"
          className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--primary)] hover:underline"
        >
          Ver Mapa de Impacto →
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border border-border/60">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Pilar</th>
              <th className="px-3 py-2 text-left font-semibold">Nota</th>
              <th className="px-3 py-2 text-left font-semibold">Impacta</th>
              <th className="px-3 py-2 text-left font-semibold">Influência</th>
              <th className="px-3 py-2 text-left font-semibold">Prioridade</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <tr key={it.impact.systemPillarId} className="border-t border-border/60">
                <td className="px-3 py-2">
                  <Link
                    to="/impactos"
                    search={{ pillar: it.impact.systemPillarId }}
                    className="font-medium hover:underline"
                  >
                    {it.impact.icon} {it.impact.displayName}
                  </Link>
                </td>
                <td className="px-3 py-2 font-semibold">{it.score.toFixed(1)}</td>
                <td className="px-3 py-2">{it.impact.directCount} pilares</td>
                <td className="px-3 py-2 text-muted-foreground">{influenceLabel(it.impact.influence)}</td>
                <td className="px-3 py-2">
                  {(() => {
                    const label = priorityLabel(idx);
                    const styles =
                      label === "Máxima"
                        ? { bg: "var(--attention-soft)", fg: "var(--attention)" }
                        : { bg: "var(--balanced-soft)", fg: "var(--primary)" };
                    return (
                      <span
                        className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                        style={{ background: styles.bg, color: styles.fg }}
                      >
                        {label}
                      </span>
                    );
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Esses pilares têm notas baixas e alto poder de influência. Ao melhorá-los, você gera
        efeito positivo em várias áreas da vida.
      </p>
    </section>
  );
}

function AlertsPanel() {
  const qc = useQueryClient();
  const { data: alerts } = useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("alerts")
        .select("id, title, message, severity, pillar_id, created_at")
        .eq("is_resolved", false)
        .order("created_at", { ascending: false })
        .limit(10);
      return data ?? [];
    },
  });

  async function resolve(id: string) {
    await supabase.from("alerts").update({ is_resolved: true, resolved_at: new Date().toISOString() }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["alerts"] });
  }

  if (!alerts || alerts.length === 0) return null;

  return (
    <section className="mt-8 rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Bell className="h-4 w-4 text-[color:var(--accent)]" strokeWidth={1.75} />
        <h2 className="text-[12px] font-bold uppercase tracking-[0.18em] text-foreground">Alertas</h2>
        <span className="text-xs text-muted-foreground">({alerts.length})</span>
      </div>
      <ul className="flex flex-col gap-2">
        {alerts.map((a) => (
          <li key={a.id} className="flex items-start justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5">
            <div className="flex min-w-0 items-start gap-3">
              <span className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full bg-[color:var(--accent)]" />
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{a.title}</div>
                <div className="text-xs text-muted-foreground">{a.message}</div>
              </div>
            </div>
            <button
              onClick={() => resolve(a.id)}
              className="shrink-0 rounded-md border border-[color:var(--primary)]/40 bg-card px-3 py-1 text-xs font-semibold text-[color:var(--primary)] hover:bg-[color:var(--balanced-soft)]/30"
            >
              Resolver
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Legend() {
  const items = [
    { label: "Excelente", color: "var(--primary)" },
    { label: "Bom", color: "var(--balanced-soft)" },
    { label: "Atenção", color: "var(--attention)" },
    { label: "Crítico", color: "var(--critical)" },
    { label: "Sem dados", color: "var(--empty)" },
  ];
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Legenda</div>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-2 text-xs text-foreground">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: it.color }} />
            {it.label}
          </div>
        ))}
        <div className="flex items-center gap-2 text-xs text-foreground">
          <span className="inline-block w-6 border-t-2 border-dashed border-[color:var(--empty)]" />
          Pouca influência
        </div>
      </div>
    </div>
  );
}

function TipCard() {
  return (
    <div className="rounded-2xl border border-[color:var(--attention)]/30 bg-[color:var(--attention-soft)]/40 p-4">
      <div className="flex items-start gap-3">
        <Lightbulb className="h-5 w-5 shrink-0 text-[color:var(--accent)]" strokeWidth={1.75} />
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
        <Target className="h-4 w-4 text-[color:var(--primary)]" strokeWidth={1.75} />
        <h2 className="text-[12px] font-bold uppercase tracking-[0.18em] text-foreground">Prioridades da Semana</h2>
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
                <div className="text-sm font-semibold text-foreground truncate">Cuidar de {p.shortName}</div>
                <div className="text-xs text-muted-foreground truncate">Prioridade: {priorityFromScore(p.score)}</div>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--balanced-soft)]/40">
                <p.Icon className="h-4 w-4 text-[color:var(--primary)]" strokeWidth={1.75} />
              </span>
            </li>
          ))}
        </ol>
      )}
      <div className="mt-4 flex flex-col gap-2">
        <Link
          to="/checkin"
          className="w-full rounded-xl bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground shadow-sm hover:opacity-95 transition flex items-center justify-between"
        >
          <span className="flex items-center gap-2">+ Novo Check-in</span>
          <span>›</span>
        </Link>
        <Link
          to="/acoes"
          className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-foreground hover:bg-secondary transition flex items-center justify-between"
        >
          <span className="flex items-center gap-2"><Leaf className="h-4 w-4 text-[color:var(--primary)]" strokeWidth={1.75} /> Minhas Ações</span>
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
        <h2 className="text-[12px] font-bold uppercase tracking-[0.18em] text-foreground">Próxima Melhor Ação</h2>
        <Star className="h-4 w-4 text-[color:var(--accent)]" strokeWidth={1.75} fill="currentColor" />
      </div>
      <div className="rounded-xl bg-[color:var(--primary)]/5 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--balanced-soft)]/50">
            <Sparkles className="h-5 w-5 text-[color:var(--primary)]" strokeWidth={1.75} />
          </div>
          <p className="text-sm font-medium text-foreground leading-snug">
            {data?.title ?? "Conectar-se com a família"}
          </p>
        </div>
        <Link
          to="/acoes"
          className="mt-4 w-full rounded-xl bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground shadow-sm hover:opacity-95 transition flex items-center justify-center gap-2"
        >
          {data ? "Ver Minhas Ações" : "Criar Primeira Ação"} <span>›</span>
        </Link>
      </div>
    </div>
  );
}