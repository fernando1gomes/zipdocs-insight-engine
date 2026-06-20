ALTER FUNCTION public.has_role(uuid, public.app_role) SECURITY INVOKER;
ALTER FUNCTION public.approve_video_suggestion(uuid, integer) SECURITY INVOKER;