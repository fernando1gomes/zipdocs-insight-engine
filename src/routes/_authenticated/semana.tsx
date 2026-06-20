import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { CaretLeft, CaretRight, Plus, Funnel, Sparkle, NotePencil } from "@phosphor-icons/react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PILLAR_DEFAULTS, iconForPillar } from "@/lib/pillars";
import {
  listWeekActions,
  createScheduledAction,
  updateActionStatus,
  rescheduleAction,
  submitDailyClosing,
  generateClosingSummary,
} from "@/lib/calendar.functions";
import {
  WEEK_DAYS,
  HOUR_START,
  HOUR_END,
  SLOT_HEIGHT_PX,
  SLOT_MINUTES,
  startOfWeek,
  addDays,
  formatWeekLabel,
  formatDayHeader,
  formatHour,
  formatTimeRange,
  topPxFromTime,
  heightPxFromMinutes,
  dayIndex,
  buildDateTime,
  STATUS_LABEL,
  STATUS_TOKEN,
  NON_EXECUTION_REASONS,
  type CalendarStatus,
} from "@/lib/calendar-utils";

export const Route = createFileRoute("/_authenticated/semana")({
  head: () => ({
    meta: [
      { title: "Semana em Eixo — Calendário" },
      {
        name: "description",
        content:
          "Distribua as ações dos seus planos ao longo da semana e acompanhe a execução com leveza.",
      },
    ],
  }),
  component: SemanaPage,
});

type ActionRow = {
  id: string;
  pillar_id: number;
  title: string;
  description: string | null;
  action_type: string;
  frequency_type: string | null;
  priority: string;
  obstacle_expected: string | null;
  required_resource: string | null;
  status: string;
  calendar_status: string;
  scheduled_start: string | null;
  scheduled_end: string | null;
  duration_minutes: number | null;
  reminder_enabled: boolean;
  reminder_at: string | null;
  completed_at: string | null;
};

