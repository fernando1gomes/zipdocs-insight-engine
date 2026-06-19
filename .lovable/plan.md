
# Rebranding: "Vida em Eixo"

Renomear o SaaS de "Roda da Vida Viva" para **Vida em Eixo** e aplicar a nova paleta em todo o sistema (landing + área logada).

## 1. Nome do produto

Substituir todas as ocorrências do nome antigo ("Roda da Vida Viva" / "Roda da Vida") pelo novo nome **Vida em Eixo** nos seguintes pontos:

- Título da aba (meta `<title>`) — landing, dashboard, todas as rotas em `src/routes/_authenticated/*` e `src/routes/__root.tsx`.
- Cabeçalho do app (`src/components/AppHeader.tsx`) — logo/wordmark.
- Landing page (`src/components/landing/LandingPage.tsx`) — hero, headline, footer, CTAs.
- Tela de auth (`src/routes/auth.tsx`).
- Onboarding (`src/routes/_authenticated/onboarding.tsx`).
- Tagline sugerida: *"Transforme equilíbrio em ação."*

Não alterar nomes técnicos (tabelas, rotas, IDs, chaves de query).

## 2. Nova paleta de cores

Aplicar via tokens semânticos em `src/styles.css` (sem `text-white`/`bg-[#...]` hardcoded em componentes). Tokens em **oklch** equivalentes aos hex pedidos:

| Papel | Hex | Token |
|---|---|---|
| Base / Estrutura ("Eixo") | `#1B263B` | `--primary` (modo claro: usado em headers, navegação, textos fortes) |
| Ação / Energia | `#FB8500` | `--accent` (CTAs, check-ins, alertas de ação) |
| Equilíbrio / Sucesso | `#2D6A4F` | `--balanced` (progresso, scores saudáveis, feedback positivo) |
| Clareza / Fundo | `#F8F9FA` | `--background` (planos de fundo, áreas de leitura) |
| Tinta principal | derivado de `#1B263B` | `--foreground` |

### Mapeamento detalhado (modo claro)

- `--background`: `#F8F9FA` (off-white).
- `--foreground`: `#1B263B` (azul profundo) — texto principal.
- `--primary`: `#1B263B` / `--primary-foreground`: `#F8F9FA` — botões primários, headers, links de navegação.
- `--accent`: `#FB8500` / `--accent-foreground`: `#FFFFFF` — usado nos CTAs principais da landing e botões "Novo check-in", "Criar ação".
- `--balanced`: `#2D6A4F` + `--balanced-soft` (verde claro derivado) — mantém o uso atual em scores/legenda da Roda da Vida.
- `--attention`: laranja mais suave derivado do `--accent` (ex.: `#FFB266`) para diferenciar de "ação" pura.
- `--critical`: vermelho atual (mantido) — saúde do sistema/alertas críticos não devem confundir com "ação".
- `--focus`: variação fria do azul profundo (ex.: `#415A77`) para "foco estratégico".
- `--muted` / `--secondary` / `--border`: tons de cinza-gelo derivados do off-white.

### Modo escuro

- `--background`: `#0F1A2C` (azul profundo mais escuro).
- `--foreground`: `#F8F9FA`.
- `--primary`: tom claro do azul para contraste (ex.: `#A8C0E0`); `--primary-foreground`: `#1B263B`.
- `--accent`: `#FB8500` mantido (alta vibração já funciona no escuro); `--accent-foreground`: `#1B263B`.
- `--balanced`: `#52B788` (verde mais claro para legibilidade).

### Landing page

A landing usa tokens próprios em `.landing-root` (em `src/styles.css`) que já derivam de `--primary`, `--foreground`, `--background`. Como a paleta global muda, a landing se ajusta automaticamente — apenas confirmar:

- `--landing-gold` (hoje `var(--primary)`) passa a apontar para `--accent` (`#FB8500`) para preservar o papel visual de "destaque dourado/quente" nos CTAs e na roda animada do hero.
- `--landing-bg`, `--landing-ink`, `--landing-line` permanecem ligados aos tokens globais.

### Roda da Vida (interna e landing)

A roda usa as cores semânticas (`--balanced`, `--attention`, `--critical`, `--focus`, `--empty`). Com os novos tokens, ela passa a mostrar:
- Verde sálvia para pilares equilibrados.
- Laranja vibrante para pilares que pedem ação.
- Vermelho para crítico.
- Azul profundo (`--focus`) para foco estratégico.

Nenhuma alteração de componente é necessária — só os valores dos tokens.

## 3. Detalhes técnicos

Arquivos a editar:

- `src/styles.css` — atualizar `:root`, `.dark` e o bloco `.landing-root` (ajuste de `--landing-gold`).
- `src/components/landing/LandingPage.tsx` — substituir nome em copy/CTAs/meta.
- `src/components/AppHeader.tsx` — wordmark.
- `src/routes/__root.tsx` — `<title>` e meta description padrão.
- `src/routes/_authenticated/dashboard.tsx`, `auth.tsx`, `onboarding.tsx` e demais rotas com `head().meta.title` contendo o nome antigo — atualizar para "Vida em Eixo".

Itens explicitamente fora de escopo:
- Lógica de negócio, schema do banco, server functions.
- Renomear classes CSS, variáveis técnicas, rotas ou tabelas.
- Mudar tipografia (Plus Jakarta Sans + Inter mantidas).

## 4. Validação

Após implementar:
1. Build automático (sem erros de Tailwind/oklch).
2. Verificar a landing (`/`) e o dashboard (`/dashboard`) via Playwright: screenshots em desktop confirmando paleta nova, nome atualizado no header e CTAs em laranja sobre base azul profundo.
3. Conferir contraste (texto sobre `--accent` e `--primary`).
