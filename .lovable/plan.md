## Problema

Acessar `/plano-acao` mostra 404. A causa é o conflito de rota pai/filho no roteamento file-based do TanStack: existem dois arquivos irmãos — `plano-acao.tsx` (lista) e `plano-acao.$pillarId.tsx` (wizard). Quando há um filho dinâmico, o TanStack trata `plano-acao.tsx` como **layout** e exige um `index` explícito para servir o path exato `/plano-acao`. Sem o index, a URL exata cai no `notFoundComponent` do root → 404.

## Correção

1. **Renomear** `src/routes/_authenticated/plano-acao.tsx` → `src/routes/_authenticated/plano-acao.index.tsx` e atualizar a chamada para `createFileRoute("/_authenticated/plano-acao/")` (rota index).
2. **Criar** novo `src/routes/_authenticated/plano-acao.tsx` mínimo como layout: apenas `createFileRoute("/_authenticated/plano-acao")` + `component: () => <Outlet />`.
3. Manter `plano-acao.$pillarId.tsx` intacto — ele agora renderiza dentro do `<Outlet />` do layout.
4. O TanStack regenera `routeTree.gen.ts` automaticamente.

## Nada mais muda

Componentes da lista, do wizard, server function, migrations e tipos permanecem iguais. É puramente um ajuste de estrutura de rotas.
