## Nova área: Impactos (Mapa de Impacto dos Pilares)

Adicionar uma nova seção entre Autoavaliação e Autorresponsabilidade, com dados estáticos de interdependência entre os 11 pilares, integrações com Autoavaliação, Dashboard, Autorresponsabilidade e Plano.

### 1. Dados de impacto (nova fonte)

Criar `src/lib/impacts.ts` com a estrutura completa fornecida pelo usuário:

```ts
export type Intensity = "forte" | "medio" | "leve";
export type Influence = "muito_alto" | "alto" | "medio_alto" | "medio" | "baixo";

export interface PillarImpactRow {
  pillarShortName: string;  // referencia Pillar.shortName
  intensity: Intensity;
  reason: string;
}

export interface PillarImpactData {
  pillarId: number;            // mesmo id de PILLAR_DEFAULTS
  directCount: number;         // ex: 9
  influence: Influence;
  influenceWeight: number;     // 4, 3, 2.5, 2, 1
  impacts: PillarImpactRow[];
  ifImproves: string[];
  ifWorsens: string[];
}

export const PILLAR_IMPACTS: PillarImpactData[] = [ ...11 pilares... ];
export function getImpact(pillarId: number): PillarImpactData | undefined;
export function influenceLabel(i: Influence): string;
export function intensityLabel(i: Intensity): string;
```

Todos os 11 conjuntos de dados (Saúde, Intelectual, Emocional, Realização/Propósito, Financeiro, Família, Relacionamento, Social, Espiritualidade, Carreira, Contribuição) preenchidos exatamente conforme o briefing, mapeando os nomes para `shortName` existentes em `src/lib/pillars.ts`.

Observação: o atual `PILLAR_DEFAULTS.impact`/`impactPillars` continua existindo (usado em outros cards), mas a nova área usa `PILLAR_IMPACTS` como fonte de verdade da interdependência.

### 2. Nova rota `/impactos`

Arquivo: `src/routes/_authenticated/impactos.tsx` (autenticada, mesmo padrão das demais).

Layout (mesmo estilo visual do projeto — `AppHeader`, cards arredondados, tokens semânticos):

1. **Cabeçalho** — título "Mapa de Impacto dos Pilares" + subtítulo e parágrafo introdutório.
2. **Grid de cards de pilares** (responsivo, 2–4 colunas). Cada card:
   - Ícone + nome
   - Nota atual (de `usePillars()`)
   - "Impacta: N pilares"
   - Tag de influência colorida
   - Estado selecionado destacado
3. **Painel de detalhe** (renderiza abaixo do grid quando há pilar selecionado):
   - Cabeçalho com nome, nota, impacta, influência
   - Texto explicativo curto
   - **Tabela** de pilares impactados: Pilar | Intensidade (tag) | Por que impacta
   - **Efeito dominó**: dois cards lado a lado — "Se melhorar" / "Se piorar" (listas com bullets)
   - **Card "Agora olhe para sua parte"** com botões:
     - "Ir para Autorresponsabilidade" → `/autorresponsabilidade?pillarId={id}`
     - "Criar Plano de Ação" → `/plano-acao?pillarId={id}` (ou rota `/plano-acao/$pillarId` existente, se aplicável)
4. **Texto final** + botão "Escolher um pilar para transformar agora" (scroll ao grid).

Seleção via search param `?pillar=<id>` para suportar deep-link vindo da Autoavaliação e do Dashboard.

### 3. Item de menu

Editar `src/components/AppHeader.tsx`: inserir `<Link to="/impactos">Impactos</Link>` entre Autoavaliação e Autorresponsabilidade.

### 4. Integração com Autoavaliação

Em `src/routes/_authenticated/autoavaliacao.tsx`, adicionar um card discreto logo abaixo do título do pilar atual:

```
Impacto deste pilar
Este pilar impacta diretamente N áreas da sua vida, especialmente A, B, C e D.
[Ver impactos deste pilar →]
```

Botão navega para `/impactos?pillar=<id>`. Dados vêm de `PILLAR_IMPACTS`. Card discreto (borda suave, sem cor primária forte) para não competir com a avaliação.

### 5. Integração com Dashboard

Em `src/routes/_authenticated/dashboard.tsx`, adicionar bloco "Seus pilares de maior impacto agora" após a conclusão da autoavaliação (mostrar apenas quando existir pelo menos um `user_pillars.current_score > 0`).

Cálculo:
```
score = (10 - nota_atual) * influenceWeight
```
Pesos: muito_alto=4, alto=3, medio_alto=2.5, medio=2, baixo=1. Considerar apenas pilares com nota > 0. Ordenar desc e pegar top 3.

Render: card com tabela Pilar | Nota | Impacta | Prioridade (Máxima/Alta/Média baseada na posição), mensagem explicativa e botão "Ver Mapa de Impactos" → `/impactos`.

### 6. Autorresponsabilidade e Plano (contexto do pilar)

Aceitar `?pillarId=` (ou search param equivalente já existente) em `/autorresponsabilidade` e `/plano-acao` e pré-selecionar o pilar quando presente. Mudança mínima: ler o search param e setar o estado inicial; sem alterar lógica de negócio.

### 7. Atualizar `routeTree.gen.ts`

Gerado automaticamente pelo plugin — não editar manualmente.

### Detalhes técnicos / convenções

- **Tags de intensidade** (utilitário em `impacts.ts`):
  - forte → `bg-[color:var(--critical-soft)] text-[color:var(--critical)]`
  - medio → `bg-[color:var(--attention-soft)] text-[color:var(--attention)]`
  - leve → `bg-secondary text-muted-foreground`
- **Tags de influência**: usar tokens semânticos existentes; sem cores hardcoded.
- **Sem mudanças de schema**: tudo client-side a partir de `usePillars()` + dados estáticos.
- **Acessibilidade**: cards com `<button>`, foco visível, `aria-pressed` no card selecionado.
- **SEO**: `head()` na rota com título "Mapa de Impacto dos Pilares" e descrição curta.

### Arquivos afetados

- novo: `src/lib/impacts.ts`
- novo: `src/routes/_authenticated/impactos.tsx`
- editar: `src/components/AppHeader.tsx` (novo link)
- editar: `src/routes/_authenticated/autoavaliacao.tsx` (card "Impacto deste pilar")
- editar: `src/routes/_authenticated/dashboard.tsx` (bloco "Maior impacto agora")
- editar: `src/routes/_authenticated/autorresponsabilidade.tsx` (ler `?pillarId`)
- editar: `src/routes/_authenticated/plano-acao.tsx` (ler `?pillarId`)
- auto: `src/routeTree.gen.ts`
