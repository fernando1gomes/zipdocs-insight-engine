import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";
import {
  useApproveSuggestion,
  usePendingSuggestions,
  useRejectSuggestion,
  type VideoSuggestion,
} from "@/lib/video-suggestions";
import { youtubeThumbnail } from "@/lib/youtube";
import { PILLAR_DEFAULTS } from "@/lib/pillars";

export function PendingSuggestions() {
  const { data, isLoading } = usePendingSuggestions(true);
  const approve = useApproveSuggestion();
  const reject = useRejectSuggestion();
  const [rejecting, setRejecting] = useState<VideoSuggestion | null>(null);
  const [reason, setReason] = useState("");

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-border/60 bg-card p-6">
        <p className="text-sm text-muted-foreground">Carregando sugestões...</p>
      </section>
    );
  }

  const list = data ?? [];

  async function handleApprove(s: VideoSuggestion) {
    try {
      await approve.mutateAsync(s.id);
      toast.success("Sugestão aprovada e publicada");
    } catch {
      toast.error("Erro ao aprovar sugestão");
    }
  }

  async function confirmReject() {
    if (!rejecting) return;
    try {
      await reject.mutateAsync({ id: rejecting.id, reason: reason.trim() });
      toast.success("Sugestão recusada");
      setRejecting(null);
      setReason("");
    } catch {
      toast.error("Erro ao recusar");
    }
  }

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="font-semibold">Sugestões pendentes</h2>
        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
          {list.length}
        </span>
      </div>
      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma sugestão aguardando análise.</p>
      ) : (
        <ul className="space-y-3">
          {list.map((s) => {
            const pillar = PILLAR_DEFAULTS.find((p) => p.id === s.pillar_id);
            return (
              <li
                key={s.id}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 p-3"
              >
                <a
                  href={`https://www.youtube.com/watch?v=${s.youtube_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0"
                >
                  <img
                    src={youtubeThumbnail(s.youtube_id)}
                    alt=""
                    className="h-16 w-28 rounded-lg object-cover bg-muted"
                  />
                </a>
                <div className="flex-1 min-w-[200px]">
                  <p className="font-medium">{s.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {pillar?.name ?? `Pilar ${s.pillar_id}`}
                    {s.expert_name ? ` • ${s.expert_name}` : ""}
                  </p>
                  {s.description && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {s.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(s)}
                    disabled={approve.isPending}
                  >
                    <Check className="h-4 w-4" /> Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setRejecting(s);
                      setReason("");
                    }}
                  >
                    <X className="h-4 w-4" /> Recusar
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={!!rejecting} onOpenChange={(o) => !o && setRejecting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recusar sugestão</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Motivo (opcional, visível ao autor)</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              maxLength={500}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRejecting(null)}>Cancelar</Button>
            <Button onClick={confirmReject} disabled={reject.isPending}>
              {reject.isPending ? "Recusando..." : "Confirmar recusa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}