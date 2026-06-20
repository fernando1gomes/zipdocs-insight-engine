# Substituir emojis por ícones SVG line-art (Phosphor + Lucide)

Trocar todos os emojis nativos do site por componentes de ícones SVG minimalistas e consistentes. Biblioteca principal: **Phosphor Icons** (`@phosphor-icons/react`) com `weight="light"`. Lucide segue como complemento para casos sem equivalente Phosphor.

## 1. Dependências

- Instalar `@phosphor-icons/react` via `bun add`.
- Manter `lucide-react` (já instalado) para fallbacks pontuais.

## 2. Mapeamento de pilares (`src/lib/pillars.ts`)

Substituir os componentes Lucide atuais (do passo anterior) por Phosphor `weight="light"`. O campo `Icon: LucideIcon` vira `Icon: React.ComponentType<{ className?: string; size?: number; weight?: string }>` (genérico). Mapeamento final:

| # | Pilar | Ícone Phosphor |
|---|---|---|
| 1 | Contribuição e legado | `HandHeart` |
| 2 | Emocional / Saúde mental | `Brain` |
| 3 | Família | `House` |
| 4 | Relacionamento amoroso | `Heart` |
| 5 | Social e amizades | `UsersThree` |
| 6 | Profissional e carreira | `Target` |
| 7 | Financeiro | `ChartLineUp` |
| 8 | Intelectual / Desenvolvimento | `BookOpen` |
| 9 | Espiritualidade | `FlowerLotus` |
| 10 | Lazer | `MusicNotes` |
| 11 | Saúde física | `Heartbeat` |

Padrão de renderização: `<Icon weight="light" size={20} />` com cor herdada via `style={{ color: ... }}` ou classe Tailwind. Para a roda, `color="white"`. Todos os arquivos que já usam `pillar.Icon` continuam funcionando sem mudanças, apenas trocando os componentes em `pillars.ts`.

## 3. Atualizar `src/lib/impacts.ts`

Hoje cada item tem `icon: string` (emoji). Adicionar campo paralelo `Icon: ComponentType` mapeando para o mesmo Phosphor do pilar correspondente, **mantendo** o `icon: string` por compatibilidade com lugares ainda não migrados (ex.: `<option>` em selects). Atualizar `dashboard.tsx → ImpactPrioritiesBlock` para renderizar `<it.impact.Icon weight="light" className="inline h-4 w-4 mr-1" />` em vez do emoji string concatenado.

## 4. Emojis decorativos avulsos

Trocar 1-a-1 por Phosphor `weight="light"`:

- `src/routes/auth.tsx` (🌱 logo placeholder) → `Plant` em verde primário.
- `src/components/LifeWheel.tsx` (⚖️ no hub) → `Sprout` (consistência com o RadialWheel atual).
- `src/components/landing/LandingPage.tsx`:
  - 🌊 → `Waves`
  - 🧭 → `Compass`
  - ✨ → `Sparkle`
  - ✓ ✓ ✓ (3 checks) → `CheckCircle` (`weight="light"`)
  - ⚖️ (hub do svg) → trocar `<text>` por `<foreignObject>` com `<Sprout />`
- `src/routes/_authenticated/pilar.$id.tsx` (✨) → `Sparkle`.
- `src/routes/_authenticated/orientadora.tsx` (💬) → `ChatCircleDots`.
- `src/routes/_authenticated/autorresponsabilidade.tsx` (🏅) → `Medal`.

## 5. Convenções de estilo

- Sempre `weight="light"` (Phosphor) ou `strokeWidth={1.5–1.75}` (Lucide) para manter o traço fino.
- Tamanho padrão: ícones em texto/linha = 16-20px; cards e destaques = 24px; hero = 40-48px.
- Cor sempre via `currentColor` ou variável CSS do status (`--primary`, `--accent`, `--attention`, `--critical`). Nunca cor hardcoded.
- Os emojis em `<option>` de `<select>` (checkin.tsx, acoes.tsx) **não** serão trocados porque não aceitam React — manter `pillar.icon: string` para esses casos.

## 6. Arquivos a editar

- `src/lib/pillars.ts` — trocar imports Lucide por Phosphor.
- `src/lib/impacts.ts` — adicionar campo `Icon` Phosphor.
- `src/routes/_authenticated/dashboard.tsx` — usar `it.impact.Icon` na tabela de impacto + ajustar imports (já usa Lucide para Bell/Leaf/etc.; migrar para Phosphor `Bell`, `Leaf`, `Lightbulb`, `Star`, `Target`, `Sparkle`).
- `src/components/PillarCard.tsx` — usar `weight="light"` (a API muda: trocar `strokeWidth` por `weight`).
- `src/components/RadialWheel.tsx` — idem; `Sprout` Phosphor no hub.
- `src/components/LifeWheel.tsx` — `<foreignObject>` com Phosphor icon; trocar ⚖️ por `Sprout`.
- `src/components/landing/LandingPage.tsx` — Waves/Compass/Sparkle/CheckCircle/Sprout.
- `src/components/AppHeader.tsx` — caso tenha emoji ou `MessageCircle` Lucide, migrar para Phosphor `ChatCircleDots`.
- `src/routes/auth.tsx`, `src/routes/_authenticated/pilar.$id.tsx`, `orientadora.tsx`, `autorresponsabilidade.tsx` — substituições pontuais.

## 7. Validação

- Build automático.
- Playwright em `/dashboard`, `/`, `/auth`, `/orientadora`, `/autorresponsabilidade`: screenshots confirmando que não restou emoji visual e o estilo line-art está consistente.
