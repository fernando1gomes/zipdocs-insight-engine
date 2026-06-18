import { type Pillar, statusFromScore } from "@/lib/pillars";
import { PillarCard } from "./PillarCard";

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

// Layout constants (container viewBox coordinates)
const W = 1100;
const H = 880;
const CX = W / 2;
const CY = H / 2;
const R_OUTER = 180;
const R_INNER = 90;
const R_CARD = 330; // distance from center to card anchor edge

const N = 11;
const segDeg = 360 / N;

function segAngles(i: number) {
  // segment i: from a0 to a1, starting at top going clockwise
  const a0 = -90 + i * segDeg;
  const a1 = a0 + segDeg;
  const mid = (a0 + a1) / 2;
  return { a0, a1, mid };
}

const toRad = (d: number) => (d * Math.PI) / 180;

export function RadialWheel({ pillars, balance, hovered, onHover }: Props) {
  return (
    <div
      className="relative mx-auto w-full"
      style={{ aspectRatio: `${W} / ${H}`, maxWidth: W }}
    >
      {/* Background SVG: wheel + connector lines */}
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full">
        {pillars.map((p, i) => {
          const { a0, a1, mid } = segAngles(i);
          const isHover = hovered === p.id;
          const r2 = isHover ? R_OUTER + 6 : R_OUTER;
          const x0o = CX + r2 * Math.cos(toRad(a0));
          const y0o = CY + r2 * Math.sin(toRad(a0));
          const x1o = CX + r2 * Math.cos(toRad(a1));
          const y1o = CY + r2 * Math.sin(toRad(a1));
          const x0i = CX + R_INNER * Math.cos(toRad(a1));
          const y0i = CY + R_INNER * Math.sin(toRad(a1));
          const x1i = CX + R_INNER * Math.cos(toRad(a0));
          const y1i = CY + R_INNER * Math.sin(toRad(a0));
          const d = `M ${x0o} ${y0o} A ${r2} ${r2} 0 0 1 ${x1o} ${y1o} L ${x0i} ${y0i} A ${R_INNER} ${R_INNER} 0 0 0 ${x1i} ${y1i} Z`;
          const status = statusFromScore(p.score);
          const midR = toRad(mid);

          // icon position inside segment
          const iconR = (R_INNER + R_OUTER) / 2 + 6;
          const ix = CX + iconR * Math.cos(midR);
          const iy = CY + iconR * Math.sin(midR);
          // number badge near inner edge
          const numR = R_INNER + 16;
          const nx = CX + numR * Math.cos(midR);
          const ny = CY + numR * Math.sin(midR);
          // connector line from outer edge towards card
          const lx1 = CX + (R_OUTER + 4) * Math.cos(midR);
          const ly1 = CY + (R_OUTER + 4) * Math.sin(midR);
          const lx2 = CX + (R_CARD - 8) * Math.cos(midR);
          const ly2 = CY + (R_CARD - 8) * Math.sin(midR);

          return (
            <g
              key={p.id}
              onMouseEnter={() => onHover(p.id)}
              onMouseLeave={() => onHover(null)}
              style={{ cursor: "pointer" }}
            >
              <path
                d={d}
                fill={STATUS_FILL[status]}
                fillOpacity={isHover ? 1 : 0.88}
                stroke="white"
                strokeWidth={2}
              />
              <text
                x={nx}
                y={ny}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="13"
                fontWeight="700"
                fill="white"
              >
                {p.id}
              </text>
              <text
                x={ix}
                y={iy + 6}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="22"
              >
                {p.icon}
              </text>
              {/* connector */}
              <line
                x1={lx1}
                y1={ly1}
                x2={lx2}
                y2={ly2}
                stroke="var(--border)"
                strokeWidth={1.5}
                strokeDasharray="3 4"
              />
              <circle cx={lx1} cy={ly1} r={3.5} fill="white" stroke={STATUS_FILL[status]} strokeWidth={1.5} />
              <circle cx={lx2} cy={ly2} r={3} fill="var(--border)" />
            </g>
          );
        })}

        {/* Center hub */}
        <circle cx={CX} cy={CY} r={R_INNER - 4} fill="white" stroke="var(--primary)" strokeOpacity={0.35} strokeWidth={2} />
        <text x={CX} y={CY - 18} textAnchor="middle" fontSize="14" fill="var(--muted-foreground)" fontWeight="500">
          Equilíbrio Geral
        </text>
        <text
          x={CX}
          y={CY + 18}
          textAnchor="middle"
          fontSize="42"
          fontWeight="800"
          fill="var(--foreground)"
          style={{ fontFamily: "Plus Jakarta Sans" }}
        >
          {balance}%
        </text>
        <text x={CX} y={CY + 46} textAnchor="middle" fontSize="16">⚖️</text>
      </svg>

      {/* Cards positioned radially in % coordinates */}
      {pillars.map((p, i) => {
        const { mid } = segAngles(i);
        const rad = toRad(mid);
        const cosA = Math.cos(rad);
        const sinA = Math.sin(rad);
        // anchor point at radius R_CARD
        const px = CX + R_CARD * cosA;
        const py = CY + R_CARD * sinA;
        const leftPct = (px / W) * 100;
        const topPct = (py / H) * 100;
        // translate so the card edge nearest the wheel sits at the anchor
        const txPct = -50 - 50 * cosA;
        const tyPct = -50 - 50 * sinA;
        return (
          <div
            key={p.id}
            className="absolute"
            style={{
              left: `${leftPct}%`,
              top: `${topPct}%`,
              transform: `translate(${txPct}%, ${tyPct}%)`,
              width: 220,
            }}
          >
            <PillarCard pillar={p} hovered={hovered === p.id} onHover={onHover} />
          </div>
        );
      })}
    </div>
  );
}