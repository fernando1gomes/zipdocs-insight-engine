
CREATE TABLE public.pillar_action_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pillar_id integer NOT NULL REFERENCES public.pillars(id),
  broken_text text,
  missing_text text,
  misplaced_text text,
  what text,
  why text,
  how text,
  when_start date,
  when_due date,
  where_text text,
  who_text text,
  how_much text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pillar_action_plans TO authenticated;
GRANT ALL ON public.pillar_action_plans TO service_role;

ALTER TABLE public.pillar_action_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Manage own action plans" ON public.pillar_action_plans
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE TRIGGER pillar_action_plans_updated_at
  BEFORE UPDATE ON public.pillar_action_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_action_plans_user_pillar ON public.pillar_action_plans(user_id, pillar_id);

ALTER TABLE public.pillar_actions
  ADD COLUMN plan_id uuid REFERENCES public.pillar_action_plans(id) ON DELETE SET NULL;
