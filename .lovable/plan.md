## Redesign premium da landing — referência "Vida em Eixo Proposta Premium"

Aplicar nova identidade visual (verde-escuro profundo + dourado, Playfair Display + Inter, layout editorial espaçoso) replicando a estrutura da imagem de referência.

### Paleta (tokens em `src/styles.css`)

- `--background: #F8F6F1` (off-white principal)
- `--primary: #1A3A3A` (verde-escuro profundo do hero/footer/CTA)
- `--accent: #C9A227` (dourado dos botões, divisores e detalhes)
- `--ink: #2D3436` (texto principal)
- `--ink-soft: #636E72` (texto secundário)
- `--card: #FFFFFF`
- `--line: #E8E4DD` (bordas suaves)
- `--landing-*` tokens reescritos para esses valores; remover oklch antigos

### Tipografia

- `--font-display: "Playfair Display"` (h1, h2, números 01–04, logo "VIDA em EIXO")
- `--font-sans: "Inter"` (body, navegação, CTAs, labels)
- Carregar via `<link>` no `src/routes/__root.tsx` (preconnect + Playfair 400/600/700 italic + Inter 400/500/600)
- Headlines grandes (~64px desktop), corpo 16px, hierarquia clara

### Espaçamentos

- Container max-width `1200px`
- Padding vertical de seção: `96px` (desktop) / `64px` (mobile)
- Gap entre cards: `24–32px`
- Padding interno de cards: `32px`
- Header altura ~`76px`

### Estrutura do `LandingPage.tsx` (rewrite completo)

1. **Nav (`LandingNav`)** — fundo verde-escuro `#1A3A3A`, logo "VIDA em EIXO" em Playfair (EM em itálico dourado), links uppercase Inter 500 espaçados (SOBRE · METODOLOGIA · DEPOIMENTOS · CONTATO), CTA "ENTRAR" dourado outline à direita. Fixed top.

2. **Hero** — fundo `#1A3A3A`, grid 55/45:
   - Esquerda: traço dourado curto, h1 Playfair branco "Transforme sua vida em um sistema que funciona", subcopy off-white 80%, botão "COMECE SUA JORNADA" outline dourado
   - Direita: imagem de uma mulher (gerada via imagegen — coaching/profissional, luz natural, blusa clara, ambiente sofisticado)

3. **Roda da Vida (`LifeWheelSection`)** — fundo `#F8F6F1`, grid 3 colunas:
   - Coluna esquerda: eyebrow dourado "SUA VIDA, EM EQUILÍBRIO", h2 Playfair "Uma visão completa de quem você é.", parágrafo, botão verde-escuro "AVALIE SUA RODA DA VIDA"
   - Coluna central: `RadialWheel` em modo `variant="editorial"` — segmentos com stroke verde-escuro fino (1.5px), conectores dourados sutis, sem preenchimento de status, hub branco com texto "VIDA EM EIXO" em Playfair dourado, ícones Phosphor light verdes nos 8 pilares principais visíveis
   - Coluna direita: 4 itens (RECONHEÇA / DEFINA / TRACE PLANOS / EQUILIBRE) com ícone dourado linear, título Inter 600 e descrição
   - Mantém os 11 pilares no domínio mas exibe 8 rótulos ao redor (para casar com a referência)

4. **Metodologia (`Methodology`)** — fundo `#F8F6F1`, eyebrow "METODOLOGIA VIDA EM EIXO", h2 Playfair "Um caminho estruturado para resultados reais.", parágrafo à direita, grid de 4 cards brancos com:
   - Número Playfair dourado "01"–"04" (48px)
   - Ícone Phosphor light dourado centralizado
   - Título uppercase Inter 600 ("DIAGNÓSTICO E CLAREZA", "PLANO PERSONALIZADO", "AÇÃO COM FOCO", "RESULTADOS E EVOLUÇÃO")
   - Descrição curta centralizada
   - Borda `#E8E4DD`, radius 4px, hover shadow sutil

5. **Footer** — fundo `#1A3A3A`, 4 colunas:
   - Logo + tagline + assinatura em itálico dourada
   - NAVEGAÇÃO (links)
   - CONTATO (email, whatsapp, online)
   - SIGA NO INSTAGRAM (handle + ícones sociais dourados outline)
   - Linha inferior com copyright centralizado

### Remoções

- Remover `DashboardPreview`, `PillarsSection` (grid de 11 cards), `HowItWorks` (substituído por Methodology), `Differentiators`, `Testimonials`, `FAQSection`, `FinalCTA`, `HeroWheel` antigo.

### `RadialWheel.tsx`

- Adicionar prop opcional `variant?: "default" | "editorial"`
- `editorial`: stroke verde `#1A3A3A` 1.5px, conectores dourados `#C9A227` 1px, sem fill de status, sem badges de impacto, hub branco com Playfair "VIDA em EIXO", ícones Phosphor light verdes
- `default`: comportamento atual intacto (dashboard interno usa esse)

### Assets

- Gerar `src/assets/hero-portrait.jpg` (imagegen premium) — retrato editorial de mulher profissional, luz natural, blusa branca/clara, ambiente sofisticado interior com plantas, expressão serena

### Arquivos editados

- `src/styles.css` — paleta + tokens + classes `.landing-cta`, `.landing-cta-gold-outline`, `.landing-cta-solid`
- `src/routes/__root.tsx` — fonts via `<link>`
- `src/components/landing/LandingPage.tsx` — rewrite completo
- `src/components/RadialWheel.tsx` — adicionar `variant` editorial
- `src/assets/hero-portrait.jpg` — novo (imagegen)

### Fora de escopo

- Páginas internas (`/auth`, dashboard, etc.) permanecem sem alteração visual nesta etapa
- Sem mudanças no schema ou backend
