import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/plano-acao/")({
  component: PlanoAcaoList,
});

function PlanoAcaoList() {
  const { data: pillars } = useQuery({
    queryKey: ["pillars-active"],
    queryFn: async () => {
      const { data } = await supabase
        .from("pillars")
        .select("id,name,short_name,icon,default_order")
        .eq("is_active", true)
        .order("default_order");
      return data ?? [];
    },
  });

  const { data: plans } = useQuery({
    queryKey: ["action-plans"],
    queryFn: async () => {
      const { data } = await supabase
        .from("pillar_action_plans")
        .select("id,pillar_id,status,updated_at,what")
        .order("updated_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: ups } = useQuery({
    queryKey: ["user-pillars-mini"],
    queryFn: async () => {
      const { data } = await supabase.from("user_pillars").select("pillar_id,current_score,status_color");
      return data ?? [];
    },
  });

  const planByPillar = new Map<number, { id: string; status: string; what: string | null }>();
  (plans ?? []).forEach((p) => {
    if (!planByPillar.has(p.pillar_id)) planByPillar.set(p.pillar_id, p);
  });
  const upByPillar = new Map((ups ?? []).map((u) => [u.pillar_id, u]));

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6 md:px-8 md:py-8">
        <AppHeader />
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold">Planos de ação por pilar</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Para cada pilar: o que está <strong>quebrado</strong>, <strong>faltando</strong> ou{" "}
            <strong>fora do lugar</strong>? Monte um plano 5W2H com sugestões da IA.
          </p>
        </div>

        <ul className="grid gap-3 md:grid-cols-2">
          {(pillars ?? []).map((p) => {
            const plan = planByPillar.get(p.id);
            const up = upByPillar.get(p.id);
            const color =
              up?.status_color === "red"
                ? "bg-red-500"
                : up?.status_color === "yellow"
                  ? "bg-yellow-500"
                  : up?.status_color === "green"
                    ? "bg-green-500"
                    : "bg-gray-300";
            return (
              <li key={p.id} className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{p.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold truncate">{p.name}</h2>
                      <span className={`inline-block h-2 w-2 rounded-full ${color}`} />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Nota atual: {up?.current_score ?? 0}/10
                    </div>
                    {plan?.what ? (
                      <div className="text-xs mt-2 line-clamp-2">
                        <span className="font-medium">Objetivo:</span> {plan.what}
                      </div>
                    ) : (
                      <div className="text-xs mt-2 text-muted-foreground">Nenhum plano ainda.</div>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <Link
                    to="/plano-acao/$pillarId"
                    params={{ pillarId: String(p.id) }}
                    className="rounded-lg bg-[color:var(--primary)] text-primary-foreground px-3 py-1.5 text-sm font-medium hover:opacity-90"
                  >
                    {plan ? "Editar plano" : "Criar plano"}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}