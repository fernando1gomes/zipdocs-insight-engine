
## 1. Avaliação do sistema atual vs. a filosofia "vida em movimento"

| Área da filosofia | Estado atual | Lacuna |
|---|---|---|
| Roda da Vida Viva interativa | ✅ `RadialWheel` com 11 pilares e cores semáforo | Falta pulsação/animação viva e modal de detalhe ao clicar |
| Cores semáforo (verde/amarelo/vermelho/cinza/foco) | ✅ Tokens definidos e usados | OK |
| Avaliação subjetiva 0–10 | ✅ Onboarding + `/pilar/$id` | OK |
| Avaliação multicritério (subj + comportamento + execução + frequência + interdependência) | ⚠️ 5 sliders genéricos, mas **iguais para todos os pilares** | Faltam critérios objetivos **específicos de cada pilar** (sono, dívidas, presença familiar, etc.) |
| Perguntas de check-in por pilar | ❌ Check-in semanal é genérico | Faltam perguntas próprias de cada pilar |
| Plano de ação (objetivo, nota desejada, prazo, frequência, obstáculo, recurso) | ⚠️ `pillar_actions` tem os campos, mas o form de ação coleta só título/desc/tipo/data | Form incompleto |
| Monitor de Equilíbrio / Radar dos Pilares (alertas automáticos) | ⚠️ Tabela `alerts` existe e o painel exibe, mas **nada gera alertas automaticamente** | Falta engine de regras (dias sem ação, queda de nota, ação vencida, sem plano, queda em pilar de alto impacto) |
| Interdependência entre pilares | ⚠️ Tabela `pillar_interdependencies` existe e o peso de impacto já entra na nota final | Falta tela para usuário configurar e mensagens "X caiu, pode afetar Y/Z" |
| Tendência (subindo/estável/caindo) | ❌ `trend` existe na tabela mas não é calculado | Falta cálculo a partir do histórico |
| Risco de negligência | ❌ Não calculado | Falta `risk_level` |
| Status calculado com múltiplos fatores (não só nota) | ❌ Trigger atual decide cor **só pela nota final** | Precisa considerar dias sem ação, vencidas, plano ativo, tendência |
| Prioridades da semana inteligentes | ⚠️ Atualmente = 5 pilares de menor score | Falta considerar queda recente, ações vencidas, tempo sem cuidado, impacto |
| Check-in semanal com IA | ⚠️ Wizard salva respostas, mas sem análise | Falta resumo/sugestões geradas por IA |
| IA orientadora conversacional | ❌ Não existe | A construir |
| Critérios configuráveis (`pillar_criteria`) | ❌ Tabela não existe | A criar |
| Histórico de critérios (`pillar_criteria_scores`) | ❌ Não existe | A criar |
| Log de execução de ação recorrente (`pillar_action_logs`) | ✅ Tabela existe, pouco usada | OK |
| Linguagem acolhedora (sem culpa) | ⚠️ Mensagens hoje são neutras | Padronizar nos textos de alerta |

**Veredito:** a fundação técnica está ~60% alinhada (schema rico, roda, cores, multicritério genérico). Faltam três grandes blocos para virar "vida em movimento": **(A) critérios e perguntas por pilar**, **(B) motor de status/tendência/risco/alertas automáticos**, e **(C) IA orientadora conversacional**. Este plano entrega esses três blocos.

---

## 2. Escopo deste plano

### Bloco A — Critérios e perguntas por pilar (banco + UI)

**Migração SQL única:**

1. Criar `pillar_criteria` (id, pillar_id, key, label, question_text, weight, hint, is_active) — fonte da verdade dos critérios de cada pilar.
2. Criar `pillar_criteria_scores` (id, evaluation_id, criterion_id, score 0–10, comment) — uma linha por critério respondido em cada avaliação.
3. Criar `pillar_checkin_questions` (id, pillar_id, question_text, order_index, is_active) — perguntas específicas de cada pilar para o check-in semanal.
4. Adicionar em `user_pillars`: `trend` (`up|stable|down|null`), `risk_level` (`low|medium|high|null`), `days_without_action` (int), `last_calc_at` (timestamptz). (Vários já existem; só completar.)
5. Seed dos critérios e perguntas dos 11 pilares conforme a tabela técnica enviada (Saúde: sono, alimentação, atividade física, exames, energia, sintomas; Emocional: ansiedade, estabilidade, clareza mental, irritabilidade, descanso, autocuidado; …até Contribuição e legado).
6. GRANT + RLS (`auth.uid() = user_id` onde aplicável; `pillars`/`pillar_criteria`/`pillar_checkin_questions` legíveis por `authenticated`).
7. Atualizar `apply_evaluation_to_user_pillar` para também recalcular `trend` (compara `final_score` com média das 3 avaliações anteriores) e `days_without_action`.

**UI:**

- `/pilar/$id`: substituir os 4 sliders genéricos pelos critérios do pilar vindos do banco (label + pergunta + slider 0–10 + comentário opcional). A nota final continua sendo a fórmula ponderada (40% subjetivo, 30% execução de ação, 20% comportamento — calculado como média dos critérios objetivos do pilar — 10% interdependência, ajustada pelo `impact`).
- Form de ação completo: objetivo, nota desejada, prazo, frequência, prioridade, obstáculo esperado, recurso necessário.

### Bloco B — Motor de status / tendência / risco / alertas automáticos

**Database functions (executadas a cada insert de avaliação, log de ação ou via cron diário):**

