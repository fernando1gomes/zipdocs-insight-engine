## Sugestão de vídeos com aprovação

Permitir que qualquer usuário autenticado sugira vídeos do YouTube para um pilar. As sugestões ficam pendentes até um admin aprovar ou recusar. Quando aprovada, a sugestão vira um vídeo público em `/videos`.

### Banco de dados

Nova tabela `video_suggestions`:
- `pillar_id`, `title`, `youtube_id`, `expert_name`, `description`
- `suggested_by` (uuid do usuário)
- `status`: `pending` | `approved` | `rejected` (default `pending`)
- `reviewed_by`, `reviewed_at`, `rejection_reason`
- `approved_video_id` (referência ao registro criado em `expert_videos` quando aprovado)
- `created_at`, `updated_at`

RLS:
- Usuário autenticado pode `INSERT` (com `suggested_by = auth.uid()`).
- Usuário vê apenas as **próprias** sugestões (`SELECT WHERE suggested_by = auth.uid()`).
- Admin vê **todas** e pode `UPDATE` (aprovar/recusar).

GRANTs apropriados para `authenticated` e `service_role`.

### Fluxo do usuário

Na página `/videos`:
- Botão **"Sugerir vídeo"** (visível para todos os autenticados, ao lado do filtro).
- Abre um modal com: pilar, URL do YouTube, título, especialista (opcional), descrição (opcional).
- Validações: URL válida do YouTube, título obrigatório, limites de caracteres.
- Após enviar: toast de confirmação e a sugestão aparece numa aba "Minhas sugestões" com status.

Nova seção/aba **"Minhas sugestões"** em `/videos` mostrando o status de cada uma (pendente, aprovada, recusada com motivo).

### Fluxo do admin

Em `/videos-admin`, adicionar uma seção no topo: **"Sugestões pendentes"** com badge de contagem.
- Lista cada sugestão com preview da thumbnail, dados e quem sugeriu.
- Botões **Aprovar** e **Recusar** (com campo opcional de motivo).
- **Aprovar**: cria registro em `expert_videos` com os dados da sugestão e marca a sugestão como `approved` com `approved_video_id` preenchido. Tudo em uma transação (RPC `approve_video_suggestion`).
- **Recusar**: marca como `rejected` com `rejection_reason` e `reviewed_by/at`.

### Detalhes técnicos

- Nova função SQL `approve_video_suggestion(suggestion_id, display_order)` (`SECURITY DEFINER`) que valida `has_role(auth.uid(), 'admin')`, insere em `expert_videos` e atualiza a sugestão atomicamente.
- Novos hooks em `src/lib/video-suggestions.ts`: `useMySuggestions`, `usePendingSuggestions`, `useCreateSuggestion`, `useApproveSuggestion`, `useRejectSuggestion`.
- Reaproveitar `extractYouTubeId` e `youtubeThumbnail` de `src/lib/youtube.ts`.
- Novo componente `SuggestVideoDialog` reutilizável.

### Arquivos a criar/editar

- `supabase/migrations/...` — tabela `video_suggestions`, RLS, GRANTs, função `approve_video_suggestion`.
- `src/lib/video-suggestions.ts` (novo) — hooks Query/Mutation.
- `src/components/SuggestVideoDialog.tsx` (novo).
- `src/routes/_authenticated/videos.tsx` — botão "Sugerir vídeo" + aba "Minhas sugestões".
- `src/routes/_authenticated/videos-admin.tsx` — seção "Sugestões pendentes" com aprovar/recusar.

### Fora de escopo (a confirmar depois, se quiser)

- Notificação ao usuário quando a sugestão é aprovada/recusada (e-mail ou in-app).
- Limite de quantas sugestões pendentes um usuário pode ter ao mesmo tempo.
- Edição da sugestão pelo admin antes de aprovar.