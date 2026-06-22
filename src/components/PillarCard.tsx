import { type Pillar, statusFromScore, impactLabelFromScore } from "@/lib/pillars";

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
  const impact = impactLabelFromScore(pillar.score);
  const showBorder = status === "attention" || status === "critical";
  return (
    <div
      onMouseEnter={() => onHover(pillar.id)}
      onMouseLeave={() => onHover(null)}
      className="relative rounded-2xl bg-card p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer border border-border/60"
      style={{
        borderColor: showBorder ? meta.ring : undefined,
        borderWidth: showBorder ? 1.5 : 1,
        boxShadow: hovered ? `0 8px 24px -8px ${meta.ring}55` : undefined,
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{ background: meta.num }}
          >
            {pillar.id}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground leading-tight">
            {pillar.shortName}
          </span>
        </div>
        {pillar.focus && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--focus-soft)] px-2 py-0.5 text-[10px] font-semibold text-[color:var(--focus)]">
            ◎ Foco
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-3">
        <div className="flex items-center gap-2">
          <pillar.Icon size={24} weight="light" style={{ color: meta.num }} />
          <span className="text-3xl font-bold tabular-nums" style={{ color: meta.num, fontFamily: "var(--font-display)" }}>
            {pillar.score.toFixed(1)}
          </span>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Impacto</div>
          <div className="text-[11px] font-semibold" style={{ color: meta.num }}>{impact}</div>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground leading-snug">{pillar.message}</p>
    </div>
  );
}