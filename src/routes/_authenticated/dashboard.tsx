import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { RadialWheel } from "@/components/RadialWheel";
import { LifeWheel } from "@/components/LifeWheel";
import { PillarCard } from "@/components/PillarCard";
import { getDashboard, type DashboardPillar } from "@/lib/dashboard.functions";
import { getLatestRecommendation, generateRecommendation } from "@/lib/recommendations.functions";
import type { Pillar } from "@/lib/pillars";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Roda da Vida Viva" }] }),
  component: Dashboard,
});

function toPillar(p: DashboardPillar): Pillar {
  return {
    id: p.id,
    name: p.name,
    shortName: p.shortName,
    icon: p.icon,
    score: p.score,
    message: p.message,
    impact: p.impact,
    impactPillars: [],
    focus: p.focus,
  };
}

function Dashboard() {
  const router = useRouter();
  const qc = useQueryClient();
  const fetchDashboard = useServerFn(getDashboard);
  const fetchRec = useServerFn(getLatestRecommendation);
  const genRec = useServerFn(generateRecommendation);
  const [hovered, setHovered] = useState<number | null>(null);

  const dash = useQuery({ queryKey: ["dashboard"], queryFn: () => fetchDashboard() });
  const rec = useQuery({ queryKey: ["latest-rec"], queryFn: () => fetchRec() });

  const generate = useMutation({
    mutationFn: () => genRec(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["latest-rec"] }); toast.success("Recomendação gerada!"); },
    onError: (e: Error) => toast.error(e.message),
  });

  if (dash.isLoading) return <AppShell><div className="p-8 text-muted-foreground">Carregando…</div></AppShell>;
  if (dash.error) return <AppShell><div className="p-8 text-destructive">Erro ao carregar.</div></AppShell>;

  const data = dash.data!;
  const pillars = data.pillars.map(toPillar);

  return (
    <AppShell>
      <div className="mx-auto max-w-[1500px] px-4 py-6 md:px-8 md:py-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Olá 👋</h1>
            <p className="text-sm text-muted-foreground">Seu equilíbrio: <span className="font-semibold text-foreground">{data.balance}%</span> · {data.statusCounts.balanced} equilibrados · {data.statusCounts.attention} em atenção · {data.statusCounts.critical} críticos</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => router.navigate({ to: "/checkin" })}
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary">
              Novo check-in
            </button>
            <button onClick={() => router.navigate({ to: "/acoes" })}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95">
              Criar ação
            </button>
          </div>
        </header>

        <div className="hidden xl:grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <RadialWheel pillars={pillars} balance={data.balance} hovered={hovered} onHover={setHovered} />
          <div className="flex flex-col gap-4">
            <PrioritiesCard priorities={data.priorities} />
            <NextActionCard rec={rec.data} loading={generate.isPending} onGen={() => generate.mutate()} fallback={data.nextAction} />
          </div>
        </div>

        <div className="xl:hidden grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl bg-card p-6 shadow-sm border border-border/60">
              <LifeWheel pillars={pillars} balance={data.balance} hovered={hovered} onHover={setHovered} />
            </div>
            <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {pillars.map((p) => <PillarCard key={p.id} pillar={p} hovered={hovered === p.id} onHover={setHovered} />)}
            </section>
          </div>
          <div className="flex flex-col gap-4">
            <PrioritiesCard priorities={data.priorities} />
            <NextActionCard rec={rec.data} loading={generate.isPending} onGen={() => generate.mutate()} fallback={data.nextAction} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function PrioritiesCard({ priorities }: { priorities: Array<{ pillarId: number; title: string; pillarName: string; icon: string }> }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2"><span className="text-lg">🎯</span><h2 className="text-lg font-bold">Prioridades</h2></div>
      {priorities.length === 0 && <p className="text-sm text-muted-foreground">Faça seu primeiro check-in para ver prioridades.</p>}
      <ol className="flex flex-col gap-2">
        {priorities.map((p, i) => (
          <li key={p.pillarId} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-secondary transition">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-bold">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{p.title}</div>
              <div className="text-xs text-muted-foreground truncate">Pilar: {p.pillarName}</div>
            </div>
            <span className="text-lg">{p.icon}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function NextActionCard({ rec, loading, onGen, fallback }: {
  rec: { title: string | null; message: string } | null | undefined;
  loading: boolean;
  onGen: () => void;
  fallback: { title: string; pillarName: string | null } | null;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">Próxima melhor ação</h2>
        <span className="text-[color:var(--attention)]">★</span>
      </div>
      <div className="rounded-xl bg-[color:var(--primary)]/5 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">⏰</div>
          <div>
            <p className="text-sm font-medium leading-snug">{rec?.title ?? fallback?.title ?? "Comece fazendo seu check-in semanal."}</p>
            {rec?.message && <p className="mt-1 text-xs text-muted-foreground">{rec.message}</p>}
          </div>
        </div>
        <button onClick={onGen} disabled={loading}
          className="mt-4 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? "Gerando…" : "✨ Gerar nova sugestão (IA)"}
        </button>
      </div>
    </div>
  );
}