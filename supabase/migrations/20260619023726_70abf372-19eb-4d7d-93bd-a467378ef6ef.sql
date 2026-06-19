CREATE TABLE public.autorresponsabilidade_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pillar_id integer NOT NULL REFERENCES public.pillars(id),
  current_score numeric,
  result_text text,
  behaviors text[] DEFAULT '{}',
  behaviors_reflection text,
  broken_text text,
  missing_text text,
  misplaced_text text,
  excuse text,
  excuse_decision text,
  commitment text,
  action_24h text,
  score integer DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.autorresponsabilidade_sessions TO authenticated;
GRANT ALL ON public.autorresponsabilidade_sessions TO service_role;

ALTER TABLE public.autorresponsabilidade_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own autorresp sessions"
  ON public.autorresponsabilidade_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER autorresp_set_updated_at
  BEFORE UPDATE ON public.autorresponsabilidade_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_autorresp_user_pillar ON public.autorresponsabilidade_sessions(user_id, pillar_id);