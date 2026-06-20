import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { VideoCard } from "@/components/VideoCard";
import { VideoLightbox } from "@/components/VideoLightbox";
import { useExpertVideos, useIsAdmin, type ExpertVideo } from "@/lib/expert-videos";
import { PILLAR_DEFAULTS } from "@/lib/pillars";
import { Settings } from "lucide-react";

export const Route = createFileRoute("/_authenticated/videos")({
  component: VideosPage,
});

function VideosPage() {
  const { data: videos, isLoading } = useExpertVideos();
  const { data: isAdmin } = useIsAdmin();
  const [filter, setFilter] = useState<number | "all">("all");
  const [active, setActive] = useState<ExpertVideo | null>(null);

  const grouped = useMemo(() => {
    const list = videos ?? [];
    const filtered = filter === "all" ? list : list.filter((v) => v.pillar_id === filter);
    const map = new Map<number, ExpertVideo[]>();
    for (const v of filtered) {
      const arr = map.get(v.pillar_id) ?? [];
      arr.push(v);
      map.set(v.pillar_id, arr);
    }
    return PILLAR_DEFAULTS
      .map((p) => ({ pillar: p, videos: map.get(p.id) ?? [] }))
      .filter((g) => g.videos.length > 0);
  }, [videos, filter]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      <AppHeader />

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Vídeos dos especialistas</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Conteúdos por pilar para aprofundar a sua jornada. Clique em um vídeo para assistir em destaque.
          </p>
        </div>
        {isAdmin && (
          <Link
            to="/videos-admin"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary transition"
          >
            <Settings className="h-4 w-4" />
            Gerenciar vídeos
          </Link>
        )}
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>Todos</FilterChip>
        {PILLAR_DEFAULTS.map((p) => (
          <FilterChip key={p.id} active={filter === p.id} onClick={() => setFilter(p.id)}>
            <p.Icon size={16} weight="duotone" /> {p.shortName}
          </FilterChip>
        ))}
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Carregando vídeos...</p>
      ) : grouped.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 bg-card p-12 text-center">
          <p className="text-muted-foreground">
            Ainda não há vídeos cadastrados{filter === "all" ? "" : " para este pilar"}.
          </p>
          {isAdmin && (
            <Link
              to="/videos-admin"
              className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
            >
              Cadastrar o primeiro vídeo
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-12">
          {grouped.map(({ pillar, videos }) => (
            <section key={pillar.id}>
              <div className="mb-4 flex items-center gap-3">
                <pillar.Icon size={24} weight="duotone" />
                <h2 className="text-xl font-semibold">{pillar.name}</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {videos.map((v) => (
                  <VideoCard key={v.id} video={v} onClick={() => setActive(v)} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <VideoLightbox video={active} onClose={() => setActive(null)} />
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-primary text-primary-foreground"
          : "bg-card border border-border text-foreground/70 hover:bg-secondary"
      }`}
    >
      {children}
    </button>
  );
}