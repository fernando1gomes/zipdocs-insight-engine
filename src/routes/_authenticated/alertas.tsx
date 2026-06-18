import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { listAlerts, markAlertRead, generateAlerts } from "@/lib/alerts.functions";

export const Route = createFileRoute("/_authenticated/alertas")({
  head: () => ({ meta: [{ title: "Alertas — Roda da Vida Viva" }] }),
  component: AlertasPage,
});

const SEV: Record<string, string> = { red: "var(--critical)", yellow: "var(--attention)", green: "var(--balanced)", gray: "var(--empty)" };

function AlertasPage() {
  const qc = useQueryClient();
  const list = useServerFn(listAlerts);
  const mark = useServerFn(markAlertRead);
  const gen = useServerFn(generateAlerts);
  const alerts = useQuery({ queryKey: ["alerts"], queryFn: () => list() });

  const mGen = useMutation({
    mutationFn: () => gen(),
    onSuccess: (r) => { qc.invalidateQueries({ queryKey: ["alerts"] }); toast.success(`${r.created} alerta(s) gerado(s)`); },
    onError: (e: Error) => toast.error(e.message),
  });
  const mMark = useMutation({
    mutationFn: (id: string) => mark({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold">Alertas</h1>
          <button onClick={() => mGen.mutate()} disabled={mGen.isPending}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">
            {mGen.isPending ? "Analisando…" : "🔄 Analisar agora"}
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {alerts.data?.length === 0 && <p className="text-sm text-muted-foreground">Nenhum alerta. Tudo certo por aqui.</p>}
          {alerts.data?.map((a) => (
            <div key={a.id} className="rounded-xl border border-border/60 bg-card p-4 flex items-start gap-3"
              style={{ borderLeft: `4px solid ${SEV[a.severity] ?? SEV.yellow}` }}>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{a.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{a.message}</div>
                <div className="text-[10px] text-muted-foreground mt-1">{new Date(a.created_at).toLocaleString("pt-BR")}</div>
              </div>
              {!a.is_read && (
                <button onClick={() => mMark.mutate(a.id)} className="text-xs text-primary hover:underline">marcar lido</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}