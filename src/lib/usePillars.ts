import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mergeWithDefaults, type Pillar } from "./pillars";

export function usePillars() {
  return useQuery<{ pillars: Pillar[] }>({
    queryKey: ["user_pillars"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_pillars")
        .select("pillar_id, current_score")
        .order("pillar_id", { ascending: true });
      if (error) throw error;
      return { pillars: mergeWithDefaults(data ?? []) };
    },
  });
}