import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { suggestPillarActions } from "@/lib/action-plan.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/plano-acao_/$pillarId")({
  component: PlanoAcaoWizard,
});

type Suggested = { title: string; description: string; effort: string };

function PlanoAcaoWizard() {
  const { pillarId } = Route.useParams();
  const pid = Number(pillarId);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const suggest = useServerFn(suggestPillarActions);

  const [step, setStep] = useState(1);
  const [broken, setBroken] = useState("");
  const [missing, setMissing] = useState("");
  const [misplaced, setMisplaced] = useState("");
  const [suggesting, setSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggested[]>([]);
  const [picked, setPicked] = useState<Record<number, boolean>>({});
  const [form, setForm] = useState({
    what: "",
    why: "",
    how: "",
    when_start: new Date().toISOString().slice(0, 10),
    when_due: "",
    where_text: "",
    who_text: "",
    how_much: "",
  });
  const [saving, setSaving] = useState(false);

  const { data: pillar } = useQuery({
    queryKey: ["pillar", pid],
    queryFn: async () => {
      const { data } = await supabase.from("pillars").select("id,name,icon,short_name").eq("id", pid).maybeSingle();
      return data;
    },
  });

  const { data: existingPlan } = useQuery({
    queryKey: ["action-plan", pid],
    queryFn: async () => {
      const { data } = await supabase
        .from("pillar_action_plans")
        .select("*")
        .eq("pillar_id", pid)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
  });

  const { data: lastEval } = useQuery({
    queryKey: ["last-eval-comment", pid],
    queryFn: async () => {
      const { data } = await supabase
        .from("pillar_evaluations")
        .select("user_comment")
        .eq("pillar_id", pid)
        .order("evaluation_date", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    if (existingPlan) {
      setBroken(existingPlan.broken_text ?? "");
      setMissing(existingPlan.missing_text ?? "");
      setMisplaced(existingPlan.misplaced_text ?? "");
      setForm({
        what: existingPlan.what ?? "",
        why: existingPlan.why ?? "",
        how: existingPlan.how ?? "",
        when_start: existingPlan.when_start ?? new Date().toISOString().slice(0, 10),
        when_due: existingPlan.when_due ?? "",
        where_text: existingPlan.where_text ?? "",
        who_text: existingPlan.who_text ?? "",
        how_much: existingPlan.how_much ?? "",
      });
    } else if (lastEval?.user_comment && !broken && !missing && !misplaced) {
      setBroken(lastEval.user_comment);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingPlan, lastEval]);

  async function generate() {
    setSuggesting(true);
    try {
      const res = await suggest({ data: { pillarId: pid, broken, missing, misplaced } });
      setSuggestions(res.actions);
      const initial: Record<number, boolean> = {};
      res.actions.forEach((_, i) => (initial[i] = true));
      setPicked(initial);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao gerar sugestões");
    } finally {
      setSuggesting(false);
    }
  }

  function goToStep3() {
    const chosen = suggestions.filter((_, i) => picked[i]);
    if (chosen.length && !form.how) {
      setForm((f) => ({ ...f, how: chosen.map((c) => `• ${c.title}`).join("\n") }));
    }
    setStep(3);
  }

  async function save() {
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) {
      setSaving(false);
      toast.error("Faça login novamente");
      return;
    }
    const payload = {
      user_id: u.user.id,
      pillar_id: pid,
      broken_text: broken || null,
      missing_text: missing || null,
      misplaced_text: misplaced || null,
      what: form.what || null,
      why: form.why || null,
      how: form.how || null,
      when_start: form.when_start || null,
      when_due: form.when_due || null,
      where_text: form.where_text || null,
      who_text: form.who_text || null,
      how_much: form.how_much || null,
      status: "active" as const,
    };

    let planId = existingPlan?.id ?? null;
    if (planId) {
      const { error } = await supabase.from("pillar_action_plans").update(payload).eq("id", planId);
      if (error) {
        setSaving(false);
        toast.error(error.message);
        return;
      }
    } else {
      const { data, error } = await supabase
        .from("pillar_action_plans")
        .insert(payload)
        .select("id")
        .single();
      if (error || !data) {
        setSaving(false);
        toast.error(error?.message ?? "Erro ao salvar plano");
        return;
      }
      planId = data.id;
    }

    const chosen = suggestions.filter((_, i) => picked[i]);
    if (chosen.length && planId) {
      const rows = chosen.map((c) => ({
        user_id: u.user!.id,
        pillar_id: pid,
        plan_id: planId,
        title: c.title,
        description: c.description,
        action_type: "unique",
        start_date: form.when_start || new Date().toISOString().slice(0, 10),
        due_date: form.when_due || null,
        status: "pending",
      }));
      const { error: aErr } = await supabase.from("pillar_actions").insert(rows);
      if (aErr) {
        setSaving(false);
        toast.error("Plano salvo, mas falhou ao criar ações: " + aErr.message);
        return;
      }
    }

    setSaving(false);
    toast.success("Plano salvo!");
    qc.invalidateQueries({ queryKey: ["action-plans"] });
    qc.invalidateQueries({ queryKey: ["actions"] });
    navigate({ to: "/plano-acao" });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-6 md:px-8 md:py-8">
        <AppHeader />
        <Link to="/plano-acao" className="text-sm text-muted-foreground hover:text-foreground">
          ← Voltar aos planos
        </Link>

        <div className="mt-4 rounded-3xl bg-card border border-border/60 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            {(() => {
              const Icon = iconForPillar(Number(pid));
              return <Icon weight="light" className="h-10 w-10 text-[color:var(--primary)]" />;
            })()}
            <div>
              <h1 className="text-2xl font-extrabold">{pillar?.name ?? "Pilar"}</h1>
              <p className="text-xs text-muted-foreground">Plano de ação 5W2H — etapa {step} de 3</p>
            </div>
          </div>

          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden mb-6">
            <div className="h-full bg-[color:var(--primary)] transition-all" style={{ width: `${(step / 3) * 100}%` }} />
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Diagnóstico</h2>
              <div>
                <Label>O que está <strong>quebrado</strong> que preciso consertar?</Label>
                <Textarea rows={3} value={broken} onChange={(e) => setBroken(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>O que está <strong>faltando</strong> que preciso repor?</Label>
                <Textarea rows={3} value={missing} onChange={(e) => setMissing(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>O que está <strong>fora do lugar</strong> que preciso organizar?</Label>
                <Textarea rows={3} value={misplaced} onChange={(e) => setMisplaced(e.target.value)} className="mt-1" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Sugestões da IA</h2>
              <p className="text-xs text-muted-foreground">
                A IA vai propor ações práticas com base no seu diagnóstico. Marque as que quer adotar — elas viram itens da sua lista de ações.
              </p>
              <Button onClick={generate} disabled={suggesting}>
                {suggesting ? "Gerando..." : suggestions.length ? "Gerar novamente" : "Gerar sugestões com IA"}
              </Button>
              {suggestions.length > 0 && (
                <ul className="space-y-2 mt-3">
                  {suggestions.map((s, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-border/60 p-3 cursor-pointer hover:bg-secondary/30"
                      onClick={() => setPicked((p) => ({ ...p, [i]: !p[i] }))}
                    >
                      <Checkbox
                        checked={!!picked[i]}
                        onCheckedChange={() => setPicked((p) => ({ ...p, [i]: !p[i] }))}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{s.title}</div>
                        <div className="text-xs text-muted-foreground">{s.description}</div>
                        <div className="text-[10px] uppercase tracking-wide mt-1 text-muted-foreground">
                          Esforço: {s.effort}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">5W2H consolidado</h2>
              <div>
                <Label>O quê? (objetivo neste pilar)</Label>
                <Textarea rows={2} value={form.what} onChange={(e) => setForm({ ...form, what: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>Por quê? (importância para sua vida)</Label>
                <Textarea rows={2} value={form.why} onChange={(e) => setForm({ ...form, why: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>Como? (ações práticas)</Label>
                <Textarea rows={4} value={form.how} onChange={(e) => setForm({ ...form, how: e.target.value })} className="mt-1" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Quando começar?</Label>
                  <Input type="date" value={form.when_start} onChange={(e) => setForm({ ...form, when_start: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label>Prazo de conclusão</Label>
                  <Input type="date" value={form.when_due} onChange={(e) => setForm({ ...form, when_due: e.target.value })} className="mt-1" />
                </div>
              </div>
              <div>
                <Label>Onde? (ambiente, rotina, contexto)</Label>
                <Input value={form.where_text} onChange={(e) => setForm({ ...form, where_text: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>Quem pode ajudar ou acompanhar?</Label>
                <Input value={form.who_text} onChange={(e) => setForm({ ...form, who_text: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>Quanto? (tempo, energia, dinheiro)</Label>
                <Input value={form.how_much} onChange={(e) => setForm({ ...form, how_much: e.target.value })} className="mt-1" />
              </div>
              {suggestions.filter((_, i) => picked[i]).length > 0 && (
                <div className="rounded-lg bg-secondary/40 p-3 text-xs">
                  Ao salvar, <strong>{suggestions.filter((_, i) => picked[i]).length}</strong> ação(ões) sugerida(s) serão criadas em <em>Minhas ações</em> ligadas a este plano.
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button variant="outline" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1 || saving}>
              ← Anterior
            </Button>
            {step === 1 && <Button onClick={() => setStep(2)}>Próximo →</Button>}
            {step === 2 && <Button onClick={goToStep3}>Próximo →</Button>}
            {step === 3 && (
              <Button onClick={save} disabled={saving}>
                {saving ? "Salvando..." : "Salvar plano"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}