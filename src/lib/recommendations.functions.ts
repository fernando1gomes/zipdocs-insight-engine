import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getLatestRecommendation = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("ai_recommendations")
      .select("*")
      .eq("user_id", context.userId)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  });

export const generateRecommendation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY ausente");

    const { data: ups } = await supabase
      .from("user_pillars")
      .select("pillar_id, current_score")
      .eq("user_id", userId);
    const { data: cat } = await supabase.from("pillars").select("id, name, short_name");
    const nameOf = new Map((cat ?? []).map((c) => [c.id, c]));

    const summary = (ups ?? [])
      .map((u) => {
        const c = nameOf.get(u.pillar_id);
        return `- ${c?.short_name ?? u.pillar_id}: ${Number(u.current_score).toFixed(1)}/10`;
      })
      .join("\n");

    const lowest = (ups ?? [])
      .filter((u) => Number(u.current_score) > 0)
      .sort((a, b) => Number(a.current_score) - Number(b.current_score))[0];
    const targetPillar = lowest ? nameOf.get(lowest.pillar_id) : null;

    const prompt = `Você é um coach de autogestão. Dado o estado dos 11 pilares da vida do usuário:\n${summary}\n\nSugira UMA única próxima melhor ação concreta e específica para os próximos 7 dias${targetPillar ? `, focada no pilar "${targetPillar.name}"` : ""}. Responda em JSON: {"title": "ação curta (max 80 chars)", "details": "explicação em 2 frases"}.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });
    if (resp.status === 429) throw new Error("Limite de IA atingido, tente em alguns minutos.");
    if (resp.status === 402) throw new Error("Créditos de IA esgotados.");
    if (!resp.ok) throw new Error(`AI error ${resp.status}`);
    const json = await resp.json();
    let parsed: { title?: string; details?: string } = {};
    try { parsed = JSON.parse(json.choices?.[0]?.message?.content ?? "{}"); } catch { /* ignore */ }

    const title = parsed.title ?? "Próxima ação sugerida";
    const details = parsed.details ?? "";

    const { data: inserted, error } = await supabase
      .from("ai_recommendations")
      .insert({
        user_id: userId,
        pillar_id: lowest?.pillar_id ?? null,
        recommendation_type: "micro_action",
        title,
        message: details,
        suggested_action: title,
      })
      .select()
      .single();
    if (error) throw error;
    return inserted;
  });