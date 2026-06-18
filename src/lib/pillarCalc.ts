import type { PillarStatus } from "@/lib/pillars";

export function statusFromScore(score: number): PillarStatus {
  if (score <= 0) return "empty";
  if (score < 6) return "critical";
  if (score < 7) return "attention";
  return "balanced";
}

export function statusColorKey(score: number): "green" | "yellow" | "red" | "gray" {
  if (score <= 0) return "gray";
  if (score < 6) return "red";
  if (score < 7) return "yellow";
  return "green";
}

export function overallBalance(scores: number[]): number {
  const scored = scores.filter((s) => s > 0);
  if (!scored.length) return 0;
  const avg = scored.reduce((s, v) => s + v, 0) / scored.length;
  return Math.round(avg * 10);
}

export function countByStatus(scores: number[]) {
  const counts = { balanced: 0, attention: 0, critical: 0, empty: 0 };
  for (const s of scores) counts[statusFromScore(s)]++;
  return counts;
}