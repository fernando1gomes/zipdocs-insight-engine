import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listAlerts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("alerts")
      .select("*")
      .eq("user_id", context.userId)
      .order("is_read", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    return data ?? [];
  });

export const markAlertRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("alerts")
      .update({ is_read: true }).eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const generateAlerts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: ups } = await supabase
      .from("user_pillars")
      .select("pillar_id, current_score, last_evaluation_date")
      .eq("user_id", userId);
    const { data: cat } = await supabase.from("pillars").select("id, short_name");
    const nameOf = new Map((cat ?? []).map((c) => [c.id, c.short_name]));

    const newAlerts: Array<{
      user_id: string; pillar_id: number; alert_type: string; severity: string;
      title: string; message: string;
    }> = [];
    const now = Date.now();
    for (const u of ups ?? []) {
      const name = nameOf.get(u.pillar_id) ?? `Pilar ${u.pillar_id}`;
      const score = Number(u.current_score);
      if (score > 0 && score < 6) {
        newAlerts.push({
          user_id: userId, pillar_id: u.pillar_id, alert_type: "low_score", severity: "red",
          title: `${name} em estado crítico`, message: `Nota atual ${score.toFixed(1)} — precisa de atenção imediata.`,
        });
      }
      if (u.last_evaluation_date) {
        const days = (now - new Date(u.last_evaluation_date).getTime()) / 86400000;
        if (days > 14) {
          newAlerts.push({
            user_id: userId, pillar_id: u.pillar_id, alert_type: "pillar_neglected", severity: "yellow",
            title: `${name} negligenciado`, message: `Sem avaliação há ${Math.floor(days)} dias.`,
          });
        }
      }
    }
    if (newAlerts.length) {
      await supabase.from("alerts").insert(newAlerts);
    }
    return { created: newAlerts.length };
  });