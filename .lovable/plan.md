## Diagnóstico

A rota `/autoavaliacao` existe (`src/routes/_authenticated/autoavaliacao.tsx`) e já está registrada no `routeTree.gen.ts`. O 404 + o erro de runtime `Expected to find a match below the root match in SPA mode` indicam que o navegador está rodando um bundle antigo (anterior à criação da rota), gerado antes do último build, e por isso o cliente não conhece `/autoavaliacao` e cai no `notFoundComponent`.

## Plano de correção

1. Reiniciar o dev server do Vite para forçar a regeneração do `routeTree.gen.ts` e limpar o cache do client.
2. Validar via `preview_control--get_preview_health` que o preview voltou saudável na rota `/autoavaliacao`.
3. Se o erro persistir após o restart, verificar:
   - Se `src/routeTree.gen.ts` contém de fato a entrada `AuthenticatedAutoavaliacaoRoute` (já confirmado: 13 ocorrências).
   - Se há algum erro de hidratação no console após o reload limpo.

Nenhuma alteração de código é necessária — é apenas um problema de cache do bundle servido ao navegador.
