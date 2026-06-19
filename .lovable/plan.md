Criar um novo item de menu **Autorresponsabilidade** (entre Autoavaliação e Plano), abrindo uma jornada interativa em 7 telas chamada **Espelho da Autorresponsabilidade**, que ao final gera/atualiza um plano de ação para o pilar escolhido e leva o usuário para o wizard de Plano de Ação.

## Mudanças

### 1. Menu (`src/components/AppHeader.tsx`)
- Inserir novo link `Autorresponsabilidade` (rota `/autorresponsabilidade`) logo após `Autoavaliação` e antes de `Plano`.

### 2. Nova rota `src/routes/_authenticated/autorresponsabilidade.tsx`
Página única com estado de etapa (1→7), header próprio e barra de progresso/pontuação.

- **Tela inicial (intro)**: título "Espelho da Autorresponsabilidade", subtítulo "Pare de culpar. Comece a transformar.", frase motivacional e botão "Começar minha análise".
- **Tela 1 – Escolher pilar**: lê `user_pillars` + `pillars` (via `usePillars`/supabase), lista os pilares com menor `current_score` no topo, mostra nota. Campo "Qual é o resultado real que você está colhendo nesse pilar?" (textarea).
- **Tela 2 – Meu plantio**: grid de 12 cards de comportamentos (Omissão, Desorganização, Falta de disciplina, Falta de conversa, Mágoa, Medo, Orgulho, Impulsividade, Falta de estudo, Vitimismo, Procrastinação, Crença limitante) com seleção múltipla + textarea "Minha parte nisso foi...".
- **Tela 3 – Quebrado / Faltando / Fora do lugar**: três blocos com exemplos sugeridos como chips clicáveis (que preenchem o textarea) + três textareas. Frase de impacto ao final.
- **Tela 4 – Troca de desculpas por poder**: cards (10 desculpas listadas no briefing), ao escolher uma aparece a pergunta de conversão correspondente e um textarea.
- **Tela 5 – Minha decisão**: textarea com modelo pré-preenchido ("Eu reconheço que, no pilar X, minha nota atual é consequência..."). Substituições automáticas (`pilar`, `quebrado`, `faltando`, `fora do lugar`).
- **Tela 6 – Ação de 24 horas**: textarea "Qual ação prática você fará nas próximas 24 horas?".
- **Tela 7 – Conclusão**: mostra resumo, selo "Eu Assumo", pontuação total (10+20+30+30+40=130) e dois botões: "Salvar e voltar" e "Transformar em Plano de Ação".

Botões "Voltar" / "Próxima" em todas as etapas. Pontuação somada conforme etapa concluída.

### 3. Persistência
Nova migração: tabela `autorresponsabilidade_sessions` com `id`, `user_id`, `pillar_id`, `current_score`, `result_text`, `behaviors text[]`, `behaviors_reflection`, `broken_text`, `missing_text`, `misplaced_text`, `excuse`, `excuse_decision`, `commitment`, `action_24h`, `score int`, `completed_at`, `created_at`, `updated_at`. RLS por `auth.uid()=user_id`, GRANTs para `authenticated` e `service_role`, trigger `set_updated_at`.

Ao concluir (Tela 7 → "Salvar e voltar"): insert na tabela.

### 4. Integração com Plano de Ação
Ao clicar **Transformar em Plano de Ação**:
- `upsert` em `pillar_action_plans` para o `pillar_id` escolhido com:
  - `broken_text`, `missing_text`, `misplaced_text` (telas 3)
  - `what` = `commitment` (tela 5)
  - `why` = `result_text` (tela 1)
  - `how` = `action_24h` (tela 6)
  - `when_start` = hoje, `status = 'active'`
- Também salva a sessão como no item 3.
- Navega para `/plano-acao/$pillarId` (o wizard já carrega o plano existente e exibe os textos preenchidos).

### 5. Detalhes técnicos
- Tudo client-side com `supabase` direto (mesmo padrão de `plano-acao_.$pillarId.tsx` e `autoavaliacao.tsx`); sem novos server functions.
- `createFileRoute("/_authenticated/autorresponsabilidade")` com `head()` próprio (title e description).
- Cards/chips usam classes `bg-secondary`/`bg-primary text-primary-foreground` para selecionado (tokens existentes), sem cores hardcoded.
- Não alterar wizard de plano existente — ele já consome `broken/missing/misplaced/what/why/how` da tabela.

### Validação
- Build deve passar.
- Navegar /autorresponsabilidade, concluir as 7 etapas e verificar que `/plano-acao/$pillarId` abre com campos pré-preenchidos.