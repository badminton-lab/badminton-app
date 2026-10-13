/**
 * 課題からの逆引き用のタグ（「打力を強化したい」「反応を速くしたい」など）。
 * 区分（パターン練習・アップなど）とは別の軸で、メニューが何を伸ばすかを表す。
 * 候補は運営者の確認待ち。ラベルや分け方は、確認後にここを直す。
 * 付け方は、menus の元データではなく drillTags.ts（id → タグ）に書く。エディタ（/editor）からも付けられる。
 */
export type TagGroup = { key: string; label: string; tags: { id: string; label: string; help: string }[] };

export const TAG_GROUPS: TagGroup[] = [
  {
    key: "hit",
    label: "打つ力",
    tags: [
      { id: "power", label: "打力強化", help: "スマッシュ・クリアなどの威力や飛距離を伸ばす" },
      { id: "control", label: "コントロール", help: "コースの打ち分けや、落とす位置の正確さを高める" },
      { id: "form", label: "フォーム習得", help: "握り・スイング・打点など、打ち方の基本を身につける" },
      { id: "racketwork", label: "ラケットワーク", help: "手首・指の使い方や、ラケットの面の操作を磨く" },
    ],
  },
  {
    key: "move",
    label: "動く力",
    tags: [
      { id: "speed", label: "スピード向上", help: "動き出しと移動の速さを上げる" },
      { id: "reaction", label: "反応速度向上", help: "相手の球や合図に、すばやく反応する" },
      { id: "footwork", label: "フットワーク", help: "ステップ・切り返し・戻りなど、コート上の足さばき" },
      { id: "jump", label: "ジャンプ力・瞬発力", help: "ジャンプや、一歩目の爆発的な力" },
    ],
  },
  {
    key: "body",
    label: "体づくり",
    tags: [
      { id: "stamina", label: "持久力・スタミナ", help: "長いラリーや試合で、動きが落ちない体力" },
      { id: "flexibility", label: "柔軟性・可動域", help: "関節や筋肉の動く範囲を広げる" },
      { id: "core", label: "体幹・バランス", help: "ぶれない軸と、崩れても立て直す力" },
      { id: "care", label: "ケガ予防・疲労回復", help: "練習前の準備と、練習後のケア" },
    ],
  },
  {
    key: "game",
    label: "試合で使う力",
    tags: [
      { id: "attack", label: "攻撃力", help: "決め球をつくり、点を取りにいく" },
      { id: "defense", label: "守備力", help: "強い球を受けて、立て直す（レシーブ）" },
      { id: "net", label: "ネット前", help: "ヘアピン・プッシュなど、前のプレー" },
      { id: "back", label: "奥（後ろ）", help: "クリア・ドロップ・スマッシュなど、後ろからのプレー" },
      { id: "serve", label: "サーブ・レシーブ", help: "最初の1〜3球を、有利に進める" },
      { id: "switch", label: "攻守の切り替え", help: "守りから攻めへ、攻めから守りへ移る" },
      { id: "tactics", label: "配球", help: "どこへ打つかを組み立てる（球の配分・打ち分けの順序）" },
      { id: "pair", label: "連係", help: "ダブルスのペアや、複数人で、動きをつなげる（陣形・ローテーション・声かけ）" },
      { id: "match", label: "実戦形式", help: "ゲーム形式で、練習の成果を試合に近づける" },
    ],
  },
];

export const ALL_TAGS = TAG_GROUPS.flatMap((g) => g.tags);
export type TagId = string;

export const TAG_LABELS: Record<string, string> = Object.fromEntries(ALL_TAGS.map((t) => [t.id, t.label]));
export const isTagId = (v: unknown): v is TagId => typeof v === "string" && v in TAG_LABELS;
