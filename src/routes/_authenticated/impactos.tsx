import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useEffect, useRef } from "react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { usePillars } from "@/lib/usePillars";
import {
  PILLAR_IMPACTS,
  getImpactBySystemId,
  intensityClasses,
  intensityLabel,
  influenceClasses,
  influenceLabel,
  type PillarImpactData,
} from "@/lib/impacts";

const search = z.object({
  pillar: fallback(z.number().int().optional(), undefined).optional(),
});

export const Route = createFileRoute("/_authenticated/impactos")({
  validateSearch: zodValidator(search),
  head: () => ({
    meta: [
      { title: "Mapa de Impacto dos Pilares — Roda da Vida Viva" },
      {
        name: "description",
        content:
          "Entenda como a melhora ou queda de um pilar afeta os outros pilares da sua vida.",
      },
    ],
  }),
  component: ImpactosPage,
});

function ImpactosPage() {
  const navigate = useNavigate();
  const { pillar: selectedId } = Route.useSearch();
  const { data } = usePillars();
  const userPillars = data?.pillars ?? [];
  const detailRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(
    () =>
      selectedId ? PILLAR_IMPACTS.find((p) => p.systemPillarId === selectedId) : undefined,
    [selectedId]
  );

  useEffect(() => {
    if (selected && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selected?.systemPillarId]);

  function scoreOf(systemPillarId: number): number {
    return userPillars.find((p) => p.id === systemPillarId)?.score ?? 0;
  }

  function selectPillar(systemPillarId: number) {
    navigate({
      to: "/impactos",
      search: { pillar: systemPillarId },
      replace: false,
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-8">
        <AppHeader />

        <header className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Mapa de Impacto dos Pilares
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Entenda como a melhora ou a queda de um pilar afeta os outros pilares da sua vida.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80 max-w-3xl">
            Nenhum pilar da vida melhora ou piora sozinho. Cada área influencia outras áreas.
            Ao fortalecer um pilar estratégico, você acelera a evolução de vários outros.
          </p>
        </header>

        <section ref={gridRef} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PILLAR_IMPACTS.map((p) => {
            const score = scoreOf(p.systemPillarId);
            const isActive = selected?.systemPillarId === p.systemPillarId;
            return (
              <button
                key={p.systemPillarId}
                type="button"
                aria-pressed={isActive}
                onClick={() => selectPillar(p.systemPillarId)}
                className={`text-left rounded-2xl border bg-card p-4 shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] ${
                  isActive
                    ? "border-[color:var(--primary)] ring-2 ring-[color:var(--primary)]/40"
                    : "border-border/60"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl leading-none">{p.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{p.displayName}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Nota atual: <span className="font-semibold text-foreground">{score ? score.toFixed(1) : "—"}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Impacta {p.directCount} pilares
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${influenceClasses(p.influence)}`}>
                    Influência: {influenceLabel(p.influence)}
                  </span>
                </div>
              </button>
            );
          })}
        </section>

        <div ref={detailRef} className="mt-8">
          {selected ? (
            <PillarDetail data={selected} currentScore={scoreOf(selected.systemPillarId)} />
          ) : (
            <div className="rounded-2xl border border-dashed border-border/60 bg-card/50 p-8 text-center text-sm text-muted-foreground">
              Toque em um pilar acima para ver como ele impacta as outras áreas da sua vida.
            </div>
          )}
        </div>

        <section className="mt-10 rounded-2xl bg-secondary/40 border border-border/60 p-6 text-center">
          <p className="text-base leading-relaxed text-foreground max-w-2xl mx-auto">
            Nenhum pilar da vida adoece sozinho. Nenhum pilar melhora sozinho.
            Toda mudança verdadeira gera um efeito dominó.
          </p>
          <Button
            className="mt-4"
            onClick={() => gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          >
            Escolher um pilar para transformar agora
          </Button>
        </section>
      </div>
    </div>
  );
}

function PillarDetail({ data, currentScore }: { data: PillarImpactData; currentScore: number }) {
  return (
    <article className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
      <header className="flex items-start gap-4">
        <div className="text-4xl">{data.icon}</div>
        <div className="flex-1">
          <h2 className="text-2xl font-extrabold">{data.displayName}</h2>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-secondary px-2.5 py-1 font-medium">
              Nota atual: <span className="font-bold text-foreground">{currentScore ? currentScore.toFixed(1) : "—"}</span>
            </span>
            <span className="rounded-full bg-secondary px-2.5 py-1 font-medium">
              Impacta diretamente: <span className="font-bold">{data.directCount} pilares</span>
            </span>
            <span className={`rounded-full px-2.5 py-1 font-semibold ${influenceClasses(data.influence)}`}>
              Influência: {influenceLabel(data.influence)}
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{data.intro}</p>
        </div>
      </header>

      <section className="mt-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
          Pilares impactados
        </h3>
        <div className="overflow-hidden rounded-xl border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Pilar impactado</th>
                <th className="px-3 py-2 text-left font-semibold">Intensidade</th>
                <th className="px-3 py-2 text-left font-semibold">Por que impacta</th>
              </tr>
            </thead>
            <tbody>
              {data.impacts.map((row) => (
                <tr key={row.target} className="border-t border-border/60">
                  <td className="px-3 py-2 font-medium">{row.target}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${intensityClasses(row.intensity)}`}>
                      {intensityLabel(row.intensity)}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[color:var(--balanced)]/30 bg-[color:var(--balanced-soft)]/50 p-4">
          <div className="text-sm font-bold text-[color:var(--balanced)] flex items-center gap-2">
            ▲ Se este pilar melhorar
          </div>
          <ul className="mt-2 space-y-1 text-sm">
            {data.ifImproves.map((x) => (
              <li key={x} className="flex gap-2">
                <span className="text-[color:var(--balanced)]">•</span>
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-[color:var(--critical)]/30 bg-[color:var(--critical-soft)]/40 p-4">
          <div className="text-sm font-bold text-[color:var(--critical)] flex items-center gap-2">
            ▼ Se este pilar piorar
          </div>
          <ul className="mt-2 space-y-1 text-sm">
            {data.ifWorsens.map((x) => (
              <li key={x} className="flex gap-2">
                <span className="text-[color:var(--critical)]">•</span>
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-[color:var(--primary)]/30 bg-[color:var(--primary)]/5 p-5">
        <h3 className="text-lg font-bold">Agora olhe para sua parte</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          O que está quebrado, faltando ou fora do lugar neste pilar? Assuma sua parte e
          transforme consciência em ação.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/autorresponsabilidade"
            search={{ pillarId: data.systemPillarId }}
            className="rounded-xl bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
          >
            Ir para Autorresponsabilidade
          </Link>
          <Link
            to="/plano-acao/$pillarId"
            params={{ pillarId: String(data.systemPillarId) }}
            className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary transition"
          >
            Criar Plano de Ação
          </Link>
        </div>
      </section>
    </article>
  );
}
