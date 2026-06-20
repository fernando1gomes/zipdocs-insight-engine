import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Medal as PhMedal } from "@phosphor-icons/react";
import { iconForPillar } from "@/lib/pillars";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/_authenticated/autorresponsabilidade")({
  validateSearch: (raw: Record<string, unknown>): { pillarId?: number } => {
    const v = raw?.pillarId;
    const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
    return Number.isFinite(n) && n > 0 ? { pillarId: n } : {};
  },
  head: () => ({
    meta: [
      { title: "Autorresponsabilidade — Vida em Eixo" },
      {
        name: "description",
        content:
          "Espelho da Autorresponsabilidade: descubra sua parte na realidade que você vive e transforme culpa em ação.",
      },
    ],
  }),
  component: AutorresponsabilidadePage,
});

type PillarRow = {
  id: number;
  name: string;
  short_name: string | null;
  icon: string | null;
  current_score: number;
};

const BEHAVIORS: { key: string; label: string; desc: string }[] = [
  { key: "omissao", label: "Omissão", desc: "Eu sabia que precisava agir, mas adiei" },
  { key: "desorganizacao", label: "Desorganização", desc: "Eu não coloquei ordem nessa área" },
  { key: "indisciplina", label: "Falta de disciplina", desc: "Comecei, mas não sustentei" },
  { key: "sem_conversa", label: "Falta de conversa", desc: "Evitei diálogos importantes" },
  { key: "magoa", label: "Mágoa", desc: "Alimentei ressentimentos" },
  { key: "medo", label: "Medo", desc: "Deixei o medo decidir por mim" },
  { key: "orgulho", label: "Orgulho", desc: "Preferi ter razão a resolver" },
  { key: "impulsividade", label: "Impulsividade", desc: "Agi sem pensar nas consequências" },
  { key: "sem_estudo", label: "Falta de estudo", desc: "Não busquei preparo" },
  { key: "vitimismo", label: "Vitimismo", desc: "Esperei que alguém resolvesse por mim" },
  { key: "procrastinacao", label: "Procrastinação", desc: "Empurrei decisões importantes" },
  { key: "crenca", label: "Crença limitante", desc: "Acreditei que não sou capaz ou não mereço" },
];

const BROKEN_EX = [
  "Confiança",
  "Rotina",
  "Saúde",
  "Diálogo",
  "Disciplina",
  "Fé",
  "Organização",
  "Respeito",
  "Autoestima",
];
const MISSING_EX = [
  "Planejamento",
  "Conversa",
  "Perdão",
  "Estudo",
  "Presença",
  "Constância",
  "Clareza",
  "Reserva financeira",
  "Cuidado com o corpo",
  "Tempo de qualidade",
];
const MISPLACED_EX = [
  "Trabalho acima da família",
  "Celular acima da presença",
  "Orgulho acima do amor",
  "Prazer imediato acima da saúde",
  "Aparência acima da realidade financeira",
  "Medo acima da fé",
  "Emoção acima da razão",
  "Desculpa acima da ação",
];

