import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getImpactBySystemId, influenceLabel } from "@/lib/impacts";
import { iconForPillar } from "@/lib/pillars";

export const Route = createFileRoute("/_authenticated/autoavaliacao")({
  component: AutoAvaliacao,
});

type Pillar = { id: number; name: string; short_name: string; icon: string | null; default_order: number };
type Criterion = { id: string; pillar_id: number; label: string; question_text: string; order_index: number };

type PillarState = {
  checked: Record<string, boolean>;
  subjective: number;
  comment: string;
};

function AutoAvaliacao() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  const storageKey = userId ? `autoavaliacao:draft:${userId}` : null;

  const { data: pillars, isLoading: pl } = useQuery({
    queryKey: ["pillars-active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pillars")
        .select("id,name,short_name,icon,default_order")
        .eq("is_active", true)
        .order("default_order");
      if (error) throw error;
      return data as Pillar[];
    },
  });

  const { data: criteria, isLoading: cl } = useQuery({
    queryKey: ["pillar-criteria-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pillar_criteria")
        .select("id,pillar_id,label,question_text,order_index")
        .eq("is_active", true)
        .order("pillar_id")
        .order("order_index");
      if (error) throw error;
      return data as Criterion[];
    },
  });

  const [step, setStep] = useState(0);
  const [state, setState] = useState<Record<number, PillarState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Restore draft once user + storage key are known
  useEffect(() => {
    if (!storageKey || hydratedRef.current) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          if (typeof parsed.step === "number") setStep(parsed.step);
          if (parsed.state && typeof parsed.state === "object") setState(parsed.state);
          setRestored(true);
        }
      }
    } catch {
      // ignore corrupted draft
    }
    hydratedRef.current = true;
  }, [storageKey]);

  // Persist draft on every change
  useEffect(() => {
    if (!storageKey || !hydratedRef.current || done) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ step, state }));
    } catch {
      // storage full / unavailable — ignore
    }
  }, [storageKey, step, state, done]);

  function clearDraft() {
    if (!storageKey) return;
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  }

  function resetAll() {
    setStep(0);
    setState({});
    setRestored(false);
    clearDraft();
  }

  const byPillar = useMemo(() => {
    const m = new Map<number, Criterion[]>();
    (criteria ?? []).forEach((c) => {
      const a = m.get(c.pillar_id) ?? [];
      a.push(c);
      m.set(c.pillar_id, a);
    });
    return m;
  }, [criteria]);

  if (pl || cl || !pillars) {
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground">
        Carregando autoavaliação...
      </div>
    );
  }

  const total = pillars.length;
  const pillar = pillars[Math.min(step, total - 1)];
  const list = byPillar.get(pillar.id) ?? [];
  const cur: PillarState = state[pillar.id] ?? { checked: {}, subjective: 7, comment: "" };

  const checkedCount = list.filter((c) => cur.checked[c.id]).length;
  const objective = list.length ? (checkedCount / list.length) * 10 : 0;
  const finalScore = Number(((cur.subjective + objective) / 2).toFixed(2));

  function updatePillar(patch: Partial<PillarState>) {
    setState((s) => ({
      ...s,
      [pillar.id]: { ...(s[pillar.id] ?? { checked: {}, subjective: 7, comment: "" }), ...patch },
    }));
  }

  function toggle(critId: string) {
    updatePillar({ checked: { ...cur.checked, [critId]: !cur.checked[critId] } });
  }

  async function submitAll() {
    if (!pillars) return;
    setSubmitting(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) {
      setSubmitting(false);
      toast.error("Faça login novamente");
      return;
    }
    const userId = u.user.id;

    for (const p of pillars) {
      const pl = byPillar.get(p.id) ?? [];
      const st = state[p.id] ?? { checked: {}, subjective: 7, comment: "" };
      const cc = pl.filter((c) => st.checked[c.id]).length;
      const obj = pl.length ? (cc / pl.length) * 10 : 0;
      const fs = Number(((st.subjective + obj) / 2).toFixed(2));

      const { data: ev, error: evErr } = await supabase
        .from("pillar_evaluations")
        .insert({
          user_id: userId,
          pillar_id: p.id,
          final_score: fs,
          subjective_score: st.subjective,
          behavior_score: Number(obj.toFixed(2)),
          user_comment: st.comment || null,
        })
        .select("id")
        .single();

      if (evErr || !ev) {
        setSubmitting(false);
        toast.error("Erro ao salvar " + p.short_name + ": " + (evErr?.message ?? ""));
        return;
      }

      if (pl.length) {
        const rows = pl.map((c) => ({
          evaluation_id: ev.id,
          criterion_id: c.id,
          user_id: userId,
          score: st.checked[c.id] ? 10 : 0,
        }));
        const { error: csErr } = await supabase.from("pillar_criteria_scores").insert(rows);
        if (csErr) {
          setSubmitting(false);
          toast.error("Erro ao salvar critérios de " + p.short_name + ": " + csErr.message);
          return;
        }
      }
    }

    setSubmitting(false);
    toast.success("Autoavaliação completa salva!");
    qc.invalidateQueries({ queryKey: ["user_pillars"] });
    qc.invalidateQueries({ queryKey: ["alerts"] });
    setDone(true);
    clearDraft();
    setTimeout(() => navigate({ to: "/dashboard" }), 1200);
  }

  function next() {
    if (step < total - 1) setStep(step + 1);
    else submitAll();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-6 md:px-8 md:py-8">
        <AppHeader />
        <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
          ← Voltar ao dashboard
        </Link>

        {restored && (
          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-secondary/40 px-4 py-2 text-sm">
            <span>Continuamos de onde você parou. Seu progresso é salvo automaticamente neste dispositivo.</span>
            <Button variant="ghost" size="sm" onClick={resetAll}>
              Recomeçar do zero
            </Button>
          </div>
        )}

        <div className="mt-4 rounded-3xl bg-card border border-border/60 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-extrabold">Autoavaliação completa</h1>
            <span className="text-sm text-muted-foreground">
              Pilar {step + 1} de {total}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-[color:var(--primary)] transition-all"
              style={{ width: `${((step + (done ? 1 : 0)) / total) * 100}%` }}
            />
          </div>

          <div className="mt-6 flex items-center gap-4">
            {(() => {
              const Icon = iconForPillar(pillar.id);
              return <Icon weight="light" className="h-12 w-12 text-[color:var(--primary)]" />;
            })()}
            <div>
              <h2 className="text-xl font-bold">{pillar.name}</h2>
              <p className="text-xs text-muted-foreground">
                Marque cada critério que você cumpre hoje. Marcar todos = nota objetiva 10.
              </p>
            </div>
          </div>

          <PillarImpactHint pillarId={pillar.id} />

          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">Critérios objetivos</h3>
            {list.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum critério cadastrado para este pilar.</p>
            ) : (
              <ul className="space-y-2">
                {list.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-start gap-3 rounded-xl border border-border/60 p-3 hover:bg-secondary/30 cursor-pointer"
                    onClick={() => toggle(c.id)}
                  >
                    <Checkbox
                      checked={!!cur.checked[c.id]}
                      onCheckedChange={() => toggle(c.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{c.label}</div>
                      <div className="text-xs text-muted-foreground">{c.question_text}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-2 text-xs text-muted-foreground">
              {checkedCount} de {list.length} marcados · nota objetiva{" "}
              <span className="font-semibold text-foreground">{objective.toFixed(1)}</span>/10
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-baseline justify-between">
              <label className="text-sm font-semibold">Percepção subjetiva</label>
              <span className="text-sm font-bold">{cur.subjective.toFixed(1)}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-1">
              Independentemente dos critérios, como você se sente em relação a este pilar agora?
            </p>
            <input
              type="range"
              min={0}
              max={10}
              step={0.5}
              value={cur.subjective}
              onChange={(e) => updatePillar({ subjective: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          <div className="mt-6">
            <label className="text-sm font-semibold">
              O que precisa ser consertado, reposto ou colocado no lugar para este pilar chegar a 10?
            </label>
            <textarea
              value={cur.comment}
              onChange={(e) => updatePillar({ comment: e.target.value })}
              placeholder="Sua reflexão (opcional)"
              className="mt-2 w-full rounded-xl border border-input bg-background p-3 text-sm"
              rows={3}
            />
          </div>

          <div className="mt-4 rounded-lg bg-secondary/40 px-3 py-2 text-sm">
            Nota final deste pilar: <span className="font-bold">{finalScore.toFixed(2)}</span>
            <span className="ml-2 text-xs text-muted-foreground">
              (média entre subjetiva {cur.subjective.toFixed(1)} e objetiva {objective.toFixed(1)})
            </span>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0 || submitting}
            >
              ← Anterior
            </Button>
            <div className="flex gap-2">
              {step < total - 1 && (
                <Button variant="ghost" onClick={() => setStep((s) => Math.min(total - 1, s + 1))}>
                  Pular
                </Button>
              )}
              <Button onClick={next} disabled={submitting}>
                {submitting
                  ? "Salvando..."
                  : step === total - 1
                    ? "Concluir autoavaliação"
                    : "Próximo pilar →"}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-6 gap-2 md:grid-cols-11">
          {pillars.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setStep(idx)}
              className={`rounded-lg border p-2 text-center text-lg transition ${
                idx === step
                  ? "border-[color:var(--primary)] bg-[color:var(--primary)]/10"
                  : "border-border/60 hover:bg-secondary"
              }`}
              title={p.name}
            >
              {(() => {
                const Icon = iconForPillar(p.id);
                return <Icon weight="light" className="mx-auto h-5 w-5" />;
              })()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PillarImpactHint({ pillarId }: { pillarId: number }) {
  const impact = getImpactBySystemId(pillarId);
  if (!impact) return null;
  const top = impact.impacts
    .filter((i) => i.intensity === "forte")
    .slice(0, 4)
    .map((i) => i.target);
  const list = top.length ? top : impact.impacts.slice(0, 4).map((i) => i.target);
  return (
    <div className="mt-4 rounded-xl border border-border/60 bg-secondary/30 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Impacto deste pilar
          </div>
          <p className="mt-1 text-sm">
            Este pilar impacta diretamente <strong>{impact.directCount} áreas</strong> da sua vida
            (influência {influenceLabel(impact.influence).toLowerCase()}), especialmente {list.join(", ")}.
          </p>
        </div>
        <Link
          to="/impactos"
          search={{ pillar: pillarId }}
          className="shrink-0 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-secondary transition"
        >
          Ver impactos →
        </Link>
      </div>
    </div>
  );
}