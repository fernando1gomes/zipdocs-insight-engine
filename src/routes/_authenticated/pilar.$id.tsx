import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { PILLAR_DEFAULTS, statusFromScore } from "@/lib/pillars";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { generatePillarInsight } from "@/lib/insights.functions";
import { Sparkle as PhSparkle } from "@phosphor-icons/react";

export const Route = createFileRoute("/_authenticated/pilar/$id")({
  component: PillarDetail,
});

function PillarDetail() {
  const { id } = Route.useParams();
  const pillarId = Number(id);
  const def = PILLAR_DEFAULTS.find((p) => p.id === pillarId);
  const impactWeight = (def?.impact ?? 5) / 10;
  const computeFinal = (s: number, b: number, e: number, f: number, i: number) =>
    Number(((s + b + e + f + i * impactWeight) / (4 + impactWeight)).toFixed(2));
  const qc = useQueryClient();
  const [score, setScore] = useState<number>(7);
  const [execution, setExecution] = useState<number>(7);
  const [interdependence, setInterdependence] = useState<number>(7);
  const [criteriaScores, setCriteriaScores] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const runInsight = useServerFn(generatePillarInsight);

  const { data: userPillar } = useQuery({
    queryKey: ["user_pillar", pillarId],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_pillars")
        .select("*")
        .eq("pillar_id", pillarId)
        .maybeSingle();
      return data;
    },
  });

  const { data: history } = useQuery({
    queryKey: ["pillar_history", pillarId],
    queryFn: async () => {
      const { data } = await supabase
        .from("pillar_evaluations")
        .select("id, final_score, evaluation_date, user_comment")
        .eq("pillar_id", pillarId)
        .order("evaluation_date", { ascending: false })
        .limit(10);
      return data ?? [];
    },
  });

  const { data: actions } = useQuery({
    queryKey: ["pillar_actions_for", pillarId],
    queryFn: async () => {
      const { data } = await supabase
        .from("pillar_actions")
        .select("*")
        .eq("pillar_id", pillarId)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: criteria } = useQuery({
    queryKey: ["pillar_criteria", pillarId],
    queryFn: async () => {
      const { data } = await supabase
        .from("pillar_criteria")
        .select("id, key, label, question_text, hint, weight, order_index")
        .eq("pillar_id", pillarId)
        .eq("is_active", true)
        .order("order_index");
      return data ?? [];
    },
  });

  function setCrit(id: string, v: number) {
    setCriteriaScores((s) => ({ ...s, [id]: v }));
  }

  // média ponderada dos critérios objetivos = behavior_score
  const behaviorAvg = (() => {
    const items = criteria ?? [];
    if (!items.length) return 7;
    let sum = 0;
    let wsum = 0;
    for (const c of items) {
      const v = criteriaScores[c.id] ?? 7;
      const w = Number(c.weight ?? 1);
      sum += v * w;
      wsum += w;
    }
    return wsum > 0 ? sum / wsum : 7;
  })();

  async function submitEvaluation(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const final = computeFinal(score, behaviorAvg, execution, behaviorAvg, interdependence);
    const { data: evalIns, error } = await supabase.from("pillar_evaluations").insert({
      user_id: u.user.id,
      pillar_id: pillarId,
      final_score: final,
      subjective_score: score,
      behavior_score: Number(behaviorAvg.toFixed(2)),
      action_execution_score: execution,
      frequency_score: Number(behaviorAvg.toFixed(2)),
      interdependence_score: interdependence,
      user_comment: comment || null,
    }).select("id").single();
    if (!error && evalIns && (criteria ?? []).length > 0) {
      const rows = (criteria ?? []).map((c) => ({
        evaluation_id: evalIns.id,
        criterion_id: c.id,
        user_id: u.user!.id,
        score: criteriaScores[c.id] ?? 7,
      }));
      await supabase.from("pillar_criteria_scores").insert(rows);
    }
    setSubmitting(false);
    if (error) {
      toast.error("Erro: " + error.message);
      return;
    }
    toast.success("Avaliação registrada!");
    setComment("");
    qc.invalidateQueries({ queryKey: ["user_pillar", pillarId] });
    qc.invalidateQueries({ queryKey: ["pillar_history", pillarId] });
    qc.invalidateQueries({ queryKey: ["user_pillars"] });
    qc.invalidateQueries({ queryKey: ["alerts"] });
  }

  async function completeAction(actionId: string) {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    await supabase.from("pillar_action_logs").insert({
      action_id: actionId,
      user_id: u.user.id,
      pillar_id: pillarId,
      status: "completed",
    });
    await supabase
      .from("pillar_actions")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", actionId);
    toast.success("Ação concluída!");
    qc.invalidateQueries({ queryKey: ["pillar_actions_for", pillarId] });
  }

  if (!def) return <div className="p-8">Pilar não encontrado.</div>;
  const current = Number(userPillar?.current_score ?? 0);
  const status = statusFromScore(current);

  async function fetchInsight() {
    setLoadingInsight(true);
    try {
      const r = await runInsight({ data: { pillarId } });
      setInsight(r.insight);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro na IA");
    } finally {
      setLoadingInsight(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-8">
        <AppHeader />
        <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">← Voltar ao dashboard</Link>

        <div className="mt-4 rounded-3xl bg-card border border-border/60 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <def.Icon weight="light" className="h-12 w-12 text-[color:var(--primary)]" />
            <div>
              <h1 className="text-2xl font-extrabold">{def.name}</h1>
              <p className="text-sm text-muted-foreground">{def.shortName} · status: {status}</p>
            </div>
            <div className="ml-auto text-4xl font-bold" style={{ color: `var(--${status})` }}>
              {current.toFixed(1)}
            </div>
          </div>
          <div className="mt-5 rounded-xl border border-[color:var(--focus)]/30 bg-[color:var(--focus)]/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <PhSparkle size={18} weight="light" className="text-[color:var(--focus)]" />
                <span className="text-sm font-semibold">Insight da IA</span>
              </div>
              <Button size="sm" variant="outline" onClick={fetchInsight} disabled={loadingInsight}>
                {loadingInsight ? "Pensando..." : insight ? "Gerar de novo" : "Gerar insight"}
              </Button>
            </div>
            {insight && (
              <p className="mt-3 text-sm leading-relaxed text-foreground whitespace-pre-line">{insight}</p>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <form onSubmit={submitEvaluation} className="rounded-2xl bg-card border border-border/60 p-5 shadow-sm">
            <h2 className="text-lg font-bold mb-3">Nova avaliação</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Avalie 0–10 em cada critério. A nota final é a média.
            </p>
            <CriterionSlider
              label="Percepção subjetiva"
              hint="Como você se sente em relação a este pilar agora?"
              value={score}
              onChange={setScore}
            />
            {(criteria ?? []).length > 0 && (
              <div className="mt-2 mb-2 rounded-lg bg-secondary/30 px-3 py-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Critérios objetivos deste pilar
                </div>
                {(criteria ?? []).map((c) => (
                  <CriterionSlider
                    key={c.id}
                    label={c.label}
                    hint={c.question_text}
                    value={criteriaScores[c.id] ?? 7}
                    onChange={(v) => setCrit(c.id, v)}
                  />
                ))}
              </div>
            )}
            <CriterionSlider
              label="Execução de ações"
              hint="Você executou as ações planejadas para este pilar?"
              value={execution}
              onChange={setExecution}
            />
            <CriterionSlider
              label="Interdependência"
              hint="Quanto este pilar tem impactado positivamente os outros?"
              value={interdependence}
              onChange={setInterdependence}
            />
            <div className="mt-2 rounded-lg bg-secondary/40 px-3 py-2 text-sm">
              Nota final:{" "}
              <span className="font-bold">
                {computeFinal(score, behaviorAvg, execution, behaviorAvg, interdependence).toFixed(2)}
              </span>
              <span className="ml-2 text-xs text-muted-foreground">
                (interdependência pesa ×{impactWeight.toFixed(1)} — impacto deste pilar: {def.impact}/10)
              </span>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Reflexão (opcional)"
              className="mt-3 w-full rounded-xl border border-input bg-background p-3 text-sm"
              rows={3}
            />
            <Button type="submit" disabled={submitting} className="mt-3 w-full">
              {submitting ? "Salvando..." : "Salvar avaliação"}
            </Button>
          </form>

          <div className="rounded-2xl bg-card border border-border/60 p-5 shadow-sm">
            <h2 className="text-lg font-bold mb-3">Histórico</h2>
            {(history ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem avaliações ainda.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {history!.map((h) => (
                  <li key={h.id} className="flex items-center justify-between rounded-lg bg-secondary/40 px-3 py-2 text-sm">
                    <span>{new Date(h.evaluation_date!).toLocaleDateString("pt-BR")}</span>
                    <span className="font-bold">{Number(h.final_score ?? 0).toFixed(1)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-card border border-border/60 p-5 shadow-sm">
          <h2 className="text-lg font-bold mb-3">Ações deste pilar</h2>
          {(actions ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma ação. <Link to="/acoes" className="text-primary underline">Crie uma</Link>.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {actions!.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{a.title}</div>
                    <div className="text-xs text-muted-foreground">status: {a.status}</div>
                  </div>
                  {a.status !== "completed" && (
                    <Button size="sm" variant="outline" onClick={() => completeAction(a.id)}>
                      Concluir
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function CriterionSlider({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="mb-3">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-sm font-bold">{value.toFixed(1)}</span>
      </div>
      <p className="text-xs text-muted-foreground mb-1">{hint}</p>
      <input
        type="range"
        min={0}
        max={10}
        step={0.5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}