const EXCUSES: { excuse: string; question: string }[] = [
  { excuse: "Não tenho tempo", question: "O que estou colocando como prioridade?" },
  { excuse: "A culpa é dos outros", question: "Qual é a minha parte nisso?" },
  { excuse: "Meu passado me travou", question: "O que posso fazer agora com o que vivi?" },
  { excuse: "Não tenho dinheiro", question: "Que habilidade preciso desenvolver?" },
  { excuse: "Meu cônjuge não muda", question: "O que precisa mudar primeiro em mim?" },
  { excuse: "Minha família é difícil", question: "Como posso me posicionar melhor?" },
  { excuse: "Sou assim mesmo", question: "Que comportamento preciso treinar?" },
  { excuse: "Já tentei de tudo", question: "O que tentei com método e constância?" },
  { excuse: "Ninguém me ajuda", question: "Que pedido claro eu ainda não fiz?" },
  { excuse: "Não consigo", question: "Qual é o menor passo que consigo dar hoje?" },
];

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs transition ${
        active
          ? "bg-primary text-primary-foreground border-transparent"
          : "border-border bg-card hover:bg-secondary"
      }`}
    >
      {label}
    </button>
  );
}

function AutorresponsabilidadePage() {
  const navigate = useNavigate();
  const searchParams = Route.useSearch();
  const [step, setStep] = useState(0); // 0 = intro, 1..7
  const [pillarId, setPillarId] = useState<number | null>(null);
  const [resultText, setResultText] = useState("");
  const [behaviors, setBehaviors] = useState<string[]>([]);
  const [behaviorsReflection, setBehaviorsReflection] = useState("");
  const [broken, setBroken] = useState("");
  const [missing, setMissing] = useState("");
  const [misplaced, setMisplaced] = useState("");
  const [excuse, setExcuse] = useState<string | null>(null);
  const [excuseDecision, setExcuseDecision] = useState("");
  const [commitment, setCommitment] = useState("");
  const [action24h, setAction24h] = useState("");
  const [saving, setSaving] = useState(false);

  // Pre-select pillar coming via ?pillarId= and auto-advance to step 1
  useEffect(() => {
    if (searchParams.pillarId && pillarId == null) {
      setPillarId(searchParams.pillarId);
      if (step === 0) setStep(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.pillarId]);

  const { data: pillars } = useQuery({
    queryKey: ["autorresp-pillars"],
    queryFn: async (): Promise<PillarRow[]> => {
      const { data: ps } = await supabase
        .from("pillars")
        .select("id,name,short_name,icon")
        .eq("is_active", true)
        .order("default_order");
      const { data: ups } = await supabase.from("user_pillars").select("pillar_id,current_score");
      const map = new Map((ups ?? []).map((u) => [u.pillar_id, u.current_score ?? 0]));
      return (ps ?? []).map((p) => ({ ...p, current_score: Number(map.get(p.id) ?? 0) }));
    },
  });

  const sortedPillars = useMemo(() => {
    const arr = [...(pillars ?? [])];
    return arr.sort((a, b) => a.current_score - b.current_score);
  }, [pillars]);

  const currentPillar = (pillars ?? []).find((p) => p.id === pillarId) ?? null;

  const score =
    (resultText.trim() ? 10 : 0) +
    (behaviors.length > 0 || behaviorsReflection.trim() ? 20 : 0) +
    ((broken || missing || misplaced).trim() ? 30 : 0) +
    (excuse && excuseDecision.trim() ? 30 : 0) +
    (action24h.trim() ? 40 : 0);

  // Pré-preenche o compromisso quando entra na etapa 5
  useEffect(() => {
    if (step === 5 && !commitment) {
      const pillarName = currentPillar?.short_name || currentPillar?.name || "__________";
      const tpl = `Eu reconheço que, no pilar ${pillarName}, minha nota atual é consequência de comportamentos, escolhas, omissões, pensamentos e sentimentos que eu venho alimentando.

A partir de hoje, eu assumo a responsabilidade de consertar ${broken || "__________"}, repor ${missing || "__________"} e organizar ${misplaced || "__________"}.

