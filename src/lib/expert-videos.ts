import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ExpertVideo {
  id: string;
  pillar_id: number;
  title: string;
  youtube_id: string;
  expert_name: string | null;
  description: string | null;
  display_order: number;
}

const QUERY_KEY = ["expert_videos"] as const;

export function useExpertVideos() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async (): Promise<ExpertVideo[]> => {
      const { data, error } = await supabase
        .from("expert_videos")
        .select("id, pillar_id, title, youtube_id, expert_name, description, display_order")
        .order("pillar_id", { ascending: true })
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as ExpertVideo[];
    },
  });
}

export function useIsAdmin() {
  return useQuery({
    queryKey: ["is_admin"],
    queryFn: async (): Promise<boolean> => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return false;
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: userData.user.id,
        _role: "admin",
      });
      if (error) return false;
      return Boolean(data);
    },
  });
}

export type ExpertVideoInput = Omit<ExpertVideo, "id">;

export function useSaveVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ExpertVideoInput & { id?: string }) => {
      if (input.id) {
        const { id, ...rest } = input;
        const { error } = await supabase.from("expert_videos").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("expert_videos").insert(input);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("expert_videos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}