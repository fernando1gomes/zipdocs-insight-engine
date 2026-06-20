## Visão geral
Criar a funcionalidade **Semana em Eixo** — calendário semanal em tela cheia onde o usuário agenda, acompanha e fecha o dia, ligando ações dos planos aos pilares, dashboard, alertas e check-in semanal.

Entrega em **três fases incrementais** (mais seguro do que migrar/criar tudo em uma única rodada). Cada fase pode ser aprovada e validada antes da próxima.

---

## Fase 1 — Estrutura e Calendário Semanal (MVP)

### 1.1 Migração de banco
Estender o que já existe — não duplicar.

`pillar_actions` ganha:
- `scheduled_start` timestamptz
- `scheduled_end` timestamptz
- `duration_minutes` int
- `calendar_status` text default `'planned'` (planned | done | missed | rescheduled | cancelled)
- `reminder_enabled` bool default false
- `reminder_at` timestamptz

`pillar_action_logs` ganha:
- `execution_status` text (done | missed | rescheduled | cancelled)
- `non_execution_reason` text
- `rescheduled_from` timestamptz
- `rescheduled_to` timestamptz
- `daily_closing_id` uuid

Novas tabelas:
- `daily_closings` (user_id, closing_date, planned/completed/missed/rescheduled counts, user_reflection, ai_summary)
- `daily_closing_answers` (daily_closing_id, question, answer)

Todas com **GRANT** + **RLS** por `auth.uid()`.

### 1.2 Server functions (`src/lib/calendar.functions.ts`)
- `listWeekActions({ weekStart })` — retorna ações com `scheduled_start` na semana.
- `scheduleAction({ actionId, start, end })` — agenda/move ação no calendário.
- `createScheduledAction({ pillarId, title, ..., start, end })` — cria ação direto da grade.
- `updateActionStatus({ actionId, status, reason?, note? })` — registra execução / não execução / cancelamento; insere log; atualiza `completed_at`, `calendar_status`; aciona `recalculate_user_pillar` + `generate_pillar_alerts`.
- `rescheduleAction({ actionId, newStart, newEnd })` — move + log com `rescheduled_from/to`.

### 1.3 UI
- Nova rota `src/routes/_authenticated/semana.tsx` (link no `AppHeader` como “Semana em Eixo”).
- Layout grid CSS: coluna sticky de horários 5h–23h (slots de 30 min); 7 colunas Seg–Dom; cabeçalho com navegação ‹ semana anterior › / hoje / próxima.
- Cada ação renderizada como bloco absoluto (top = horário, height = duração) dentro da coluna do dia.
- Bloco mostra: ícone Phosphor do pilar, título, horário, selo de status (cores suaves abaixo).
- Cores do bloco usam a cor do pilar; **selo** sobreposto usa cor de status:
  - planned → `--info-soft`
  - done → `--balanced-soft`
  - missed → `--critical-soft`
  - rescheduled → `--attention-soft`
  - cancelled → `--muted`
- Adicionar tokens `--info`, `--info-soft` em `src/styles.css` se ainda não existirem.
- Clique em bloco → `ActionDetailDialog` (shadcn Dialog) com todos os campos + botões (Executada / Não executada / Reagendar / Editar / Cancelar).
- Clique em slot vazio → `CreateActionDialog` pré-preenche dia/horário.
- Modal “Não executada” pede motivo via Select (lista fixa) + textarea.
- Modal “Reagendar” = date+time pickers.
- Linguagem acolhedora conforme o briefing (textos centralizados em `src/lib/calendar-copy.ts`).

### 1.4 Responsividade
- Desktop ≥ lg: grade completa.
- md: scroll horizontal nas colunas.
- < md: visão diária com tabs Seg–Dom no topo.

---

## Fase 2 — Resumo do dia, Filtros e Fechamento do dia
- Painel lateral “Resumo do dia” (drawer no mobile): contagens + lista de pilares cuidados/sem atenção (deriva do estado da semana, sem nova query).
- Barra de filtros: pilar, status, prioridade, vencidas, hoje, recorrentes.
- Botão flutuante “Fechar meu dia” aparece após 18h ou manualmente.
- `DailyClosingDialog` com 4 perguntas (executou, não executou, dificuldade, aprendizado) → grava `daily_closings` + `daily_closing_answers`; atualiza logs do dia com `daily_closing_id`.

---

## Fase 3 — Integração check-in / dashboard / alertas
- Estender `weekly_checkins` (ou nova view) para puxar agregados da semana de `pillar_action_logs`: planejadas, executadas, taxa, top/bottom pilares, motivos mais frequentes.
- Adicionar bloco “Semana em Eixo” no `dashboard.tsx`: taxa de execução semanal + atalho para `/semana`.
- Estender `generate_pillar_alerts` para detectar 3+ `missed` consecutivos na mesma ação → novo `alert_type='action_too_hard'` com texto “Esta ação tem sido difícil de executar…”.
- Sugestão de fechamento de semana gerada via Lovable AI Gateway no check-in.

---

## Considerações técnicas
- Slots de 30 min (Date manipulado em UTC e exibido com `Intl.DateTimeFormat` em pt-BR).
- Drag-and-drop fica fora do MVP — mover ação via botão “Reagendar”. Pode entrar em fase futura usando `@dnd-kit/core` (instalar sob aprovação).
- Reaproveitar `iconForPillar` para os ícones dos blocos.
- Todas as mutações invalidam `queryKey: ['calendar-week', weekStart]`, `['actions']`, `['user-pillars']`, `['alerts']`.
- Reusar `recalculate_user_pillar` e `generate_pillar_alerts` existentes — não duplicar lógica no JS.

---

## Confirmação antes de executar
1. Tudo bem entregar em **3 fases** (começando pelo MVP Fase 1) ou prefere uma única entrega completa?
2. Drag-and-drop pode ficar para depois, ou é essencial já no MVP?
