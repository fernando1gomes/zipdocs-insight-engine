import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PILLAR_DEFAULTS } from "@/lib/pillars";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/checkin")({
  component: CheckinPage,
});

function CheckinPage() {
  const navigate = useNavigate();
  const [reflection, setReflection] = useState("");
  const [focusId, setFocusId] = useState(1);
  const [neglectedId, setNeglectedId] = useState(2);
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const { data: checkin, error } = await supabase
      .from("weekly_checkins")
      .insert({
        user_id: u.user.id,
        week_start_date: start.toISOString().slice(0, 10),
        week_end_date: end.toISOString().slice(0, 10),
        main_focus_pillar_id: focusId,
        most_neglected_pillar_id: neglectedId,
        user_reflection: reflection || null,
        is_completed: true,
      })
      .select()
      .single();
    if (error || !checkin) {
      toast.error(error?.message ?? "Erro ao salvar");
      setSubmitting(false);
      return;
    }
    if (reflection) {
      await supabase.from("weekly_checkin_answers").insert({
        checkin_id: checkin.id,
        user_id: u.user.id,
        question: "Reflexão da semana",
        answer: reflection,
      });
    }
    toast.success("Check-in registrado!");
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-6 md:px-8 md:py-8">
        <AppHeader />
        <h1 className="text-2xl font-extrabold mb-2">Check-in semanal</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Uma pausa curta para olhar pra semana e definir o próximo foco.
        </p>

        <form onSubmit={submit} className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm grid gap-4">
          <div>
            <Label>Como foi sua semana?</Label>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-input bg-background p-3 text-sm"
              placeholder="O que funcionou, o que travou..."
            />
          </div>
          <div>
            <Label>Pilar foco da próxima semana</Label>
            <select
              value={focusId}
              onChange={(e) => setFocusId(Number(e.target.value))}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              {PILLAR_DEFAULTS.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Pilar mais negligenciado</Label>
            <select
              value={neglectedId}
              onChange={(e) => setNeglectedId(Number(e.target.value))}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              {PILLAR_DEFAULTS.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Salvando..." : "Concluir check-in"}
          </Button>
        </form>
      </div>
    </div>
  );
}