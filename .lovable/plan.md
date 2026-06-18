## O que muda

Hoje os cards estão em duas colunas laterais + grid embaixo. A referência mostra os 11 cards **distribuídos em volta da roda**, cada um alinhado ao seu segmento e ligado por uma linha tracejada com um pequeno ponto no segmento.

Vou reconstruir o layout do dashboard para reproduzir esse arranjo radial, mantendo todo o conteúdo já existente (pilares, scores, prioridades, próxima ação, legenda, dica).

## Layout alvo

```text
┌───────────────────────────────────────────────────────────────────────┐
│ 🌱 Roda da Vida Viva                                                   │
│   subtítulo                                  [Novo check-in] [Criar]   │
├──────────────────────────────────────────┬────────────────────────────┤
│                                          │  🎯 Prioridades da semana  │
│     [11]      [1]      [2]               │  1. ...                    │
│        ╲      │      ╱                   │  2. ...                    │
│  [10] ─── ╔══ROD A══╗ ─── [3]            │  ...                       │
│           ║   73%   ║                    │  [Criar ação rápida]       │
│  [9]  ─── ╚════════╝ ─── [4]             │  [Revisar planos]          │
│        ╱      │      ╲                   │  [Ver foco da semana]      │
│     [8]      [7][6]    [5]               │                            │
│                                          │  ⭐ Próxima melhor ação    │
│                                          │  [Agendar agora]           │
├──────────────────────────────────────────┴────────────────────────────┤
│ Legenda: ● Equilibrado ● Atenção ● Crítico ● Sem dados ◎ Foco | 💡 Dica│
└───────────────────────────────────────────────────────────────────────┘
```

Distribuição dos 11 cards seguindo a imagem (sentido horário a partir do topo): 1 topo, 2 topo-direita, 3 direita-cima, 4 direita-baixo, 5 baixo-direita, 6 baixo-centro-dir, 7 baixo-centro-esq, 8 baixo-esquerda, 9 esquerda-baixo, 10 esquerda-cima, 11 topo-esquerda.

## Detalhes técnicos

- Criar `src/components/RadialWheel.tsx`: container `relative` com a `<LifeWheel>` centralizada e os 11 `<PillarCard>` posicionados via `position: absolute` usando coordenadas pré-definidas (um array `[{id, top%, left%, anchor: 'tl'|'tr'|'bl'|'br'}]` mapeando cada pilar à sua âncora). Anchor controla `transform: translate(-100%,0)` etc. para que o card "saia" do lado certo em direção à roda.
- Dentro da `<LifeWheel>` SVG, adicionar linhas tracejadas (`stroke-dasharray`) saindo da borda externa de cada segmento em direção ao card, terminando num pequeno círculo (ponto de conexão). As linhas se desenham no SVG mesmo, indo até a borda do container do wheel; a aparência de "conectar ao card" é dada porque o card está posicionado logo após o ponto final.
- Reescrever `src/routes/index.tsx`:
  - Grid 2 colunas no desktop: esquerda = `<RadialWheel>` (com altura fixa ~720px e largura fluida), direita = coluna com `PrioridadesCard` + `NextActionCard`.
  - Remover o grid extra de cards embaixo (`rest.map`).
  - Mover `Legend` e `TipCard` para uma faixa horizontal no rodapé (lado a lado), espelhando a referência.
- Em telas menores (`lg:` abaixo), cair para layout empilhado: roda no topo (sem cards absolutos — vira grid 2 colunas de PillarCards abaixo da roda), depois prioridades, depois próxima ação, depois legenda/dica. Detecção via classes Tailwind (`hidden lg:block` para a versão radial, `lg:hidden` para a versão empilhada).
- Não alterar `pillars.ts`, `PillarCard.tsx` (apenas talvez deixar variante mais compacta via prop `compact` se necessário para caber).
- Sem mudanças em backend/dados — puramente visual.

## Arquivos afetados

- novo: `src/components/RadialWheel.tsx`
- edita: `src/routes/index.tsx`
- edita (pequeno, opcional): `src/components/LifeWheel.tsx` para adicionar as linhas conectoras tracejadas
- edita (opcional): `src/components/PillarCard.tsx` para suportar prop `compact`

## Fora de escopo

- Ativar Lovable Cloud / persistência (continua mock).
- Editar/criar novos pilares ou ações.
- Mudar paleta ou tipografia.
