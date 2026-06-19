
# Aplicar Identidade Visual "Vida em Eixo"

Aplicar o guia de identidade visual enviado (paleta, tipografia, logomarca e ícones dos pilares) em todo o sistema — landing e área logada.

## 1. Nova paleta de cores

Substituir os tokens atuais em `src/styles.css` pelos hex do guia, convertidos para oklch:

| Papel | Hex | Uso | Token |
|---|---|---|---|
| Verde Sálvia Profundo (Primária) | `#4A7C59` | Botões primários, headers, links | `--primary` |
| Verde Aloe Suave (Secundária) | `#8FB996` | Acentos calmos, badges, hover | `--balanced` / `--secondary` |
| Creme/Linho (Fundo) | `#F5F1E8` | `--background` da landing e do app | `--background` |
| Terracota Suave (Destaque) | `#D4A574` | CTAs, check-ins, alertas de ação | `--accent` |
| Azul Petróleo (Texto/Acento) | `#2C4A52` | Texto principal, headings | `--foreground` |

Demais tokens derivados:
- `--card`: branco puro (`#FFFFFF`) para contraste suave sobre o creme.
- `--muted`: derivação clara do creme; `--muted-foreground`: azul petróleo a 65%.
- `--border` / `--input`: tom mais escuro do creme (`color-mix` creme + azul petróleo).
- `--ring`: terracota (`--accent`).
- `--balanced`: verde sálvia (`#4A7C59`); `--balanced-soft`: verde aloe (`#8FB996`).
- `--attention`: terracota mais clara; `--critical`: vermelho atual mantido para alertas críticos.
- `--focus`: azul petróleo (`#2C4A52`); `--empty`: cinza-creme.
- Modo escuro: fundo `#1F3036` (derivado do azul petróleo), texto creme, primária verde aloe (`#8FB996`) para contraste, acento terracota mantido.

### Landing (`.landing-root`)
- `--landing-gold` → `--accent` (terracota) — preserva o destaque quente dos CTAs e da roda animada.
- `--landing-bg` → creme; `--landing-ink` → azul petróleo. Já derivam dos tokens globais, nada a alterar manualmente.

## 2. Tipografia

Trocar o par atual (Plus Jakarta Sans + Inter) por **Poppins** (títulos) + **Lato** (corpo) conforme o guia:

- Atualizar `<link>` do Google Fonts em `src/routes/__root.tsx`:
  `https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Lato:wght@300;400;700&display=swap`
- Em `src/styles.css` (`@theme`): `--font-display: "Poppins"`, `--font-sans: "Lato"`.

## 3. Logomarca

Usar a logomarca do guia como ícone do app:

- Subir o arquivo `icone.png` (anexado) como asset via `lovable-assets` → `src/assets/vida-em-eixo-logo.png.asset.json`.
- Em `src/components/AppHeader.tsx`: exibir o ícone (32–40px) ao lado do wordmark "Vida em Eixo" (Poppins SemiBold, cor azul petróleo). Tagline opcional pequena: "11 Pilares · Equilíbrio · Transformação".
- Em `src/components/landing/LandingPage.tsx`: substituir o logotipo/wordmark do topo pelo ícone + nome. No hero, manter a roda animada existente (já tematizada via tokens), mas o ícone aparece no header da landing.
- Atualizar `favicon` em `src/routes/__root.tsx` para apontar para a mesma imagem (ou variante 32×32).

## 4. Ícones dos 11 pilares

O guia sugere ícones temáticos (coração+pulso, cérebro, casa, alvo, etc.). O projeto já usa ícones `lucide-react` em `src/lib/pillars.ts`. Vou:

- Revisar o mapeamento atual em `src/lib/pillars.ts` e ajustar para se aproximar do guia (ex.: Saúde Física → `HeartPulse`, Saúde Mental → `Brain`, Relacionamentos → `Users` ou `HeartHandshake`, Família → `Home`, Carreira → `Target`, Finanças → `TrendingUp`, Desenvolvimento → `BookOpen`, Espiritualidade → `Flower2`/`Lotus`, Lazer → `Music`, Ambiente → `Home`+folha (`Sprout`), Contribuição → `HandHeart`).
- Esses ícones já herdam a cor primária via tokens, então nenhuma cor hardcoded é necessária.
- Não vou gerar SVGs customizados (manter Lucide para consistência com o resto do app).

## 5. Arquivos a editar

- `src/styles.css` — novos valores oklch para `:root` e `.dark`; troca de `--font-display`/`--font-sans`.
- `src/routes/__root.tsx` — link do Google Fonts (Poppins + Lato) e favicon.
- `src/components/AppHeader.tsx` — adicionar ícone da logo ao lado do nome.
- `src/components/landing/LandingPage.tsx` — header da landing com ícone; conferir que copy/CTAs continuam legíveis na nova paleta.
- `src/lib/pillars.ts` — ajustar ícones Lucide para alinhar ao guia.
- Asset novo: `src/assets/vida-em-eixo-logo.png.asset.json` (via `lovable-assets create` a partir de `/mnt/user-uploads/icone.png`).

Fora de escopo: lógica de negócio, schema, server functions, nomes técnicos, criação de SVGs customizados para os pilares.

## 6. Validação

1. Build automático (sem erros de Tailwind/oklch nem fonte).
2. Playwright em `/` e `/dashboard`: screenshot confirmando fundo creme, headers em azul petróleo, CTAs terracota, logo no header e tipografia Poppins/Lato.
3. Conferir contraste WCAG do texto azul petróleo sobre creme e do branco sobre terracota/verde.
