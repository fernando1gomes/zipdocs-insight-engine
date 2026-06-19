## Diagnóstico

A rota `/impactos` está corretamente implementada e registrada:

- Arquivo existe: `src/routes/_authenticated/impactos.tsx`
- Já consta em `src/routeTree.gen.ts` (imports, `FileRoutesByFullPath`, etc.)
- Uma chamada `curl http://localhost:8080/impactos` direto no sandbox retorna **HTTP 200** com o título correto `"Mapa de Impacto dos Pilares — Roda da Vida Viva"` no HTML.

Ou seja, o código está correto — o que o navegador do usuário está exibindo (a tela "404 / Page not found") é o `defaultNotFoundComponent` do TanStack Router, provavelmente porque o dev server / a aba do preview ficou com o estado antigo do router de antes do arquivo `impactos.tsx` ser criado.

## Correção

1. Reiniciar o dev server do Vite (`code--restart_dev_server`) para garantir que o `routeTree.gen.ts` mais novo seja servido e o HMR pegue o novo arquivo de rota.
2. Confirmar com um `curl` ao endpoint `/impactos` que segue retornando 200 com o conteúdo correto.
3. Pedir ao usuário para dar um hard refresh (Ctrl/Cmd+Shift+R) no preview e validar visualmente.

Nenhuma alteração de código é necessária — apenas o restart do servidor de desenvolvimento.
