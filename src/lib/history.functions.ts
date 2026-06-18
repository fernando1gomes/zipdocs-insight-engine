import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: evals, error } = await context.supabase
      .from("pillar_evaluations")
      .select("pillar_id, final_score, evaluation_date")
      .eq("user_id", context.userId)
      .order("evaluation_date", { ascending: true })
      .limit(500);
    if (error) throw error;

    const { data: checkins } = await context.supabase
      .from("weekly_checkins")
      .select("id, week_start_date, week_end_date, user_reflection, is_completed")
      .eq("user_id", context.userId)
      .order("week_start_date", { ascending: false })
      .limit(20);

    return { evaluations: evals ?? [], checkins: checkins ?? [] };
  });