import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const PILLAR_TOOLS: Record<number, string> = {
  1: "Rotina de hábitos saudáveis (sono, alimentação, exercício, hidratação)",
  2: "Diário emocional e reprogramação de crenças",
  3: "Tempo de qualidade e conversas restauradoras em família",
  4: "Reunião semanal do casal (sentimentos, planos, finanças, intimidade)",
  5: "Mapa de relacionamentos sociais saudáveis",
  6: "Plano de crescimento profissional (competências, feedback, entrega de valor)",
  7: "Orçamento financeiro e plano de prosperidade",
  8: "Plano de estudo (leitura diária, cursos trimestrais, aplicação prática)",
  9: "Rotina espiritual (oração, meditação, leitura, gratidão, serviço)",
  10: "Rotina de lazer consciente (descanso, prazer, hobbies)",
  11: "Plano de serviço e legado (doar tempo, conhecimento, dinheiro)",
};

export const suggestPillarActions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        pillarId: z.number().int().min(1).max(11),
        broken: z.string().optional().default(""),
        missing: z.string().optional().default(""),
        misplaced: z.string().optional().default(""),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const { data: pillar } = await context.supabase
      .from("pillars")
      .select("name, short_name")
      .eq("id", data.pillarId)
      .maybeSingle();

    const { data: up } = await context.supabase
      .from("user_pillars")
      .select("current_score, desired_score")
      .eq("pillar_id", data.pillarId)
      .maybeSingle();

    const pillarName = pillar?.name ?? `Pilar ${data.pillarId}`;
    const tool = PILLAR_TOOLS[data.pillarId] ?? "";

    const prompt = `Você é um coach holístico da Roda da Vida Viva.
Pilar: ${pillarName}.
Ferramenta principal deste pilar: ${tool}.
Nota atual: ${up?.current_score ?? 0}/10 (desejada ${up?.desired_score ?? 10}).

Diagnóstico do usuário sobre este pilar:
- Quebrado (precisa consertar): ${data.broken || "(não informado)"}
- Faltando (precisa repor): ${data.missing || "(não informado)"}
- Fora do lugar (precisa organizar): ${data.misplaced || "(não informado)"}

Sugira de 5 a 7 ações práticas, pequenas e executáveis nesta semana para o usuário avançar neste pilar. Cada ação deve atacar diretamente um dos itens do diagnóstico (consertar / repor / organizar). Use linguagem direta em português, sem chavões.

Responda APENAS com JSON válido no formato:
{ "actions": [ { "title": "...", "description": "...", "effort": "baixo" | "médio" | "alto" } ] }`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "Você é um coach empático, direto e prático. Responda sempre em JSON válido quando solicitado." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      if (resp.status === 429) throw new Error("Limite de requisições atingido, tente novamente em instantes.");
      if (resp.status === 402) throw new Error("Créditos de IA esgotados.");
      throw new Error(`AI gateway ${resp.status}: ${text.slice(0, 200)}`);
    }

    const json = (await resp.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = json.choices?.[0]?.message?.content?.trim() ?? "{}";
    let parsed: { actions?: Array<{ title?: string; description?: string; effort?: string }> } = {};
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = { actions: [] };
    }
    const actions = (parsed.actions ?? [])
      .filter((a) => a && typeof a.title === "string")
      .slice(0, 8)
      .map((a) => ({
        title: String(a.title).slice(0, 200),
        description: String(a.description ?? "").slice(0, 600),
        effort: ["baixo", "médio", "alto"].includes(String(a.effort)) ? String(a.effort) : "médio",
      }));

    return { actions };
  });