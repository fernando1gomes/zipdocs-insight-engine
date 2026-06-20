import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  useDeleteVideo,
  useExpertVideos,
  useIsAdmin,
  useSaveVideo,
  type ExpertVideo,
} from "@/lib/expert-videos";
import { extractYouTubeId } from "@/lib/youtube";
import { PILLAR_DEFAULTS } from "@/lib/pillars";

export const Route = createFileRoute("/_authenticated/videos-admin")({
  component: VideosAdminPage,
});

type FormState = {
  id?: string;
  pillar_id: number;
  title: string;
  youtube_input: string;
  expert_name: string;
  description: string;
  display_order: number;
};

const EMPTY: FormState = {
  pillar_id: PILLAR_DEFAULTS[0].id,
  title: "",
  youtube_input: "",
  expert_name: "",
  description: "",
  display_order: 0,
};

function VideosAdminPage() {
  const { data: isAdmin, isLoading: loadingRole } = useIsAdmin();
  const { data: videos, isLoading } = useExpertVideos();
  const saveVideo = useSaveVideo();
  const deleteVideo = useDeleteVideo();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);

  if (loadingRole) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <AppHeader />
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <AppHeader />
        <div className="rounded-2xl border border-border/60 bg-card p-12 text-center">
          <h1 className="text-2xl font-semibold">Acesso restrito</h1>
          <p className="mt-2 text-muted-foreground">
            Esta área é apenas para administradores.
          </p>
          <Link
            to="/dashboard"
            className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
          >
            Voltar para o painel
          </Link>
        </div>
      </div>
    );
  }

  function openCreate() {
    setForm(EMPTY);
    setOpen(true);
  }

  function openEdit(v: ExpertVideo) {
    setForm({
      id: v.id,
      pillar_id: v.pillar_id,
      title: v.title,
      youtube_input: v.youtube_id,
      expert_name: v.expert_name ?? "",
      description: v.description ?? "",
      display_order: v.display_order,
    });
    setOpen(true);
  }

  async function handleSave() {
    const youtube_id = extractYouTubeId(form.youtube_input);
    if (!youtube_id) {
      toast.error("URL ou ID do YouTube inválido");
      return;
    }
    if (!form.title.trim()) {
      toast.error("Informe um título");
      return;
    }
    try {
      await saveVideo.mutateAsync({
        id: form.id,
        pillar_id: form.pillar_id,
        title: form.title.trim(),
        youtube_id,
        expert_name: form.expert_name.trim() || null,
        description: form.description.trim() || null,
        display_order: form.display_order,
      });
      toast.success(form.id ? "Vídeo atualizado" : "Vídeo adicionado");
      setOpen(false);
    } catch (e) {
      toast.error("Erro ao salvar vídeo");
    }
  }

  async function handleDelete(v: ExpertVideo) {
    if (!confirm(`Remover "${v.title}"?`)) return;
    try {
      await deleteVideo.mutateAsync(v.id);
      toast.success("Vídeo removido");
    } catch {
      toast.error("Erro ao remover");
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      <AppHeader />

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Gerenciar vídeos</h1>
          <p className="mt-2 text-muted-foreground">
            Cadastre vídeos do YouTube para cada pilar.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/videos"
            className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary transition"
          >
            Ver página pública
          </Link>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Adicionar vídeo
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <div className="space-y-8">
          {PILLAR_DEFAULTS.map((pillar) => {
            const pillarVideos = (videos ?? []).filter((v) => v.pillar_id === pillar.id);
            return (
              <section key={pillar.id} className="rounded-2xl border border-border/60 bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <pillar.Icon size={20} weight="duotone" />
                  <h2 className="font-semibold">{pillar.name}</h2>
                  <span className="text-xs text-muted-foreground">
                    {pillarVideos.length} vídeo(s)
                  </span>
                </div>
                {pillarVideos.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum vídeo cadastrado.</p>
                ) : (
                  <ul className="divide-y divide-border/60">
                    {pillarVideos.map((v) => (
                      <li key={v.id} className="flex items-center gap-3 py-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{v.title}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {v.expert_name ? `${v.expert_name} • ` : ""}
                            ID: {v.youtube_id} • ordem {v.display_order}
                          </p>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => openEdit(v)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(v)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{form.id ? "Editar vídeo" : "Novo vídeo"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Pilar</Label>
              <Select
                value={String(form.pillar_id)}
                onValueChange={(val) => setForm((f) => ({ ...f, pillar_id: Number(val) }))}
              >
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
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                maxLength={200}
              />
            </div>
            <div className="space-y-1.5">
              <Label>URL ou ID do YouTube *</Label>
              <Input
                value={form.youtube_input}
                onChange={(e) => setForm((f) => ({ ...f, youtube_input: e.target.value }))}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            <div className="space-y-1.5">
              <Label>Nome do especialista</Label>
              <Input
                value={form.expert_name}
                onChange={(e) => setForm((f) => ({ ...f, expert_name: e.target.value }))}
                maxLength={120}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Descrição</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                maxLength={1000}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Ordem de exibição</Label>
              <Input
                type="number"
                value={form.display_order}
                onChange={(e) =>
                  setForm((f) => ({ ...f, display_order: Number(e.target.value) || 0 }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saveVideo.isPending}>
              {saveVideo.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}