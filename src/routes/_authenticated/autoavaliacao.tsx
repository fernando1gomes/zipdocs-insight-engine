import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { PILLAR_DEFAULTS } from "@/lib/pillars";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/autoavaliacao")({
  component: AutoAvaliacao,
});

type Scores = {
  subjective: number;
  behavior: number;
  execution: number;
  frequency: number;
  interdependence: number;
  comment: string;
};

const DEFAULTS: Scores = {
  subjective: 7,
  behavior: 7,
  execution: 7,
  frequency: 7,
  interdependence: 7,
  comment: "",
};

function AutoAvaliacao() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<number, Scores>>(
    Object.fromEntries(PILLAR_DEFAULTS.map((p) => [p.id, { ...DEFAULTS }])),
  );
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const total = PILLAR_DEFAULTS.length;
  const pillar = PILLAR_DEFAULTS[step];
  const cur = data[pillar.id];
  const impactWeight = pillar.impact / 10;
  const finalScore = Number(
    (
      (cur.subjective + cur.behavior + cur.execution + cur.frequency + cur.interdependence * impactWeight) /
      (4 + impactWeight)
    ).toFixed(2),
  );

  function update(field: keyof Scores, value: number | string) {
    setData((d) => ({ ...d, [pillar.id]: { ...d[pillar.id], [field]: value } }));
  }

  async function submitAll() {
    setSubmitting(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) {
      setSubmitting(false);
      toast.error("Faça login novamente");
      return;
    }
    const rows = PILLAR_DEFAULTS.map((p) => {
      const s = data[p.id];
      const w = p.impact / 10;
      const fs = Number(
        ((s.subjective + s.behavior + s.execution + s.frequency + s.interdependence * w) / (4 + w)).toFixed(2),
      );
      return {
        user_id: u.user!.id,
        pillar_id: p.id,
        final_score: fs,
        subjective_score: s.subjective,
        behavior_score: s.behavior,
        action_execution_score: s.execution,
        frequency_score: s.frequency,
        interdependence_score: s.interdependence,
        user_comment: s.comment || null,
      };
    });
    const { error } = await supabase.from("pillar_evaluations").insert(rows);
    setSubmitting(false);
    if (error) {
      toast.error("Erro ao salvar: " + error.message);
      return;
    }
    toast.success("Autoavaliação completa salva!");
    qc.invalidateQueries({ queryKey: ["user_pillars"] });
    qc.invalidateQueries({ queryKey: ["alerts"] });
    setDone(true);
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
            <div className="text-5xl">{pillar.icon}</div>
            <div>
              <h2 className="text-xl font-bold">{pillar.name}</h2>
              <p className="text-xs text-muted-foreground">
                Impacto deste pilar nos demais: {pillar.impact}/10 · influencia{" "}
                {pillar.impactPillars.join(", ")}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-1">
            <Slider
              label="Percepção subjetiva"
              hint="Como você se sente em relação a este pilar agora?"
              value={cur.subjective}
              onChange={(v) => update("subjective", v)}
            />
            <Slider
              label="Comportamento"
              hint="Seus hábitos e atitudes neste pilar estão saudáveis?"
              value={cur.behavior}
              onChange={(v) => update("behavior", v)}
            />
            <Slider
              label="Execução de ações"
              hint="Você executou as ações planejadas para este pilar?"
              value={cur.execution}
              onChange={(v) => update("execution", v)}
            />
            <Slider
              label="Frequência"
              hint="Com que regularidade você cuida deste pilar?"
              value={cur.frequency}
              onChange={(v) => update("frequency", v)}
            />
            <Slider
              label="Interdependência"
              hint="Quanto este pilar tem impactado positivamente os outros?"
              value={cur.interdependence}
              onChange={(v) => update("interdependence", v)}
            />
          </div>

          <textarea
            value={cur.comment}
            onChange={(e) => update("comment", e.target.value)}
            placeholder="Reflexão sobre este pilar (opcional)"
            className="mt-4 w-full rounded-xl border border-input bg-background p-3 text-sm"
            rows={2}
          />

          <div className="mt-4 rounded-lg bg-secondary/40 px-3 py-2 text-sm">
            Nota final deste pilar: <span className="font-bold">{finalScore.toFixed(2)}</span>
            <span className="ml-2 text-xs text-muted-foreground">
              (interdependência pesa ×{impactWeight.toFixed(1)})
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
          {PILLAR_DEFAULTS.map((p, idx) => (
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
              {p.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Slider({
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