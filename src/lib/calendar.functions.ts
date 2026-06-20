import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Devolve as ações com `scheduled_start` dentro da semana solicitada. */
export const listWeekActions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z.object({
      weekStart: z.string(), // ISO date (segunda-feira 00:00 local convertido p/ UTC)
      weekEnd: z.string(),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("pillar_actions")
      .select(
        "id,pillar_id,title,description,action_type,frequency_type,priority,obstacle_expected,required_resource,status,calendar_status,scheduled_start,scheduled_end,duration_minutes,reminder_enabled,reminder_at,completed_at",
      )
      .eq("user_id", context.userId)
      .gte("scheduled_start", data.weekStart)
      .lt("scheduled_start", data.weekEnd)
      .order("scheduled_start", { ascending: true });
    if (error) throw new Error(error.message);
    return { actions: rows ?? [] };
  });

/** Cria uma nova ação direto da grade (com horário). */
export const createScheduledAction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z.object({
      pillarId: z.number().int().min(1).max(11),
      title: z.string().min(1),
      description: z.string().optional().default(""),
      scheduledStart: z.string(),
      scheduledEnd: z.string(),
      durationMinutes: z.number().int().positive(),
      actionType: z.enum(["unique", "recurring"]).default("unique"),
      frequencyType: z.string().optional(),
      priority: z.enum(["low", "medium", "high"]).default("medium"),
      obstacleExpected: z.string().optional().default(""),
      requiredResource: z.string().optional().default(""),
      reminderEnabled: z.boolean().default(false),
      reminderAt: z.string().optional(),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("pillar_actions")
      .insert({
        user_id: context.userId,
        pillar_id: data.pillarId,
        title: data.title,
        description: data.description || null,
        action_type: data.actionType,
        frequency_type: data.frequencyType ?? null,
        priority: data.priority,
        obstacle_expected: data.obstacleExpected || null,
        required_resource: data.requiredResource || null,
        status: "pending",
        calendar_status: "planned",
        scheduled_start: data.scheduledStart,
        scheduled_end: data.scheduledEnd,
        duration_minutes: data.durationMinutes,
        reminder_enabled: data.reminderEnabled,
        reminder_at: data.reminderAt ?? null,
        start_date: data.scheduledStart.slice(0, 10),
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

/** Reagenda uma ação já existente. */
export const rescheduleAction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z.object({
      actionId: z.string().uuid(),
      newStart: z.string(),
      newEnd: z.string(),
      durationMinutes: z.number().int().positive(),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { data: current } = await context.supabase
      .from("pillar_actions")
      .select("pillar_id,scheduled_start")
      .eq("id", data.actionId)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (!current) throw new Error("Ação não encontrada");

    const { error: updErr } = await context.supabase
      .from("pillar_actions")
      .update({
        scheduled_start: data.newStart,
        scheduled_end: data.newEnd,
        duration_minutes: data.durationMinutes,
        calendar_status: "rescheduled",
        next_due_date: data.newStart.slice(0, 10),
      })
      .eq("id", data.actionId)
      .eq("user_id", context.userId);
    if (updErr) throw new Error(updErr.message);

    await context.supabase.from("pillar_action_logs").insert({
      user_id: context.userId,
      pillar_id: current.pillar_id,
      action_id: data.actionId,
      log_date: new Date().toISOString(),
      status: "rescheduled",
      execution_status: "rescheduled",
      rescheduled_from: current.scheduled_start,
      rescheduled_to: data.newStart,
    });
    return { ok: true };
  });

/** Fecha o dia: salva reflexão + respostas e calcula contagens automaticamente. */
export const submitDailyClosing = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z.object({
      closingDate: z.string(), // YYYY-MM-DD
      reflection: z.string().optional().default(""),
      answers: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    // contagens das ações daquele dia
    const dayStart = `${data.closingDate}T00:00:00.000Z`;
    const dayEnd = `${data.closingDate}T23:59:59.999Z`;
    const { data: rows, error: e1 } = await context.supabase
      .from("pillar_actions")
      .select("calendar_status")
      .eq("user_id", context.userId)
      .gte("scheduled_start", dayStart)
      .lte("scheduled_start", dayEnd);
    if (e1) throw new Error(e1.message);
    const planned = rows?.length ?? 0;
    const done = rows?.filter((r) => r.calendar_status === "done").length ?? 0;
    const missed = rows?.filter((r) => r.calendar_status === "missed").length ?? 0;
    const rescheduled = rows?.filter((r) => r.calendar_status === "rescheduled").length ?? 0;

    const { data: closing, error: e2 } = await context.supabase
      .from("daily_closings")
      .upsert(
        {
          user_id: context.userId,
          closing_date: data.closingDate,
          planned_actions_count: planned,
          completed_actions_count: done,
          not_completed_actions_count: missed,
          rescheduled_actions_count: rescheduled,
          user_reflection: data.reflection || null,
        },
        { onConflict: "user_id,closing_date" },
      )
      .select("id")
      .single();
    if (e2) throw new Error(e2.message);

    if (data.answers.length) {
      await context.supabase
        .from("daily_closing_answers")
        .delete()
        .eq("daily_closing_id", closing.id);
      const payload = data.answers
        .filter((a) => a.answer.trim().length > 0)
        .map((a) => ({
          daily_closing_id: closing.id,
          user_id: context.userId,
          question: a.question,
          answer: a.answer,
        }));
      if (payload.length) {
        const { error: e3 } = await context.supabase
          .from("daily_closing_answers")
          .insert(payload);
        if (e3) throw new Error(e3.message);
      }
    }

    return { ok: true, planned, done, missed, rescheduled };
  });

/** Atualiza status (executada, não executada, cancelada). */
export const updateActionStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z.object({
      actionId: z.string().uuid(),
      status: z.enum(["done", "missed", "cancelled", "planned"]),
      reason: z.string().optional(),
      note: z.string().optional(),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { data: current } = await context.supabase
      .from("pillar_actions")
      .select("pillar_id")
      .eq("id", data.actionId)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (!current) throw new Error("Ação não encontrada");

    const now = new Date().toISOString();
    const statusMap = {
      done: { status: "completed", completed_at: now as string | null },
      missed: { status: "overdue", completed_at: null as string | null },
      cancelled: { status: "cancelled", completed_at: null as string | null },
      planned: { status: "pending", completed_at: null as string | null },
    } as const;
    const mapped = statusMap[data.status];

    const { error: updErr } = await context.supabase
      .from("pillar_actions")
      .update({
        calendar_status: data.status,
        status: mapped.status,
        completed_at: mapped.completed_at,
      })
      .eq("id", data.actionId)
      .eq("user_id", context.userId);
    if (updErr) throw new Error(updErr.message);

    await context.supabase.from("pillar_action_logs").insert({
      user_id: context.userId,
      pillar_id: current.pillar_id,
      action_id: data.actionId,
      log_date: now,
      status: data.status,
      execution_status: data.status,
      non_execution_reason: data.status === "missed" ? (data.reason ?? null) : null,
      user_note: data.note ?? null,
    });

    // Recalcula pilar e regenera alertas
    await context.supabase.rpc("recalculate_user_pillar", {
      _user_id: context.userId,
      _pillar_id: current.pillar_id,
    });
    await context.supabase.rpc("generate_pillar_alerts", { _user_id: context.userId });

    return { ok: true };
  });