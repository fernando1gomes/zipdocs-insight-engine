import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { LandingPage } from "@/components/landing/LandingPage";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Vida em Eixo — Veja sua vida inteira em uma só imagem" },
      {
        name: "description",
        content:
          "Avalie os 11 pilares da sua vida, descubra o efeito dominó entre eles e crie um plano para transformar o que mais importa. Gratuito.",
      },
      { property: "og:title", content: "Vida em Eixo — Veja sua vida inteira em uma só imagem" },
      {
        property: "og:description",
        content: "Autoavaliação, mapa de impactos e plano de ação para os 11 pilares da sua vida.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return; // visitor → render landing
    const { count } = await supabase
      .from("pillar_evaluations")
      .select("id", { count: "exact", head: true });
    if (!count || count === 0) throw redirect({ to: "/onboarding" });
    throw redirect({ to: "/dashboard" });
  },
  component: LandingPage,
});