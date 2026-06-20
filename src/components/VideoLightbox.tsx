import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { youtubeEmbedUrl } from "@/lib/youtube";
import type { ExpertVideo } from "@/lib/expert-videos";

interface Props {
  video: ExpertVideo | null;
  onClose: () => void;
}

export function VideoLightbox({ video, onClose }: Props) {
  return (
    <Dialog open={!!video} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-border">
        {video && (
          <div className="flex flex-col">
            <div className="aspect-video w-full bg-black">
              <iframe
                key={video.id}
                src={youtubeEmbedUrl(video.youtube_id, true)}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
            <div className="p-6">
              <DialogTitle className="text-lg">{video.title}</DialogTitle>
              {video.expert_name && (
                <p className="mt-1 text-sm text-muted-foreground">{video.expert_name}</p>
              )}
              {video.description && (
                <DialogDescription className="mt-3 whitespace-pre-line">
                  {video.description}
                </DialogDescription>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}