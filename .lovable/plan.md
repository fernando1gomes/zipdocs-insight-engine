A rota `/_authenticated/autorresponsabilidade` está corretamente declarada e registrada no `routeTree.gen.ts`, mas o preview está com um estado de hidratação travado ("Invariant failed: Expected to find a match below the root match in SPA mode"), o que faz cair no fallback 404. Isso costuma acontecer quando o servidor de desenvolvimento ficou com o route tree antigo em memória após a criação do novo arquivo de rota.

## Ação

- Reiniciar o servidor de desenvolvimento do Vite (`code--restart_dev_server`) para forçar a recarga do novo route tree.
- Em seguida, verificar a saúde do preview e confirmar que `/autorresponsabilidade` renderiza o Espelho da Autorresponsabilidade em vez do 404.

Não há mudança de código necessária — apenas reset do dev server.