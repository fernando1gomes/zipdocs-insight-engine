
-- 1. Estender pillar_actions com campos de calendário
ALTER TABLE public.pillar_actions
  ADD COLUMN IF NOT EXISTS scheduled_start timestamptz,
  ADD COLUMN IF NOT EXISTS scheduled_end timestamptz,
  ADD COLUMN IF NOT EXISTS duration_minutes integer,
  ADD COLUMN IF NOT EXISTS calendar_status text NOT NULL DEFAULT 'planned',
  ADD COLUMN IF NOT EXISTS reminder_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reminder_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_pillar_actions_scheduled_start
  ON public.pillar_actions(user_id, scheduled_start)
  WHERE scheduled_start IS NOT NULL;

-- 2. Estender pillar_action_logs
ALTER TABLE public.pillar_action_logs
  ADD COLUMN IF NOT EXISTS execution_status text,
  ADD COLUMN IF NOT EXISTS non_execution_reason text,
  ADD COLUMN IF NOT EXISTS rescheduled_from timestamptz,
  ADD COLUMN IF NOT EXISTS rescheduled_to timestamptz,
  ADD COLUMN IF NOT EXISTS daily_closing_id uuid;

-- 3. Tabela daily_closings
CREATE TABLE IF NOT EXISTS public.daily_closings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  closing_date date NOT NULL,
  planned_actions_count integer NOT NULL DEFAULT 0,
  completed_actions_count integer NOT NULL DEFAULT 0,
  not_completed_actions_count integer NOT NULL DEFAULT 0,
  rescheduled_actions_count integer NOT NULL DEFAULT 0,
  user_reflection text,
  ai_summary text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, closing_date)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_closings TO authenticated;
GRANT ALL ON public.daily_closings TO service_role;

ALTER TABLE public.daily_closings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own daily closings"
  ON public.daily_closings FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER daily_closings_set_updated_at
  BEFORE UPDATE ON public.daily_closings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. Tabela daily_closing_answers
CREATE TABLE IF NOT EXISTS public.daily_closing_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_closing_id uuid NOT NULL REFERENCES public.daily_closings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_closing_answers TO authenticated;
GRANT ALL ON public.daily_closing_answers TO service_role;

ALTER TABLE public.daily_closing_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own closing answers"
  ON public.daily_closing_answers FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 5. FK opcional para pillar_action_logs.daily_closing_id
ALTER TABLE public.pillar_action_logs
  DROP CONSTRAINT IF EXISTS pillar_action_logs_daily_closing_id_fkey;
ALTER TABLE public.pillar_action_logs
  ADD CONSTRAINT pillar_action_logs_daily_closing_id_fkey
  FOREIGN KEY (daily_closing_id) REFERENCES public.daily_closings(id) ON DELETE SET NULL;
