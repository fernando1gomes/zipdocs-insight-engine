## Objetivo

Aplicar o novo sistema de design "Vida em Eixo" (premium, clean, Stratejoy-style) na landing (`/`) e nos tokens globais, **sem mexer em rotas internas autenticadas** nem na lógica do app. O `RadialWheel` (com hub respirando + cards flutuando) que já está na seção "Prévia do painel" continua intacto — só passa a viver dentro da nova linguagem visual.

## Escopo

- **Sim:** `src/styles.css` (tokens novos + dark mode), `src/components/landing/LandingPage.tsx` (re-skin completo), `src/routes/__root.tsx` (favicon/title/meta já OK — não tocar a não ser por reset de fonte).
- **Não:** `RadialWheel`, `PillarCard`, dashboard, onboarding, backend, animações existentes (hub/halo/float/connector), tipos de dados.

## Sistema de design (em `src/styles.css`)

Adiciona um bloco de tokens da landing (escopado em `:root` e `.dark`) — não substitui os tokens shadcn do app, evita regressão no dashboard.

```text
--ve-primary:        #2b5a4a   (verde principal)
--ve-primary-deep:   #214538   (hover)
--ve-accent:         #d4806d   (coral, warmth)
--ve-ink:            #2c2c2a   (texto principal)
--ve-ink-soft:       #5f5e5a
--ve-muted:          #888780   (subtítulos)
--ve-bg:             #ffffff
--ve-bg-soft:        #f8f8f6
--ve-line:           #d3d1c7   (border 0.5px)
--ve-shadow-sm: 0 2px 4px  rgba(0,0,0,.08)
--ve-shadow-md: 0 4px 12px rgba(0,0,0,.08)
--ve-shadow-lg: 0 8px 24px rgba(0,0,0,.10)
--ve-radius-md: 8px
--ve-radius-lg: 12px
--ve-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
```

Dark mode (`.dark` ou `@media (prefers-color-scheme: dark)`):
```text
--ve-bg:      #14161a
--ve-bg-soft: #1b1e22
--ve-ink:     #ececea
--ve-ink-soft:#b8b6af
--ve-muted:   #888780
--ve-line:    #2a2d32
--ve-primary: #4a8a76   (acessibilidade AA em fundo escuro)
--ve-accent:  #e09b87
```

Regras globais aplicadas só dentro de `.landing-root`:
- `font-family: var(--ve-font)`
- `font-weight: 400` base; `h1/h2/h3` = `500` (nunca 600/700)
- Tamanhos: `h1 52px / 1.1`, `h2 36px / 1.2`, `h3 24px / 1.3`, body `16px / 1.7`
- `border-width: .5px` em utilitários da landing (`.ve-card`, `.ve-btn-outline`)
- Toda transição CSS limitada a `200–300ms cubic-bezier(.2,.7,.2,1)`
- `@media (prefers-reduced-motion: reduce)` desliga `transform/opacity` animações decorativas (mantém hub respirando estático)

Componentes utilitários novos:
- `.ve-btn` (verde sólido), `.ve-btn-outline` (border .5px verde, fundo transparente) — padding `14px 32px`, radius `12px`, focus ring visível
- `.ve-card` — `bg var(--ve-bg)`, border `.5px solid var(--ve-line)`, radius `12px`, padding `1rem 1.25rem`, `--ve-shadow-sm` em hover
- `.ve-eyebrow` — subtítulo `var(--ve-muted)`, sentence case, sem CAPS

## Estrutura da landing (re-skin de `LandingPage.tsx`)

```text
<div class="landing-root">                  ← raiz com tokens + fonte
  <StickyNav>                                ← novo
    logo · 4 links (Como funciona · Pilares · Depoimentos · Perguntas) · CTA "Inicie sua jornada"
  </StickyNav>

  <Hero>                                     ← refeito
    eyebrow: "Autoconhecimento integrado"
    h1 (52px, sentence case, weight 500):
      "Veja sua vida inteira *em uma só imagem.*"   ← itálico, sem bold
    parágrafo (max 700px, 16/1.7, ve-ink-soft)
    2 CTAs: [Inicie sua jornada] (verde) · [ver como funciona] (outline)
    visual: HeroWheel atual (sem alterar SVG)
  </Hero>

  <StatsStrip>                               ← novo: 3 números-chave
    "11 pilares" · "10 min para começar" · "100% gratuito"
    números grandes (weight 500), legendas em ve-muted
  </StatsStrip>

  <DashboardPreview>                         ← mantido; só troca classes pra ve-card/tokens
    "Prévia do painel · dados ilustrativos"
    <RadialWheel ... />   ← intacto, animações preservadas
  </DashboardPreview>

  <Method>                                   ← era HowItWorks; 4 ve-cards
    h2 "Quatro passos, uma vida *clareada.*"
    cards: 01 Autoavaliação · 02 Impactos · 03 Plano · 04 Check-in
  </Method>

  <Pillars>                                  ← grade 3 col, ve-cards minimalistas
    h2 "Sua vida não é uma lista. *É um sistema vivo.*"
    11 itens; ícone Phosphor + nome + 1 linha
  </Pillars>

  <Differentiators>                          ← 3 colunas, fundo ve-bg-soft (não preto)
    sem inversão dark hard-coded; respeita tema
  </Differentiators>

  <Testimonials>                             ← 3 cards com aspa coral, nome ve-muted
  </Testimonials>

  <CentralCTA>                               ← faixa com fundo ve-primary
    h2 branco + 1 CTA secundária outline
  </CentralCTA>

  <FAQ>                                       ← Accordion existente, re-skin .ve-card
  </FAQ>

  <Footer>                                    ← minimalista, 1 linha + newsletter opt-in
  </Footer>
</div>
```

Regras de conteúdo:
- Toda label que estava em CAPS / `uppercase` vira **sentence case** (`Como funciona`, `Pilares`, etc.).
- Ênfase via `<em>` (itálico), nunca `<strong>` ou bold extra.
- Por seção: **máximo 2 CTAs**. CTAs com copy emocional ("Inicie sua jornada", "Faça sua roda agora") — sem "Saiba mais".
- Largura de copy: container `max-w-[700px]`.
- Espaçamento vertical: `py-20 md:py-28` (≥80px) entre seções.

## Acessibilidade & performance

- Contraste verificado: ve-ink em ve-bg = 13:1; ve-ink-soft em ve-bg = 7:1; verde primário texto em branco = 6.4:1 (AA pass).
- Focus ring: `outline: 2px solid var(--ve-primary); outline-offset: 2px` em links/botões da landing.
- `loading="lazy"` em qualquer `<img>` exceto logo do nav.
- Sem novas fontes web (system stack) → sem bloqueio de FCP.

## Arquivos afetados

- `src/styles.css` — adiciona bloco de tokens `--ve-*`, utilitários `.ve-*`, regras escopadas em `.landing-root`, dark mode.
- `src/components/landing/LandingPage.tsx` — reescrita das seções (mesma estrutura de exports), reusa `RadialWheel`, `HeroWheel`, `PILLAR_DEFAULTS`, `Accordion`. Sticky nav nova.

## Não-objetivos

- Não tocar em `RadialWheel`, animações `wheel-*`, dashboard, rotas autenticadas, schema, server functions.
- Não criar novas rotas (links do nav rolam para âncoras `#metodo`, `#pilares`, `#depoimentos`, `#perguntas`).
- Não trocar a fonte do app inteiro — apenas a landing.
