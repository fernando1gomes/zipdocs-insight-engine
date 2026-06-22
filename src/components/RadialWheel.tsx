import { type Pillar, statusFromScore } from "@/lib/pillars";
import { PillarCard } from "./PillarCard";
import { Plant } from "@phosphor-icons/react";

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

// Layout constants (container coordinates ≈ rendered px at desktop)
const W = 1120;
const H = 760;
const CX = W / 2;
const CY = H / 2;
const R_OUTER = 170;
const R_INNER = 85;

const N = 11;
const segDeg = 360 / N;

function segAngles(i: number) {
  // segment i: centered so pillar 1 (i=0) sits at the top
  const a0 = -90 - segDeg / 2 + i * segDeg;
  const a1 = a0 + segDeg;
  const mid = (a0 + a1) / 2;
  return { a0, a1, mid };
}

const toRad = (d: number) => (d * Math.PI) / 180;

// Manual card placement mirroring the reference image.
// Coordinates are in container units (W × H); anchor controls translate.
type Anchor = "tl" | "tc" | "tr" | "cl" | "cr" | "bl" | "br";
const CARD_POS: Record<number, { x: number; y: number; anchor: Anchor }> = {
  1:  { x: 560, y: 16,   anchor: "tc" },
  2:  { x: 870, y: 80,   anchor: "tl" },
  3:  { x: 910, y: 250,  anchor: "cl" },
  4:  { x: 910, y: 410,  anchor: "cl" },
  5:  { x: 870, y: 580,  anchor: "bl" },
  6:  { x: 600, y: 744,  anchor: "bl" },
  7:  { x: 520, y: 744,  anchor: "br" },
  8:  { x: 250, y: 580,  anchor: "br" },
  9:  { x: 210, y: 410,  anchor: "cr" },
  10: { x: 210, y: 250,  anchor: "cr" },
  11: { x: 250, y: 80,   anchor: "tr" },
};

function anchorTranslate(a: Anchor): string {
  switch (a) {
    case "tl": return "translate(0, 0)";
    case "tc": return "translate(-50%, 0)";
    case "tr": return "translate(-100%, 0)";
    case "cl": return "translate(0, -50%)";
    case "cr": return "translate(-100%, -50%)";
    case "bl": return "translate(0, -100%)";
    case "br": return "translate(-100%, -100%)";
  }
}

// Card dimensions (reduced for a tighter layout)
const CARD_W = 170;
const CARD_H = 95;

// Connector terminates near the card edge facing the wheel.
function connectorEnd(pos: { x: number; y: number; anchor: Anchor }, cardW = CARD_W, cardH = CARD_H) {
  const { x, y, anchor } = pos;
  switch (anchor) {
    case "tc": return { x, y: y + cardH }; // line meets bottom-center of top card
    case "tl": return { x, y: y + cardH / 2 };
    case "tr": return { x, y: y + cardH / 2 };
    case "cl": return { x, y };
    case "cr": return { x, y };
    case "bl": return { x, y: y - cardH / 2 };
    case "br": return { x, y: y - cardH / 2 };
  }
}

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
          const iconR = (R_INNER + R_OUTER) / 2 + 4;
          const ix = CX + iconR * Math.cos(midR);
          const iy = CY + iconR * Math.sin(midR);
          // number badge near inner edge
          const numR = R_INNER + 14;
          const nx = CX + numR * Math.cos(midR);
          const ny = CY + numR * Math.sin(midR);
          // connector: from outer edge of segment to card-anchor edge
          const start = {
            x: CX + (R_OUTER + 4) * Math.cos(midR),
            y: CY + (R_OUTER + 4) * Math.sin(midR),
          };
          const end = connectorEnd(CARD_POS[p.id]);

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
              {/* connector to card */}
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="var(--border)"
                strokeWidth={1.5}
                strokeDasharray="3 4"
                opacity={0.7}
                className="wheel-connector"
                style={{ animationDelay: `${i * 0.18}s` }}
              />
              <circle
                cx={start.x}
                cy={start.y}
                r={3.5}
                fill="white"
                stroke={STATUS_FILL[status]}
                strokeWidth={1.5}
                className="wheel-node-origin"
                style={{ animationDelay: `${i * 0.18}s` }}
              />
              <circle
                cx={end.x}
                cy={end.y}
                r={3}
                fill="white"
                stroke="var(--border)"
                strokeWidth={1}
                className="wheel-node-end"
                style={{ animationDelay: `${i * 0.18}s` }}
              />
            </g>
          );
        })}

        {/* Center hub */}
        <circle
          cx={CX}
          cy={CY}
          r={R_INNER - 4}
          fill="white"
          stroke="var(--primary)"
          strokeOpacity={0.35}
          strokeWidth={2}
          className="wheel-hub"
        />
        <circle
          cx={CX}
          cy={CY}
          r={R_INNER + 6}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={1.5}
          className="wheel-hub-halo"
        />
        <text
          x={CX}
          y={CY - 22}
          textAnchor="middle"
          fontSize="11"
          fill="white"
          fontWeight="600"
          letterSpacing="2"
        >
          AVALIAÇÃO GERAL
        </text>
        <text
          x={CX}
          y={CY + 18}
          textAnchor="middle"
          fontSize="42"
          fontWeight="800"
          fill="white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {balance}%
        </text>
      </svg>

      {/* Lucide icons overlay inside each segment */}
      {pillars.map((p, i) => {
        const { mid } = segAngles(i);
        const iconR = (R_INNER + R_OUTER) / 2 + 4;
        const ix = CX + iconR * Math.cos(toRad(mid));
        const iy = CY + iconR * Math.sin(toRad(mid));
        const Icon = p.Icon;
        return (
          <div
            key={`icon-${p.id}`}
            className="pointer-events-none absolute flex items-center justify-center"
            style={{
              left: `${(ix / W) * 100}%`,
              top: `${(iy / H) * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <Icon size={20} weight="light" color="white" />
          </div>
        );
      })}

      {/* Hub sprout */}
      <div
        className="pointer-events-none absolute flex items-center justify-center"
        style={{
          left: `${(CX / W) * 100}%`,
          top: `${((CY + 46) / H) * 100}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <Plant size={20} weight="light" className="text-[color:var(--primary)]" />
      </div>

      {/* Cards positioned with explicit anchors per the reference layout */}
      {pillars.map((p, i) => {
        const pos = CARD_POS[p.id];
        if (!pos) return null;
        return (
          <div
            key={p.id}
            className="absolute"
            style={{
              left: `${(pos.x / W) * 100}%`,
              top: `${(pos.y / H) * 100}%`,
              transform: anchorTranslate(pos.anchor),
              width: `${(CARD_W / W) * 100}%`,
              minWidth: 154,
              maxWidth: 190,
            }}
          >
            <div
              className="wheel-card-float"
              style={{ animationDelay: `${(i % 11) * 0.35}s` }}
            >
              <PillarCard pillar={p} hovered={hovered === p.id} onHover={onHover} />
            </div>
          </div>
        );
      })}
    </div>
  );
}