function SemanaPage() {
  const qc = useQueryClient();
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date()));
  const [activeDay, setActiveDay] = useState<number>(() => {
    const idx = dayIndex(startOfWeek(new Date()), new Date().toISOString());
    return Math.max(0, Math.min(6, idx));
  });
  const [detailAction, setDetailAction] = useState<ActionRow | null>(null);
  const [createSlot, setCreateSlot] = useState<{
    day: Date;
    hour: number;
    minute: number;
    durationMinutes?: number;
  } | null>(null);
  const [filterPillar, setFilterPillar] = useState<number | "all">("all");
  const [filterStatus, setFilterStatus] = useState<CalendarStatus | "all">("all");
  const [summaryDay, setSummaryDay] = useState<number | null>(null);
  const [closeDayOpen, setCloseDayOpen] = useState(false);

  const weekEnd = useMemo(() => addDays(weekStart, 7), [weekStart]);

  const fetchWeek = useServerFn(listWeekActions);
  const { data, isLoading } = useQuery({
    queryKey: ["calendar-week", weekStart.toISOString()],
    queryFn: () =>
      fetchWeek({
        data: { weekStart: weekStart.toISOString(), weekEnd: weekEnd.toISOString() },
      }),
  });
  const actions: ActionRow[] = (data?.actions ?? []) as ActionRow[];

  const filteredActions = useMemo(() => {
    return actions.filter((a) => {
      if (filterPillar !== "all" && a.pillar_id !== filterPillar) return false;
      if (filterStatus !== "all" && (a.calendar_status ?? "planned") !== filterStatus) return false;
      return true;
    });
  }, [actions, filterPillar, filterStatus]);

  function invalidate() {
    qc.invalidateQueries({ queryKey: ["calendar-week"] });
    qc.invalidateQueries({ queryKey: ["actions"] });
    qc.invalidateQueries({ queryKey: ["user-pillars"] });
    qc.invalidateQueries({ queryKey: ["alerts"] });
    qc.invalidateQueries({ queryKey: ["daily-closing"] });
  }

  const hours = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);
  const totalHeight = hours.length * (60 / SLOT_MINUTES) * SLOT_HEIGHT_PX;

  function actionsForDay(idx: number): ActionRow[] {
    return filteredActions.filter(
      (a) => a.scheduled_start && dayIndex(weekStart, a.scheduled_start) === idx,
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-8 md:py-8">
        <AppHeader />

        <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Semana em Eixo</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Pequenas ações consistentes geram equilíbrio. Distribua seus compromissos com leveza.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWeekStart((d) => addDays(d, -7))}
              aria-label="Semana anterior"
            >
              <CaretLeft size={16} weight="bold" />
            </Button>
            <Button variant="outline" onClick={() => setWeekStart(startOfWeek(new Date()))}>
              Hoje
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWeekStart((d) => addDays(d, 7))}
              aria-label="Próxima semana"
            >
              <CaretRight size={16} weight="bold" />
            </Button>
            <span className="ml-3 text-sm font-semibold text-foreground">
              {formatWeekLabel(weekStart)}
            </span>
          </div>
        </header>

        {/* Barra de filtros + resumo do dia */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Funnel size={14} weight="light" /> Filtros:
          </div>
          <select
            value={filterPillar === "all" ? "all" : String(filterPillar)}
            onChange={(e) =>
              setFilterPillar(e.target.value === "all" ? "all" : Number(e.target.value))
            }
            className="h-8 rounded-md border border-input bg-background px-2 text-xs"
          >
            <option value="all">Todos os pilares</option>
            {PILLAR_DEFAULTS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as CalendarStatus | "all")}
            className="h-8 rounded-md border border-input bg-background px-2 text-xs"
          >
            <option value="all">Todos os status</option>
            {(Object.keys(STATUS_LABEL) as CalendarStatus[]).map((s) => (
              <option key={s} value={s}>{STATUS_LABEL[s]}</option>
            ))}
          </select>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto gap-1.5"
            onClick={() => {
              const idx = dayIndex(weekStart, new Date().toISOString());
              setSummaryDay(idx >= 0 && idx < 7 ? idx : activeDay);
            }}
          >
            <Sparkle size={14} weight="light" /> Resumo de hoje
          </Button>
        </div>

        {/* Mobile: tabs de dia */}
        <div className="mb-4 flex gap-1 overflow-x-auto md:hidden">
          {WEEK_DAYS.map((d, i) => {
            const date = addDays(weekStart, i);
            const isActive = i === activeDay;
            return (
              <button
                key={d.key}
                onClick={() => setActiveDay(i)}
                className={`shrink-0 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  isActive
                    ? "bg-[color:var(--primary)] text-primary-foreground"
                    : "bg-secondary text-foreground/70"
                }`}
              >
                <div>{d.label}</div>
                <div className="text-[10px] opacity-80">{formatDayHeader(date)}</div>
              </button>
            );
          })}
        </div>

        <div className="rounded-3xl border border-border/60 bg-card shadow-sm overflow-hidden">
          {/* Header de dias (desktop) */}
          <div className="hidden md:grid border-b border-border/60 bg-secondary/30" style={gridCols()}>
            <div className="px-2 py-3 text-[11px] uppercase tracking-wider text-muted-foreground">
              Horário
            </div>
            {WEEK_DAYS.map((d, i) => {
              const date = addDays(weekStart, i);
              const today =
                date.toDateString() === new Date().toDateString();
              return (
                <div
                  key={d.key}
                  className={`px-3 py-3 text-center ${
                    today ? "bg-[color:var(--primary)]/10" : ""
                  }`}
                >
                  <div className="text-sm font-bold">{d.label}</div>
                  <div className="text-xs text-muted-foreground">{formatDayHeader(date)}</div>
                </div>
              );
            })}
          </div>

          {/* Grade */}
          <div className="relative overflow-x-auto">
            <div className="hidden md:grid relative" style={gridCols()}>
              {/* coluna de horas */}
              <div className="border-r border-border/60">
                {hours.map((h) => (
                  <div
                    key={h}
                    className="text-[11px] text-muted-foreground px-2"
                    style={{ height: (60 / SLOT_MINUTES) * SLOT_HEIGHT_PX }}
                  >
                    {formatHour(h)}
                  </div>
                ))}
              </div>
              {/* colunas de dias */}
              {WEEK_DAYS.map((d, i) => (
                <DayColumn
                  key={d.key}
                  day={addDays(weekStart, i)}
                  actions={actionsForDay(i)}
                  totalHeight={totalHeight}
                  onSlotRangeSelect={(hour, minute, durationMinutes) =>
                    setCreateSlot({
                      day: addDays(weekStart, i),
                      hour,
                      minute,
                      durationMinutes,
                    })
                  }
                  onActionClick={setDetailAction}
                />
              ))}
            </div>

            {/* mobile: apenas um dia */}
            <div className="md:hidden grid" style={{ gridTemplateColumns: "60px 1fr" }}>
              <div className="border-r border-border/60">
                {hours.map((h) => (
                  <div
                    key={h}
                    className="text-[11px] text-muted-foreground px-2"
                    style={{ height: (60 / SLOT_MINUTES) * SLOT_HEIGHT_PX }}
                  >
                    {formatHour(h)}
                  </div>
                ))}
              </div>
              <DayColumn
                day={addDays(weekStart, activeDay)}
                actions={actionsForDay(activeDay)}
                totalHeight={totalHeight}
                onSlotRangeSelect={(hour, minute, durationMinutes) =>
                  setCreateSlot({
                    day: addDays(weekStart, activeDay),
                    hour,
                    minute,
                    durationMinutes,
                  })
                }
                onActionClick={setDetailAction}
              />
            </div>
          </div>
        </div>

        {isLoading && (
          <p className="mt-3 text-xs text-muted-foreground">Carregando agenda…</p>
        )}

        {actions.length === 0 && !isLoading && (
          <p className="mt-4 text-sm text-muted-foreground">
            Nenhuma ação agendada nesta semana. Toque em um horário vazio para criar a primeira.
          </p>
        )}
      </div>

      {detailAction && (
        <ActionDetailDialog
          action={detailAction}
          onClose={() => setDetailAction(null)}
          onChanged={invalidate}
        />
      )}

      {createSlot && (
        <CreateActionDialog
          slot={createSlot}
          onClose={() => setCreateSlot(null)}
          onCreated={invalidate}
        />
      )}

      {/* Drawer de resumo do dia */}
      <DaySummarySheet
        open={summaryDay !== null}
        onClose={() => setSummaryDay(null)}
        day={summaryDay !== null ? addDays(weekStart, summaryDay) : null}
        actions={summaryDay !== null ? actionsForDay(summaryDay) : []}
        onActionClick={(a) => {
          setSummaryDay(null);
          setDetailAction(a);
        }}
      />

      {/* Botão flutuante "Fechar meu dia" — visível a partir das 18h */}
      {new Date().getHours() >= 18 && (
        <Button
          onClick={() => setCloseDayOpen(true)}
          className="fixed bottom-6 right-6 z-30 h-12 rounded-full shadow-lg gap-2"
        >
          <NotePencil size={18} weight="light" /> Fechar meu dia
        </Button>
      )}

      {closeDayOpen && (
        <CloseDayDialog
          onClose={() => setCloseDayOpen(false)}
          onSubmitted={invalidate}
        />
      )}
    </div>
  );
}

