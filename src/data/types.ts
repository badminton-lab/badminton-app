export type Level = "beginner" | "intermediate" | "advanced";
/** 練習区分 */
export type Category =
  | "pattern" // パターン練習
  | "drill" // ドリル（複数人が、順番に回りながら、ローテーションで打つ）
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

// ───────────── イメージ図（人の体・ラケット・道具の部品） ─────────────

/** 部品の色。テーマに依存しない固定色（コート図と同じ） */
export type ColorName = "blue" | "orange" | "gray" | "green" | "red" | "yellow" | "dark";

/**
 * 人のポーズ。各部分（線分）の向きを、絶対角度（度）で持つ。
 * 角度の決まり: 0 = 真下、90 = 右、180 = 真上、-90 = 左。
 * 体幹・頭は、腰・首から上へ伸びるので、まっすぐ立つと 180 になる。
 * 腕・脚は [上腕, 前腕]、[太もも, すね]。R は手前側、L は奥側。
 */
export type PersonPose = {
  torso: number;
  head: number;
  armL: [number, number];
  armR: [number, number];
  legL: [number, number];
  legR: [number, number];
};

type PartBase = { id: string };

export type PersonPart = PartBase & {
  type: "person";
  /** 腰の位置 */
  x: number;
  y: number;
  scale?: number;
  /** true で左右反転（左向き） */
  flip?: boolean;
  color?: ColorName;
  /** 頭の横に出す文字（番号など） */
  label?: string;
  /** false で足を描かない（正面向きの図など）。既定は描く */
  feet?: boolean;
  pose: PersonPose;
};

export type RacketPart = PartBase & {
  type: "racket";
  /** グリップの位置（手に持たせたときは、手の位置が使われる） */
  x: number;
  y: number;
  /** 向き（度）。手に持たせたときは、前腕の向きからの差 */
  rotation: number;
  scale?: number;
  /** 人の手に持たせる */
  attach?: { to: string; hand: "L" | "R" };
};

export type ShuttlePart = PartBase & { type: "shuttle"; x: number; y: number; rotation?: number; scale?: number };
export type BallPart = PartBase & { type: "ball"; x: number; y: number; scale?: number; color?: ColorName };
export type ConePart = PartBase & { type: "cone"; x: number; y: number; scale?: number; color?: ColorName };
/** フープ・的 */
export type RingPart = PartBase & { type: "ring"; x: number; y: number; scale?: number; color?: ColorName };
export type ArrowPart = PartBase & {
  type: "arrow";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** 曲げ具合（0 で直線） */
  bend?: number;
  dashed?: boolean;
  color?: ColorName;
};
export type LinePart = PartBase & {
  type: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width?: number;
  dashed?: boolean;
  color?: ColorName;
};
/** マット・壁・ベンチなど */
export type RectPart = PartBase & { type: "rect"; x: number; y: number; w: number; h: number; color?: ColorName };
export type TextPart = PartBase & { type: "text"; x: number; y: number; text: string; size?: number; color?: ColorName };

export type IllustrationPart =
  | PersonPart
  | RacketPart
  | ShuttlePart
  | BallPart
  | ConePart
  | RingPart
  | ArrowPart
  | LinePart
  | RectPart
  | TextPart;

/** イメージ図。座標は、幅320・高さ200の中。後ろの部品から順に描く */
export type Illustration = {
  parts: IllustrationPart[];
  /** 床の線を描く（既定: 描く） */
  ground?: boolean;
};

// ───────────── 場面図（上から見た図。運動遊びなど） ─────────────

type SceneBase = { id: string };

/** 人を表す、色つきの丸のコマ。label は中に入れる文字（番号・役名）。dir は向きの印（0=上、90=右） */
export type TokenPart = SceneBase & { type: "token"; x: number; y: number; color?: ColorName; label?: string; scale?: number; dir?: number };
/** 陣地・エリア（半透明の面） */
export type ZonePart = SceneBase & { type: "zone"; x: number; y: number; w: number; h: number; color?: ColorName; label?: string; round?: boolean };
/** 床のライン・テープなど */
export type SceneLinePart = SceneBase & { type: "line"; x1: number; y1: number; x2: number; y2: number; color?: ColorName; width?: number; dashed?: boolean };
/** 動き（実線）や、物の軌道（破線）を示す矢印 */
export type SceneArrowPart = SceneBase & { type: "arrow"; x1: number; y1: number; x2: number; y2: number; bend?: number; dashed?: boolean; color?: ColorName };
export type SceneTextPart = SceneBase & { type: "text"; x: number; y: number; text: string; size?: number; color?: ColorName };
/** 吹き出し（合図・かけ声など）。x, y は中心 */
export type BubblePart = SceneBase & { type: "bubble"; x: number; y: number; text: string; size?: number; color?: ColorName };

export const PROP_KINDS = ["tail", "balloon", "racket", "shuttle", "ball", "cone", "hoop", "treasure", "flag", "basket"] as const;
export type PropKind = (typeof PROP_KINDS)[number];
/** 道具のアイコン */
export type PropPart = SceneBase & { type: "prop"; kind: PropKind; x: number; y: number; rotation?: number; scale?: number; color?: ColorName };

export type ScenePart = TokenPart | ZonePart | SceneLinePart | SceneArrowPart | SceneTextPart | BubblePart | PropPart;

/** 場面図。座標は、幅320・高さ200の中。後ろの部品から順に描く */
export type Scene = {
  parts: ScenePart[];
  /** 体育館の床の色（既定: 木の色） */
  floor?: "wood" | "plain";
  /** コートの白い線を描く（既定: 描く） */
  court?: boolean;
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
  /** 体・ラケットなどのイメージ図（コート図がないメニュー向け）。汎用的な部品の組み合わせ */
  illustration?: Illustration;
  /** 上から見た場面図（運動遊びなど）。コート図・イメージ図がないメニュー向け */
  scene?: Scene;

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
  /** 運営者が内容を確認済みか。true のメニューだけが、公開サイトに表示される */
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
  drill: "ドリル",
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
  "drill",
  "footwork",
  "warmup",
  "stretch",
  "play",
];

/** 区分の説明（絞り込み画面に表示する） */
export const CATEGORY_HELP: Record<Category, string> = {
  pattern: "決まった順序で打ち合い、配球や連係を身につける練習（ゲーム形式を含む）",
  drill: "複数人が、決まった順番・動き方で、ぐるぐる回りながら（ローテーションで）、交代して打つ練習",
  handFeed: "フィーダー（ノッカー）が手で投げた球を、打ち返す練習",
  racketFeed: "フィーダー（ノッカー）がラケットで打った球を、打ち返す練習",
  footwork: "コート上の、移動とステップの練習",
  warmup: "練習前に、体を温めて、動きの準備をする（素振りなどの、フォーム確認も含む）",
  stretch: "筋肉や関節を伸ばして、動きをなめらかにし、疲れをやわらげる",
  play: "遊びの中に、走る・跳ぶ・打つ・反応するなどの運動を取り入れた練習",
};

export const COURT_TYPE_LABELS: Record<CourtType, string> = {
  singles: "シングルス",
  doubles: "ダブルス",
  both: "シングルス/ダブルス",
  none: "共通",
};

