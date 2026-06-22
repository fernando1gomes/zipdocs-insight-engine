## Objetivo

Animar o **círculo central e as linhas conectoras** que ligam a roda aos cards no `RadialWheel` (dashboard `/dashboard`), **sem mexer no formato, posição ou estilo dos cards** nem no layout dos segmentos.

## Escopo

Arquivos afetados:
- `src/components/RadialWheel.tsx` — adicionar classes nas linhas/pontos conectores e no hub central.
- `src/styles.css` — novas `@keyframes` e classes utilitárias para a animação dos conectores.

Nada muda em:
- `PillarCard.tsx`, posições `CARD_POS`, tamanhos, ancoragens.
- Segmentos da roda (paths coloridos), ícones, números, valor central `{balance}%`.

## O que será animado

1. **Linhas conectoras (`<line>` tracejadas)**
   - Animar `stroke-dashoffset` em loop para criar efeito de "fluxo de energia" correndo do centro até o card (~4s, linear, infinito).
   - Opacidade pulsando suavemente entre 0.5 e 0.85.

2. **Ponto de origem no segmento (`<circle>` branco com borda colorida)**
   - Pulso sutil (scale 1 → 1.15, 2.5s ease-in-out infinito) sincronizado com o fluxo da linha.

3. **Ponto de destino no card (`<circle>` pequeno)**
   - Halo leve (opacidade 0.6 → 1, 2.5s) para indicar "recebimento".

4. **Hub central (círculo branco com o `{balance}%`)**
   - "Respiração" lenta: scale 1 → 1.025 (6s ease-in-out infinito) — bem discreto, só dá sensação de vida.
   - Halo externo opcional (anel `<circle>` extra atrás do hub) com opacidade pulsando.

5. **Respeito a `prefers-reduced-motion`**
   - Todas as animações desligadas via media query, como já é feito em `.hero-wheel-*`.

## Detalhes técnicos

Em `src/styles.css`, adicionar bloco similar ao `hero-wheel-*` existente:

```css
@keyframes wheel-connector-flow {
  to { stroke-dashoffset: -28; }
}
@keyframes wheel-connector-pulse {
  0%, 100% { opacity: .55; }
  50%      { opacity: .9; }
}
@keyframes wheel-node-pulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.15); }
}
@keyframes wheel-hub-breathe {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.025); }
}

.wheel-connector {
  animation: wheel-connector-flow 4s linear infinite,
             wheel-connector-pulse 3s ease-in-out infinite;
}
.wheel-node-origin {
  transform-box: fill-box;
  transform-origin: center;
  animation: wheel-node-pulse 2.5s ease-in-out infinite;
}
.wheel-node-end {
  animation: wheel-connector-pulse 2.5s ease-in-out infinite;
}
.wheel-hub {
  transform-box: fill-box;
  transform-origin: center;
  animation: wheel-hub-breathe 6s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .wheel-connector, .wheel-node-origin, .wheel-node-end, .wheel-hub { animation: none; }
}
```

Em `src/components/RadialWheel.tsx`:
- Adicionar `className="wheel-connector"` no `<line>` (mantendo `strokeDasharray="3 4"`).
- Adicionar `className="wheel-node-origin"` no `<circle>` de origem e `className="wheel-node-end"` no de destino.
- Adicionar `className="wheel-hub"` no `<circle>` central (`r={R_INNER - 4}`).
- Em hover de um segmento, aumentar opacidade base da linha correspondente (já existe `isHover` no escopo) — opcional, posso pausar a animação no segmento hovered para destacá-lo.

## Não-objetivos (do que **não** vou fazer)

- Não vou aplicar `card-animations.css` (flutuação rotacionada dos cards) — o pedido foi explicitamente **sem alterar o formato atual dos cards**.
- Não vou trocar para `framer-motion` nem adicionar dependências.
- Não vou substituir a roda pelo `OrganismVisualization` (canvas) nem pelo `IntegratedOrganismDashboard`.
