## Objetivo
Substituir os emojis remanescentes do banco (`pillar.icon` string) por ícones Phosphor `weight="light"` em todas as páginas que ainda mostram emojis do sistema.

## Páginas afetadas
- `src/routes/_authenticated/impactos.tsx` (cards e detalhe)
- `src/routes/_authenticated/plano-acao.tsx`
- `src/routes/_authenticated/plano-acao_.$pillarId.tsx`
- `src/routes/_authenticated/onboarding.tsx`
- `src/routes/_authenticated/autorresponsabilidade.tsx`
- `src/routes/_authenticated/acoes.tsx`
- `src/routes/_authenticated/autoavaliacao.tsx`
- `src/routes/_authenticated/pilar.$id.tsx`
- `src/routes/_authenticated/checkin.tsx` (selects)

## Abordagem
1. Adicionar helper em `src/lib/pillars.ts`:
   ```ts
   export function iconForPillar(id: number): PillarIcon {
     return PILLAR_DEFAULTS.find(p => p.id === id)?.Icon ?? Heartbeat;
   }
   ```
2. Em cada página listada, importar `iconForPillar` e trocar trechos como `<span className="text-3xl">{p.icon}</span>` por:
   ```tsx
   {(() => { const Icon = iconForPillar(p.id); return <Icon weight="light" className="h-8 w-8 text-[color:var(--ink)]" />; })()}
   ```
   Tamanhos: `h-6 w-6` para selects/linhas, `h-8 w-8` para cards, `h-10 w-10` para destaque/detalhe.
3. Em `checkin.tsx`, os emojis estão dentro de `<option>` — não é possível renderizar SVG ali, então remover o emoji e exibir só `{p.name}` (ou prefixar com `p.short_name`).
4. Landing page (`index.tsx` + `LandingPage.tsx`) já usa Phosphor — verificar e ajustar qualquer string emoji solta que ainda exista.

## Validação
- `rg "p\.icon|pillar\.icon|def\.icon"` deve retornar apenas dentro de `pillars.ts` ou queries SQL.
- Screenshot Playwright de `/impactos`, `/plano-acao`, `/autoavaliacao`, `/onboarding`, `/checkin`, `/acoes` confirmando ícones line-art consistentes.
