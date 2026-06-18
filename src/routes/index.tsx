import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    const { count } = await supabase
      .from("pillar_evaluations")
      .select("id", { count: "exact", head: true });
    if (!count || count === 0) throw redirect({ to: "/onboarding" });
    throw redirect({ to: "/dashboard" });
  },
  component: () => null,
});