import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { getDashboard } from "@/lib/dashboard.functions";
import { submitCheckin } from "@/lib/checkin.functions";

export const Route = createFileRoute("/_authenticated/checkin")({
  head: () => ({ meta: [{ title: "Check-in semanal" }] }),
  component: CheckinPage,
});

function CheckinPage() {
  const navigate = useNavigate();
  const fetchDash = useServerFn(getDashboard);
  const submit = useServerFn(submitCheckin);
  const dash = useQuery({ queryKey: ["dashboard"], queryFn: () => fetchDash() });
  const [scores, setScores] = useState<Record<number, number>>({});
  const [comments, setComments] = useState<Record<number, string>>({});
  const [reflection, setReflection] = useState("");

  const mut = useMutation({
    mutationFn: (payload: Parameters<typeof submit>[0]) => submit(payload),
    onSuccess: () => { toast.success("Check-in salvo!"); navigate({ to: "/dashboard" }); },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!dash.data) return <AppShell><div className="p-8">Carregando…</div></AppShell>;

  const pillars = dash.data.pillars;

  function save() {
    const arr = pillars
      .filter((p) => scores[p.id] !== undefined)
      .map((p) => ({ pillar_id: p.id, score: scores[p.id], comment: comments[p.id] ?? null }));
    if (arr.length === 0) { toast.error("Avalie ao menos um pilar."); return; }
    mut.mutate({ data: { scores: arr, reflection } });
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Check-in semanal</h1>
        <p className="text-sm text-muted-foreground mb-6">Dê uma nota de 0 a 10 para cada pilar nesta semana.</p>
        <div className="flex flex-col gap-4">
          {pillars.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border/60 bg-card p-4">
              <div className="flex items-center justify-between mb-2 gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xl">{p.icon}</span>
                  <span className="font-semibold truncate">{p.name}</span>
                </div>
                <span className="text-lg font-bold tabular-nums w-10 text-right">{scores[p.id]?.toFixed(1) ?? "—"}</span>
              </div>
              <input type="range" min={0} max={10} step={0.5}
                value={scores[p.id] ?? p.score}
                onChange={(e) => setScores((s) => ({ ...s, [p.id]: Number(e.target.value) }))}
                className="w-full accent-primary" />
              <input type="text" placeholder="Comentário (opcional)"
                value={comments[p.id] ?? ""}
                onChange={(e) => setComments((c) => ({ ...c, [p.id]: e.target.value }))}
                className="mt-2 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs" />
            </div>
          ))}
          <textarea placeholder="Reflexão da semana (opcional)" value={reflection} onChange={(e) => setReflection(e.target.value)}
            className="w-full rounded-xl border border-border bg-card p-3 text-sm min-h-24" />
          <button onClick={save} disabled={mut.isPending}
            className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95 disabled:opacity-50">
            {mut.isPending ? "Salvando…" : "Salvar check-in"}
          </button>
        </div>
      </div>
    </AppShell>
  );
}