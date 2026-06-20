# Página "Vídeos dos Especialistas" por pilar

## Visão geral
Nova página acessível pelo menu autenticado que lista os 11 pilares e, dentro de cada um, uma grade de vídeos do YouTube. Clicar num card abre um lightbox centralizado com animação de expansão, fundo desfocado e botão de fechar. Inclui um painel admin (somente para usuários com role `admin`) para cadastrar, editar e remover vídeos por pilar.

## Telas

### `/videos` — página pública (autenticada)
- Header com título "Vídeos dos especialistas" + subtítulo curto.
- Filtro por pilar (chips horizontais com ícone + nome curto), opção "Todos".
- Para cada pilar com vídeos: seção com nome do pilar, e grade responsiva de cards (2 colunas mobile, 3-4 desktop).
- Cada **card de vídeo** mostra:
  - Thumbnail do YouTube (`https://img.youtube.com/vi/<id>/hqdefault.jpg`)
  - Ícone de play sobreposto
  - Título do vídeo
  - Nome do especialista (opcional)
  - Hover: leve scale + sombra
- Clicar abre **lightbox** centralizado (`Dialog` do shadcn, `max-w-4xl`, aspect-video) com:
  - Animação `scale-in` + `fade-in` (já disponíveis no projeto)
  - `iframe` do YouTube com `autoplay=1`
  - Título e nome do especialista abaixo do player
  - Botão de fechar (já incluído no `DialogContent`)
  - Fundo escurecido com backdrop-blur

### `/videos/admin` — painel de cadastro (gated por role `admin`)
- Lista todos os vídeos agrupados por pilar com botões de editar/remover.
- Formulário (dialog) para adicionar/editar vídeo:
  - Pilar (select com os 11 pilares)
  - Título (texto, obrigatório)
  - URL do YouTube ou ID (texto, obrigatório — extrai o ID automaticamente)
  - Nome do especialista (texto, opcional)
  - Descrição curta (textarea, opcional)
  - Ordem de exibição (number, default 0)
- Botão "Adicionar vídeo" no topo.
- Acesso negado (mensagem + link para `/dashboard`) se o usuário não for admin.

## Banco de dados

Nova migração com:

1. **Tabela `expert_videos`**
   - `id` uuid PK
   - `pillar_id` int → `pillars(id)`
   - `title` text not null
   - `youtube_id` text not null (apenas o ID, ex: `dQw4w9WgXcQ`)
   - `expert_name` text
   - `description` text
   - `display_order` int default 0
   - `created_at` / `updated_at` timestamptz
2. **GRANTs**: `SELECT` para `anon` e `authenticated`; `ALL` para `service_role`.
3. **RLS**:
   - Leitura: qualquer usuário autenticado (`SELECT TO authenticated USING (true)`).
   - Insert/Update/Delete: somente `has_role(auth.uid(), 'admin')`.
4. **Trigger `set_updated_at`** já existe — reutilizar.
5. **`app_role` enum + `user_roles` + `has_role`**: já existem no projeto, sem mudanças.

Sem seed automático — admin cadastra os vídeos pelo painel.

## Mudanças de código

- `src/routes/_authenticated/videos.tsx` — página pública de listagem com lightbox.
- `src/routes/_authenticated/videos.admin.tsx` — painel admin (checa role no client + RLS no banco como segunda camada).
- `src/components/VideoCard.tsx` — card com thumbnail + play.
- `src/components/VideoLightbox.tsx` — dialog com iframe autoplay.
- `src/lib/youtube.ts` — utilitário para extrair `youtube_id` de URL/ID colado.
- `src/lib/expert-videos.ts` — hook `useExpertVideos()` (TanStack Query lendo via `supabase` client) e mutations para CRUD admin.
- `src/components/AppHeader.tsx` (ou onde mora a navegação autenticada) — adicionar link "Vídeos".

Sem server functions: leitura usa RLS via client; escrita usa RLS + checagem `has_role` no banco. O painel admin checa a role com a função `has_role` via RPC para esconder a UI quando não autorizado.

## Fora do escopo
- Upload de vídeos próprios (apenas YouTube).
- Playlists, favoritos, histórico de visualização.
- Comentários, avaliações ou progresso de assistir.
- Tradução/legenda — usa o player nativo do YouTube.
