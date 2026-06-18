import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listActions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("pillar_actions")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

const CreateSchema = z.object({
  pillar_id: z.number().int().min(1).max(11),
  title: z.string().min(2).max(200),
  description: z.string().max(2000).optional().nullable(),
  action_type: z.enum(["unique", "recurring"]).default("unique"),
  frequency_type: z.enum(["daily", "weekly", "monthly"]).optional().nullable(),
  due_date: z.string().optional().nullable(),
});

export const createAction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => CreateSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { data: inserted, error } = await context.supabase
      .from("pillar_actions")
      .insert({
        user_id: context.userId,
        pillar_id: data.pillar_id,
        title: data.title,
        description: data.description ?? null,
        action_type: data.action_type,
        frequency_type: data.frequency_type ?? null,
        due_date: data.due_date ?? null,
        next_due_date: data.due_date ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    return inserted;
  });

export const completeAction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: act, error: fetchErr } = await context.supabase
      .from("pillar_actions").select("*").eq("id", data.id).single();
    if (fetchErr) throw fetchErr;
    await context.supabase.from("pillar_action_logs").insert({
      action_id: act.id, user_id: context.userId, pillar_id: act.pillar_id, status: "completed",
    });
    const { error: updErr } = await context.supabase
      .from("pillar_actions")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", data.id);
    if (updErr) throw updErr;
    return { ok: true };
  });

export const deleteAction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("pillar_actions").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });