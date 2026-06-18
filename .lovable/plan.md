
# Plano: SaaS Roda da Vida Viva

Hoje o projeto tem só o dashboard com dados *mock* (`src/lib/pillars.ts`) e a roda radial. O banco no Lovable Cloud já está criado (tabelas `pillars`, `user_pillars`, `pillar_evaluations`, `pillar_actions`, `pillar_action_logs`, `alerts`, `weekly_checkins`, `weekly_checkin_answers`, `ai_recommendations`, `pillar_interdependencies`, `profiles`, `user_roles` + funções `has_role`, `handle_new_user`, `apply_evaluation_to_user_pillar`, `set_updated_at`).

Falta: seed dos 11 pilares, criação automática dos `user_pillars` no signup, autenticação real, telas para avaliar / criar ações / fazer check-in, e ligar o dashboard a dados reais.

## Escopo entregue neste plano

### 1. Banco — completar o que falta (migration única)
- `INSERT` dos 11 pilares fixos em `public.pillars` (idempotente).
- Atualizar `handle_new_user` para também popular `user_pillars` (uma linha por pilar) e disparar trigger em `auth.users`.
- Garantir triggers `set_updated_at` nas tabelas com `updated_at`.
- Trigger `apply_evaluation_to_user_pillar` ligado em `pillar_evaluations`.
- Garantir `GRANT`s e RLS (políticas `auth.uid() = user_id`) em todas as tabelas de dados do usuário; `pillars` legível por `authenticated`.

### 2. Autenticação
- Rota pública `/auth` (e-mail/senha + Google), usando `supabase.auth`.
- Layout protegido `src/routes/_authenticated/route.tsx` (gate gerenciado, `ssr: false`).
- Header com botão "Sair" e nome do usuário (lendo `profiles`).
- Habilitar provider Google via tool de auth.

### 3. Dashboard com dados reais (`/_authenticated/`)
- Substituir `PILLARS` mock por query `user_pillars` + join `pillars`.
- Manter layout radial (`RadialWheel`) e cards já aprovados.
- Cálculo de status/cores reutilizando `statusFromScore` e regras do `pillar-calculations.js` (dias sem ação, ações atrasadas).
- "Prioridades da semana" = top 5 pilares por score mais baixo + atenção/crítico.
- "Próxima melhor ação" = primeira `pillar_actions` pendente do pilar de menor score.

### 4. Avaliar pilar (`/_authenticated/pilar/$id`)
- Página por pilar mostrando histórico (`pillar_evaluations`) e formulário de nova avaliação (score 0–10 + comentário).
- Insert em `pillar_evaluations` (trigger já atualiza `user_pillars`).
- Lista de ações vinculadas ao pilar com marcar como concluída (`pillar_action_logs` + atualizar `status`).

### 5. Ações (`/_authenticated/acoes`)
- Lista de todas as ações do usuário com filtros (pendente / atrasada / concluída).
- Modal "Criar ação" (título, descrição, pilar, tipo único/recorrente, data).
- Concluir / pausar / cancelar.

### 6. Check-in semanal (`/_authenticated/checkin`)
- Wizard de 3 passos: reflexão livre, pilar foco da semana, pilar mais negligenciado.
- Insert em `weekly_checkins` + `weekly_checkin_answers`.
- Botão "Novo check-in" no header do dashboard leva pra cá.

### 7. Alertas (drawer/painel no dashboard)
- Listar `alerts` não resolvidos, marcar como lido/resolvido.

## Detalhes técnicos

- **Stack**: TanStack Start + Supabase já configurados. Tudo client-side via `@/integrations/supabase/client` (RLS protege). Sem server functions custom neste plano.
- **Read shape**: `useQuery`/`useSuspenseQuery` com TanStack Query (já no projeto).
- **Auth**: Google OAuth pelo broker `lovable.auth.signInWithOAuth` + e-mail/senha. `configure_social_auth` para Google.
- **Migrations**: uma migration cobrindo seed dos 11 pilares + trigger novo no `handle_new_user` + ajustes de RLS/GRANT que estiverem faltando.
- **Design**: mantém tokens atuais (`--balanced`, `--attention`, `--critical`, `--focus`) e layout da roda já aprovado.

## Fora do escopo (fica pra depois)

- Recomendações de IA via Lovable AI Gateway (`ai_recommendations` fica como tabela vazia por enquanto).
- Interdependências entre pilares (`pillar_interdependencies`).
- Notificações por e-mail/push.
- Onboarding guiado (cycle dates, preferred_checkin_day).
- Tooltips ricos descritos no markdown ("impacta X pilares" expandido).

Aprovando, eu começo pela migration + auth, depois ligo o dashboard a dados reais, e em seguida as telas de avaliação, ações e check-in.
