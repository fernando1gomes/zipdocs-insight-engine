import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const Schema = z.object({
  scores: z.array(z.object({
    pillar_id: z.number().int().min(1).max(11),
    score: z.number().min(0).max(10),
    comment: z.string().max(500).optional().nullable(),
  })).min(1).max(11),
  reflection: z.string().max(2000).optional().nullable(),
});

export const submitCheckin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => Schema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const now = new Date();
    const dow = now.getDay();
    const start = new Date(now); start.setDate(now.getDate() - dow);
    const end = new Date(start); end.setDate(start.getDate() + 6);
    const toDate = (d: Date) => d.toISOString().slice(0, 10);

    const { data: checkin, error: cErr } = await supabase
      .from("weekly_checkins")
      .insert({
        user_id: userId,
        week_start_date: toDate(start),
        week_end_date: toDate(end),
        user_reflection: data.reflection ?? null,
        is_completed: true,
      })
      .select()
      .single();
    if (cErr) throw cErr;

    const evals = data.scores.map((s) => ({
      user_id: userId,
      pillar_id: s.pillar_id,
      final_score: s.score,
      subjective_score: s.score,
      user_comment: s.comment ?? null,
    }));
    const { error: eErr } = await supabase.from("pillar_evaluations").insert(evals);
    if (eErr) throw eErr;

    return { checkinId: checkin.id };
  });