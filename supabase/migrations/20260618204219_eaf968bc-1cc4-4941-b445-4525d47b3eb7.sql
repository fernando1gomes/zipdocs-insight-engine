
-- =========== Roles ===========
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- =========== Profiles ===========
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  current_cycle_start_date DATE,
  current_cycle_end_date DATE,
  preferred_checkin_day SMALLINT,
  notification_preferences JSONB NOT NULL DEFAULT '{"email":false,"push":false}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "Update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========== Pillars catalog ===========
CREATE TABLE public.pillars (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  default_order INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pillars TO anon, authenticated;
GRANT ALL ON public.pillars TO service_role;
ALTER TABLE public.pillars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pillars are public" ON public.pillars FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.pillars (id, name, short_name, description, icon, default_order) VALUES
(1,  'Contribuição e legado',     'Contribuição',     'Ajuda a outras pessoas e impacto positivo',           '🤝', 1),
(2,  'Emocional',                  'Emocional',        'Estabilidade emocional, ansiedade e autocuidado',     '❤️', 2),
(3,  'Família',                    'Família',          'Qualidade da convivência e presença',                 '👨‍👩‍👧‍👦', 3),
(4,  'Relacionamento amoroso',     'Relacionamento',   'Conexão afetiva e diálogo',                           '💕', 4),
(5,  'Social e amizades',          'Social',           'Rede de apoio e qualidade das amizades',              '👥', 5),
(6,  'Profissional e carreira',    'Carreira',         'Desempenho, satisfação e aprendizado',                '💼', 6),
(7,  'Financeiro',                 'Financeiro',       'Controle de gastos, dívidas e planejamento',          '💵', 7),
(8,  'Intelectual e aprendizado',  'Intelectual',      'Leitura, estudo e desenvolvimento de habilidades',    '📖', 8),
(9,  'Espiritualidade e sentido',  'Espiritualidade',  'Conexão com valores e propósito',                     '🧘', 9),
(10, 'Lazer e prazer',             'Lazer',            'Diversão, descanso e hobbies',                        '🌞', 10),
(11, 'Saúde e disposição',         'Saúde',            'Sono, alimentação, atividade física e energia',       '🏃', 11);

-- =========== user_pillars (per-user state) ===========
CREATE TABLE public.user_pillars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pillar_id INTEGER NOT NULL REFERENCES public.pillars(id),
  current_score NUMERIC(3,1) NOT NULL DEFAULT 0,
  desired_score NUMERIC(3,1) NOT NULL DEFAULT 10,
  status_color TEXT NOT NULL DEFAULT 'gray',
  trend TEXT NOT NULL DEFAULT 'neutral',
  priority_level TEXT NOT NULL DEFAULT 'normal',
  focus_cycle_status TEXT,
  last_evaluation_date TIMESTAMPTZ,
  last_action_date TIMESTAMPTZ,
  days_without_action INTEGER NOT NULL DEFAULT 0,
  overdue_actions_count INTEGER NOT NULL DEFAULT 0,
  impact_score NUMERIC(3,2) NOT NULL DEFAULT 0,
  risk_level TEXT NOT NULL DEFAULT 'low',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, pillar_id)
);
CREATE INDEX idx_user_pillars_user ON public.user_pillars(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_pillars TO authenticated;
GRANT ALL ON public.user_pillars TO service_role;
ALTER TABLE public.user_pillars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Manage own pillars" ON public.user_pillars FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TRIGGER user_pillars_updated_at BEFORE UPDATE ON public.user_pillars
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