1. `recalculate_user_pillar(user_id, pillar_id)` — atualiza `current_score`, `trend`, `days_without_action`, `overdue_actions_count`, `risk_level`, `status_color` segundo as regras:
   - Verde: score ≥ 7, sem ações vencidas, ação recente dentro da frequência, tendência ≥ estável.
   - Amarelo: 5 ≤ score < 7, OU 1+ ação vencida, OU queda recente, OU >X dias sem ação, OU sem plano ativo.
   - Vermelho: score < 5, OU múltiplas ações vencidas, OU queda forte, OU alto impacto piorando.
   - Cinza: sem avaliação.
2. `generate_alerts_for_user(user_id)` — varre os `user_pillars` e cria registros em `alerts` para: pilar negligenciado (>N dias), ação vencida, queda em 2 check-ins, score < 5, pilar crítico sem plano, queda em pilar de alto impacto, ausência de check-in semanal, pilar sem avaliação há 30 dias. Mensagens no tom acolhedor (templates fixos na função).
3. Triggers em `pillar_evaluations` e `pillar_action_logs` chamando `recalculate_user_pillar` + `generate_alerts_for_user`.
4. Server function `runDailyMaintenance` (chamada pelo dashboard ao abrir, uma vez por dia por usuário) que dispara `generate_alerts_for_user` para capturar alertas baseados em tempo (sem ação há X dias).

**UI:**

- Dashboard: card "Prioridades da semana" passa a usar `risk_level` + `impact_score` em vez de só score baixo.
- Cada `PillarCard` mostra ícone de tendência (↑ → ↓) e badge de risco.
- Modal de detalhe do pilar ao clicar na roda (em vez de navegar): nota atual/desejada, tendência, critérios, plano, ações pendentes/vencidas, dias sem cuidado, pilares impactados, microação sugerida, histórico.

### Bloco C — IA orientadora conversacional (Lovable AI Gateway)

**Backend:**

1. Server route streaming em `src/routes/api/chat.ts` usando `@ai-sdk/openai-compatible` + Lovable AI Gateway (modelo `google/gemini-3-flash-preview`).
2. Helper `src/lib/ai-gateway.server.ts` conforme padrão Lovable.
3. System prompt longo embutido no servidor com:
   - A filosofia "vida como sistema vivo, 11 pilares interdependentes".
   - Posicionamento: ferramenta de autogestão — **não** substitui terapia/médico/consultor financeiro; recomenda profissional quando o tema for clínico/jurídico/financeiro grave.
   - Tom: claro, humano, prático, acolhedora; nunca culpa, sempre correção de rota.
   - Repertório de perguntas poderosas (o que quer melhorar, por que importa, o que está impedindo, qual microação em 7 dias, que padrão se repete, alinhamento com valores).
   - Regras: respostas curtas, focar em **uma** microação executável, perguntar antes de aconselhar, usar o contexto dos pilares do usuário.
4. Contexto injetado a cada conversa: snapshot dos `user_pillars` (nota, status, tendência, risco, dias sem ação) + 3 alertas ativos + foco da semana, montado no servidor via `requireSupabaseAuth` antes de chamar o modelo.
5. Conversas persistidas (uma única conversa por usuário, por simplicidade — pode evoluir para threads depois). Tabela `ai_conversations` + `ai_messages` (role, content, created_at). RLS por `auth.uid()`.

**Frontend:**

1. Nova rota `/_authenticated/orientadora.tsx` (botão "💬 IA Orientadora" no header).
2. Componente de chat usando `useChat` do `@ai-sdk/react` apontando para `/api/chat`, renderizando `message.parts` com markdown.
3. Composer com foco automático, indicador de digitação durante `submitted`, scroll automático.
4. Atalhos rápidos abaixo do input: "Me ajude a definir uma ação para [pilar mais crítico]", "O que está desequilibrado esta semana?", "Reflexão de check-in".

**IA também usada em pontos do produto (mesma server fn, prompts diferentes):**

- Resumo do check-in semanal (gera `weekly_checkins.ai_summary`).
- Sugestão de microação ao avaliar pilar (preenche `ai_recommendations`).
- Mensagem do alerta de interdependência quando um pilar de alto impacto cai.

---

## 3. Detalhes técnicos relevantes

- Stack: TanStack Start + Lovable Cloud (Supabase). Server functions em `src/lib/*.functions.ts`; chat em server route `src/routes/api/chat.ts`. `LOVABLE_API_KEY` já configurado.
- Fórmula nota final do pilar (revisada):
  `final = 0.40·subjective + 0.30·action_execution + 0.20·behavior_avg + 0.10·interdependence·(impact/10)`, normalizada para 0–10.
- `behavior_avg` = média ponderada dos `pillar_criteria_scores` daquela avaliação usando `weight` do critério.
- Tendência: compara `final_score` atual com média dos 3 últimos. Diferença > +0.5 → up; < −0.5 → down; senão stable.
- Risco: matriz `(score band) × (overdue_actions) × (days_without_action) × (impact_score) → low|medium|high`.
- Alertas: idempotência via `unique(user_id, pillar_id, alert_type, date_trunc('day', created_at))` para não duplicar no mesmo dia.
- IA: nunca expor `LOVABLE_API_KEY` no client; system prompt e snapshot do usuário montados server-side; tratar 402/429 com mensagem clara.

---

## 4. Fora do escopo (para depois)

- Tela de administração dos critérios (CRUD pelo usuário).
- Threads múltiplas na IA orientadora (vai começar com 1 conversa por usuário).
- Notificações por e-mail/push dos alertas.
- Cron real (pg_cron) — por ora, `runDailyMaintenance` no abrir do dashboard.
- Tela visual de mapa de interdependência.

Aprovando, eu começo pela migração (Bloco A + funções do Bloco B), depois ligo a UI de avaliação aos critérios, atualizo dashboard com tendência/risco/alertas automáticos, e por fim entrego a IA orientadora com chat streaming.
