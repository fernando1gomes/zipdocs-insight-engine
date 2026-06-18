import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createClient } from "@supabase/supabase-js";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `Você é a IA Orientadora da Roda da Vida Viva, um SaaS de autogestão pessoal.

FILOSOFIA (siga sempre):
- A vida é um sistema vivo composto por 11 pilares interdependentes: Contribuição, Emocional, Família, Relacionamento, Social, Carreira, Financeiro, Intelectual, Espiritualidade, Lazer, Saúde.
- Cada pilar influencia os demais. Negligenciar um afeta vários outros.
- Seu papel é transformar autoconhecimento em ação prática — não diagnosticar, não julgar.
- Cores semáforo (verde/equilíbrio, amarelo/atenção, vermelho/alerta, cinza/sem dados) são sinais de cuidado, não fracasso.
- Foco em correção de rota com microações pequenas e executáveis em 7 dias.

TOM:
- Acolhedor, claro, humano, direto, prático. Nunca culpa, nunca julgamento.
- Nunca diga "você falhou", "está negligenciando sua vida" ou "seu desempenho foi ruim".
- Prefira: "este pilar pede atenção", "vamos escolher uma pequena ação", "há sinais de queda — uma correção simples ajuda".
- Respostas curtas (2–6 frases). Uma microação por vez. Pergunte antes de aconselhar quando o contexto for vago.

LIMITES (importante):
- Você NÃO substitui terapia, médico, consultor financeiro, advogado ou qualquer profissional.
- Quando o tema for clínico, jurídico, financeiro grave ou de risco emocional sério, recomende buscar um profissional qualificado — com gentileza, sem alarmar.
- Não dê diagnósticos, prescrições ou orientações técnicas profissionais.

PERGUNTAS PODEROSAS (use quando útil):
- O que você quer melhorar neste pilar? Por que isso importa para você?
- O que está impedindo seu avanço? Que padrão parece se repetir?
- Qual pequena ação você consegue executar nos próximos 7 dias?
- Esse objetivo está alinhado com seus valores?
- O que precisa ser simplificado para você conseguir executar?

USE O CONTEXTO DO USUÁRIO (snapshot abaixo) para responder com base na situação real dos pilares dele.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
        if (!token) return new Response("Unauthorized", { status: 401 });

        const supabase = createClient(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_PUBLISHABLE_KEY!,
          {
            global: { headers: { Authorization: `Bearer ${token}` } },
            auth: { persistSession: false, autoRefreshToken: false },
          },
        );
        const { data: userData, error: userErr } = await supabase.auth.getUser(token);
        if (userErr || !userData.user) return new Response("Unauthorized", { status: 401 });
        const userId = userData.user.id;

        const body = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(body.messages)) {
          return new Response("messages required", { status: 400 });
        }

        // Snapshot dos pilares do usuário
        const [{ data: pillars }, { data: alerts }] = await Promise.all([
          supabase
            .from("user_pillars")
            .select("pillar_id, current_score, desired_score, status_color, trend, risk_level, days_without_action, overdue_actions_count, pillars(name, short_name, impact_score)")
            .order("pillar_id"),
          supabase
            .from("alerts")
            .select("title, message, severity, pillar_id")
            .eq("is_resolved", false)
            .order("created_at", { ascending: false })
            .limit(5),
        ]);

        const pillarsText = (pillars ?? [])
          .map((p: any) => {
            const name = p.pillars?.short_name ?? `Pilar ${p.pillar_id}`;
            return `- ${name}: nota ${Number(p.current_score ?? 0).toFixed(1)}/10, status ${p.status_color ?? "?"}, tendência ${p.trend ?? "?"}, risco ${p.risk_level ?? "?"}, ${p.days_without_action ?? 0}d sem ação, ${p.overdue_actions_count ?? 0} ação(ões) vencida(s)`;
          })
          .join("\n") || "Sem dados de pilares ainda.";

        const alertsText = (alerts ?? []).length
          ? (alerts ?? []).map((a: any) => `• [${a.severity}] ${a.title}: ${a.message}`).join("\n")
          : "Nenhum alerta ativo.";

        const contextMsg = `SNAPSHOT DO USUÁRIO (use para personalizar a resposta):\n\nPilares:\n${pillarsText}\n\nAlertas ativos:\n${alertsText}`;

        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) return new Response("LOVABLE_API_KEY missing", { status: 500 });

        const gateway = createLovableAiGatewayProvider(apiKey);

        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: SYSTEM_PROMPT + "\n\n" + contextMsg,
          messages: await convertToModelMessages(body.messages),
          onError: ({ error }) => {
            console.error("[chat] streamText error", error);
          },
        });

        return result.toUIMessageStreamResponse({
          originalMessages: body.messages,
          onFinish: async ({ messages }) => {
            try {
              // Garante a conversa única do usuário
              let { data: conv } = await supabase
                .from("ai_conversations")
                .select("id")
                .eq("user_id", userId)
                .maybeSingle();
              if (!conv) {
                const ins = await supabase
                  .from("ai_conversations")
                  .insert({ user_id: userId })
                  .select("id")
                  .single();
                conv = ins.data;
              }
              if (!conv) return;
              await supabase.from("ai_conversations").update({ updated_at: new Date().toISOString() }).eq("id", conv.id);

              // Persiste somente a última do usuário + a do assistente
              const lastUser = [...body.messages!].reverse().find((m) => m.role === "user");
              const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
              const rows: any[] = [];
              if (lastUser) {
                rows.push({
                  conversation_id: conv.id,
                  user_id: userId,
                  role: "user",
                  content: lastUser.parts.map((p: any) => (p.type === "text" ? p.text : "")).join(""),
                  parts: lastUser.parts,
                });
              }
              if (lastAssistant) {
                rows.push({
                  conversation_id: conv.id,
                  user_id: userId,
                  role: "assistant",
                  content: lastAssistant.parts.map((p: any) => (p.type === "text" ? p.text : "")).join(""),
                  parts: lastAssistant.parts,
                });
              }
              if (rows.length) await supabase.from("ai_messages").insert(rows);
            } catch (e) {
              console.error("[chat] persist error", e);
            }
          },
        });
      },
    },
  },
});