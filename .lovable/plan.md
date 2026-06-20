# Substituir emojis por ícones de linha elegantes

A referência usa ícones de linha finos, monocromáticos (verde sálvia / terracota), no estilo Lucide — não emojis coloridos. Vou trocar todos os emojis dos pilares por componentes `lucide-react` renderizados com `currentColor`, herdando a cor do contexto (verde no hub/equilibrado, terracota no atenção/crítico, branco dentro dos segmentos da roda).

## 1. `src/lib/pillars.ts`

- Trocar o campo `icon: string` (emoji) por `icon: LucideIcon` importado de `lucide-react`.
- Mapeamento por pilar (alinhado à referência):
  1. Contribuição → `HandHeart`
  2. Emocional → `Brain` (a referência usa cérebro para mental/emocional)
  3. Família → `Users` / `HeartHandshake`
  4. Relacionamento amoroso → `Heart`
  5. Social e amizades → `Users2`
  6. Profissional e carreira → `TrendingUp`
  7. Financeiro → `LineChart` / `PiggyBank`
  8. Intelectual → `BookOpen`
  9. Espiritualidade → `Flower2` (lótus)
  10. Lazer → `Music2`
  11. Saúde → `HeartPulse`
- Manter assinatura de `mergeWithDefaults` e demais helpers intactos.

## 2. `src/components/PillarCard.tsx`

- Em vez de `<span className="text-2xl">{pillar.icon}</span>`, renderizar `<pillar.icon className="h-6 w-6" style={{ color: meta.num }} strokeWidth={1.75} />`.
- Cor herdada do status (verde/terracota/vermelho) — sem mais emojis coloridos.

## 3. `src/components/RadialWheel.tsx`

- Substituir `<text>{p.icon}</text>` dentro do segmento por um ícone SVG do Lucide. Como o `icon` agora é um componente React, renderizar **fora** do `<svg>` num overlay absoluto (mais simples) ou usar `<foreignObject>` dentro do SVG. Vou usar overlay absoluto: para cada pilar, posicionar `<div>` com o `<Icon />` nas coordenadas `(ix, iy)` já calculadas, traduzido em %.
- Cor: branco (`text-white`) dentro do segmento, stroke 1.75.
- Substituir o emoji 🌱 do hub por `<Sprout />` (lucide) em verde `--primary`, posicionado absolutamente sobre o hub.
- Manter números e a estrutura da roda.

## 4. Outros pontos onde aparecem emojis de pilar

Buscar e ajustar usos secundários (caso existam) em `dashboard.tsx`:
- "Próxima melhor ação" e "Prioridades" usam `pillar.icon` — agora recebem um componente, então renderizar `<Icon className="h-5 w-5 text-[color:var(--primary)]" />` dentro do quadrado verde.
- Sino de alertas: trocar emoji 🔔 (se houver) por `<Bell />` terracota.
- Estrela "PRÓXIMA MELHOR AÇÃO": `<Star />` terracota.
- 🌿 no header da tabela de impacto: `<Leaf />` verde.

## 5. Arquivos a editar

- `src/lib/pillars.ts` — tipo + imports lucide + mapping.
- `src/components/PillarCard.tsx` — render do ícone.
- `src/components/RadialWheel.tsx` — overlay de ícones nos segmentos + hub.
- `src/routes/_authenticated/dashboard.tsx` — usos de `pillar.icon` e emojis decorativos.
- `src/components/LifeWheel.tsx` — se usar `pillar.icon`, ajustar também.

Sem mudanças em rotas, schema, server functions ou lógica.

## 6. Validação

- Build automático.
- Playwright em `/dashboard` (1280×1800): screenshot conferindo que os ícones agora são de linha verde sálvia / terracota, sem emojis coloridos, alinhados ao visual da referência.
