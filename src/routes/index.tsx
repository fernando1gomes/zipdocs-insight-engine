import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LifeWheel } from "@/components/LifeWheel";
import { PillarCard } from "@/components/PillarCard";
import { RadialWheel } from "@/components/RadialWheel";
import { PILLARS, overallBalance, statusFromScore, type Pillar } from "@/lib/pillars";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Roda da Vida Viva — Equilíbrio integrado da sua evolução" },
      { name: "description", content: "Dashboard de autogestão pessoal com 11 pilares: visualize, priorize e tome a próxima melhor ação." },
      { property: "og:title", content: "Roda da Vida Viva" },
      { property: "og:description", content: "Uma visão integrada da sua evolução em 11 pilares da vida." },
    ],
  }),
  component: Index,
});

function Index() {
  const [pillars] = useState<Pillar[]>(PILLARS);
  const [hovered, setHovered] = useState<number | null>(null);
  const balance = useMemo(() => overallBalance(pillars), [pillars]);

  const PRIORITY_NAMES = [
    "Saúde e disposição",
    "Emocional",
    "Espiritualidade e sentido",
    "Financeiro",
    "Intelectual e aprendizado",
  ];
  const priorities = PRIORITY_NAMES
    .map((n) => pillars.find((p) => p.name === n))
    .filter((p): p is Pillar => Boolean(p));

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1500px] px-4 py-6 md:px-8 md:py-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--focus)] text-white text-xl shadow-md">
              🌱
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Roda da Vida Viva</h1>
              <p className="text-sm text-muted-foreground">Uma visão integrada da sua evolução</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition">
              Novo check-in
            </button>
            <button className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95 transition">
              Criar ação
            </button>
          </div>
        </header>

        {/* Desktop radial layout */}
        <div className="hidden xl:grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <RadialWheel pillars={pillars} balance={balance} hovered={hovered} onHover={setHovered} />
          <div className="flex flex-col gap-4">
            <PrioritiesCard priorities={priorities} onHover={setHovered} />
            <NextActionCard />
          </div>
        </div>

        {/* Tablet / mobile stacked layout */}
        <div className="xl:hidden grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl bg-card p-6 shadow-sm border border-border/60">
              <LifeWheel pillars={pillars} balance={balance} hovered={hovered} onHover={setHovered} />
            </div>
            <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {pillars.map((p) => (
                <PillarCard key={p.id} pillar={p} hovered={hovered === p.id} onHover={setHovered} />
              ))}
            </section>
          </div>
          <div className="flex flex-col gap-4">
            <PrioritiesCard priorities={priorities} onHover={setHovered} />
            <NextActionCard />
          </div>
        </div>

        {/* Footer: legend + tip side by side */}
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
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-lg">🎯</span>
        <h2 className="text-lg font-bold">Prioridades da semana</h2>
      </div>
      <ol className="flex flex-col gap-2">
        {priorities.map((p, i) => (
          <li
            key={p.id}
            onMouseEnter={() => onHover(p.id)}
            onMouseLeave={() => onHover(null)}
            className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-secondary cursor-pointer transition"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate">{actionFor(p)}</div>
              <div className="text-xs text-muted-foreground truncate">Pilar: {p.shortName}</div>
            </div>
            <span className="text-lg">{p.icon}</span>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-col gap-2">
        <button className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95 transition flex items-center justify-between">
          <span className="flex items-center gap-2">⚡ Criar ação rápida</span>
          <span>›</span>
        </button>
        <button className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition flex items-center justify-between">
          <span className="flex items-center gap-2">📅 Revisar planos</span>
          <span>›</span>
        </button>
        <button className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition flex items-center justify-between">
          <span className="flex items-center gap-2">📊 Ver foco da semana</span>
          <span>›</span>
        </button>
      </div>
    </div>
  );
}

function actionFor(p: Pillar) {
  const map: Record<string, string> = {
    "Saúde e disposição": "Fortalecer rotina de exercícios",
    "Emocional": "Melhorar equilíbrio emocional",
    "Financeiro": "Organizar finanças pessoais",
    "Lazer e prazer": "Reservar tempo para lazer",
    "Intelectual e aprendizado": "Aprofundar estudos atuais",
    "Espiritualidade e sentido": "Reconectar com seu propósito",
    "Relacionamento amoroso": "Fortalecer diálogo no relacionamento",
  };
  return map[p.name] ?? `Cuidar de ${p.shortName}`;
}

function NextActionCard() {
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
            Agendar 30min de exercício hoje à tarde
          </p>
        </div>
        <button className="mt-4 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95 transition flex items-center justify-center gap-2">
          Agendar agora <span>›</span>
        </button>
      </div>
    </div>
  );
}