
REVOKE EXECUTE ON FUNCTION public.recalculate_user_pillar(uuid, integer) FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_pillar_alerts(uuid) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.recalculate_user_pillar(uuid, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.generate_pillar_alerts(uuid) TO service_role;
