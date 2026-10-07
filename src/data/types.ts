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
/** none: 種目に関係しない（アップ・ストレッチ・運動遊びなど） */
export type CourtType = "singles" | "doubles" | "both" | "none";

/**
 * コート上の位置は 0〜1 の割合。x: 長さ方向（ネットは0.5）、y: 幅方向。
 * 図は縦向きで描かれ、x が大きい側（ノッカー側）が下に来る。
 */
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
  /** 動きや球出しの順番（1, 2, 3…）。連続した動きの図で、矢印の中ほどに番号を表示する */
  order?: number;
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

  // ───── 以下は「指導の手引き」としての深掘り。すべて任意。 ─────
  /** ねらい（何のための練習か） */
  purpose?: string;
  /** 準備物 */
  equipment?: string[];
  /** 手順（上から順に行う） */
  steps?: string[];
  /** バリエーション・発展（易しくする／難しくする） */
  variations?: string[];
  /** よくあるミスと、その直し方・声かけ */
  commonMistakes?: string[];
  /** ノッカー（球出しをする人）のコツ。ノック系のメニュー向け */
  feederTips?: string[];
  /** 安全上の注意 */
  safety?: string[];
  /** ストレッチを行う時期（動的は練習前、静的は練習後が基本） */
  timing?: StretchTiming;
  /** 運営者が内容を確認済みか。true のものだけ「運営者確認済み」と表示する */
  reviewed?: boolean;
};

/** before: 練習前（動的ストレッチ） / after: 練習後（静的ストレッチ） / either: どちらでも */
export type StretchTiming = "before" | "after" | "either";

export const TIMING_LABELS: Record<StretchTiming, string> = {
  before: "練習前（動的）",
  after: "練習後（静的）",
  either: "練習前・後どちらでも",
};

export const TIMING_HELP =
  "動的ストレッチ（動きながら関節や筋肉を温める）は練習前に、静的ストレッチ（ゆっくり伸ばして止める）は練習後に行うのが基本です。強い力を出す前に、長く止めて伸ばすと、動きが出にくくなることがあります。";

export const LEVEL_LABELS: Record<Level, string> = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
};

/** レベルの目安（このサイトでの使い分け） */
export const LEVEL_HELP: Record<Level, string> = {
  beginner: "ラケットに慣れ、基本の動きやフォームを身につける段階",
  intermediate: "基本のショットが打てて、ラリーが続く段階",
  advanced: "打ち分けや連係、実戦での判断を磨く段階",
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
  none: "共通",
};

