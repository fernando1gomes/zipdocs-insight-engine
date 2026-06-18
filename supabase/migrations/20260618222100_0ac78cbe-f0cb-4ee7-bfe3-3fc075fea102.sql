
-- ============ PILLAR CRITERIA ============
CREATE TABLE public.pillar_criteria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar_id integer NOT NULL REFERENCES public.pillars(id) ON DELETE CASCADE,
  key text NOT NULL,
  label text NOT NULL,
  question_text text NOT NULL,
  hint text,
  weight numeric NOT NULL DEFAULT 1,
  order_index integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(pillar_id, key)
);
GRANT SELECT ON public.pillar_criteria TO authenticated, anon;
GRANT ALL ON public.pillar_criteria TO service_role;
ALTER TABLE public.pillar_criteria ENABLE ROW LEVEL SECURITY;
CREATE POLICY "criteria readable by all" ON public.pillar_criteria FOR SELECT USING (true);

CREATE TABLE public.pillar_criteria_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id uuid NOT NULL REFERENCES public.pillar_evaluations(id) ON DELETE CASCADE,
  criterion_id uuid NOT NULL REFERENCES public.pillar_criteria(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  score numeric NOT NULL CHECK (score >= 0 AND score <= 10),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pillar_criteria_scores TO authenticated;
GRANT ALL ON public.pillar_criteria_scores TO service_role;
ALTER TABLE public.pillar_criteria_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own criteria scores" ON public.pillar_criteria_scores FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.pillar_checkin_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar_id integer NOT NULL REFERENCES public.pillars(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pillar_checkin_questions TO authenticated, anon;
GRANT ALL ON public.pillar_checkin_questions TO service_role;
ALTER TABLE public.pillar_checkin_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "checkin questions readable" ON public.pillar_checkin_questions FOR SELECT USING (true);

-- ============ AI CONVERSATIONS ============
CREATE TABLE public.ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_conversations TO authenticated;
GRANT ALL ON public.ai_conversations TO service_role;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own conv" ON public.ai_conversations FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.ai_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('user','assistant','system')),
  content text NOT NULL,
  parts jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_messages TO authenticated;
GRANT ALL ON public.ai_messages TO service_role;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own messages" ON public.ai_messages FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX ai_messages_conv_idx ON public.ai_messages(conversation_id, created_at);

-- ============ SEED CRITERIA ============
INSERT INTO public.pillar_criteria (pillar_id, key, label, question_text, weight, order_index) VALUES
-- 1 Contribuição e legado
(1,'contribution_frequency','Frequência de contribuição','Com que regularidade você contribui ou ajuda outras pessoas?',2,1),
(1,'positive_impact','Impacto positivo','Suas ações têm gerado impacto além de você?',2,2),
(1,'legacy_clarity','Clareza de legado','Você tem clareza sobre o legado que quer deixar?',1,3),
(1,'values_coherence','Coerência com valores','Suas ações estão coerentes com seus valores?',2,4),
-- 2 Emocional
(2,'anxiety_level','Nível de ansiedade','Como está seu nível de ansiedade? (10 = muito tranquilo)',3,1),
(2,'emotional_stability','Estabilidade emocional','Quão estável você tem se sentido emocionalmente?',2,2),
(2,'mental_clarity','Clareza mental','Como está sua clareza mental?',2,3),
(2,'rest_frequency','Frequência de descanso','Você teve momentos reais de descanso?',2,4),
(2,'self_care','Autocuidado','Você praticou autocuidado nos últimos 7 dias?',2,5),
-- 3 Família
(3,'family_presence','Presença','Você tem estado presente para sua família?',2,1),
(3,'family_quality','Qualidade do tempo','A qualidade do tempo com a família tem sido boa?',2,2),
(3,'pending_conflicts','Conflitos pendentes','Há conflitos importantes não resolvidos? (10 = nenhum)',2,3),
(3,'mutual_support','Apoio mútuo','Vocês se apoiam mutuamente?',1,4),
-- 4 Relacionamento amoroso
(4,'emotional_connection','Conexão emocional','Quão conectado você se sente?',3,1),
(4,'communication','Qualidade do diálogo','Como está o diálogo no relacionamento?',2,2),
(4,'respect','Respeito','Você se sente respeitado e valorizado?',2,3),
(4,'shared_plans','Planos em comum','Vocês têm planos em comum claros?',1,4),
(4,'conflict_resolution','Resolução de conflitos','Conflitos são resolvidos de forma saudável?',2,5),
-- 5 Social e amizades
(5,'social_frequency','Frequência de contato','Você tem cultivado boas amizades?',2,1),
(5,'friendship_quality','Qualidade das amizades','Suas amizades te fortalecem?',2,2),
(5,'support_network','Rede de apoio','Você tem pessoas com quem pode contar?',2,3),
(5,'isolation','Ausência de isolamento','Você tem evitado o isolamento? (10 = nada isolado)',2,4),
-- 6 Profissional e carreira
(6,'satisfaction','Satisfação','Você está satisfeito com sua evolução profissional?',2,1),
(6,'learning','Aprendizado','Está aprendendo algo novo regularmente?',2,2),
(6,'direction','Clareza de direção','Você sabe para onde quer caminhar?',2,3),
(6,'recognition','Reconhecimento','Sente-se reconhecido pelo seu trabalho?',1,4),
(6,'overload','Equilíbrio (sem sobrecarga)','Sua carga de trabalho está equilibrada? (10 = sem sobrecarga)',2,5),
-- 7 Financeiro
(7,'expense_control','Controle de gastos','Você sabe para onde seu dinheiro está indo?',3,1),
(7,'debt_control','Dívidas sob controle','Suas dívidas estão sob controle? (10 = sem dívidas/sob controle)',3,2),
(7,'emergency_reserve','Reserva de emergência','Sua reserva de emergência está adequada?',2,3),
(7,'savings','Capacidade de poupar','Você consegue poupar regularmente?',2,4),
(7,'financial_peace','Tranquilidade financeira','Seu dinheiro gera paz? (10 = total tranquilidade)',2,5),
-- 8 Intelectual
(8,'study_frequency','Frequência de estudo','Tem estudado com regularidade?',2,1),
(8,'reading','Leitura','Tem lido com frequência?',1,2),
(8,'skill_development','Desenvolvimento de habilidades','Está desenvolvendo habilidades relevantes?',2,3),
(8,'application','Aplicação prática','Está aplicando o que aprende?',2,4),
(8,'reflection','Reflexão','Tem reservado tempo para reflexão?',1,5),
-- 9 Espiritualidade
(9,'values_alignment','Alinhamento com valores','Sua rotina está alinhada com seus valores?',3,1),
(9,'purpose_clarity','Clareza de propósito','Você sente que sua vida tem direção?',2,2),
(9,'inner_peace','Paz interior','Como está sua paz interior?',2,3),
(9,'gratitude','Gratidão','Você tem cultivado gratidão?',1,4),
(9,'spiritual_practice','Prática espiritual','Tem mantido alguma prática espiritual ou reflexiva?',1,5),
-- 10 Lazer e prazer
(10,'leisure_frequency','Frequência de lazer','Você tem reservado tempo para lazer?',2,1),
(10,'rest_quality','Qualidade do descanso','Seu descanso tem sido de qualidade?',2,2),
(10,'hobbies','Hobbies','Tem dedicado tempo a hobbies?',2,3),
(10,'creativity','Criatividade','Tem espaço para criatividade?',1,4),
(10,'guilt_free_rest','Descanso sem culpa','Consegue descansar sem culpa? (10 = sem culpa)',2,5),
-- 11 Saúde
(11,'sleep','Qualidade do sono','Como está sua qualidade de sono?',3,1),
(11,'nutrition','Alimentação','Está cuidando da alimentação?',2,2),
(11,'physical_activity','Atividade física','Praticou atividade física nos últimos 7 dias?',3,3),
(11,'preventive_care','Cuidados preventivos','Está em dia com cuidados preventivos (exames)?',2,4),
(11,'energy_level','Nível de energia','Como está sua energia no dia a dia?',2,5),
(11,'symptoms','Ausência de sintomas','Está sem sintomas recorrentes preocupantes? (10 = sem sintomas)',2,6);

-- ============ SEED CHECKIN QUESTIONS ============
INSERT INTO public.pillar_checkin_questions (pillar_id, question_text, order_index) VALUES
(1,'Você sentiu que contribuiu com alguém esta semana?',1),
(2,'Como você tem se sentido emocionalmente?',1),
(3,'Você esteve presente para sua família?',1),
(4,'Como tem sido o diálogo no relacionamento?',1),
(5,'Você cultivou alguma amizade nesta semana?',1),
(6,'Você está satisfeito com sua evolução profissional?',1),
(7,'Você sabe para onde seu dinheiro foi nesta semana?',1),
(8,'Aprendeu algo relevante recentemente?',1),
(9,'Sua rotina está alinhada com seus valores?',1),
(10,'Você teve momentos de lazer sem culpa?',1),
(11,'Como está sua energia e seus cuidados de saúde?',1);

-- ============ RECALCULATE ============
CREATE OR REPLACE FUNCTION public.recalculate_user_pillar(_user_id uuid, _pillar_id integer)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_score numeric;
  v_last_eval timestamptz;
  v_last_action timestamptz;
  v_days_no_action integer;
  v_overdue integer;
  v_has_plan boolean;
  v_trend text;
  v_prev_avg numeric;
  v_risk text;
  v_color text;
BEGIN
  SELECT current_score, last_evaluation_date INTO v_score, v_last_eval
  FROM user_pillars WHERE user_id=_user_id AND pillar_id=_pillar_id;

  SELECT max(completed_at) INTO v_last_action
  FROM pillar_actions WHERE user_id=_user_id AND pillar_id=_pillar_id AND status='completed';

  v_days_no_action := CASE WHEN v_last_action IS NULL THEN 999
    ELSE EXTRACT(DAY FROM now() - v_last_action)::int END;

  SELECT count(*) INTO v_overdue FROM pillar_actions
    WHERE user_id=_user_id AND pillar_id=_pillar_id AND status='overdue';

  SELECT EXISTS(SELECT 1 FROM pillar_actions
    WHERE user_id=_user_id AND pillar_id=_pillar_id AND status IN ('pending','overdue')) INTO v_has_plan;

  SELECT avg(final_score) INTO v_prev_avg FROM (
    SELECT final_score FROM pillar_evaluations
    WHERE user_id=_user_id AND pillar_id=_pillar_id
    ORDER BY evaluation_date DESC OFFSET 1 LIMIT 3
  ) t;

  v_trend := CASE
    WHEN v_prev_avg IS NULL OR v_score IS NULL THEN 'stable'
    WHEN v_score - v_prev_avg > 0.5 THEN 'up'
    WHEN v_score - v_prev_avg < -0.5 THEN 'down'
    ELSE 'stable' END;

  IF v_score IS NULL OR v_score = 0 THEN
    v_color := 'gray'; v_risk := NULL;
  ELSIF v_score < 5 OR v_overdue >= 2 OR v_days_no_action > 21 THEN
    v_color := 'red'; v_risk := 'high';
  ELSIF v_score < 7 OR v_overdue >= 1 OR v_days_no_action > 10 OR NOT v_has_plan OR v_trend = 'down' THEN
    v_color := 'yellow'; v_risk := 'medium';
  ELSE
    v_color := 'green'; v_risk := 'low';
  END IF;

  UPDATE user_pillars SET
    status_color = v_color,
    trend = v_trend,
    risk_level = v_risk,
    days_without_action = v_days_no_action,
    overdue_actions_count = v_overdue,
    last_action_date = v_last_action,
    updated_at = now()
  WHERE user_id=_user_id AND pillar_id=_pillar_id;
END $$;

-- ============ GENERATE ALERTS ============
CREATE OR REPLACE FUNCTION public.generate_pillar_alerts(_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r record;
BEGIN
  FOR r IN SELECT up.*, p.short_name FROM user_pillars up
           JOIN pillars p ON p.id=up.pillar_id
           WHERE up.user_id=_user_id LOOP
    -- pilar negligenciado
    IF r.days_without_action > 10 AND r.current_score > 0 THEN
      INSERT INTO alerts(user_id,pillar_id,alert_type,severity,title,message,trigger_reason)
      SELECT _user_id, r.pillar_id, 'pillar_neglected',
        CASE WHEN r.days_without_action > 21 THEN 'red' ELSE 'yellow' END,
        r.short_name || ' está pedindo cuidado',
        r.short_name || ' está há ' || r.days_without_action || ' dias sem ação concluída. Uma pequena ação nesta semana pode reativar esse cuidado.',
        'days_without_action='||r.days_without_action
      WHERE NOT EXISTS (
        SELECT 1 FROM alerts WHERE user_id=_user_id AND pillar_id=r.pillar_id
        AND alert_type='pillar_neglected' AND created_at::date = current_date
      );
    END IF;
    -- ações vencidas
    IF r.overdue_actions_count > 0 THEN
      INSERT INTO alerts(user_id,pillar_id,alert_type,severity,title,message,trigger_reason)
      SELECT _user_id, r.pillar_id, 'action_overdue', 'yellow',
        'Ação atrasada em ' || r.short_name,
        'Você tem ' || r.overdue_actions_count || ' ação(ões) atrasada(s) em ' || r.short_name || '. Que tal retomar com um passo pequeno?',
        'overdue='||r.overdue_actions_count
      WHERE NOT EXISTS (
        SELECT 1 FROM alerts WHERE user_id=_user_id AND pillar_id=r.pillar_id
        AND alert_type='action_overdue' AND created_at::date = current_date
      );
    END IF;
    -- score baixo
    IF r.current_score > 0 AND r.current_score < 5 THEN
      INSERT INTO alerts(user_id,pillar_id,alert_type,severity,title,message,trigger_reason)
      SELECT _user_id, r.pillar_id, 'low_score', 'red',
        r.short_name || ' precisa de atenção',
        r.short_name || ' está com nota baixa. Vamos escolher uma microação simples para começar a reativar esse pilar?',
        'score='||r.current_score
      WHERE NOT EXISTS (
        SELECT 1 FROM alerts WHERE user_id=_user_id AND pillar_id=r.pillar_id
        AND alert_type='low_score' AND created_at::date = current_date
      );
    END IF;
    -- sem plano em pilar crítico/médio
    IF r.current_score > 0 AND r.current_score < 7 AND NOT EXISTS(
      SELECT 1 FROM pillar_actions WHERE user_id=_user_id AND pillar_id=r.pillar_id AND status IN ('pending','overdue')
    ) THEN
      INSERT INTO alerts(user_id,pillar_id,alert_type,severity,title,message,trigger_reason)
      SELECT _user_id, r.pillar_id, 'no_plan_defined', 'yellow',
        r.short_name || ' está sem plano ativo',
        'Criar uma pequena ação para ' || r.short_name || ' pode ajudar a fortalecer esse pilar nesta semana.',
        'no_plan'
      WHERE NOT EXISTS (
        SELECT 1 FROM alerts WHERE user_id=_user_id AND pillar_id=r.pillar_id
        AND alert_type='no_plan_defined' AND created_at::date = current_date
      );
    END IF;
    -- queda
    IF r.trend = 'down' AND r.impact_score >= 7 THEN
      INSERT INTO alerts(user_id,pillar_id,alert_type,severity,title,message,trigger_reason)
      SELECT _user_id, r.pillar_id, 'score_drop', 'yellow',
        r.short_name || ' está em queda',
        r.short_name || ' caiu nas últimas avaliações. Por ter alto impacto em outros pilares, uma correção de rota agora ajuda o todo.',
        'trend=down'
      WHERE NOT EXISTS (
        SELECT 1 FROM alerts WHERE user_id=_user_id AND pillar_id=r.pillar_id
        AND alert_type='score_drop' AND created_at::date = current_date
      );
    END IF;
  END LOOP;
END $$;

-- ============ NEW EVALUATION TRIGGER ============
CREATE OR REPLACE FUNCTION public.apply_evaluation_to_user_pillar()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.user_pillars
     SET current_score = NEW.final_score,
         last_evaluation_date = NEW.evaluation_date,
         updated_at = now()
   WHERE user_id = NEW.user_id AND pillar_id = NEW.pillar_id;
  PERFORM public.recalculate_user_pillar(NEW.user_id, NEW.pillar_id);
  PERFORM public.generate_pillar_alerts(NEW.user_id);
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_apply_evaluation ON public.pillar_evaluations;
CREATE TRIGGER trg_apply_evaluation
AFTER INSERT ON public.pillar_evaluations
FOR EACH ROW EXECUTE FUNCTION public.apply_evaluation_to_user_pillar();
