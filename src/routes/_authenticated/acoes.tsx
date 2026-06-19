import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PILLAR_DEFAULTS, statusFromScore } from "@/lib/pillars";
import { usePillars } from "@/lib/usePillars";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/acoes")({
  component: ActionsPage,
});

function ActionsPage() {
  const qc = useQueryClient();
  const { data: pillarsData } = usePillars();
  const pillars = pillarsData?.pillars;
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("pending");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    pillar_id: 1,
    action_type: "unique",
    start_date: new Date().toISOString().slice(0, 10),
  });

  const { data: actions } = useQuery({
    queryKey: ["actions", filter],
    queryFn: async () => {
      let q = supabase.from("pillar_actions").select("*").order("created_at", { ascending: false });
      if (filter === "pending") q = q.in("status", ["pending", "overdue"]);
      if (filter === "completed") q = q.eq("status", "completed");
      const { data } = await q;
      return data ?? [];
    },
  });

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase.from("pillar_actions").insert({
      user_id: u.user.id,
      pillar_id: form.pillar_id,
      title: form.title,
      description: form.description || null,
      action_type: form.action_type,
      start_date: form.start_date,
      status: "pending",
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Ação criada!");
    setOpen(false);
    setForm({ ...form, title: "", description: "" });
    qc.invalidateQueries({ queryKey: ["actions"] });
    qc.invalidateQueries({ queryKey: ["next_action"] });
  }

  async function complete(id: string) {
    await supabase
      .from("pillar_actions")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", id);
    qc.invalidateQueries({ queryKey: ["actions"] });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6 md:px-8 md:py-8">
        <AppHeader />
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-extrabold">Minhas ações</h1>
          <Button onClick={() => setOpen(!open)}>{open ? "Cancelar" : "+ Nova ação"}</Button>
        </div>

        {open && (
          <form onSubmit={create} className="mb-6 rounded-2xl border border-border/60 bg-card p-5 shadow-sm grid gap-3">
            <div>
              <Label>Título</Label>
              <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>Pilar</Label>
              <select
                value={form.pillar_id}
                onChange={(e) => setForm({ ...form, pillar_id: Number(e.target.value) })}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                {PILLAR_DEFAULTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.icon} {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Tipo</Label>
              <select
                value={form.action_type}
                onChange={(e) => setForm({ ...form, action_type: e.target.value })}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="unique">Única</option>
                <option value="recurring">Recorrente</option>
              </select>
            </div>
            <div>
              <Label>Descrição</Label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-md border border-input bg-background p-2 text-sm"
                rows={2}
              />
            </div>
            <Button type="submit">Criar ação</Button>
          </form>
        )}

        <div className="mb-4 flex gap-2 text-sm">
          {(["pending", "completed", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 transition ${filter === f ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/70"}`}
            >
              {f === "pending" ? "Pendentes" : f === "completed" ? "Concluídas" : "Todas"}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-10">
          {(() => {
            const groups = PILLAR_DEFAULTS.filter((def) =>
              (actions ?? []).some((a) => a.pillar_id === def.id),
            );
            if (groups.length === 0) {
              const msg =
                filter === "pending"
                  ? "Nenhuma ação pendente em nenhum pilar."
                  : filter === "completed"
                    ? "Nenhuma ação concluída ainda."
                    : "Nenhuma ação cadastrada ainda.";
              return <p className="text-sm text-muted-foreground">{msg}</p>;
            }
            const statusColorVar = (s: ReturnType<typeof statusFromScore>) =>
              s === "balanced"
                ? "var(--balanced)"
                : s === "attention"
                  ? "var(--attention)"
                  : s === "critical"
                    ? "var(--critical)"
                    : "var(--empty)";
            return groups.map((def) => {
              const score = pillars?.find((p) => p.id === def.id)?.score ?? 0;
              const status = statusFromScore(score);
              const color = statusColorVar(status);
              const items = (actions ?? [])
                .filter((a) => a.pillar_id === def.id)
                .sort((a, b) => {
                  const rank = (s: string) => (s === "completed" ? 2 : s === "overdue" ? 0 : 1);
                  return rank(a.status) - rank(b.status);
                });
              const pending = items.filter((a) => a.status !== "completed").length;
              const done = items.filter((a) => a.status === "completed").length;
              return (
                <section key={def.id}>
                  <header
                    className="mb-3 flex items-center gap-3 border-l-4 pl-3"
                    style={{ borderColor: color }}
                  >
                    <span className="text-3xl">{def.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-extrabold leading-tight">{def.name}</h2>
                      <div className="flex gap-2 mt-0.5">
                        {pending > 0 && (
                          <span
                            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                            style={{ background: `${color}22`, color }}
                          >
                            {pending} pendente{pending > 1 ? "s" : ""}
                          </span>
                        )}
                        {done > 0 && (
                          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                            {done} concluída{done > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </header>
                  <ul className="flex flex-col gap-2">
                    {items.map((a) => (
                      <li
                        key={a.id}
                        className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate">{a.title}</div>
                          <div className="text-xs text-muted-foreground">{a.status}</div>
                        </div>
                        {a.status !== "completed" && (
                          <Button size="sm" variant="outline" onClick={() => complete(a.id)}>
                            Concluir
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
}