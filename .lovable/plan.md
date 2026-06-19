## Objetivo

Criar uma nova ferramenta **"Plano de Ação por Pilar"** onde o usuário, para cada um dos 11 pilares, responde a 3 perguntas-guia + um formulário 5W2H, com a IA sugerindo ações concretas baseadas no pilar, na nota atual da autoavaliação e no que ele marcou como "precisa ser consertado".

## Fluxo

1. Nova rota `/plano-acao` no menu (e card no dashboard).
2. Lista todos os pilares com status (cor da autoavaliação) + botão **"Criar / editar plano"**.
3. Ao abrir um pilar, wizard em 3 etapas:

   **Etapa 1 — Diagnóstico (3 perguntas)**
   - O que está **quebrado** que preciso consertar?
   - O que está **faltando** que preciso repor?
   - O que está **fora do lugar** que preciso organizar?
   (3 textareas; pré-preenche com o `user_comment` da última autoavaliação do pilar quando existir.)

   **Etapa 2 — Sugestões da IA**
   - Botão "Gerar sugestões com IA" chama `createServerFn` que envia: pilar, ferramenta principal do pilar (ex: "Rotina de hábitos saudáveis"), nota atual, nota objetiva, critérios não marcados, e as 3 respostas da etapa 1.
   - IA devolve 5–7 ações sugeridas (título + descrição curta + esforço estimado).
   - Usuário marca quais quer adotar (vira itens do plano; cada uma pode virar `pillar_actions` ao concluir o wizard).

   **Etapa 3 — 5W2H consolidado**
   Formulário único com os 7 campos: O quê / Por quê / Como / Quando (data início + prazo) / Onde / Quem (apoio) / Quanto (tempo, energia, dinheiro).
   Campo "Como" pré-preenchido com as ações escolhidas na etapa 2 (editável).

4. **Salvar** = grava 1 linha em `pillar_action_plans` + N linhas em `pillar_actions` (uma por ação escolhida, já ligadas ao plano).

## Banco de dados

Migration nova:

- `pillar_action_plans` (novo): `id`, `user_id`, `pillar_id`, `broken_text`, `missing_text`, `misplaced_text`, `what`, `why`, `how`, `when_start` (date), `when_due` (date), `where_text`, `who_text`, `how_much`, `status` ('active'|'paused'|'completed'), `created_at`, `updated_at`. RLS por `auth.uid()`, GRANTs para `authenticated`/`service_role`, trigger `set_updated_at`.
- `pillar_actions`: adicionar coluna opcional `plan_id uuid references pillar_action_plans(id) on delete set null` para vincular ações criadas a partir do plano (sem quebrar ações soltas existentes).

## Backend / IA

- `src/lib/action-plan.functions.ts` com `createServerFn` `suggestPillarActions` protegido por `requireSupabaseAuth`.
- Usa Lovable AI Gateway (`@/lib/ai-gateway.server`) com `google/gemini-3-flash-preview` e `generateText` + `Output.object` para devolver array tipado `{ title, description, effort: 'baixo'|'médio'|'alto' }`.
- Prompt do sistema explica o método (consertar/repor/organizar + 5W2H) e a ferramenta principal de cada pilar (mapa fixo no código, conforme o texto enviado).

## Frontend

- `src/routes/_authenticated/plano-acao.tsx` — listagem de pilares com status do plano (sem plano / ativo / concluído).
- `src/routes/_authenticated/plano-acao.$pillarId.tsx` — wizard 3 etapas (componentes locais, sem nova lib).
- Card novo no dashboard ("Próximo passo: criar plano de ação para X") apontando para o pilar mais crítico sem plano.
- Link no `AppHeader`.

## O que NÃO muda

- Autoavaliação, alertas, `recalculate_user_pillar`, `generate_pillar_alerts`, ações soltas existentes — tudo continua. O plano é uma camada acima que **gera** ações na tabela já existente.

## Pergunta antes de implementar

1. **Ações geradas pelo plano**: cada ação escolhida na etapa 2 deve virar automaticamente uma linha em `pillar_actions` (com prazo herdado do 5W2H), ou só ficam como texto dentro do plano até o usuário promover manualmente? Recomendo **virar `pillar_actions` automaticamente** para reusar todo o tracking que já existe (status, conclusão, alertas). Confirma?
