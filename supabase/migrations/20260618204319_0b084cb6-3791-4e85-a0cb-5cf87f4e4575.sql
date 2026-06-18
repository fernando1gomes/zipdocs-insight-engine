
-- pillar_evaluations
CREATE TABLE public.pillar_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pillar_id INTEGER NOT NULL REFERENCES public.pillars(id),
  evaluation_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  subjective_score NUMERIC(3,1),
  behavior_score NUMERIC(3,1),
  action_execution_score NUMERIC(3,1),
  frequency_score NUMERIC(3,1),
  interdependence_score NUMERIC(3,1),
  final_score NUMERIC(3,1) NOT NULL,
  user_comment TEXT,
  ai_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_evals_user_date ON public.pillar_evaluations(user_id, evaluation_date DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pillar_evaluations TO authenticated;
GRANT ALL ON public.pillar_evaluations TO service_role;
ALTER TABLE public.pillar_evaluations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Manage own evaluations" ON public.pillar_evaluations FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- trigger: update user_pillars on new evaluation
CREATE OR REPLACE FUNCTION public.apply_evaluation_to_user_pillar()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.user_pillars
     SET current_score = NEW.final_score,
         last_evaluation_date = NEW.evaluation_date,
         status_color = CASE
           WHEN NEW.final_score >= 7 THEN 'green'
           WHEN NEW.final_score >= 6 THEN 'yellow'
           WHEN NEW.final_score > 0 THEN 'red'
           ELSE 'gray' END,
         updated_at = now()
   WHERE user_id = NEW.user_id AND pillar_id = NEW.pillar_id;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.apply_evaluation_to_user_pillar() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER trg_apply_evaluation
AFTER INSERT ON public.pillar_evaluations
FOR EACH ROW EXECUTE FUNCTION public.apply_evaluation_to_user_pillar();

-- pillar_actions
CREATE TABLE public.pillar_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pillar_id INTEGER NOT NULL REFERENCES public.pillars(id),
  title TEXT NOT NULL,
  description TEXT,
  action_type TEXT NOT NULL DEFAULT 'unique',
  frequency_type TEXT,
  frequency_value INTEGER,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  next_due_date DATE,
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'normal',
  obstacle_expected TEXT,
  required_resource TEXT,
  days_overdue INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_actions_user_status ON public.pillar_actions(user_id, status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pillar_actions TO authenticated;
GRANT ALL ON public.pillar_actions TO service_role;
ALTER TABLE public.pillar_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Manage own actions" ON public.pillar_actions FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER pillar_actions_updated_at BEFORE UPDATE ON public.pillar_actions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- pillar_action_logs
CREATE TABLE public.pillar_action_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id UUID NOT NULL REFERENCES public.pillar_actions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pillar_id INTEGER NOT NULL REFERENCES public.pillars(id),
  log_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL,
  user_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_action_logs_action ON public.pillar_action_logs(action_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pillar_action_logs TO authenticated;
GRANT ALL ON public.pillar_action_logs TO service_role;
ALTER TABLE public.pillar_action_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Manage own action logs" ON public.pillar_action_logs FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- pillar_interdependencies (catálogo padrão é compartilhado, mas usuário pode ter próprio)
CREATE TABLE public.pillar_interdependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  source_pillar_id INTEGER NOT NULL REFERENCES public.pillars(id),
  target_pillar_id INTEGER NOT NULL REFERENCES public.pillars(id),
  impact_level TEXT NOT NULL DEFAULT 'medium',
  impact_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pillar_interdependencies TO authenticated;
GRANT ALL ON public.pillar_interdependencies TO service_role;
ALTER TABLE public.pillar_interdependencies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read interdependencies" ON public.pillar_interdependencies FOR SELECT TO authenticated USING (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "Manage own interdependencies" ON public.pillar_interdependencies FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Update own interdependencies" ON public.pillar_interdependencies FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Delete own interdependencies" ON public.pillar_interdependencies FOR DELETE TO authenticated USING (user_id = auth.uid());

-- alerts
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pillar_id INTEGER REFERENCES public.pillars(id),
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'yellow',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  trigger_reason TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);
CREATE INDEX idx_alerts_user ON public.alerts(user_id, is_read, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alerts TO authenticated;
GRANT ALL ON public.alerts TO service_role;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Manage own alerts" ON public.alerts FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- weekly_checkins
CREATE TABLE public.weekly_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  main_focus_pillar_id INTEGER REFERENCES public.pillars(id),
  most_improved_pillar_id INTEGER REFERENCES public.pillars(id),
  most_neglected_pillar_id INTEGER REFERENCES public.pillars(id),
  user_reflection TEXT,
  ai_summary TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_checkins_user_date ON public.weekly_checkins(user_id, week_start_date DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.weekly_checkins TO authenticated;
GRANT ALL ON public.weekly_checkins TO service_role;
ALTER TABLE public.weekly_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Manage own checkins" ON public.weekly_checkins FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER weekly_checkins_updated_at BEFORE UPDATE ON public.weekly_checkins FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.weekly_checkin_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checkin_id UUID NOT NULL REFERENCES public.weekly_checkins(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.weekly_checkin_answers TO authenticated;
GRANT ALL ON public.weekly_checkin_answers TO service_role;
ALTER TABLE public.weekly_checkin_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Manage own checkin answers" ON public.weekly_checkin_answers FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ai_recommendations
CREATE TABLE public.ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pillar_id INTEGER REFERENCES public.pillars(id),
  recommendation_type TEXT NOT NULL,
  title TEXT,
  message TEXT NOT NULL,
  suggested_action TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_recs_user ON public.ai_recommendations(user_id, status, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_recommendations TO authenticated;
GRANT ALL ON public.ai_recommendations TO service_role;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Manage own recommendations" ON public.ai_recommendations FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER ai_recs_updated_at BEFORE UPDATE ON public.ai_recommendations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
