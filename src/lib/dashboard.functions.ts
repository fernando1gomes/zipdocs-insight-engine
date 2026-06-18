import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { statusFromScore, overallBalance, countByStatus } from "@/lib/pillarCalc";

export interface DashboardPillar {
  id: number;
  name: string;
  shortName: string;
  icon: string;
  score: number;
  desiredScore: number;
  status: "balanced" | "attention" | "critical" | "empty";
  message: string;
  impact: number;
  focus: boolean;
}

export interface DashboardPayload {
  pillars: DashboardPillar[];
  balance: number;
  statusCounts: { balanced: number; attention: number; critical: number; empty: number };
  priorities: Array<{ pillarId: number; title: string; pillarName: string; icon: string }>;
  nextAction: { title: string; pillarName: string | null } | null;
}

function messageFor(score: number): string {
  if (score <= 0) return "Sem avaliação, faça um check-in";
  if (score < 6) return "Crítico, requer atenção";
  if (score < 7) return "Atenção, fortalecer rotina";
  return "Equilibrado, manter";
}

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: catalog, error: catErr } = await supabase
      .from("pillars")
      .select("id, name, short_name, icon, default_order")
      .order("default_order");
    if (catErr) throw catErr;

    let { data: ups, error: upsErr } = await supabase
      .from("user_pillars")
      .select("pillar_id, current_score, desired_score, focus_cycle_status")
      .eq("user_id", userId);
    if (upsErr) throw upsErr;

    // Auto-seed
    if (!ups || ups.length === 0) {
      const seed = (catalog ?? []).map((p) => ({ user_id: userId, pillar_id: p.id }));
      if (seed.length) {
        const { error: insErr } = await supabase.from("user_pillars").insert(seed);
        if (insErr) throw insErr;
      }
      ups = seed.map((s) => ({ pillar_id: s.pillar_id, current_score: 0, desired_score: 10, focus_cycle_status: null }));
    }

    const upMap = new Map(ups!.map((u) => [u.pillar_id, u]));
    const pillars: DashboardPillar[] = (catalog ?? []).map((p) => {
      const up = upMap.get(p.id);
      const score = Number(up?.current_score ?? 0);
      return {
        id: p.id,
        name: p.name,
        shortName: p.short_name,
        icon: p.icon ?? "🔹",
        score,
        desiredScore: Number(up?.desired_score ?? 10),
        status: statusFromScore(score),
        message: messageFor(score),
        impact: 7,
        focus: up?.focus_cycle_status === "focused",
      };
    });

    const scores = pillars.map((p) => p.score);
    const balance = overallBalance(scores);
    const statusCounts = countByStatus(scores);

    // Priorities: 5 lowest scored (excluding empty), then empty fallback
    const priorities = [...pillars]
      .filter((p) => p.score > 0)
      .sort((a, b) => a.score - b.score)
      .slice(0, 5)
      .map((p) => ({ pillarId: p.id, title: `Cuidar de ${p.shortName}`, pillarName: p.shortName, icon: p.icon }));

    // Next action: nearest due pending
    const { data: nextActs } = await supabase
      .from("pillar_actions")
      .select("title, pillar_id, next_due_date")
      .eq("user_id", userId)
      .eq("status", "pending")
      .order("next_due_date", { ascending: true, nullsFirst: false })
      .limit(1);

    let nextAction: DashboardPayload["nextAction"] = null;
    if (nextActs && nextActs.length) {
      const a = nextActs[0];
      const pillarName = pillars.find((p) => p.id === a.pillar_id)?.shortName ?? null;
      nextAction = { title: a.title, pillarName };
    }

    const payload: DashboardPayload = { pillars, balance, statusCounts, priorities, nextAction };
    return payload;
  });