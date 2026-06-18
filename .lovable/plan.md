# Reprocessar zips e corrigir os 11 cards da Roda

Reli `files_3.zip` e `files_4.zip`. A fonte da verdade dos pilares está em `RodaDaVidaVivaDashboard.jsx` (linhas 27–71). Comparando com `src/lib/pillars.ts`, encontrei várias divergências de ícone, texto e metadados que estão deixando os cards "errados" / incompletos.

## Divergências encontradas (zip → atual)

| # | Pilar | Ícone correto | Ícone atual | Outras correções |
|---|-------|--------------|------------|------------------|
| 1 | Contribuição e legado | 🤝 | 🌱 | mensagem: "Equilíbrio, crescer" |
| 2 | Emocional | ❤️ | 💔 | — |
| 3 | Família | 👨‍👩‍👧‍👦 | 👨‍👩‍👧 | — |
| 4 | Relacionamento amoroso | 💕 | ❤️ | — |
| 6 | Profissional e carreira | 💼 | 💼 | impactPillars usa "Familiar" (não "Família") |
| 9 | Espiritualidade e sentido | 🧘 | 🪷 | — |
| 11 | Saúde e disposição | 🏃 | 🏃 | **remover** `focus: true` (no zip só o pilar 6 é foco) |

Além disso, o zip define um campo `impact: number` (9, 6, 8, 6, 7, 10, 7, 8, 4, 4, 8) que hoje não existe — o card mostra `impactPillars.length` em vez do número real. Também há `statusCounts` fixos (balanced 4 / attention 4 / critical 2 / empty 1) e uma `nextAction` específica que vale espelhar.

## Mudanças

1. **`src/lib/pillars.ts`**
   - Adicionar `impact: number` em `Pillar`.
   - Reescrever o array `PILLARS` com ícones, mensagens, `impact` e `impactPillars` idênticos ao zip.
   - Manter `focus: true` apenas no pilar 6 (Profissional).

2. **`src/components/PillarCard.tsx`**
   - Trocar `👥 {pillar.impactPillars.length} pilares` por `👥 {pillar.impact} pilares` (número real do zip).
   - Manter o resto do visual.

3. **`src/routes/index.tsx`**
   - Ajustar a lista de prioridades para usar exatamente a do zip: Saúde, Emocional, Espiritualidade, Financeiro, Intelectual (em vez de "todos os não-balanced ordenados").
   - Manter o layout radial atual (`RadialWheel`) — o usuário já aprovou essa disposição.

## Fora do escopo

- Não alterar layout radial nem tokens de design.
- Não ativar Lovable Cloud.
- Não tocar em `RadialWheel.tsx` (posições dos cards permanecem).
