import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { listActions, createAction, completeAction, deleteAction } from "@/lib/actions.functions";
import { getDashboard } from "@/lib/dashboard.functions";

export const Route = createFileRoute("/_authenticated/acoes")({
  head: () => ({ meta: [{ title: "Ações — Roda da Vida Viva" }] }),
  component: AcoesPage,
});

function AcoesPage() {
  const qc = useQueryClient();
  const list = useServerFn(listActions);
  const create = useServerFn(createAction);
  const complete = useServerFn(completeAction);
  const del = useServerFn(deleteAction);
  const dashFn = useServerFn(getDashboard);

  const actions = useQuery({ queryKey: ["actions"], queryFn: () => list() });
  const dash = useQuery({ queryKey: ["dashboard"], queryFn: () => dashFn() });

  const [title, setTitle] = useState("");
  const [pillarId, setPillarId] = useState<number>(1);
  const [dueDate, setDueDate] = useState("");

  const invalidate = () => qc.invalidateQueries({ queryKey: ["actions"] });

  const mCreate = useMutation({
    mutationFn: (data: { pillar_id: number; title: string; due_date?: string | null }) => create({ data }),
    onSuccess: () => { invalidate(); setTitle(""); setDueDate(""); toast.success("Ação criada"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const mComplete = useMutation({ mutationFn: (id: string) => complete({ data: { id } }), onSuccess: invalidate });
  const mDelete = useMutation({ mutationFn: (id: string) => del({ data: { id } }), onSuccess: invalidate });

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-extrabold mb-6">Ações</h1>

        <div className="rounded-2xl border border-border/60 bg-card p-4 mb-6">
          <h2 className="font-bold mb-3">Nova ação</h2>
          <div className="grid gap-2 md:grid-cols-[1fr_200px_160px_auto]">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título da ação"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            <select value={pillarId} onChange={(e) => setPillarId(Number(e.target.value))}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
              {dash.data?.pillars.map((p) => <option key={p.id} value={p.id}>{p.icon} {p.shortName}</option>)}
            </select>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            <button onClick={() => title.trim() && mCreate.mutate({ pillar_id: pillarId, title, due_date: dueDate || null })}
              disabled={mCreate.isPending}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">
              Criar
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {actions.data?.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma ação ainda.</p>}
          {actions.data?.map((a) => {
            const pName = dash.data?.pillars.find((p) => p.id === a.pillar_id)?.shortName ?? "";
            return (
              <div key={a.id} className="rounded-xl border border-border/60 bg-card p-3 flex items-center gap-3">
                <input type="checkbox" checked={a.status === "completed"}
                  onChange={() => a.status !== "completed" && mComplete.mutate(a.id)}
                  className="h-4 w-4" />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium truncate ${a.status === "completed" ? "line-through text-muted-foreground" : ""}`}>{a.title}</div>
                  <div className="text-xs text-muted-foreground">{pName}{a.due_date ? ` · vence ${a.due_date}` : ""}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${a.status === "completed" ? "bg-[color:var(--balanced-soft)] text-[color:var(--balanced)]" : "bg-secondary"}`}>{a.status}</span>
                <button onClick={() => mDelete.mutate(a.id)} className="text-xs text-muted-foreground hover:text-destructive">excluir</button>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}