Minha primeira ação nas próximas 24 horas será __________.`;
      setCommitment(tpl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  function toggleBehavior(k: string) {
    setBehaviors((b) => (b.includes(k) ? b.filter((x) => x !== k) : [...b, k]));
  }

  function appendTo(field: "broken" | "missing" | "misplaced", value: string) {
    const setter = field === "broken" ? setBroken : field === "missing" ? setMissing : setMisplaced;
    const cur = field === "broken" ? broken : field === "missing" ? missing : misplaced;
    setter(cur ? `${cur}${cur.endsWith("\n") ? "" : ", "}${value}` : value);
  }

  async function persistSession(): Promise<string | null> {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user || !pillarId) return null;
    const { data, error } = await supabase
      .from("autorresponsabilidade_sessions")
      .insert({
        user_id: u.user.id,
        pillar_id: pillarId,
        current_score: currentPillar?.current_score ?? null,
        result_text: resultText || null,
        behaviors,
        behaviors_reflection: behaviorsReflection || null,
        broken_text: broken || null,
        missing_text: missing || null,
        misplaced_text: misplaced || null,
        excuse: excuse || null,
        excuse_decision: excuseDecision || null,
        commitment: commitment || null,
        action_24h: action24h || null,
        score,
        completed_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (error) {
      toast.error(error.message);
      return null;
    }
    return data?.id ?? null;
  }

  async function saveAndExit() {
    setSaving(true);
    const id = await persistSession();
    setSaving(false);
    if (id) {
      toast.success("Sessão salva!");
      navigate({ to: "/dashboard" });
    }
  }

  async function transformToPlan() {
    if (!pillarId) return;
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) {
      setSaving(false);
      toast.error("Faça login novamente");
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const { data: existing } = await supabase
      .from("pillar_action_plans")
      .select("id")
      .eq("pillar_id", pillarId)
      .eq("user_id", u.user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const payload = {
      user_id: u.user.id,
      pillar_id: pillarId,
      broken_text: broken || null,
      missing_text: missing || null,
      misplaced_text: misplaced || null,
      what: commitment || null,
      why: resultText || null,
      how: action24h || null,
      when_start: today,
      status: "active" as const,
    };

    if (existing?.id) {
      const { error } = await supabase
        .from("pillar_action_plans")
        .update(payload)
        .eq("id", existing.id);
      if (error) {
        setSaving(false);
        toast.error(error.message);
        return;
      }
    } else {
      const { error } = await supabase.from("pillar_action_plans").insert(payload);
      if (error) {
        setSaving(false);
        toast.error(error.message);
        return;
      }
    }

    await persistSession();
    setSaving(false);
    toast.success("Conteúdo enviado para o Plano de Ação!");
    navigate({ to: "/plano-acao/$pillarId", params: { pillarId: String(pillarId) } });
  }

  function canAdvance(): boolean {
    if (step === 1) return !!pillarId && resultText.trim().length > 0;
    if (step === 2) return behaviors.length > 0 || behaviorsReflection.trim().length > 0;
    if (step === 3) return (broken + missing + misplaced).trim().length > 0;
    if (step === 4) return !!excuse && excuseDecision.trim().length > 0;
    if (step === 5) return commitment.trim().length > 0;
    if (step === 6) return action24h.trim().length > 0;
    return true;
  }

  const totalSteps = 7;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-6 md:px-8 md:py-8">
        <AppHeader />

        <div className="mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight">Espelho da Autorresponsabilidade</h1>
            <ConceptInfoDialog />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Pare de culpar. Comece a transformar.
          </p>
          {step > 0 && (
            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="h-2 flex-1 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-[color:var(--primary)] transition-all"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">
                Etapa {step} de {totalSteps} · {score} pts
              </div>
            </div>
          )}
        </div>

        {step === 0 && (
          <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
            <p className="text-base leading-relaxed">
              “Você não controla tudo que acontece, mas é responsável pelo que faz com aquilo que
              acontece. Escolha um pilar da sua vida e descubra qual é a sua parte na transformação.”
            </p>
            <Button onClick={() => setStep(1)}>Começar minha análise</Button>
          </section>
        )}

        {step === 1 && (
          <section className="space-y-5">
            <div>
              <h2 className="text-lg font-bold mb-2">1. Meu resultado atual</h2>
              <p className="text-sm text-muted-foreground">
                Escolha um pilar para trabalhar agora (priorizamos os com menor nota):
              </p>
            </div>
            <ul className="grid gap-2 md:grid-cols-2">
              {sortedPillars.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setPillarId(p.id)}
                    className={`w-full text-left rounded-xl border p-3 transition ${
                      pillarId === p.id
                        ? "border-[color:var(--primary)] bg-secondary"
                        : "border-border bg-card hover:bg-secondary"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {(() => {
                        const Icon = iconForPillar(p.id);
                        return <Icon weight="light" className="h-7 w-7 shrink-0 text-[color:var(--primary)]" />;
                      })()}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{p.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Nota atual: {p.current_score}/10
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>

            {pillarId && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Qual é o resultado real que você está colhendo nesse pilar?
                </label>
                <Textarea
                  rows={4}
                  value={resultText}
                  onChange={(e) => setResultText(e.target.value)}
                  placeholder='Ex.: "Estou endividado", "meu casamento está frio", "vivo ansioso"...'
                />
              </div>
            )}
          </section>
        )}

        {step === 2 && (
          <section className="space-y-5">
            <div>
              <h2 className="text-lg font-bold mb-2">2. Meu plantio</h2>
              <p className="text-sm text-muted-foreground">
                O que você tem plantado para colher esse resultado? Selecione os comportamentos:
              </p>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {BEHAVIORS.map((b) => {
                const active = behaviors.includes(b.key);
                return (
                  <button
                    key={b.key}
                    type="button"
                    onClick={() => toggleBehavior(b.key)}
                    className={`text-left rounded-xl border p-3 transition ${
                      active
                        ? "border-[color:var(--primary)] bg-secondary"
                        : "border-border bg-card hover:bg-secondary"
                    }`}
                  >
                    <div className="font-semibold text-sm">{b.label}</div>
                    <div className="text-xs text-muted-foreground">{b.desc}</div>
                  </button>
                );
              })}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Agora escreva com suas palavras: como esses comportamentos contribuíram para sua nota
                atual?
              </label>
              <Textarea
                rows={4}
                value={behaviorsReflection}
                onChange={(e) => setBehaviorsReflection(e.target.value)}
                placeholder="Minha parte nisso foi..."
              />
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-bold mb-2">3. Quebrado, faltando ou fora do lugar</h2>
              <p className="text-sm text-muted-foreground">
                Toque nos exemplos para adicionar, ou escreva os seus.
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
              <h3 className="font-bold">O que está quebrado?</h3>
              <div className="flex flex-wrap gap-2">
                {BROKEN_EX.map((x) => (
                  <Chip key={x} label={x} onClick={() => appendTo("broken", x)} />
                ))}
              </div>
              <Textarea rows={3} value={broken} onChange={(e) => setBroken(e.target.value)} />
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
              <h3 className="font-bold">O que está faltando?</h3>
              <div className="flex flex-wrap gap-2">
                {MISSING_EX.map((x) => (
                  <Chip key={x} label={x} onClick={() => appendTo("missing", x)} />
                ))}
              </div>
              <Textarea rows={3} value={missing} onChange={(e) => setMissing(e.target.value)} />
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
              <h3 className="font-bold">O que está fora do lugar?</h3>
              <div className="flex flex-wrap gap-2">
                {MISPLACED_EX.map((x) => (
                  <Chip key={x} label={x} onClick={() => appendTo("misplaced", x)} />
                ))}
              </div>
              <Textarea
                rows={3}
                value={misplaced}
                onChange={(e) => setMisplaced(e.target.value)}
              />
            </div>

            <p className="text-sm italic text-muted-foreground border-l-2 border-[color:var(--primary)] pl-3">
              “O caos permanece onde eu tolero o quebrado, o faltando e o fora do lugar.”
            </p>
          </section>
        )}

        {step === 4 && (
          <section className="space-y-5">
            <div>
              <h2 className="text-lg font-bold mb-2">4. Troca de desculpas por poder</h2>
              <p className="text-sm text-muted-foreground">
                Qual desculpa você mais usa nesse pilar?
              </p>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {EXCUSES.map((e) => {
                const active = excuse === e.excuse;
                return (
                  <button
                    key={e.excuse}
                    type="button"
                    onClick={() => setExcuse(e.excuse)}
                    className={`text-left rounded-xl border p-3 transition ${
                      active
                        ? "border-[color:var(--primary)] bg-secondary"
                        : "border-border bg-card hover:bg-secondary"
                    }`}
                  >
                    <div className="font-semibold text-sm">“{e.excuse}”</div>
                    <div className="text-xs text-muted-foreground mt-1">{e.question}</div>
                  </button>
                );
              })}
            </div>
            {excuse && (
              <div className="space-y-2 rounded-xl border border-border/60 bg-card p-4">
                <div className="text-sm">
                  <span className="font-medium">Desculpa escolhida:</span> “{excuse}”
                </div>
                <label className="text-sm font-medium">
                  Transforme essa desculpa em uma decisão:
                </label>
                <Textarea
                  rows={4}
                  value={excuseDecision}
                  onChange={(e) => setExcuseDecision(e.target.value)}
                  placeholder="O que você vai parar, reduzir ou reorganizar?"
                />
              </div>
            )}
          </section>
        )}

        {step === 5 && (
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold mb-2">5. Minha decisão de autorresponsabilidade</h2>
              <p className="text-sm text-muted-foreground">
                Ajuste o texto abaixo com suas próprias palavras.
              </p>
            </div>
            <Textarea
              rows={10}
              value={commitment}
              onChange={(e) => setCommitment(e.target.value)}
            />
          </section>
        )}

        {step === 6 && (
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold mb-2">6. Ação de 24 horas</h2>
              <p className="text-sm text-muted-foreground">
                Qual ação prática você fará nas próximas 24 horas?
              </p>
            </div>
            <Textarea
              rows={5}
              value={action24h}
              onChange={(e) => setAction24h(e.target.value)}
              placeholder="Ex.: vou listar todas as minhas dívidas e gastos fixos."
            />
          </section>
        )}

        {step === 7 && (
          <section className="space-y-5">
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm text-center space-y-2">
              <PhMedal size={48} weight="light" className="mx-auto text-[color:var(--accent)]" />
              <h2 className="text-xl font-extrabold">Selo: Eu Assumo</h2>
              <p className="text-sm text-muted-foreground">
                Hoje você saiu da posição de vítima e entrou na posição de autor da própria
                história.
              </p>
              <div className="text-sm font-semibold pt-2">Pontuação: {score} pts</div>
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-4 text-sm space-y-2">
              <div>
                <span className="font-semibold">Pilar trabalhado:</span>{" "}
                {currentPillar?.name ?? "—"} ({currentPillar?.current_score ?? 0}/10)
              </div>
              {resultText && (
                <div>
                  <span className="font-semibold">Resultado atual:</span> {resultText}
                </div>
              )}
              {behaviors.length > 0 && (
                <div>
                  <span className="font-semibold">Meu plantio:</span>{" "}
                  {behaviors
                    .map((k) => BEHAVIORS.find((b) => b.key === k)?.label)
                    .filter(Boolean)
                    .join(", ")}
                </div>
              )}
              {broken && (
                <div>
                  <span className="font-semibold">Quebrado:</span> {broken}
                </div>
              )}
              {missing && (
                <div>
                  <span className="font-semibold">Faltando:</span> {missing}
                </div>
              )}
              {misplaced && (
                <div>
                  <span className="font-semibold">Fora do lugar:</span> {misplaced}
                </div>
              )}
              {excuse && (
                <div>
                  <span className="font-semibold">Desculpa substituída:</span> “{excuse}” →{" "}
                  {excuseDecision}
                </div>
              )}
              {action24h && (
                <div>
                  <span className="font-semibold">Ação de 24h:</span> {action24h}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={saveAndExit} disabled={saving}>
                {saving ? "Salvando..." : "Salvar e voltar"}
              </Button>
              <Button onClick={transformToPlan} disabled={saving}>
                {saving ? "Enviando..." : "Transformar em Plano de Ação"}
              </Button>
            </div>
          </section>
        )}

        {step > 0 && step < 7 && (
          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))}>
              ← Voltar
            </Button>
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canAdvance()}>
              Próxima →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ConceptInfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          aria-label="Entenda o conceito: quebrado, faltando ou fora do lugar"
        >
          <Info className="h-5 w-5 text-[color:var(--primary)]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quebrado, faltando ou fora do lugar</DialogTitle>
          <DialogDescription>
            Uma forma simples e poderosa de identificar onde o caos entrou em uma área da vida.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Sempre que existe dor, desordem, sofrimento ou resultado ruim em um pilar da vida,
            provavelmente existe algo quebrado, algo faltando ou algo fora do lugar. A ideia
            aparece quando Paulo explica que a paz, ou “Shalom”, representa uma vida sem nada
            quebrado, nada faltando e nada fora do lugar — ou seja, uma vida em ordem, inteira e
            funcional.
          </p>

          <Accordion type="multiple" className="w-full">
            <AccordionItem value="broken">
              <AccordionTrigger>1. O que está quebrado?</AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p>
                  É algo que existia, mas foi danificado. Pode ser uma confiança, uma rotina, uma
                  aliança, uma autoestima, uma disciplina, uma saúde, uma comunicação ou uma
                  conexão.
                </p>
                <div className="rounded-lg border border-border/60 bg-secondary/50 p-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="font-medium">Casamento</div>
                    <div>Confiança quebrada</div>
                    <div className="font-medium">Família</div>
                    <div>Diálogo quebrado</div>
                    <div className="font-medium">Saúde</div>
                    <div>Rotina quebrada</div>
                    <div className="font-medium">Finanças</div>
                    <div>Controle financeiro quebrado</div>
                    <div className="font-medium">Emocional</div>
                    <div>Autoestima quebrada</div>
                    <div className="font-medium">Profissional</div>
                    <div>Compromisso quebrado</div>
                    <div className="font-medium">Espiritual</div>
                    <div>Fé enfraquecida ou quebrada</div>
                  </div>
                </div>
                <p>
                  <span className="font-medium">Pergunta poderosa:</span> O que foi danificado
                  nessa área da minha vida e precisa ser restaurado?
                </p>
                <p className="text-muted-foreground">
                  Exemplo prático: No casamento, talvez o que esteja quebrado seja a confiança. Não
                  adianta criar uma viagem romântica se a confiança continua quebrada. Primeiro
                  precisa restaurar aquilo que foi ferido.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="missing">
              <AccordionTrigger>2. O que está faltando?</AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p>
                  É algo necessário que não está presente. Não está necessariamente danificado —
                  simplesmente não existe, não foi colocado, não foi desenvolvido ou não está sendo
                  praticado.
                </p>
                <div className="rounded-lg border border-border/60 bg-secondary/50 p-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="font-medium">Saúde</div>
                    <div>Exercício, sono, exames, alimentação</div>
                    <div className="font-medium">Finanças</div>
                    <div>Reserva, planejamento, orçamento</div>
                    <div className="font-medium">Família</div>
                    <div>Presença, tempo de qualidade, escuta</div>
                    <div className="font-medium">Relacionamento</div>
                    <div>Carinho, diálogo, admiração</div>
                    <div className="font-medium">Carreira</div>
                    <div>Estudo, capacitação, estratégia</div>
                    <div className="font-medium">Emocional</div>
                    <div>Autoconhecimento, perdão, regulação</div>
                    <div className="font-medium">Espiritual</div>
                    <div>Oração, silêncio, comunhão, fé prática</div>
                  </div>
                </div>
                <p>
                  <span className="font-medium">Pergunta poderosa:</span> O que está ausente
                  nessa área e precisa ser reposto ou desenvolvido?
                </p>
                <p className="text-muted-foreground">
                  Exemplo prático: Na vida financeira, talvez não exista uma reserva de emergência.
                  Então não é apenas “ganhar mais dinheiro”. O que está faltando é planejamento,
                  organização e reserva.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="misplaced">
              <AccordionTrigger>3. O que está fora do lugar?</AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p>
                  É algo que até existe, mas está ocupando a posição errada, com prioridade errada,
                  intensidade errada ou função errada.
                </p>
                <div className="rounded-lg border border-border/60 bg-secondary/50 p-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="font-medium">Família</div>
                    <div>Trabalho acima dos filhos</div>
                    <div className="font-medium">Casamento</div>
                    <div>Orgulho acima do amor</div>
                    <div className="font-medium">Saúde</div>
                    <div>Prazer imediato acima do cuidado</div>
                    <div className="font-medium">Finanças</div>
                    <div>Aparência acima da realidade</div>
                    <div className="font-medium">Emocional</div>
                    <div>Medo acima da fé</div>
                    <div className="font-medium">Profissional</div>
                    <div>Urgência acima do propósito</div>
                    <div className="font-medium">Espiritual</div>
                    <div>Discurso acima da prática</div>
                    <div className="font-medium">Social</div>
                    <div>Opinião dos outros acima da identidade</div>
                  </div>
                </div>
                <p>
                  <span className="font-medium">Pergunta poderosa:</span> O que existe nessa
                  área, mas está ocupando um lugar que não deveria ocupar?
                </p>
                <p className="text-muted-foreground">
                  Exemplo prático: A pessoa ama a família, mas colocou o trabalho em primeiro
                  lugar absoluto. O trabalho não é ruim. O problema é que ele está fora do lugar.
                  Ele virou dono da agenda, dono da energia e dono da presença.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="apply">
              <AccordionTrigger>4. Como aplicar em cada pilar da vida</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-1">
                  <div className="font-medium">Saúde e disposição</div>
                  <ul className="list-disc pl-4 text-muted-foreground">
                    <li>Quebrado: sono, rotina, metabolismo, disciplina.</li>
                    <li>Faltando: exercício, água, exames, descanso.</li>
                    <li>Fora do lugar: prazer imediato acima da saúde.</li>
                  </ul>
                  <p className="text-xs italic">
                    O que estou fazendo com meu corpo que mostra falta de cuidado comigo?
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="font-medium">Equilíbrio emocional</div>
                  <ul className="list-disc pl-4 text-muted-foreground">
                    <li>Quebrado: autoestima, segurança, paz interior.</li>
                    <li>Faltando: autoconhecimento, perdão, domínio emocional.</li>
                    <li>Fora do lugar: emoção mandando na razão.</li>
                  </ul>
                  <p className="text-xs italic">Que emoção tem governado minhas decisões?</p>
                </div>
                <div className="space-y-1">
                  <div className="font-medium">Recursos financeiros</div>
                  <ul className="list-disc pl-4 text-muted-foreground">
                    <li>Quebrado: controle financeiro, crédito, confiança com dinheiro.</li>
                    <li>Faltando: orçamento, reserva, educação financeira.</li>
                    <li>Fora do lugar: consumo acima da realidade.</li>
                  </ul>
                  <p className="text-xs italic">
                    Onde eu estou tentando parecer próspero antes de ser organizado?
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="font-medium">Família</div>
                  <ul className="list-disc pl-4 text-muted-foreground">
                    <li>Quebrado: diálogo, respeito, confiança.</li>
                    <li>Faltando: presença, afeto, escuta, perdão.</li>
                    <li>Fora do lugar: celular, trabalho ou orgulho acima da conexão.</li>
                  </ul>
                  <p className="text-xs italic">
                    O que minha família mais precisa de mim e eu não tenho entregue?
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="font-medium">Relacionamento amoroso</div>
                  <ul className="list-disc pl-4 text-muted-foreground">
                    <li>Quebrado: admiração, intimidade, confiança.</li>
                    <li>Faltando: conversa, carinho, parceria, verdade.</li>
                    <li>Fora do lugar: razão acima da conexão, orgulho acima do amor.</li>
                  </ul>
                  <p className="text-xs italic">Eu quero resolver ou quero vencer?</p>
                </div>
                <div className="space-y-1">
                  <div className="font-medium">Carreira e profissão</div>
                  <ul className="list-disc pl-4 text-muted-foreground">
                    <li>Quebrado: motivação, reputação, compromisso, performance.</li>
                    <li>Faltando: capacitação, estratégia, constância, mentoria.</li>
                    <li>Fora do lugar: reclamação acima do preparo.</li>
                  </ul>
                  <p className="text-xs italic">
                    O que eu ainda não aprendi, mas continuo usando como desculpa para não crescer?
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="font-medium">Espiritualidade</div>
                  <ul className="list-disc pl-4 text-muted-foreground">
                    <li>Quebrado: fé, coerência, confiança.</li>
                    <li>Faltando: oração, prática, gratidão, serviço.</li>
                    <li>Fora do lugar: medo acima da fé, discurso acima da prática.</li>
                  </ul>
                  <p className="text-xs italic">
                    Minha fé está aparecendo nas minhas escolhas ou só nas minhas palavras?
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="summary">
              <AccordionTrigger>5. Resumo simples</AccordionTrigger>
              <AccordionContent>
                <div className="rounded-lg border border-border/60 bg-secondary/50 p-3">
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                    <div className="font-medium">Quebrado</div>
                    <div>Algo foi danificado → O que precisa ser restaurado?</div>
                    <div className="font-medium">Faltando</div>
                    <div>Algo necessário está ausente → O que precisa ser reposto?</div>
                    <div className="font-medium">Fora do lugar</div>
                    <div>Algo está em posição errada → O que precisa ser reorganizado?</div>
                  </div>
                </div>
                <p className="mt-3 text-muted-foreground">
                  A força dessa ferramenta é que tira a pessoa da reclamação genérica. Em vez de
                  dizer “Minha vida financeira está ruim”, ela começa a dizer: “Meu controle
                  financeiro está quebrado, está faltando orçamento e meus gastos por aparência
                  estão fora do lugar.” Agora existe clareza. E onde existe clareza, pode existir
                  ação.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
}
