
INSERT INTO public.pillars (id, name, short_name, description, icon, default_order, is_active) VALUES
(1, 'Saúde e disposição', 'Saúde', 'Sono, alimentação, atividade física e energia diária', '🏃', 1, true),
(2, 'Emocional', 'Emocional', 'Estabilidade emocional, ansiedade e autocuidado', '❤️', 2, true),
(3, 'Família', 'Família', 'Qualidade da convivência e presença', '👨‍👩‍👧‍👦', 3, true),
(4, 'Relacionamento amoroso', 'Relacionamento', 'Conexão afetiva e diálogo', '💕', 4, true),
(5, 'Social e amizades', 'Social', 'Rede de apoio e qualidade das amizades', '👥', 5, true),
(6, 'Profissional e carreira', 'Carreira', 'Desempenho, satisfação e aprendizado', '💼', 6, true),
(7, 'Financeiro', 'Financeiro', 'Controle de gastos, dívidas e planejamento', '💵', 7, true),
(8, 'Intelectual e aprendizado', 'Intelectual', 'Leitura, estudo e desenvolvimento de habilidades', '📖', 8, true),
(9, 'Espiritualidade e sentido', 'Espiritualidade', 'Conexão com valores e propósito', '🧘', 9, true),
(10, 'Lazer e prazer', 'Lazer', 'Diversão, descanso e hobbies', '📚', 10, true),
(11, 'Contribuição e legado', 'Contribuição', 'Ajuda a outras pessoas e impacto positivo', '🤝', 11, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  default_order = EXCLUDED.default_order;

GRANT SELECT ON public.pillars TO anon, authenticated;
ALTER TABLE public.pillars ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Pillars are readable by everyone" ON public.pillars;
CREATE POLICY "Pillars are readable by everyone" ON public.pillars FOR SELECT USING (true);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_pillars (user_id, pillar_id, current_score, desired_score, status_color)
  SELECT NEW.id, p.id, 0, 10, 'gray'
  FROM public.pillars p
  ON CONFLICT (user_id, pillar_id) DO NOTHING;

  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS apply_evaluation ON public.pillar_evaluations;
CREATE TRIGGER apply_evaluation
  AFTER INSERT ON public.pillar_evaluations
  FOR EACH ROW EXECUTE FUNCTION public.apply_evaluation_to_user_pillar();

INSERT INTO public.user_pillars (user_id, pillar_id, current_score, desired_score, status_color)
SELECT u.id, p.id, 0, 10, 'gray'
FROM auth.users u
CROSS JOIN public.pillars p
ON CONFLICT (user_id, pillar_id) DO NOTHING;
