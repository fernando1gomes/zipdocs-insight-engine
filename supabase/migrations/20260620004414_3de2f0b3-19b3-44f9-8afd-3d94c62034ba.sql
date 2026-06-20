CREATE OR REPLACE FUNCTION public.generate_pillar_alerts(_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE r record; a record;
BEGIN
  FOR r IN SELECT up.*, p.short_name FROM user_pillars up
           JOIN pillars p ON p.id=up.pillar_id
           WHERE up.user_id=_user_id LOOP
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

  -- Detecta ações com 3+ "não executada" consecutivas (últimos logs)
  FOR a IN
    WITH last_logs AS (
      SELECT
        action_id,
        pillar_id,
        execution_status,
        log_date,
        ROW_NUMBER() OVER (PARTITION BY action_id ORDER BY log_date DESC) AS rn
      FROM pillar_action_logs
      WHERE user_id = _user_id
        AND action_id IS NOT NULL
        AND execution_status IS NOT NULL
    ),
    last3 AS (
      SELECT action_id, pillar_id,
        COUNT(*) FILTER (WHERE execution_status = 'missed') AS missed_count,
        COUNT(*) AS total
      FROM last_logs
      WHERE rn <= 3
      GROUP BY action_id, pillar_id
    )
    SELECT l3.action_id, l3.pillar_id, pa.title, p.short_name
    FROM last3 l3
    JOIN pillar_actions pa ON pa.id = l3.action_id
    JOIN pillars p ON p.id = l3.pillar_id
    WHERE l3.missed_count >= 3 AND l3.total >= 3
      AND pa.user_id = _user_id
  LOOP
    INSERT INTO alerts(user_id,pillar_id,alert_type,severity,title,message,trigger_reason)
    SELECT _user_id, a.pillar_id, 'action_too_hard', 'yellow',
      'Talvez essa ação precise ficar menor',
      'A ação "' || a.title || '" (' || a.short_name || ') não aconteceu nas últimas 3 tentativas. Que tal reagendar ou quebrá-la em algo ainda mais simples?',
      'consecutive_missed=3:action='||a.action_id::text
    WHERE NOT EXISTS (
      SELECT 1 FROM alerts WHERE user_id=_user_id AND pillar_id=a.pillar_id
      AND alert_type='action_too_hard'
      AND trigger_reason LIKE '%action='||a.action_id::text||'%'
      AND created_at::date = current_date
    );
  END LOOP;
END $function$;