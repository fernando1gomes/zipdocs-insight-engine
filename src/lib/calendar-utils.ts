/** Helpers de data para o calendário Semana em Eixo (semana Seg–Dom). */

export const WEEK_DAYS = [
  { key: "mon", label: "Seg" },
  { key: "tue", label: "Ter" },
  { key: "wed", label: "Qua" },
  { key: "thu", label: "Qui" },
  { key: "fri", label: "Sex" },
  { key: "sat", label: "Sáb" },
  { key: "sun", label: "Dom" },
] as const;

export const HOUR_START = 5;
export const HOUR_END = 23;
export const SLOT_MINUTES = 30;
export const SLOT_HEIGHT_PX = 28; // altura de cada slot de 30 min

export function startOfWeek(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay(); // 0 = Dom
  const diff = day === 0 ? -6 : 1 - day; // semana começa Seg
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function formatWeekLabel(start: Date): string {
  const end = addDays(start, 6);
  const fmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" });
  return `${fmt.format(start)} — ${fmt.format(end)}`;
}

export function formatDayHeader(d: Date): string {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(d);
}

export function formatHour(h: number): string {
  return `${String(h).padStart(2, "0")}:00`;
}

export function formatTimeRange(startIso: string, endIso: string | null): string {
  const s = new Date(startIso);
  const fmt = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });
  if (!endIso) return fmt.format(s);
  return `${fmt.format(s)} — ${fmt.format(new Date(endIso))}`;
}

/** Converte hora/minuto em offset do topo (px) dentro da coluna do dia. */
export function topPxFromTime(dateIso: string): number {
  const d = new Date(dateIso);
  const minutesFromStart = (d.getHours() - HOUR_START) * 60 + d.getMinutes();
  return (minutesFromStart / SLOT_MINUTES) * SLOT_HEIGHT_PX;
}

export function heightPxFromMinutes(min: number | null | undefined): number {
  const m = Math.max(SLOT_MINUTES, min ?? SLOT_MINUTES);
  return (m / SLOT_MINUTES) * SLOT_HEIGHT_PX;
}

export function dayIndex(start: Date, dateIso: string): number {
  const d = new Date(dateIso);
  d.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - start.getTime()) / (24 * 3600 * 1000));
  return diff;
}

/** Constrói um ISO string a partir do dia base + hora local (mantendo TZ local). */
export function buildDateTime(baseDay: Date, hour: number, minute: number): string {
  const d = new Date(baseDay);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export type CalendarStatus = "planned" | "done" | "missed" | "rescheduled" | "cancelled";

export const STATUS_LABEL: Record<CalendarStatus, string> = {
  planned: "Planejada",
  done: "Executada",
  missed: "Não executada",
  rescheduled: "Reagendada",
  cancelled: "Cancelada",
};

/** Token CSS para selo de status (cores suaves do design system). */
export const STATUS_TOKEN: Record<CalendarStatus, { bg: string; fg: string; ring: string }> = {
  planned: { bg: "var(--focus-soft)", fg: "var(--focus)", ring: "var(--focus)" },
  done: { bg: "var(--balanced-soft)", fg: "var(--balanced)", ring: "var(--balanced)" },
  missed: { bg: "var(--critical-soft)", fg: "var(--critical)", ring: "var(--critical)" },
  rescheduled: { bg: "var(--attention-soft)", fg: "var(--attention)", ring: "var(--attention)" },
  cancelled: { bg: "var(--empty-soft)", fg: "var(--empty)", ring: "var(--empty)" },
};

export const NON_EXECUTION_REASONS = [
  "Falta de tempo",
  "Cansaço",
  "Esquecimento",
  "Falta de clareza",
  "Prioridade concorrente",
  "Não fazia mais sentido",
  "Outro motivo",
] as const;