import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface VideoSuggestion {
  id: string;
  pillar_id: number;
  title: string;
  youtube_id: string;
  expert_name: string | null;
  description: string | null;
  suggested_by: string;
  status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  reviewed_at: string | null;
  created_at: string;
}

const SELECT =
  "id, pillar_id, title, youtube_id, expert_name, description, suggested_by, status, rejection_reason, reviewed_at, created_at";

export function useMySuggestions() {
  return useQuery({
    queryKey: ["video_suggestions", "mine"],
    queryFn: async (): Promise<VideoSuggestion[]> => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return [];
      const { data, error } = await supabase
        .from("video_suggestions")
        .select(SELECT)
        .eq("suggested_by", u.user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as VideoSuggestion[];
    },
  });
}

export function usePendingSuggestions(enabled: boolean) {
  return useQuery({
    queryKey: ["video_suggestions", "pending"],
    enabled,
    queryFn: async (): Promise<VideoSuggestion[]> => {
      const { data, error } = await supabase
        .from("video_suggestions")
        .select(SELECT)
        .eq("status", "pending")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as VideoSuggestion[];
    },
  });
}

export interface CreateSuggestionInput {
  pillar_id: number;
  title: string;
  youtube_id: string;
  expert_name: string | null;
  description: string | null;
}

export function useCreateSuggestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateSuggestionInput) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("not authenticated");
      const { error } = await supabase.from("video_suggestions").insert({
        ...input,
        suggested_by: u.user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["video_suggestions"] }),
  });
}

export function useApproveSuggestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc("approve_video_suggestion", {
        _suggestion_id: id,
        _display_order: 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["video_suggestions"] });
      qc.invalidateQueries({ queryKey: ["expert_videos"] });
    },
  });
}

export function useRejectSuggestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; reason: string }) => {
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("video_suggestions")
        .update({
          status: "rejected",
          rejection_reason: input.reason || null,
          reviewed_at: new Date().toISOString(),
          reviewed_by: u.user?.id ?? null,
        })
        .eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["video_suggestions"] }),
  });
}