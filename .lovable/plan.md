## Objetivo

Refazer a página `/autoavaliacao` para que cada pilar tenha:
1. **Lista de critérios objetivos** (checkboxes). Cada critério marcado vale uma fração de 10. Marcar todos = 10.
2. **Nota subjetiva** (slider 0–10) — como o usuário se sente nesse pilar.
3. **Nota final = média das duas** (subjetiva + objetiva ÷ 2), mantendo a escala 0–10 que o resto do sistema já usa (dashboard, alertas, recomendações).
4. **Pergunta de fechamento** por pilar: *"O que precisa ser consertado, reposto ou colocado no lugar para este pilar chegar a 10?"* (textarea, opcional).

> ⚠️ Você escreveu "soma das duas notas". Vou usar **média** porque o resto do app (dashboard, cores, alertas, recomendações da IA) está calibrado para 0–10. Se preferir soma literal (0–20), me avise antes da implementação.

## Etapas

### 1. Repovoar `pillar_criteria` com a lista que você passou
Migration que apaga critérios atuais e insere os 11 pilares × 4–6 critérios exatamente como você descreveu (Sono, Alimentação, Exercício, etc.), mapeando pelo nome do pilar (os IDs no banco diferem da ordem da sua lista — Saúde é 11, Contribuição é 1, etc.).

### 2. Refazer `src/routes/_authenticated/autoavaliacao.tsx`
- Carregar critérios via `useQuery` em `pillar_criteria` (ordenados por `order_index`).
- Para cada pilar (passo a passo, mantendo o wizard existente):
  - Checkboxes dos critérios (estado local `Record<criterionId, boolean>`).
  - Slider único de **percepção subjetiva** (0–10).
  - Textarea de fechamento ("O que precisa ser consertado...").
  - Exibir as três notas em tempo real: subjetiva, objetiva (`checked/total * 10`), final (média).
- Remover sliders de "comportamento / execução / frequência / interdependência".
- Navegação: Anterior / Pular / Próximo / Concluir (igual ao atual).

### 3. Persistência ao concluir
Para cada pilar, inserir em `pillar_evaluations`:
- `final_score` = média
- `subjective_score` = nota do slider
- `behavior_score` = nota objetiva (reaproveitando a coluna para guardar o lado objetivo, evitando migração nova)
- `user_comment` = texto da pergunta de fechamento

E inserir uma linha em `pillar_criteria_scores` por critério (score 10 se marcado, 0 se não). Trigger existente já recalcula `user_pillars`, alertas, etc.

### 4. Verificação
Restart do dev server + `preview_control--get_preview_health` em `/autoavaliacao`, e uma navegação Playwright marcando alguns checkboxes para confirmar que o fluxo salva.

## Detalhes técnicos
- Não mexer em `pillars`, `user_pillars`, `alerts`, nem nas funções `recalculate_user_pillar` / `generate_pillar_alerts` — elas continuam funcionando porque `final_score` continua 0–10.
- Mapeamento de IDs (banco → sua lista): 1 Contribuição, 2 Emocional, 3 Família, 4 Relacionamento, 5 Social, 6 Carreira, 7 Financeiro, 8 Intelectual, 9 Espiritualidade, 10 Lazer, 11 Saúde. O pilar **Lazer** (id 10) não aparece na sua lista de critérios — vou mantê-lo com os critérios atuais ou removê-lo do wizard. **Preciso decidir:** manter Lazer com critérios genéricos, ou ocultar Lazer da autoavaliação? (responda junto com a aprovação)
