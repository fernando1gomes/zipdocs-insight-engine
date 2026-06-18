# SaaS Roda da Vida Viva — Backend completo + auth + dados reais

Base: arquivos do `files_5.zip` (schema 12 tabelas, hooks, container Supabase, regras de cálculo). Adapto para a stack atual (TanStack Start + Lovable Cloud, server functions, RLS).

## Fases

### Fase 1 — Cloud + Auth + Schema
1. Habilitar Lovable Cloud.
2. Migração 1 — núcleo (catálogo + dados do usuário):
   - `profiles` (id = `auth.users`, display_name, avatar_url, onboarding_completed, current_cycle_start/end, preferred_checkin_day, notification_preferences) + trigger `handle_new_user`.
   - `app_role` enum + `user_roles` + função `has_role` (padrão Lovable).
   - `pillars` (catálogo dos 11, populado por seed na própria migração — pt-BR conforme zip).
   - `user_pillars` (score atual/desejado, status_color, trend, priority_level, focus_cycle_status, impact_score, risk_level, datas).
   - GRANTS + RLS: pillars público SELECT; user_pillars/profiles SELECT/INSERT/UPDATE/DELETE escopado por `auth.uid()`.
3. Migração 2 — execução e acompanhamento:
   - `pillar_evaluations`, `pillar_criteria`, `pillar_criteria_scores`.
   - `pillar_actions`, `pillar_action_logs`.
   - `pillar_interdependencies`, `alerts`, `weekly_checkins`, `weekly_checkin_answers`, `ai_recommendations`.
   - Índices conforme schema do zip. GRANTS + RLS por usuário em todas.
   - Trigger pós-`pillar_evaluations` que atualiza `user_pillars.current_score` e `last_evaluation_date`.
4. Auth: ativar e-mail/senha + Google (broker Lovable). Rota `/auth` (login + cadastro), `/reset-password`. Layout `_authenticated/route.tsx` gerenciado pela integração protege todas as rotas internas.

### Fase 2 — Dashboard com dados reais
- Mover home `/` para `/_authenticated/` (dashboard exige login). Página pública passa a ser `/auth` (landing simples + login).
- `src/lib/dashboard.functions.ts` (`createServerFn` + `requireSupabaseAuth`): retorna `{ pillars, priorities, nextAction, statusCounts, balance }` montando `user_pillars` + catálogo + `pillar_actions` (próxima a vencer). Se usuário ainda não tem `user_pillars`, semeia 11 linhas zeradas no primeiro acesso.
- Refator de `src/routes/_authenticated/index.tsx`: usa TanStack Query (`ensureQueryData` no loader + `useSuspenseQuery`). `PILLARS` mock vira fallback só para storybook.
- Adaptar `PillarCard`/`RadialWheel` para receber dados vindos do backend (mesma forma do tipo `Pillar`).
- Header ganha menu do usuário (nome, sair).

### Fase 3 — Check-in semanal
- Rota `/_authenticated/checkin`: wizard de 11 passos (slider 0-10 + comentário curto por pilar) + reflexão final.
- Server fn `submitWeeklyCheckin`: cria `weekly_checkins` + `weekly_checkin_answers` + 11 `pillar_evaluations` (trigger atualiza `user_pillars`). Recalcula `status_color`/`priority_level` via util `pillar-calculations` portado para TS em `src/lib/pillarCalc.ts`.
- Botão "Novo check-in" do dashboard leva para a rota.

### Fase 4 — Ações / Plano
- Rota `/_authenticated/acoes`: lista agrupada por pilar, filtros (pendente/atrasada/feita), criação rápida (título, pilar, tipo único/recorrente, frequência, data).
- Server fns: `listActions`, `createAction`, `completeAction` (cria `pillar_action_logs`, recalcula `next_due_date`, marca status), `updateAction`, `deleteAction`.
- Botão "Criar ação" do dashboard abre dialog reutilizando o form.

### Fase 5 — Alertas e recomendações IA
- Rota `/_authenticated/alertas`: lista `alerts` (não lidos no topo), ação marcar como lido/resolvido.
- Server fn `generateAlerts`: roda regras do `pillar-calculations.js` (pilar negligenciado, ação atrasada, score baixo, risco de interdependência) e insere em `alerts`. Disparada no fim do check-in e quando uma ação é concluída/atrasa.
- Server fn `generateRecommendations` chamando Lovable AI Gateway (`google/gemini-3-flash-preview`) com contexto dos pilares críticos → grava em `ai_recommendations`. Card "Próxima melhor ação" do dashboard passa a ler a recomendação mais recente `pending`.

### Fase 6 — Histórico e evolução
- Rota `/_authenticated/historico`: gráfico de linha por pilar (Recharts já disponível) a partir de `pillar_evaluations`; tabela de check-ins anteriores; comparação semana atual x anterior.
- Server fn `getPillarHistory(pillarId?, range)`.

## Detalhes técnicos

- Server functions sob `src/lib/*.functions.ts`; helpers `*.server.ts` quando necessário. Todas as fns autenticadas usam `requireSupabaseAuth`; `attachSupabaseAuth` é registrado em `src/start.ts`.
- IA: Lovable AI Gateway via `@ai-sdk/openai-compatible` em server fn (sem expor `LOVABLE_API_KEY`). Tratar 429/402 com mensagem amigável.
- Tokens visuais e layout radial atuais ficam intactos.
- Cada migração: `CREATE TABLE` → `GRANT` → `ENABLE RLS` → `CREATE POLICY`, conforme regra do projeto. Sem dados de teste em prod (só o seed de `pillars`).
- Toda rota com loader recebe `errorComponent` + `notFoundComponent`; loaders protegidos só sob `_authenticated/`.

## Fora do escopo (por enquanto)

- Notificações push/e-mail e cron de lembretes (estrutura pronta no schema, mas integração fica para depois).
- Pagamentos / planos.
- App mobile.

## Entrega por fase

Posso entregar tudo de uma vez ou pausar para revisar entre fases. Padrão: implementar Fases 1–2 primeiro (auth funcionando + dashboard ligado ao banco), confirmar visualmente, e seguir 3→6 em sequência.
