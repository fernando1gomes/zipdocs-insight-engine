Substituir o `HeroWheel` SVG (atualmente um radar de pontos dourados) por uma **donut wheel** visualmente igual à do dashboard (`RadialWheel`), mas em versão hero — sem os cards externos nem conectores.

### O que muda

Apenas a função `HeroWheel` em `src/components/landing/LandingPage.tsx`.

### Nova versão

- Donut SVG com os 11 segmentos coloridos por status (`balanced` / `attention` / `critical`), usando os tokens já existentes (`--balanced`, `--attention`, `--critical`) — mesmas cores do interior.
- Cada segmento mostra o **ícone do pilar** no meio e um **badge numérico** (1–11) próximo à borda interna, idêntico ao `RadialWheel`.
- Hub central branco com:
  - rótulo "Equilíbrio Geral"
  - porcentagem grande (calculada via `overallBalance(PILLAR_DEFAULTS)`)
  - emoji ⚖️
- Stroke branco entre os segmentos.
- Sem cards laterais, sem linhas conectoras (mantém o hero limpo).
- Sombra/halo suave atrás da roda usando `--landing-bg-soft`.

### Detalhes técnicos

- Reutiliza `PILLAR_DEFAULTS`, `statusFromScore`, `overallBalance` de `@/lib/pillars` (já importado).
- ViewBox quadrado 420×420 com R_OUTER=170 / R_INNER=80 (escala para o container responsivo `max-w-[420px]`).
- Mesma fórmula de arcos do `RadialWheel` (segDeg = 360/11, pilar 1 no topo).
- Cores via `var(--balanced)` etc., que continuam disponíveis no escopo da `.landing-root`.

### Arquivos

- editar `src/components/landing/LandingPage.tsx` — substituir o corpo da função `HeroWheel`.

Nenhum outro arquivo é alterado.