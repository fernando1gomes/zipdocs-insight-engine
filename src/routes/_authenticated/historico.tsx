import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { getHistory } from "@/lib/history.functions";
import { getDashboard } from "@/lib/dashboard.functions";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useMemo } from "react";

export const Route = createFileRoute("/_authenticated/historico")({
  head: () => ({ meta: [{ title: "Histórico — Roda da Vida Viva" }] }),
  component: HistPage,
});

function HistPage() {
  const hFn = useServerFn(getHistory);
  const dFn = useServerFn(getDashboard);
  const hist = useQuery({ queryKey: ["history"], queryFn: () => hFn() });
  const dash = useQuery({ queryKey: ["dashboard"], queryFn: () => dFn() });

  const chartData = useMemo(() => {
    if (!hist.data || !dash.data) return [];
    const byDate = new Map<string, Record<string, number | string>>();
    for (const e of hist.data.evaluations) {
      const date = e.evaluation_date.slice(0, 10);
      const p = dash.data.pillars.find((p) => p.id === e.pillar_id);
      if (!p) continue;
      const row = byDate.get(date) ?? { date };
      row[p.shortName] = Number(e.final_score);
      byDate.set(date, row);
    }
    return Array.from(byDate.values()).sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }, [hist.data, dash.data]);

  const colors = ["#6366f1","#ef4444","#22c55e","#eab308","#06b6d4","#f97316","#8b5cf6","#10b981","#ec4899","#3b82f6","#84cc16"];

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-extrabold mb-6">Histórico</h1>

        <div className="rounded-2xl border border-border/60 bg-card p-4 mb-6">
          <h2 className="font-bold mb-3">Evolução dos pilares</h2>
          <div className="h-72">
            {chartData.length === 0 ? (
              <p className="text-sm text-muted-foreground">Faça check-ins para ver sua evolução.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" fontSize={11} />
                  <YAxis domain={[0, 10]} fontSize={11} />
                  <Tooltip />
                  {dash.data?.pillars.map((p, i) => (
                    <Line key={p.id} dataKey={p.shortName} stroke={colors[i % colors.length]} dot={false} strokeWidth={2} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-4">
          <h2 className="font-bold mb-3">Check-ins recentes</h2>
          {hist.data?.checkins.length === 0 && <p className="text-sm text-muted-foreground">Nenhum check-in salvo ainda.</p>}
          <ul className="flex flex-col gap-2">
            {hist.data?.checkins.map((c) => (
              <li key={c.id} className="flex items-center justify-between rounded-lg bg-secondary/40 px-3 py-2 text-sm">
                <span>Semana de {c.week_start_date} a {c.week_end_date}</span>
                <span className="text-xs text-muted-foreground">{c.is_completed ? "✓ concluído" : "rascunho"}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}