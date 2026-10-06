import type {
  Category,
  CourtType,
  DiagramArrow,
  DiagramPlayer,
  Drill,
  DrillDiagram,
  Level,
  Point,
} from "./types";

// ───────── コート図の記述用ヘルパー（座標は 0〜1。左側が手前コート、ネットは x=0.5） ─────────
export const pl = (
  x: number,
  y: number,
  label?: string,
  role: DiagramPlayer["role"] = "player",
): DiagramPlayer => ({ x, y, label, role });

export const shot = (x1: number, y1: number, x2: number, y2: number): DiagramArrow => ({
  from: { x: x1, y: y1 },
  to: { x: x2, y: y2 },
  kind: "shot",
});

export const move = (x1: number, y1: number, x2: number, y2: number): DiagramArrow => ({
  from: { x: x1, y: y1 },
  to: { x: x2, y: y2 },
  kind: "move",
});

type XY = [number, number];

/** 点を順にたどる移動矢印 */
export const path = (...pts: XY[]): DiagramArrow[] =>
  pts.slice(1).map((p, i) => move(pts[i][0], pts[i][1], p[0], p[1]));

/** 中心からそれぞれの点へ放射状に動く移動矢印 */
export const star = (center: XY, targets: XY[]): DiagramArrow[] =>
  targets.map((t) => move(center[0], center[1], t[0], t[1]));

/** ノック図: フィーダー（ノ）が各ターゲットへ球出しし、練習者（1）が待つ */
export const knock = (feeder: XY, targets: XY[], player: XY = [0.25, 0.5]): DrillDiagram => ({
  players: [pl(player[0], player[1], "1"), pl(feeder[0], feeder[1], "ノ", "feeder")],
  arrows: targets.map((t) => shot(feeder[0], feeder[1], t[0], t[1])),
});

/** 1人の動き図 */
export const solo = (start: XY, arrows: DiagramArrow[]): DrillDiagram => ({
  players: [pl(start[0], start[1], "1")],
  arrows,
});

/** 2人（または2組）のラリー図: 点は [x, y]。shots は [from, to] の組 */
export const rally = (a: XY[], b: XY[], shots: [XY, XY][]): DrillDiagram => ({
  players: [
    ...a.map((p, i) => pl(p[0], p[1], a.length > 1 ? String(i + 1) : "A")),
    ...b.map((p) => pl(p[0], p[1], b.length > 1 ? "" : "B", "opponent")),
  ],
  arrows: shots.map(([f, t]) => shot(f[0], f[1], t[0], t[1])),
});

export type { Point };

// ───────── メニュー定義の簡易記法 ─────────
const LEVELS = { b: "beginner", i: "intermediate", a: "advanced" } as const;
const COURTS = { s: "singles", d: "doubles", b: "both", n: "none" } as const;

export type LevelCode = keyof typeof LEVELS;
export type CourtCode = keyof typeof COURTS;

/**
 * 区分ごとのメニュー定義関数を作る。id は `${prefix}${連番}`。
 * お気に入りの保存に id を使うため、メニューを足すときは各ファイルの末尾に追記すること。
 */
export function defineMenus(category: Category, prefix: string) {
  let n = 0;
  return (
    title: string,
    description: string,
    players: [min: number, max: number],
    level: LevelCode,
    court: CourtCode,
    duration: string,
    feedPattern: string,
    coachingPoints: string[],
    extra: { shots?: string; diagram?: DrillDiagram } = {},
  ): Drill => ({
    id: `${prefix}${String(++n).padStart(2, "0")}`,
    title,
    description,
    minPlayers: players[0],
    maxPlayers: players[1],
    level: LEVELS[level] satisfies Level,
    category,
    courtType: COURTS[court] satisfies CourtType,
    duration,
    feedPattern,
    coachingPoints,
    ...extra,
  });
}
