export type Level = "beginner" | "intermediate" | "advanced";
/** 練習区分 */
export type Category =
  | "pattern" // パターン練習
  | "handFeed" // 手投げノック（フィーダーが手で投げる）
  | "racketFeed" // ラケットノック（フィーダーがラケットで打つ）
  | "footwork"
  | "warmup" // アップ
  | "stretch"
  | "play"; // 運動遊び
/** none: 種目を問わない（アップ・ストレッチ・運動遊びなど） */
export type CourtType = "singles" | "doubles" | "both" | "none";

/** コート上の位置は 0〜1 の割合。x: 長さ方向（左→右、ネットは0.5）、y: 幅方向（上→下）。 */
export type Point = { x: number; y: number };

export type DiagramPlayer = Point & {
  label?: string;
  /** player: 練習者 / feeder: ノッカー・出し手 / opponent: 相手 */
  role?: "player" | "feeder" | "opponent";
};

export type DiagramArrow = {
  from: Point;
  to: Point;
  /** shot: シャトルの軌道 / move: 選手の移動 */
  kind: "shot" | "move";
};

export type DrillDiagram = {
  players?: DiagramPlayer[];
  arrows?: DiagramArrow[];
};

export type Drill = {
  id: string;
  title: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  level: Level;
  category: Category;
  courtType: CourtType;
  /** 指導のコツ・着眼点 */
  coachingPoints: string[];
  /** 球出し・配球パターン */
  feedPattern: string;
  /** 推奨練習時間（例: "3分×4セット"） */
  duration: string;
  /** 推奨球数（任意） */
  shots?: string;
  diagram?: DrillDiagram;
};

export const LEVEL_LABELS: Record<Level, string> = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  pattern: "パターン練習",
  handFeed: "手投げノック",
  racketFeed: "ラケットノック",
  footwork: "フットワーク",
  warmup: "アップ",
  stretch: "ストレッチ",
  play: "運動遊び",
};

/** 絞り込み・表示の並び順 */
export const CATEGORY_ORDER: Category[] = [
  "pattern",
  "handFeed",
  "racketFeed",
  "footwork",
  "warmup",
  "stretch",
  "play",
];

export const COURT_TYPE_LABELS: Record<CourtType, string> = {
  singles: "シングルス",
  doubles: "ダブルス",
  both: "シングルス/ダブルス",
  none: "種目を問わない",
};

// --- コート図の記述用ヘルパー（座標は 0〜1 の割合。左側が手前コート、ネットは x=0.5） ---