function gridCols(): React.CSSProperties {
  return { gridTemplateColumns: "60px repeat(7, minmax(110px, 1fr))" };
}

function DayColumn({
  day,
  actions,
  totalHeight,
  onSlotRangeSelect,
  onActionClick,
}: {
  day: Date;
  actions: ActionRow[];
  totalHeight: number;
  onSlotRangeSelect: (hour: number, minute: number, durationMinutes: number) => void;
  onActionClick: (a: ActionRow) => void;
}) {
  const slotsPerHour = 60 / SLOT_MINUTES;
  const totalSlots = (HOUR_END - HOUR_START) * slotsPerHour;
  const isToday = day.toDateString() === new Date().toDateString();
  const layerRef = useRef<HTMLDivElement | null>(null);
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);
  const draggingRef = useRef(false);

  // Conjunto de slots ocupados por ações existentes (para impedir início/expansão sobre blocos)
  const occupied = useMemo(() => {
    const set = new Set<number>();
    for (const a of actions) {
      if (!a.scheduled_start) continue;
      const d = new Date(a.scheduled_start);
      const startIdx =
        (d.getHours() - HOUR_START) * slotsPerHour + Math.floor(d.getMinutes() / SLOT_MINUTES);
      const slots = Math.max(1, Math.ceil((a.duration_minutes ?? SLOT_MINUTES) / SLOT_MINUTES));
      for (let k = 0; k < slots; k++) set.add(startIdx + k);
    }
    return set;
  }, [actions, slotsPerHour]);

  function slotFromEvent(e: React.PointerEvent<HTMLDivElement>): number | null {
    const el = layerRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const idx = Math.floor(y / SLOT_HEIGHT_PX);
    if (idx < 0 || idx >= totalSlots) return null;
    return idx;
  }

  function clampRange(start: number, end: number): { start: number; end: number } {
    const lo = Math.min(start, end);
    const hi = Math.max(start, end);
    // Limita expansão se cruzar slot ocupado
    let clampedLo = lo;
    let clampedHi = hi;
    if (end >= start) {
      for (let k = start + 1; k <= hi; k++) {
        if (occupied.has(k)) { clampedHi = k - 1; break; }
      }
    } else {
      for (let k = start - 1; k >= lo; k--) {
        if (occupied.has(k)) { clampedLo = k + 1; break; }
      }
    }
    return { start: clampedLo, end: clampedHi };
  }

  function commit(start: number, end: number) {
    const lo = Math.min(start, end);
    const hi = Math.max(start, end);
    const slots = hi - lo + 1;
    const hour = HOUR_START + Math.floor(lo / slotsPerHour);
    const minute = (lo % slotsPerHour) * SLOT_MINUTES;
    onSlotRangeSelect(hour, minute, slots * SLOT_MINUTES);
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const idx = slotFromEvent(e);
    if (idx === null) return;
    if (occupied.has(idx)) return;
    draggingRef.current = true;
    setSelection({ start: idx, end: idx });
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current || !selection) return;
    const idx = slotFromEvent(e);
    if (idx === null) return;
    const next = clampRange(selection.start, idx);
    if (next.start !== selection.start || next.end !== selection.end) {
      setSelection(next);
    }
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current || !selection) {
      draggingRef.current = false;
      return;
    }
    draggingRef.current = false;
    const sel = selection;
    setSelection(null);
    (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    commit(sel.start, sel.end);
  }

  function handlePointerCancel() {
    draggingRef.current = false;
    setSelection(null);
  }

  return (
    <div
      className={`relative border-r border-border/60 last:border-r-0 ${
        isToday ? "bg-[color:var(--primary)]/[0.04]" : ""
      }`}
      style={{ height: totalHeight }}
    >
      {/* linhas guia dos slots */}
      {Array.from({ length: totalSlots }).map((_, i) => {
        const onHour = i % slotsPerHour === 0;
        return (
          <div
            key={i}
            aria-hidden
            className={`absolute left-0 right-0 border-t ${
              onHour ? "border-border/50" : "border-border/20"
            }`}
            style={{ top: i * SLOT_HEIGHT_PX, height: SLOT_HEIGHT_PX }}
          />
        );
      })}

      {/* camada de seleção por arraste */}
      <div
        ref={layerRef}
        role="grid"
        aria-label={`Selecionar horário em ${formatDayHeader(day)} (arraste para cobrir mais tempo)`}
        className="absolute inset-0 z-[1] touch-none cursor-cell hover:bg-[color:var(--primary)]/5"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      />

      {/* overlay da seleção atual */}
      {selection && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1 right-1 z-[2] rounded-lg border border-dashed border-[color:var(--primary)] bg-[color:var(--primary)]/15"
          style={{
            top: Math.min(selection.start, selection.end) * SLOT_HEIGHT_PX,
            height:
              (Math.abs(selection.end - selection.start) + 1) * SLOT_HEIGHT_PX,
          }}
        >
          <div className="px-2 py-1 text-[10px] font-semibold text-[color:var(--primary)]">
            {(Math.abs(selection.end - selection.start) + 1) * SLOT_MINUTES} min
          </div>
        </div>
      )}

      {/* blocos de ação */}
      {actions.map((a) => {
        if (!a.scheduled_start) return null;
        const Icon = iconForPillar(a.pillar_id);
        const status = (a.calendar_status as CalendarStatus) ?? "planned";
        const token = STATUS_TOKEN[status];
        const top = topPxFromTime(a.scheduled_start);
        const height = heightPxFromMinutes(a.duration_minutes);
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => onActionClick(a)}
            className="absolute left-1 right-1 rounded-xl border bg-card text-left shadow-sm hover:shadow-md transition overflow-hidden"
            style={{
              top,
              height,
              borderColor: token.ring,
              background: `color-mix(in oklab, ${token.bg} 50%, var(--card))`,
            }}
          >
            <div className="flex items-start gap-2 p-2">
              <Icon weight="light" className="h-4 w-4 mt-0.5 shrink-0" style={{ color: token.fg }} />
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold leading-tight truncate">
                  {a.title}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {formatTimeRange(a.scheduled_start, a.scheduled_end)}
                </div>
                <span
                  className="mt-1 inline-block rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
                  style={{ background: token.bg, color: token.fg }}
                >
                  {STATUS_LABEL[status]}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ActionDetailDialog({
  action,
  onClose,
  onChanged,
}: {
  action: ActionRow;
  onClose: () => void;
  onChanged: () => void;
}) {
  const updateFn = useServerFn(updateActionStatus);
  const rescheduleFn = useServerFn(rescheduleAction);
  const pillar = PILLAR_DEFAULTS.find((p) => p.id === action.pillar_id);
  const Icon = iconForPillar(action.pillar_id);
  const [mode, setMode] = useState<"view" | "missed" | "reschedule">("view");
  const [reason, setReason] = useState<string>(NON_EXECUTION_REASONS[0]);
  const [note, setNote] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState<string>(
    action.scheduled_start ? action.scheduled_start.slice(0, 10) : "",
  );
  const [rescheduleTime, setRescheduleTime] = useState<string>(
    action.scheduled_start ? action.scheduled_start.slice(11, 16) : "08:00",
  );

  const mutate = useMutation({
    mutationFn: updateFn,
    onSuccess: () => {
      onChanged();
      onClose();
      toast.success("Atualizado");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro"),
  });

  const remute = useMutation({
    mutationFn: rescheduleFn,
    onSuccess: () => {
      onChanged();
      onClose();
      toast.success("Ação reagendada");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro"),
  });

  function doStatus(status: "done" | "missed" | "cancelled") {
    mutate.mutate({
      data: {
        actionId: action.id,
        status,
        reason: status === "missed" ? reason : undefined,
        note: note || undefined,
      },
    });
  }

  function doReschedule() {
    const [h, m] = rescheduleTime.split(":").map(Number);
    const base = new Date(`${rescheduleDate}T00:00:00`);
    const start = buildDateTime(base, h, m);
    const duration = action.duration_minutes ?? 30;
    const end = buildDateTime(base, h, m + duration);
    remute.mutate({
      data: { actionId: action.id, newStart: start, newEnd: end, durationMinutes: duration },
    });
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Icon weight="light" className="h-7 w-7 text-[color:var(--primary)]" />
            <div>
              <DialogTitle>{action.title}</DialogTitle>
              <DialogDescription>
                {pillar?.name} · {formatTimeRange(action.scheduled_start ?? "", action.scheduled_end)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {action.description && (
          <p className="text-sm text-foreground/80">{action.description}</p>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          {action.duration_minutes && <div>Duração: {action.duration_minutes} min</div>}
          {action.frequency_type && <div>Frequência: {action.frequency_type}</div>}
          {action.priority && <div>Prioridade: {action.priority}</div>}
          {action.obstacle_expected && <div>Obstáculo: {action.obstacle_expected}</div>}
          {action.required_resource && <div>Recurso: {action.required_resource}</div>}
          <div>
            Status:{" "}
            <span className="font-semibold text-foreground">
              {STATUS_LABEL[(action.calendar_status as CalendarStatus) ?? "planned"]}
            </span>
          </div>
        </div>

        {mode === "view" && (
          <>
            <div>
              <Label className="text-xs">Observação (opcional)</Label>
              <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button onClick={() => doStatus("done")} disabled={mutate.isPending}>
                Marcar como executada
              </Button>
              <Button variant="outline" onClick={() => setMode("missed")}>
                Não executei
              </Button>
              <Button variant="outline" onClick={() => setMode("reschedule")}>
                Reagendar
              </Button>
              <Button
                variant="ghost"
                onClick={() => doStatus("cancelled")}
                disabled={mutate.isPending}
              >
                Cancelar ação
              </Button>
            </DialogFooter>
          </>
        )}

        {mode === "missed" && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">O que aconteceu? (sem julgamento)</Label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                {NON_EXECUTION_REASONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <Textarea
                rows={2}
                placeholder="Quer registrar algo a mais?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setMode("view")}>Voltar</Button>
              <Button onClick={() => doStatus("missed")} disabled={mutate.isPending}>
                Registrar
              </Button>
            </DialogFooter>
          </>
        )}

        {mode === "reschedule" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Novo dia</Label>
                <Input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Novo horário</Label>
                <Input
                  type="time"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setMode("view")}>Voltar</Button>
              <Button onClick={doReschedule} disabled={remute.isPending}>
                Reagendar
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function CreateActionDialog({
  slot,
  onClose,
  onCreated,
}: {
  slot: { day: Date; hour: number; minute: number };
  onClose: () => void;
  onCreated: () => void;
}) {
  const createFn = useServerFn(createScheduledAction);
  const [pillarId, setPillarId] = useState<number>(PILLAR_DEFAULTS[0].id);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [actionType, setActionType] = useState<"unique" | "recurring">("unique");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const mutate = useMutation({
    mutationFn: createFn,
    onSuccess: () => {
      onCreated();
      onClose();
      toast.success("Ação adicionada à sua semana");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro"),
  });

  function submit() {
    if (!title.trim()) {
      toast.error("Dê um título à ação");
      return;
    }
    const start = buildDateTime(slot.day, slot.hour, slot.minute);
    const end = buildDateTime(slot.day, slot.hour, slot.minute + duration);
    mutate.mutate({
      data: {
        pillarId,
        title,
        description,
        scheduledStart: start,
        scheduledEnd: end,
        durationMinutes: duration,
        actionType,
        priority,
      },
    });
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus size={18} weight="light" /> Nova ação
          </DialogTitle>
          <DialogDescription>
            {formatDayHeader(slot.day)} às {formatHour(slot.hour)}:
            {String(slot.minute).padStart(2, "0")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label className="text-xs">Pilar</Label>
            <select
              value={pillarId}
              onChange={(e) => setPillarId(Number(e.target.value))}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              {PILLAR_DEFAULTS.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-xs">Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Caminhar 30 min" />
          </div>
          <div>
            <Label className="text-xs">Descrição</Label>
            <Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs">Duração (min)</Label>
              <Input
                type="number"
                min={15}
                step={15}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </div>
            <div>
              <Label className="text-xs">Tipo</Label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value as "unique" | "recurring")}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="unique">Única</option>
                <option value="recurring">Recorrente</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Prioridade</Label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit} disabled={mutate.isPending}>
            {mutate.isPending ? "Salvando…" : "Adicionar à semana"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const DAILY_QUESTIONS = [
  "O que funcionou bem hoje?",
  "O que atrapalhou ou ficou difícil?",
  "Qual aprendizado você leva para amanhã?",
  "Como você está se sentindo agora?",
] as const;

function DaySummarySheet({
  open,
  onClose,
  day,
  actions,
  onActionClick,
}: {
  open: boolean;
  onClose: () => void;
  day: Date | null;
  actions: ActionRow[];
  onActionClick: (a: ActionRow) => void;
}) {
  const counts = useMemo(() => {
    const c = { planned: 0, done: 0, missed: 0, rescheduled: 0, cancelled: 0 };
    for (const a of actions) {
      const s = (a.calendar_status as CalendarStatus) ?? "planned";
      c[s] = (c[s] ?? 0) + 1;
    }
    return c;
  }, [actions]);

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Resumo do dia</SheetTitle>
          <SheetDescription>
            {day ? new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long" }).format(day) : ""}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          {(Object.keys(STATUS_LABEL) as CalendarStatus[]).map((s) => {
            const token = STATUS_TOKEN[s];
            return (
              <div
                key={s}
                className="rounded-xl border px-3 py-2"
                style={{ borderColor: token.ring, background: `color-mix(in oklab, ${token.bg} 40%, var(--card))` }}
              >
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {STATUS_LABEL[s]}
                </div>
                <div className="text-2xl font-bold" style={{ color: token.fg }}>
                  {counts[s] ?? 0}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Ações
          </div>
          {actions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Sem ações agendadas neste dia. Pequenas ações consistentes geram equilíbrio.
            </p>
          ) : (
            <ul className="space-y-2">
              {actions
                .slice()
                .sort((a, b) => (a.scheduled_start ?? "").localeCompare(b.scheduled_start ?? ""))
                .map((a) => {
                  const Icon = iconForPillar(a.pillar_id);
                  const status = (a.calendar_status as CalendarStatus) ?? "planned";
                  const token = STATUS_TOKEN[status];
                  return (
                    <li key={a.id}>
                      <button
                        type="button"
                        onClick={() => onActionClick(a)}
                        className="flex w-full items-start gap-3 rounded-xl border border-border/60 bg-card p-3 text-left hover:bg-secondary/30 transition"
                      >
                        <Icon weight="light" className="h-5 w-5 mt-0.5 text-[color:var(--primary)]" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate">{a.title}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {formatTimeRange(a.scheduled_start ?? "", a.scheduled_end)}
                          </div>
                        </div>
                        <span
                          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                          style={{ background: token.bg, color: token.fg }}
                        >
                          {STATUS_LABEL[status]}
                        </span>
                      </button>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function CloseDayDialog({
  onClose,
  onSubmitted,
}: {
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const submitFn = useServerFn(submitDailyClosing);
  const summaryFn = useServerFn(generateClosingSummary);
  const today = new Date().toISOString().slice(0, 10);
  const [reflection, setReflection] = useState("");
  const [answers, setAnswers] = useState<string[]>(() => DAILY_QUESTIONS.map(() => ""));
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);

  const mutate = useMutation({
    mutationFn: submitFn,
    onSuccess: async () => {
      onSubmitted();
      toast.success("Dia fechado com leveza.");
      setSummarizing(true);
      try {
        const res = await summaryFn({ data: { closingDate: today } });
        setAiSummary(res.summary);
      } catch {
        // sem resumo IA: fluxo continua normalmente
        onClose();
      } finally {
        setSummarizing(false);
      }
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro"),
  });

  function submit() {
    mutate.mutate({
      data: {
        closingDate: today,
        reflection,
        answers: DAILY_QUESTIONS.map((q, i) => ({ question: q, answer: answers[i] ?? "" })),
      },
    });
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <NotePencil size={20} weight="light" /> Fechar meu dia
          </DialogTitle>
          <DialogDescription>
            Um momento curto para reconhecer o que viveu hoje — sem cobrança, com presença.
          </DialogDescription>
        </DialogHeader>

        {aiSummary ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[color:var(--primary)]/30 bg-[color:var(--balanced-soft)]/30 p-4">
              <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[color:var(--primary)]">
                Um olhar gentil sobre seu dia
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">{aiSummary}</p>
            </div>
            <DialogFooter>
              <Button onClick={onClose}>Encerrar</Button>
            </DialogFooter>
          </div>
        ) : (
          <>
        <div className="space-y-3">
          {DAILY_QUESTIONS.map((q, i) => (
            <div key={q}>
              <Label className="text-xs">{q}</Label>
              <Textarea
                rows={2}
                value={answers[i]}
                onChange={(e) =>
                  setAnswers((arr) => {
                    const next = arr.slice();
                    next[i] = e.target.value;
                    return next;
                  })
                }
              />
            </div>
          ))}
          <div>
            <Label className="text-xs">Reflexão livre (opcional)</Label>
            <Textarea
              rows={3}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Como o dia ressoou em você?"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Agora não</Button>
          <Button onClick={submit} disabled={mutate.isPending || summarizing}>
            {summarizing ? "Gerando resumo…" : mutate.isPending ? "Salvando…" : "Encerrar o dia"}
          </Button>
        </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}