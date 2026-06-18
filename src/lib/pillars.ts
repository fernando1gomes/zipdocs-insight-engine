export type PillarStatus = "balanced" | "attention" | "critical" | "empty";

export interface Pillar {
  id: number;
  name: string;
  shortName: string;
  icon: string;
  score: number; // 0-10
  message: string;
  impact: number;
  impactPillars: string[];
  focus?: boolean;
}

export const PILLAR_DEFAULTS: Pillar[] = [
  { id: 1, name: "Contribuição e legado", shortName: "Contribuição", icon: "🤝", score: 7.0, message: "Equilíbrio, crescer", impact: 9, impactPillars: ["Emocional", "Profissional", "Social"] },
  { id: 2, name: "Emocional", shortName: "Emocional", icon: "❤️", score: 4.8, message: "Crítico, acolher emoções", impact: 6, impactPillars: ["Saúde", "Relacionamento", "Profissional"] },
  { id: 3, name: "Família", shortName: "Família", icon: "👨‍👩‍👧‍👦", score: 8.1, message: "Equilibrado, conectar", impact: 8, impactPillars: ["Emocional", "Saúde", "Lazer"] },
  { id: 4, name: "Relacionamento amoroso", shortName: "Relacionamento", icon: "💕", score: 6.6, message: "Atenção, fortalecer diálogo", impact: 6, impactPillars: ["Emocional", "Lazer", "Comunicação"] },
  { id: 5, name: "Social e amizades", shortName: "Social", icon: "👥", score: 7.4, message: "Equilibrado, cultivar", impact: 7, impactPillars: ["Emocional", "Saúde", "Lazer"] },
  { id: 6, name: "Profissional e carreira", shortName: "Carreira", icon: "💼", score: 8.5, message: "Equilibrado, prosperar", impact: 10, impactPillars: ["Financeiro", "Saúde", "Emocional", "Familiar"], focus: true },
  { id: 7, name: "Financeiro", shortName: "Financeiro", icon: "💵", score: 5.2, message: "Atenção, organizar", impact: 7, impactPillars: ["Emocional", "Relacionamento", "Segurança"] },
  { id: 8, name: "Intelectual e aprendizado", shortName: "Intelectual", icon: "📖", score: 7.8, message: "Equilibrado, aprofundar", impact: 8, impactPillars: ["Profissional", "Carreira", "Confiança"] },
  { id: 9, name: "Espiritualidade e sentido", shortName: "Espiritualidade", icon: "🧘", score: 4.9, message: "Crítico, reconectar sentido", impact: 4, impactPillars: ["Propósito", "Paz", "Decisões"] },
  { id: 10, name: "Lazer e prazer", shortName: "Lazer", icon: "📚", score: 6.3, message: "Atenção, reservar tempo", impact: 4, impactPillars: ["Descanso", "Criatividade", "Saúde"] },
  { id: 11, name: "Saúde e disposição", shortName: "Saúde", icon: "🏃", score: 6.2, message: "Atenção, fortalecer rotina", impact: 8, impactPillars: ["Energia", "Emocional", "Profissional"] },
];

/** Backwards-compatibility alias kept so the legacy mock dashboard still renders. */
export const PILLARS = PILLAR_DEFAULTS;

export function messageForScore(score: number, shortName: string): string {
  if (score <= 0) return "Sem dados — avalie este pilar";
  if (score < 6) return `Crítico, priorize ${shortName.toLowerCase()}`;
  if (score < 7) return `Atenção, fortalecer ${shortName.toLowerCase()}`;
  return `Equilibrado, manter ${shortName.toLowerCase()}`;
}

/** Merge DB user_pillars rows with the static defaults to produce the Pillar shape used by UI. */
export function mergeWithDefaults(rows: Array<{ pillar_id: number; current_score: number | null }>): Pillar[] {
  return PILLAR_DEFAULTS.map((def) => {
    const row = rows.find((r) => r.pillar_id === def.id);
    const score = row?.current_score ?? 0;
    return {
      ...def,
      score: Number(score),
      message: messageForScore(Number(score), def.shortName),
    };
  }).sort((a, b) => a.id - b.id);
}

export function statusFromScore(score: number): PillarStatus {
  if (score <= 0) return "empty";
  if (score < 6) return "critical";
  if (score < 7) return "attention";
  return "balanced";
}

export function statusColor(status: PillarStatus) {
  switch (status) {
    case "balanced": return { ring: "var(--balanced)", soft: "var(--balanced-soft)", text: "text-[color:var(--balanced)]" };
    case "attention": return { ring: "var(--attention)", soft: "var(--attention-soft)", text: "text-[color:var(--attention)]" };
    case "critical": return { ring: "var(--critical)", soft: "var(--critical-soft)", text: "text-[color:var(--critical)]" };
    default: return { ring: "var(--empty)", soft: "var(--empty-soft)", text: "text-[color:var(--empty)]" };
  }
}

export function overallBalance(pillars: Pillar[]): number {
  const scored = pillars.filter(p => p.score > 0);
  if (!scored.length) return 0;
  const avg = scored.reduce((s, p) => s + p.score, 0) / scored.length;
  return Math.round(avg * 10);
}