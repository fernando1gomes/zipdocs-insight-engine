
# Reproduzir o dashboard "Vida em Eixo"

Ajustar o dashboard atual para bater visualmente com a imagem enviada. Mudanças apenas de UI — sem alteração de schema, server functions ou lógica de negócio.

## 1. Header (`src/components/AppHeader.tsx`)

- Itens da nav (exatamente como na imagem, em maiúsculas):
  `DASHBOARD · AUTOAVALIAÇÃO · PROGRESSO · ACOMPANHAMENTOS · PLANO · AÇÕES · CHECK-INS`
  - "Progresso" e "Acompanhamentos" ainda não têm rota — apontar para `/dashboard` por enquanto (placeholder) e marcar com `disabled`/tooltip leve, OU reusar rotas existentes (`/impactos` → "Progresso", `/autorresponsabilidade` → "Acompanhamentos"). Vou usar a segunda opção para não quebrar links.
  - Aba ativa = pílula verde sólida (bg `--primary`, texto branco) em vez do cinza atual.
- Lado direito: substituir o botão "Sair" por
  - ícone de balão de fala com contador (`MessageCircle` + badge "4") que abre `/orientadora`
  - círculo do avatar com iniciais do usuário (ex.: "SM"), que abre menu com "Sair".
- Tagline embaixo do título passa a ser fixa: "Coaching & PNL" (em uppercase, tracking largo, cor `--primary`) — alinhada ao lockup da logo na imagem.

## 2. Card de pilar (`src/components/PillarCard.tsx`)

- Título do pilar em **uppercase** com tracking largo (`text-xs font-semibold tracking-[0.14em]`).
- Layout interno: ícone grande à esquerda + nota grande (mantém), mas a coluna direita passa a mostrar **"Impacto"** + rótulo dinâmico (`Positivo` / `Importante` / `Crítico`) derivado do status:
  - balanced → "Positivo" (verde)
  - attention → "Importante" (terracota)
  - critical → "Crítico" (vermelho/terracota intensa)
- Linha inferior: mensagem curta (`Equilíbrio e conexão`, `Atenção: Melhorar saúde`, etc.). Reaproveitar `messageForScore` mas trocar os textos para o padrão da imagem (curtos, 2–4 palavras).
- Borda lateral colorida **apenas** quando status ≠ balanced (na imagem só cards em atenção/crítico ganham contorno terracota). Cards equilibrados ficam só com sombra suave.

## 3. Roda central (`src/components/RadialWheel.tsx`)

- Texto do hub: "AVALIAÇÃO GERAL" (uppercase, tracking) + número grande + folha (🌱) embaixo, no lugar de "Equilíbrio Geral" + ⚖️.
- Fonte do número grande passa a usar `var(--font-display)` (Poppins) em vez de Plus Jakarta Sans hardcoded.

## 4. Coluna direita — Prioridades & Próxima ação (`src/routes/_authenticated/dashboard.tsx`)

- **Prioridades da semana**: cada linha mostra
  - número (badge cinza-creme)
  - "Cuidar de {pilar}" em negrito + sub-texto "Prioridade: {Crítica|Alta|Média}" (em vez de "Score atual: x.x")
  - ícone do pilar dentro de um quadrado arredondado verde-suave à direita.
  - Mapear prioridade: score < 5 → Crítica; < 6.5 → Alta; resto → Média.
- Botões "+ NOVO CHECK-IN" (verde sólido, texto branco) e "🌿 MINHAS AÇÕES" (outline creme) em uppercase com tracking.
- **Próxima melhor ação**: card branco com título "PRÓXIMA MELHOR AÇÃO" + estrelinha terracota; corpo com ícone do pilar num círculo verde-suave + título da ação ("Conectar-se com a família" como fallback). Botão verde sólido "VER MINHAS AÇÕES ›" em uppercase.

## 5. Legenda (`Legend` em `dashboard.tsx`)

Adicionar duas entradas para bater com a imagem:
- "Excelente" (verde escuro `--primary`)
- "Bom" (verde claro `--balanced-soft`)
- "Atenção" (terracota `--attention`)
- "Crítico" (vermelho `--critical`)
- "Sem dados" (creme `--empty`)
- "Pouco influência" (linha tracejada cinza — usar uma small `<span>` com `border-dashed`).

`statusFromScore` ganha um novo nível interno para a UI: score ≥ 8 → "excellent" (mesmo verde escuro). A semântica de banco continua `balanced/attention/critical/empty`; o tier "excellent" é só visual e calculado no render.

## 6. Tabela "Seus pilares de maior impacto" (já existente)

- Pequenos ajustes visuais: cabeçalho em uppercase com tracking + ícone 🌿 antes do título (já tem 🌊, trocar) + linha de descrição final.
- Badge de prioridade: cores ajustadas (`Máxima` terracota intenso, `Alta` terracota suave, `Baixa` verde-suave) em vez de sempre vermelho.

## 7. Alertas

- Cabeçalho "ALERTAS (n)" em uppercase com tracking + sino terracota.
- Cada item: bullet terracota + título à esquerda + mensagem em coluna do meio + botão "Resolver" outline verde à direita (já existe — ajustar paddings/typography).

## 8. Arquivos a editar

- `src/components/AppHeader.tsx` — nav + avatar/chat badge.
- `src/components/PillarCard.tsx` — novo layout (uppercase, "Impacto Positivo", borda condicional).
- `src/components/RadialWheel.tsx` — hub central (Avaliação Geral + 🌱) e fonte.
- `src/routes/_authenticated/dashboard.tsx` — `PrioritiesCard`, `NextActionCard`, `Legend`, `ImpactPrioritiesBlock`, `AlertsPanel`.
- `src/lib/pillars.ts` — atualizar `messageForScore` para frases curtas no padrão da imagem; adicionar helper `priorityFromScore` (Crítica/Alta/Média) e `impactLabelFromScore` (Positivo/Importante/Crítico).

Sem mudanças em rotas novas, schema, migrations ou lógica de IA.

## 9. Validação

1. Build automático.
2. Playwright em `/dashboard` (viewport 1280×1800): screenshot comparando com a imagem — confere nav uppercase verde, cards com "Impacto Positivo/Importante", hub "AVALIAÇÃO GERAL 68% 🌱", legenda com 6 itens, prioridades com ícone do pilar à direita.
