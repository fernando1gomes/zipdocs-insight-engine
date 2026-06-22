
# Redesign editorial premium — Vida em Eixo

Reescreve a landing `/` no estilo da referência (paleta verde-escuro `#2D4A3E` + dourado `#C9A962` + off-white `#F8F6F1`, Playfair Display + Inter), e **substitui o retrato no hero pela RadialWheel completa** (com os cards flutuantes e o hub central pulsando, exatamente o componente que já existe — só com a paleta atualizada para combinar com o tema premium).

## Escopo

- Apenas a landing pública (`/`) e os tokens visuais globais.
- O painel interno (`/dashboard` etc.) herda automaticamente os novos tokens, mas seus layouts não serão retrabalhados.
- Sem mudanças de backend, dados, rotas ou autenticação.

## Mudanças por arquivo

### 1. `src/styles.css` — paleta + tipografia

- Substituir paleta (light) por:
  - `--background: #F8F6F1`, `--foreground: #2C2C2C`, `--muted-foreground: #6B6B6B`
  - `--card: #FFFFFF`, `--border: #E8E6E1`, `--input: #D4D4D4`
  - `--primary: #2D4A3E`, `--primary-foreground: #F8F6F1`
  - `--accent: #C9A962`, `--accent-foreground: #2D4A3E`
  - `--ring: #C9A962`
- Tokens de status reescritos para combinar com a paleta premium (continuam usados pelos cards da RadialWheel):
  - `--balanced: #2D4A3E`, `--balanced-soft: #DCE5DA`
  - `--attention: #C9A962`, `--attention-soft: #F2E8CF`
  - `--critical: #B5483A`, `--critical-soft: #F2D9D2` (terracota suave, dentro do tom editorial)
  - `--focus: #2D4A3E`, `--focus-soft: #E8E2D2`
  - `--empty: #B8B4AA`, `--empty-soft: #E8E6E1`
- `.dark` ajustado como espelho escuro (fundo `#1F352C`, texto `#F8F6F1`) só para não quebrar partes do app que dependem dele.
- Fontes: `--font-display: "Playfair Display", serif;` e `--font-sans: "Inter", sans-serif;` (carregadas via `<link>` no root — item 2).
- Tokens `.landing-*` reescritos: `--landing-bg: #F8F6F1`, `--landing-bg-soft: #FFFFFF`, `--landing-ink: #2C2C2C`, `--landing-ink-soft: #6B6B6B`, `--landing-gold: #C9A962`, `--landing-gold-deep: #B8984F`, `--landing-line: #E8E6E1`.
- Botões `.landing-cta*` reformulados (radius 4px, padding 16px 32px, sem sombras pronunciadas):
  - default → bg `#2D4A3E`, texto `#F8F6F1`, hover `#1F352C`.
  - `.landing-cta-gold` → bg `#C9A962`, texto `#2D4A3E`, hover `#B8984F`.
  - `.landing-cta-ghost-gold` (CTA do hero sobre o verde) → bg transparente, borda 1px `#C9A962`, texto `#C9A962`, hover bg `#C9A962` + texto `#2D4A3E`.
- **Animações mantidas intactas**: `wheel-hub-breathe`, `wheel-hub-halo`, `wheel-card-float`, `wheel-connector-flow` e as `hero-wheel-*`. Vão ser reusadas tal como estão.

### 2. `src/routes/__root.tsx`

- Adicionar no `head()` os `<link rel="preconnect">` para `fonts.googleapis.com` / `fonts.gstatic.com` e o stylesheet `https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap`.
- Nada mais é alterado.

### 3. `src/components/landing/LandingPage.tsx` — reescrita estrutural

Componentes removidos (não estão na referência premium): `Differentiators`, `Testimonials`, `FAQSection`, `PillarsSection` em grid de 11, `HeroWheel` (a versão SVG simplificada). `DEMO_PILLARS` permanece (já existe).

