-- Tabela de sugestões de vídeos
CREATE TYPE public.suggestion_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.video_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar_id INTEGER NOT NULL REFERENCES public.pillars(id),
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  youtube_id TEXT NOT NULL CHECK (char_length(youtube_id) = 11),
  expert_name TEXT CHECK (expert_name IS NULL OR char_length(expert_name) <= 120),
  description TEXT CHECK (description IS NULL OR char_length(description) <= 1000),
  suggested_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.suggestion_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT CHECK (rejection_reason IS NULL OR char_length(rejection_reason) <= 500),
  approved_video_id UUID REFERENCES public.expert_videos(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.video_suggestions TO authenticated;
GRANT ALL ON public.video_suggestions TO service_role;

ALTER TABLE public.video_suggestions ENABLE ROW LEVEL SECURITY;

-- Usuário cria sua própria sugestão
CREATE POLICY "Users can insert own suggestions"
  ON public.video_suggestions FOR INSERT TO authenticated
  WITH CHECK (suggested_by = auth.uid() AND status = 'pending');

-- Usuário vê suas sugestões; admin vê todas
CREATE POLICY "Users can view own suggestions or admins all"
  ON public.video_suggestions FOR SELECT TO authenticated
  USING (suggested_by = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Apenas admin pode atualizar (aprovar/recusar)
CREATE POLICY "Admins can update suggestions"
  ON public.video_suggestions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin pode deletar
CREATE POLICY "Admins can delete suggestions"
  ON public.video_suggestions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_video_suggestions_updated_at
  BEFORE UPDATE ON public.video_suggestions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_video_suggestions_status ON public.video_suggestions(status);
CREATE INDEX idx_video_suggestions_user ON public.video_suggestions(suggested_by);

-- Função para aprovar (cria registro em expert_videos e marca sugestão)
CREATE OR REPLACE FUNCTION public.approve_video_suggestion(
  _suggestion_id UUID,
  _display_order INTEGER DEFAULT 0
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_suggestion public.video_suggestions;
  v_video_id UUID;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT * INTO v_suggestion FROM public.video_suggestions
    WHERE id = _suggestion_id AND status = 'pending'
    FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'suggestion not found or already reviewed';
  END IF;

  INSERT INTO public.expert_videos (pillar_id, title, youtube_id, expert_name, description, display_order)
    VALUES (v_suggestion.pillar_id, v_suggestion.title, v_suggestion.youtube_id,
            v_suggestion.expert_name, v_suggestion.description, COALESCE(_display_order, 0))
    RETURNING id INTO v_video_id;

  UPDATE public.video_suggestions
     SET status = 'approved',
         reviewed_by = auth.uid(),
         reviewed_at = now(),
         approved_video_id = v_video_id
   WHERE id = _suggestion_id;

  RETURN v_video_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.approve_video_suggestion(UUID, INTEGER) TO authenticated;