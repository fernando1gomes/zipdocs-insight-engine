
CREATE TABLE public.expert_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar_id integer NOT NULL REFERENCES public.pillars(id) ON DELETE CASCADE,
  title text NOT NULL,
  youtube_id text NOT NULL,
  expert_name text,
  description text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX expert_videos_pillar_id_idx ON public.expert_videos(pillar_id, display_order);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.expert_videos TO authenticated;
GRANT ALL ON public.expert_videos TO service_role;

ALTER TABLE public.expert_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view videos"
  ON public.expert_videos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert videos"
  ON public.expert_videos FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update videos"
  ON public.expert_videos FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete videos"
  ON public.expert_videos FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER expert_videos_set_updated_at
  BEFORE UPDATE ON public.expert_videos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
