import { type Pillar, statusFromScore } from "@/lib/pillars";

const STATUS_FILL: Record<string, string> = {
  balanced: "var(--balanced)",
  attention: "var(--attention)",
  critical: "var(--critical)",
  empty: "var(--empty)",
};

interface Props {
  pillars: Pillar[];
  balance: number;
  hovered: number | null;
  onHover: (id: number | null) => void;
}

export function LifeWheel({ pillars, balance, hovered, onHover }: Props) {
  const cx = 200;
  const cy = 200;
  const rOuter = 180;
  const rInner = 90;
  const n = pillars.length;
  const segAngle = (2 * Math.PI) / n;

  return (
    <div className="relative w-full max-w-[440px] mx-auto aspect-square">
      <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-sm">
        <defs>
          <filter id="seg-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dy="1" />
            <feComponentTransfer><feFuncA type="linear" slope="0.15" /></feComponentTransfer>
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {pillars.map((p, i) => {
          const a0 = -Math.PI / 2 + i * segAngle;
          const a1 = a0 + segAngle;
          const isHover = hovered === p.id;
          const r2 = isHover ? rOuter + 6 : rOuter;
          const x0o = cx + r2 * Math.cos(a0);
          const y0o = cy + r2 * Math.sin(a0);
          const x1o = cx + r2 * Math.cos(a1);
          const y1o = cy + r2 * Math.sin(a1);
          const x0i = cx + rInner * Math.cos(a1);
          const y0i = cy + rInner * Math.sin(a1);
          const x1i = cx + rInner * Math.cos(a0);
          const y1i = cy + rInner * Math.sin(a0);
          const d = `M ${x0o} ${y0o} A ${r2} ${r2} 0 0 1 ${x1o} ${y1o} L ${x0i} ${y0i} A ${rInner} ${rInner} 0 0 0 ${x1i} ${y1i} Z`;
          const status = statusFromScore(p.score);
          const midA = (a0 + a1) / 2;
          const labelR = (rInner + r2) / 2;
          const lx = cx + labelR * Math.cos(midA);
          const ly = cy + labelR * Math.sin(midA);
          const numR = rInner + 18;
          const nx = cx + numR * Math.cos(midA);
          const ny = cy + numR * Math.sin(midA);
          return (
            <g
              key={p.id}
              onMouseEnter={() => onHover(p.id)}
              onMouseLeave={() => onHover(null)}
              className="cursor-pointer transition-all"
            >
              <path
                d={d}
                fill={STATUS_FILL[status]}
                fillOpacity={isHover ? 1 : 0.85}
                stroke="white"
                strokeWidth={2}
              />
              <text x={nx} y={ny} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="700" fill="white">
                {p.id}
              </text>
              <text x={lx} y={ly + 8} textAnchor="middle" dominantBaseline="middle" fontSize="16">
                {p.icon}
              </text>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={rInner - 4} fill="white" stroke="var(--border)" strokeWidth={1.5} />
        <text x={cx} y={cy - 18} textAnchor="middle" fontSize="13" fill="var(--muted-foreground)" fontWeight="500">
          Equilíbrio Geral
        </text>
        <text x={cx} y={cy + 16} textAnchor="middle" fontSize="38" fontWeight="800" fill="var(--foreground)" style={{ fontFamily: "Plus Jakarta Sans" }}>
          {balance}%
        </text>
        <text x={cx} y={cy + 42} textAnchor="middle" fontSize="14">⚖️</text>
      </svg>
    </div>
  );
}