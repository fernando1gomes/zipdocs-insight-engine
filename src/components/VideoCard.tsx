import { Play } from "lucide-react";
import { youtubeThumbnail } from "@/lib/youtube";
import type { ExpertVideo } from "@/lib/expert-videos";

interface Props {
  video: ExpertVideo;
  onClick: () => void;
}

export function VideoCard({ video, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col text-left rounded-2xl overflow-hidden border border-border/60 bg-card shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="relative aspect-video w-full bg-muted">
        <img
          src={youtubeThumbnail(video.youtube_id)}
          alt={video.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg group-hover:scale-110 transition-transform">
            <Play className="h-6 w-6 fill-current" />
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm leading-snug line-clamp-2">{video.title}</h3>
        {video.expert_name && (
          <p className="mt-1 text-xs text-muted-foreground">{video.expert_name}</p>
        )}
      </div>
    </button>
  );
}