
## Landing page pública para Roda da Vida Viva

### Objetivo
Transformar `/` numa página de vendas que apresenta o produto para visitantes não logados, mantendo o fluxo atual para quem já tem conta.

### Mudança de roteamento
Hoje `/` (`src/routes/index.tsx`) redireciona sempre para `/auth`, `/onboarding` ou `/dashboard`. Vou alterar para:
- Se houver sessão → continua redirecionando (sem onboarding? checa avaliações; com avaliações → `/dashboard`; sem → `/onboarding`).
- Se NÃO houver sessão → renderiza a nova `LandingPage` (sem redirecionar para `/auth`).

O botão "Entrar" no header da landing leva para `/auth`; CTAs principais ("Começar agora") também vão para `/auth`.

### Estrutura da página (single route, várias seções)
1. **Nav minimalista** — logo "🌱 Roda da Vida Viva" + link "Entrar" + botão "Começar agora".
2. **Hero** — headline forte ("Veja sua vida inteira em uma só imagem"), subheadline sobre autoavaliação + efeito dominó, CTA primário "Começar agora — é gratuito", visual de roda radial estilizada à direita (reaproveitando estética do `RadialWheel`, versão estática SVG).
3. **Os 11 pilares** — grid responsivo com card por pilar (ícone, nome, frase curta). Dados vindos de `src/lib/pillars.ts`.
4. **Como funciona** — 4 passos com números: Autoavaliação → Impactos → Plano → Check-in, cada um com 1-2 linhas explicando.
5. **Diferenciais** — 3 blocos: "Efeito dominó", "Autorresponsabilidade ativa", "IA orientadora" — com ícones e descrições curtas.
6. **Depoimentos** — 3 cards fictícios/genéricos (nome + frase) em layout de citações.
7. **FAQ** — accordion (componente `ui/accordion` já existe) com 5 perguntas: "É grátis?", "Preciso fazer tudo de uma vez?", "Como a IA me ajuda?", "Meus dados são privados?", "Quanto tempo leva?".
8. **CTA final** — bloco grande centralizado com frase "Nenhum pilar da vida muda sozinho. Comece o seu efeito dominó hoje." + botão "Criar minha Roda gratuita".
9. **Footer** — créditos curtos + link para `/auth`.

### Direção visual (sereno e introspectivo)
Paleta semântica nova só na landing (sem mexer no app autenticado):
- Background base: `#F0EBE3` (bege claro) com gradientes suaves para branco.
- Texto principal: `#1B2A41` (azul noite).
- Texto secundário: `#3E5C76`.
- Accent/CTAs: `#C9A86A` (dourado suave) com hover mais profundo.
- Tipografia: usa as fontes já carregadas no root (`Plus Jakarta Sans` para headlines, `Inter` para corpo).
- Estilo: muito whitespace, tipografia grande, cantos `rounded-2xl`, sombras suaves, sem gradientes vibrantes. Linhas finas em dourado para divisores.

Não vou criar novos tokens globais para evitar contaminar o tema do app. Tokens locais ficam dentro do componente da landing usando classes Tailwind + cores em variáveis CSS escopadas em uma `<section className="landing-root">` com `:where(.landing-root) { --landing-bg: ...; }` em `styles.css`.

### SEO
`head()` da rota `/` com:
- `<title>` "Roda da Vida Viva — Veja, entenda e transforme sua vida inteira"
- meta description focada em autoavaliação + efeito dominó
- `og:title`, `og:description`, `og:type=website`, `og:url=/`
- canonical `/`

### Arquivos a editar/criar
- **editar** `src/routes/index.tsx` — passa a renderizar componente `<LandingPage />` para visitantes não logados; logado redireciona como hoje. Adiciona `head()`.
- **criar** `src/components/landing/LandingPage.tsx` — composição das seções.
- **criar** `src/components/landing/sections/Hero.tsx`, `PillarsSection.tsx`, `HowItWorks.tsx`, `Differentiators.tsx`, `Testimonials.tsx`, `FAQ.tsx`, `FinalCTA.tsx`, `LandingNav.tsx`, `LandingFooter.tsx` — uma seção por arquivo para manter cada um pequeno.
- **editar** `src/styles.css` — adiciona um bloco escopado `.landing-root { ... }` com as variáveis de cor da landing (não afeta app autenticado).

### Notas técnicas
- Index continua `ssr: false` para permitir checar sessão sem prerender 401. Componente renderiza `<LandingPage />` por padrão e dispara `useEffect` que checa `supabase.auth.getUser()` para redirecionar usuários logados (ou faz o check em `beforeLoad` retornando `null` quando não houver sessão).
- Nenhuma alteração em rotas autenticadas, header do app, ou lógica de Impactos/Pilares.
- Reaproveita `accordion`, `button` shadcn já instalados; não precisa instalar pacotes.
