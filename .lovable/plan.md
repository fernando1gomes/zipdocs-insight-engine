## Objetivo

Na página `/` (landing), adicionar a mesma composição visual do `/dashboard` — roda central com conectores tracejados, 11 cards ao redor, hub respirando, conectores fluindo e cards flutuando — usando **dados fictícios de demonstração**, sem buscar nada do backend.

## Onde colocar

- Substituir o `<HeroWheel />` atual dentro do hero do `LandingPage.tsx` por uma nova seção `<HeroRadialDemo />` que renderiza o componente `RadialWheel` já existente, em modo "showcase".
- Mantém todo o resto da landing inalterado (textos, CTAs, demais seções, footer).

## Como

1. **Reaproveitar `RadialWheel`** (sem fork): ele já tem todas as animações (`wheel-connector`, `wheel-node-*`, `wheel-hub`, `wheel-hub-halo`, `wheel-card-float`).
2. **Dataset fictício** dentro do `LandingPage.tsx`: array `DEMO_PILLARS: Pillar[]` com 11 itens, scores variados (alguns balanced, alguns attention, alguns critical) para que as cores da roda mostrem a paleta inteira. Nomes/mensagens neutros e claramente ilustrativos (ex.: "Saúde", "Carreira", "Família" etc., com `message` curto tipo "exemplo").
3. **Equilíbrio fictício**: passar `balance={72}` fixo.
4. **Hover desativado**: passar `hovered={null}` e `onHover={() => {}}` (sem estado), já que é decorativo.
5. **Wrapper responsivo**: a `RadialWheel` usa largura máxima 1120px e aspect 1120/760. Na landing, envolver em um container que limita a largura ao slot do hero (ex.: `max-w-[680px]` em telas grandes) preservando o aspect ratio nativo do componente para os cards continuarem nas posições corretas.

## Pontos de atenção

- O `RadialWheel` posiciona cards com coordenadas absolutas baseadas em um canvas 1120×760, então ele já é responsivo (tudo em %). Só precisa de um container com largura razoável; em telas muito estreitas vai ficar apertado — aceitável para landing desktop. Para mobile vou esconder o demo (`hidden md:block`) e manter o atual `HeroWheel` simples como fallback mobile.
- Nenhuma chamada ao Supabase: dados 100% locais, fixos no módulo.
- Sem mudanças de CSS — as animações já existem em `src/styles.css`.

## Arquivos afetados

- `src/components/landing/LandingPage.tsx` — adicionar `DEMO_PILLARS`, novo componente `HeroRadialDemo`, e trocar o uso de `HeroWheel` por `HeroRadialDemo` no slot do hero (com fallback mobile para `HeroWheel`).

## Não-objetivos

- Não mexer em outras seções da landing.
- Não criar nova rota, não tocar no backend, não alterar `RadialWheel` nem `PillarCard`.
- Não alterar as animações existentes.