- **`LandingNav`** — sobreposta ao hero verde. Logo "VIDA em EIXO" em Playfair branco com "em" itálico dourado. Links `SOBRE / METODOLOGIA / SOBRE A RODA / CONTATO` em Inter 12px tracking 0.2em `#F8F6F1`, hover dourado.
- **`Hero`** — fundo `#2D4A3E`, `min-h-[88vh]`, grid 2 colunas (texto à esquerda 45%, roda à direita 55% para caber bem):
  - Eyebrow dourado fininho `METODOLOGIA VIDA EM EIXO`.
  - Headline Playfair 56px `#F8F6F1` `"Transforme sua vida em um sistema que funciona"`.
  - Traço dourado 48×1px.
  - Subheadline Inter 18px `#F8F6F1`/80% `"A metodologia completa para você sair do estado atual para o estado desejado, equilibrando os 11 pilares da sua vida."`.
  - CTA `.landing-cta-ghost-gold` `"COMECE SUA JORNADA"` → `/auth`.
  - **Coluna direita: a `RadialWheel` real**, com `DEMO_PILLARS` e `balance={68}`, dentro de uma cápsula com fundo `#F8F6F1` (a roda precisa de fundo claro para os cards e o hub funcionarem). Cápsula: `bg-[color:var(--landing-bg)]`, `rounded-3xl`, `p-6 lg:p-10`, borda 1px `#C9A962`/30%, sombra suave editorial. Isso preserva 100% das animações existentes (hub pulsando, halo, cards flutuando, conectores). Como a paleta de status (`balanced/attention/critical`) já foi reescrita no item 1 (verde / dourado / terracota), a roda fica naturalmente alinhada ao novo tema — sem editar `RadialWheel.tsx`.
  - Em mobile (`<md`): o hero empilha em 1 coluna; a roda aparece abaixo do texto. Em telas muito estreitas, escondemos a roda (`hidden sm:block`) e mostramos um pequeno selo "Roda da Vida" como placeholder, porque a RadialWheel precisa de largura mínima para ler bem.
- **`LifeWheelSection`** (substitui a antiga `DashboardPreview`) — fundo `#F8F6F1`. Mantém o texto editorial da referência (eyebrow `SUA VIDA, EM EQUILÍBRIO`, título `"Uma visão completa de quem você é."`, parágrafo cinza), porém **sem repetir a roda completa** (já está no hero). No lugar, mostra a **lista dos 4 estágios** que aparecem ao lado da roda da referência:
  - `RECONHEÇA / DEFINA / TRACE PLANOS / EQUILIBRE`, cada um com ícone Phosphor line-art dourado, título Inter 600 14px tracking 0.12em verde, descrição Inter 14px cinza.
  - CTA `.landing-cta` `"AVALIE SUA RODA DA VIDA"` → `/auth`.
- **`Methodology`** (substitui `HowItWorks`) — fundo `#F8F6F1`:
  - Eyebrow dourado `METODOLOGIA VIDA EM EIXO`. Título Playfair 42px `"Um caminho estruturado para resultados reais."`. Parágrafo de apoio em coluna ao lado.
  - 4 cards (`md:grid-cols-2 lg:grid-cols-4`): fundo `#FFFFFF`, borda `#E8E6E1`, radius 8px, padding 32px, hover `box-shadow: 0 4px 20px rgba(0,0,0,0.08)`.
  - Numeral Playfair 24px dourado; ícone Phosphor line-art verde 48px (`Compass`, `MapTrifold`, `Mountains`, `ChartLineUp`); título Inter 600 16px tracking 0.14em; descrição Inter 14px `#6B6B6B`:
    - `01 DIAGNÓSTICO E CLAREZA` — "Entenda onde você está hoje e o que precisa mudar para chegar onde deseja."
    - `02 PLANO PERSONALIZADO` — "Criamos um plano estratégico alinhado aos seus objetivos e valores."
    - `03 AÇÃO COM FOCO` — "Você entra em ação com método, foco e acompanhamento contínuo."
    - `04 RESULTADOS E EVOLUÇÃO` — "Celebre conquistas, ajuste a rota e continue evoluindo com consistência."
- **`LandingFooter`** — fundo `#2C2C2C`, 4 colunas:
  - Coluna 1: logo "VIDA em EIXO" branco, tagline Inter `#F8F6F1`/70%, assinatura cursiva dourada `"Sua vida. Seu eixo. Suas escolhas."` (Playfair itálico).
  - Coluna 2 (NAVEGAÇÃO): SOBRE / METODOLOGIA / SOBRE A RODA / CONTATO.
  - Coluna 3 (CONTATO): email, whatsapp, "Atendimentos online" com ícones Phosphor light dourados.
  - Coluna 4 (SIGA NO INSTAGRAM): `@vidaemeixo` + ícones circulares (Instagram, YouTube, LinkedIn) com borda dourada.
  - Copyright centralizado em Inter 11px `#F8F6F1`/50%.

### 4. `src/components/RadialWheel.tsx`

**Não será editado.** A paleta nova (item 1) já reaproveita os tokens `balanced/attention/critical/focus`, então o visual da roda fica automaticamente em verde + dourado + terracota suave, sem código novo.

## Detalhes técnicos

- Cores expressas como `#hex` direto nos custom properties (CSS aceita; shadcn consome via `var(--primary)`). Os blocos `oklch(...)` antigos serão substituídos.
- `routeTree.gen.ts` **não** será editado (auto-gerado).
- Sem novos assets de imagem (não vamos gerar foto editorial).
- Container `max-w-6xl`, padding `px-6 md:px-12 lg:px-16`, espaçamento entre seções `py-24 md:py-32`.

## Arquivos tocados

- Editados: `src/styles.css`, `src/routes/__root.tsx`, `src/components/landing/LandingPage.tsx`
- Não tocados: `src/components/RadialWheel.tsx` (herda paleta dos tokens)
