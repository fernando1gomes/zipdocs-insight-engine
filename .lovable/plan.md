## Animações na seção "Os 11 pilares da vida"

Adicionar três camadas de animação na seção `Pillars` de `src/components/landing/LandingPage.tsx`, disparadas por `IntersectionObserver` quando a seção entra na viewport.

### 1. Textos do cabeçalho — entrada em direções contrárias
- Eyebrow ("OS 11 PILARES DA VIDA") + título "Uma visão completa do que importa": entram da **esquerda** (translateX -40px → 0, opacity 0 → 1, 700ms, ease-out).
- Parágrafo descritivo: entra da **direita** (translateX +40px → 0, opacity 0 → 1, 700ms, ease-out, delay 120ms).

### 2. Cards dos pilares — entrada elegante escalonada
- Cada um dos 11 cards entra com fade + subida suave + leve scale (opacity 0 → 1, translateY 24px → 0, scale 0.96 → 1).
- Duração 600ms, ease cubic-bezier(.2,.7,.2,1), `stagger` de ~70ms entre cards (ordem natural da grid).

### 3. Movimento contínuo após a entrada
- Quando todos os cards terminam de entrar, ativa um "float" infinito sutil em cada card: translateY oscilando ±4px, duração 5–7s, ease-in-out, alternate infinite.
- Cada card recebe um `animation-delay` levemente diferente (baseado no índice) para que o movimento não fique sincronizado e pareça orgânico.
- Hover do card pausa o float (mantém o efeito hover atual de `-translate-y-1`).

### Acessibilidade
- Tudo respeita `@media (prefers-reduced-motion: reduce)` — sem entrada animada e sem float contínuo; conteúdo aparece direto.

### Arquivos a alterar
- `src/styles.css` — keyframes `pillars-text-in-left`, `pillars-text-in-right`, `pillar-card-in`, `pillar-card-float`; classes utilitárias e regra `prefers-reduced-motion`.
- `src/components/landing/LandingPage.tsx` — `Pillars` vira componente com `useRef` + `IntersectionObserver` que adiciona a classe `.is-visible` na seção; `PillarTile` recebe `index` para `animation-delay`. Sem mudanças em outras seções.
