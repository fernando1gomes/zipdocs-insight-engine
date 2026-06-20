import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { extractYouTubeId } from "@/lib/youtube";
import { PILLAR_DEFAULTS } from "@/lib/pillars";
import { useCreateSuggestion } from "@/lib/video-suggestions";

export function SuggestVideoDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const create = useCreateSuggestion();
  const [pillarId, setPillarId] = useState<number>(PILLAR_DEFAULTS[0].id);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [expert, setExpert] = useState("");
  const [description, setDescription] = useState("");

  function reset() {
    setPillarId(PILLAR_DEFAULTS[0].id);
    setTitle("");
    setUrl("");
    setExpert("");
    setDescription("");
  }

  async function handleSubmit() {
    const youtube_id = extractYouTubeId(url);
    if (!youtube_id) {
      toast.error("URL ou ID do YouTube inválido");
      return;
    }
    if (!title.trim()) {
      toast.error("Informe um título");
      return;
    }
    try {
      await create.mutateAsync({
        pillar_id: pillarId,
        title: title.trim().slice(0, 200),
        youtube_id,
        expert_name: expert.trim() ? expert.trim().slice(0, 120) : null,
        description: description.trim() ? description.trim().slice(0, 1000) : null,
      });
      toast.success("Sugestão enviada! Aguardando análise.");
      reset();
      onOpenChange(false);
    } catch (e) {
      toast.error("Erro ao enviar sugestão");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Sugerir um vídeo</DialogTitle>
          <DialogDescription>
            Sua sugestão passará por análise antes de aparecer publicamente.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Pilar</Label>
            <Select value={String(pillarId)} onValueChange={(v) => setPillarId(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PILLAR_DEFAULTS.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Título *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} />
          </div>
          <div className="space-y-1.5">
            <Label>URL do YouTube *</Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
          <div className="space-y-1.5">
            <Label>Nome do especialista</Label>
            <Input value={expert} onChange={(e) => setExpert(e.target.value)} maxLength={120} />
          </div>
          <div className="space-y-1.5">
            <Label>Descrição</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={1000}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={create.isPending}>
            {create.isPending ? "Enviando..." : "Enviar sugestão"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}