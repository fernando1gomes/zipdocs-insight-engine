import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const PILLAR_NAMES: Record<number, string> = {
  1: "Saúde física",
  2: "Saúde mental",
  3: "Sono e descanso",
  4: "Relacionamentos",
  5: "Família",
  6: "Carreira / Trabalho",
  7: "Finanças",
  8: "Propósito e espiritualidade",
  9: "Lazer e prazer",
  10: "Aprendizado e crescimento",
  11: "Ambiente e organização",
};

export const generatePillarInsight = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ pillarId: z.number().int().min(1).max(11) }).parse(data))
  .handler(async ({ data, context }) => {
    const { pillarId } = data;
    const pillarName = PILLAR_NAMES[pillarId] ?? `Pilar ${pillarId}`;

    const { data: up } = await context.supabase
      .from("user_pillars")
      .select("current_score, desired_score")
      .eq("pillar_id", pillarId)
      .maybeSingle();

    const { data: history } = await context.supabase
      .from("pillar_evaluations")
      .select("final_score, user_comment, evaluation_date")
      .eq("pillar_id", pillarId)
      .order("evaluation_date", { ascending: false })
      .limit(5);

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const historyText = (history ?? [])
      .map((h) => `- ${h.evaluation_date}: nota ${h.final_score}${h.user_comment ? ` — "${h.user_comment}"` : ""}`)
      .join("\n") || "Sem histórico ainda.";

    const prompt = `Você é um coach holístico da Vida em Eixo. Pilar: ${pillarName}.
Score atual: ${up?.current_score ?? 0}/10 (desejado: ${up?.desired_score ?? 10}).
Últimas avaliações:
${historyText}

Em até 4 frases curtas e empáticas em português, dê: (1) um diagnóstico breve, (2) UMA próxima ação concreta e pequena (executável esta semana). Sem listas, sem markdown.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "Você é um coach empático, direto e prático." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`AI gateway error ${resp.status}: ${text.slice(0, 200)}`);
    }
    const json = (await resp.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const insight = json.choices?.[0]?.message?.content?.trim() ?? "Sem insight disponível.";

    await context.supabase.from("ai_recommendations").insert({
      user_id: context.userId,
      pillar_id: pillarId,
      recommendation_type: "insight",
      title: `Insight — ${pillarName}`,
      message: insight,
    });

    return { insight };
  });