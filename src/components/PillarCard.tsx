import { type Pillar, statusFromScore } from "@/lib/pillars";

const STATUS_META = {
  balanced: { label: "Equilibrado", ring: "var(--balanced)", dot: "var(--balanced)", soft: "var(--balanced-soft)", num: "var(--balanced)" },
  attention: { label: "Atenção", ring: "var(--attention)", dot: "var(--attention)", soft: "var(--attention-soft)", num: "var(--attention)" },
  critical: { label: "Crítico", ring: "var(--critical)", dot: "var(--critical)", soft: "var(--critical-soft)", num: "var(--critical)" },
  empty: { label: "Sem dados", ring: "var(--empty)", dot: "var(--empty)", soft: "var(--empty-soft)", num: "var(--empty)" },
} as const;

export function PillarCard({
  pillar,
  hovered,
  onHover,
}: {
  pillar: Pillar;
  hovered: boolean;
  onHover: (id: number | null) => void;
}) {
  const status = statusFromScore(pillar.score);
  const meta = STATUS_META[status];
  return (
    <div
      onMouseEnter={() => onHover(pillar.id)}
      onMouseLeave={() => onHover(null)}
      className="relative rounded-2xl bg-card p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
      style={{ borderLeft: `4px solid ${meta.ring}`, boxShadow: hovered ? `0 8px 24px -8px ${meta.ring}55` : undefined }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{ background: meta.num }}
          >
            {pillar.id}
          </span>
          <span className="text-sm font-semibold text-foreground leading-tight">{pillar.shortName}</span>
        </div>
        {pillar.focus && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--focus-soft)] px-2 py-0.5 text-[10px] font-semibold text-[color:var(--focus)]">
            ◎ Foco
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{pillar.icon}</span>
          <span className="text-3xl font-bold tabular-nums" style={{ color: meta.num, fontFamily: "Plus Jakarta Sans" }}>
            {pillar.score.toFixed(1)}
          </span>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-muted-foreground">impacta</div>
          <div className="text-[10px] font-medium text-muted-foreground">👥 {pillar.impactPillars.length} pilares</div>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground leading-snug">{pillar.message}</p>
    </div>
  );
}