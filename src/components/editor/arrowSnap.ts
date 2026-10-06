import { courtToSvg, svgToCourt, PLAYER_RADIUS } from "../CourtDiagram";
import type { DiagramArrow, DiagramPlayer, Point } from "@/data/types";

/** 選手の円（線を含む）に重なっているとみなす距離。この内側にある矢印の端は円の下に隠れてしまう */
export const PLAYER_HIT = PLAYER_RADIUS + 0.3;
/** 矢印の端を置く位置（選手の中心からの距離）。円の外ギリギリ */
export const EDGE_DISTANCE = PLAYER_RADIUS + 0.8;

export const svgDist = (a: Point, b: Point) => {
  const as = courtToSvg(a);
  const bs = courtToSvg(b);
  return Math.hypot(as.x - bs.x, as.y - bs.y);
};

/**
 * 矢印の端 p が選手の円に重なっていたら、円の外ギリギリへ押し出す。
 * 押し出す向きは「選手の中心 → p」。中心とぴったり重なっている場合は「選手 → 矢印の反対側の端」。
 */
export function snapOut(p: Point, other: Point, players: DiagramPlayer[]): Point {
  for (const q of players) {
    const qs = courtToSvg(q);
    const ps = courtToSvg(p);
    let dx = ps.x - qs.x;
    let dy = ps.y - qs.y;
    let d = Math.hypot(dx, dy);
    if (d >= EDGE_DISTANCE) continue;
    if (d < 0.01) {
      const os = courtToSvg(other);
      dx = os.x - qs.x;
      dy = os.y - qs.y;
      d = Math.hypot(dx, dy) || 1;
    }
    const k = EDGE_DISTANCE / d;
    return svgToCourt(qs.x + dx * k, qs.y + dy * k);
  }
  return p;
}

/** 全ての矢印について、指定した選手の円に重なっている端を外へ出す */
export function settleArrows(players: DiagramPlayer[], arrows: DiagramArrow[]): DiagramArrow[] {
  return arrows.map((a) => ({
    ...a,
    from: snapOut(a.from, a.to, players),
    to: snapOut(a.to, a.from, players),
  }));
}
