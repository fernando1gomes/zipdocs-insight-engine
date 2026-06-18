import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PILLAR_DEFAULTS } from "@/lib/pillars";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({ meta: [{ title: "Boas-vindas — Roda da Vida Viva" }] }),
  component: Onboarding,
});

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<number, number>>(
    Object.fromEntries(PILLAR_DEFAULTS.map((p) => [p.id, 7]))
  );
  const [saving, setSaving] = useState(false);

  const isIntro = step === 0;
  const pillarIndex = step - 1;
  const pillar = PILLAR_DEFAULTS[pillarIndex];
  const isLast = step === PILLAR_DEFAULTS.length;

  function setScore(id: number, v: number) {
    setScores((s) => ({ ...s, [id]: v }));
  }

  async function finish() {
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const rows = PILLAR_DEFAULTS.map((p) => ({
      user_id: u.user.id,
      pillar_id: p.id,
      final_score: scores[p.id],
      subjective_score: scores[p.id],
      user_comment: null as string | null,
    }));
    const { error } = await supabase.from("pillar_evaluations").insert(rows);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Sua roda foi criada!");
    navigate({ to: "/dashboard", replace: true });
  }

  const total = PILLAR_DEFAULTS.length + 1;
  const progress = Math.round(((step + 1) / total) * 100);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[color:var(--primary)]/5 via-background to-[color:var(--focus)]/5 px-4 py-10">
      <div className="w-full max-w-xl rounded-3xl border border-border/60 bg-card p-8 shadow-xl">
        <div className="mb-6">
          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {isIntro ? "Boas-vindas" : `Pilar ${step} de ${PILLAR_DEFAULTS.length}`}
          </div>
        </div>

        {isIntro ? (
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Vamos calibrar sua Roda da Vida Viva</h1>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Em 11 perguntas rápidas você dá uma nota inicial (0 a 10) para cada pilar da sua vida. Isso cria sua roda
              base — depois você refina aos poucos.
            </p>
            <Button onClick={() => setStep(1)} className="mt-6 w-full">Começar</Button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3">
              <div className="text-4xl">{pillar.icon}</div>
              <div>
                <h2 className="text-xl font-bold">{pillar.name}</h2>
                <p className="text-xs text-muted-foreground">{pillar.shortName}</p>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">
                Como está hoje? <span className="font-bold">({scores[pillar.id].toFixed(1)})</span>
              </label>
              <input
                type="range"
                min={0}
                max={10}
                step={0.5}
                value={scores[pillar.id]}
                onChange={(e) => setScore(pillar.id, Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>Crítico</span>
                <span>Atenção</span>
                <span>Equilibrado</span>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                  Voltar
                </Button>
              )}
              {!isLast ? (
                <Button onClick={() => setStep(step + 1)} className="flex-1">Continuar</Button>
              ) : (
                <Button onClick={finish} disabled={saving} className="flex-1">
                  {saving ? "Salvando..." : "Ver minha roda"}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}