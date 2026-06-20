import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { VideoCard } from "@/components/VideoCard";
import { VideoLightbox } from "@/components/VideoLightbox";
import { useExpertVideos, useIsAdmin, type ExpertVideo } from "@/lib/expert-videos";
import { PILLAR_DEFAULTS } from "@/lib/pillars";
import { Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SuggestVideoDialog } from "@/components/SuggestVideoDialog";
import { useMySuggestions } from "@/lib/video-suggestions";
import { youtubeThumbnail } from "@/lib/youtube";

export const Route = createFileRoute("/_authenticated/videos")({
  component: VideosPage,
});

function VideosPage() {
  const { data: videos, isLoading } = useExpertVideos();
  const { data: isAdmin } = useIsAdmin();
  const { data: mySuggestions } = useMySuggestions();
  const [filter, setFilter] = useState<number | "all">("all");
  const [active, setActive] = useState<ExpertVideo | null>(null);
  const [suggestOpen, setSuggestOpen] = useState(false);

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
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setSuggestOpen(true)} variant="outline" className="rounded-full">
            <Plus className="h-4 w-4" /> Sugerir vídeo
          </Button>
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

      {mySuggestions && mySuggestions.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-semibold mb-4">Minhas sugestões</h2>
          <ul className="space-y-3">
            {mySuggestions.map((s) => {
              const pillar = PILLAR_DEFAULTS.find((p) => p.id === s.pillar_id);
              const badge =
                s.status === "approved"
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                  : s.status === "rejected"
                  ? "bg-destructive/15 text-destructive"
                  : "bg-amber-500/15 text-amber-700 dark:text-amber-400";
              const label =
                s.status === "approved" ? "Aprovada" : s.status === "rejected" ? "Recusada" : "Em análise";
              return (
                <li
                  key={s.id}
                  className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3"
                >
                  <img
                    src={youtubeThumbnail(s.youtube_id)}
                    alt=""
                    className="h-14 w-24 rounded-lg object-cover bg-muted"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{s.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {pillar?.name ?? `Pilar ${s.pillar_id}`}
                      {s.status === "rejected" && s.rejection_reason
                        ? ` • Motivo: ${s.rejection_reason}`
                        : ""}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${badge}`}>
                    {label}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <SuggestVideoDialog open={suggestOpen} onOpenChange={setSuggestOpen} />
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