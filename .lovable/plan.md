## Problema

Durante a autoavaliação, se a página recarrega (ou o app reinicia) no meio do processo, todo o progresso é perdido e o usuário volta ao primeiro pilar. Hoje o estado vive só em `useState` — nada é persistido.

## Solução: persistir o progresso localmente e retomar de onde parou

Salvar automaticamente o rascunho da autoavaliação em `localStorage` (por usuário) a cada mudança, e ao abrir a página recuperar:
- O pilar atual (step)
- Os critérios marcados de cada pilar
- A nota subjetiva de cada pilar
- O comentário de cada pilar

### Mudanças em `src/routes/_authenticated/autoavaliacao.tsx`

1. Definir uma chave de storage por usuário: `autoavaliacao:draft:<userId>`.
2. Ao montar (depois que `pillars` e o usuário carregarem), ler o rascunho do `localStorage` e popular `step` + `state`.
3. Em um `useEffect`, sempre que `step` ou `state` mudar, gravar o rascunho.
4. Mostrar um aviso discreto no topo quando um rascunho foi restaurado, com botão "Recomeçar do zero" (limpa o rascunho e reseta o state).
5. Ao concluir com sucesso (`submitAll` terminar OK), apagar o rascunho do `localStorage`.
6. Pequeno banner: "Seu progresso é salvo automaticamente neste dispositivo."

### Notas técnicas

- Persistência apenas client-side (localStorage) — simples, sem migração de banco, e suficiente para o caso de reload/crash do app. Funciona offline e no mesmo navegador/dispositivo.
- Chave por `user.id` para não vazar entre contas no mesmo navegador.
- Não persistir após submit bem-sucedido para não reabrir um rascunho velho.

### Fora de escopo

- Sincronizar rascunho entre dispositivos (exigiria nova tabela `pillar_evaluation_drafts`). Posso adicionar depois se quiser retomar em outro device.
