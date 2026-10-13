/**
 * 指導者向けの読み物（指導のお悩み・声かけ集）の型とラベル。
 * 画面（クライアント）から読んでよいよう、内容のデータは含めない。内容は coaching.ts。
 */

// ───────────── 指導のお悩み ─────────────
export type WorryCategory = "focus" | "skill" | "gap" | "mental" | "parents" | "mgmt" | "care";

export const WORRY_CATEGORY_LABELS: Record<WorryCategory, string> = {
  focus: "集中力・態度",
  skill: "上達・技術",
  gap: "力の差・学年・人数",
  mental: "気持ち・メンタル",
  parents: "保護者との関係",
  mgmt: "チーム運営",
  care: "体調・安全",
};

export const WORRY_CATEGORY_ORDER: WorryCategory[] = ["focus", "skill", "gap", "mental", "parents", "mgmt", "care"];

export type Worry = {
  id: string;
  category: WorryCategory;
  /** お悩みの見出し（「〇〇する」「〇〇しない」の形） */
  title: string;
  /** よくある場面 */
  scene: string;
  /** 原因の見立て */
  cause: string;
  /** 今日からできる一手 */
  actions: string[];
  /** 避けたい対応 */
  avoid?: string[];
  /** 声かけの例 */
  phrases?: string[];
  /** 運営者の経験・ひとこと（運営者が書き足す。入っていれば公開される） */
  experience?: string;
  /** 運営者が確認済み。確認済みのものだけが公開される */
  reviewed?: boolean;
};

// ───────────── 声かけ集 ─────────────
export type PhraseGroup = "practice" | "match";

export const PHRASE_GROUP_LABELS: Record<PhraseGroup, string> = {
  practice: "普段の練習中の声かけ",
  match: "試合中の声かけ（インターバルのアドバイス）",
};

export type PhraseCategory =
  | "p-start"
  | "p-drill"
  | "p-miss"
  | "p-good"
  | "p-slump"
  | "p-game"
  | "p-end"
  | "m-basic"
  | "m-before"
  | "m-lead"
  | "m-behind"
  | "m-close"
  | "m-doubles"
  | "m-singles"
  | "m-between"
  | "m-final"
  | "m-bench"
  | "m-after";

export const PHRASE_CATEGORY_LABELS: Record<PhraseCategory, string> = {
  "p-start": "練習の始まり・準備運動",
  "p-drill": "基本打ち・ドリル・ノック中",
  "p-miss": "ミスをしたとき",
  "p-good": "できたとき・ほめるとき",
  "p-slump": "集中が切れた・だれたとき",
  "p-game": "ゲーム練習・練習試合",
  "p-end": "練習の終わり",
  "m-basic": "インターバルの基本",
  "m-before": "試合前",
  "m-lead": "インターバル：リードしているとき",
  "m-behind": "インターバル：負けているとき",
  "m-close": "インターバル：接戦のとき",
  "m-doubles": "インターバル：ダブルス",
  "m-singles": "インターバル：シングルス",
  "m-between": "ゲームの間",
  "m-final": "最終ゲーム・勝負どころ",
  "m-bench": "試合中のベンチ・応援",
  "m-after": "試合後",
};

export const PHRASE_CATEGORY_ORDER: Record<PhraseGroup, PhraseCategory[]> = {
  practice: ["p-start", "p-drill", "p-miss", "p-good", "p-slump", "p-game", "p-end"],
  match: [
    "m-basic",
    "m-before",
    "m-lead",
    "m-behind",
    "m-close",
    "m-doubles",
    "m-singles",
    "m-between",
    "m-final",
    "m-bench",
    "m-after",
  ],
};

export const phraseGroupOf = (c: PhraseCategory): PhraseGroup => (c.startsWith("m-") ? "match" : "practice");

export type Phrase = {
  id: string;
  category: PhraseCategory;
  /** 場面（「〇〇のとき」の形） */
  title: string;
  /** 言い方の例 */
  phrases: string[];
  /** ねらい・考え方 */
  intent: string;
  /** 避けたい言い方 */
  avoid?: string[];
  /** ひとこと補足 */
  tip?: string;
  /** 運営者の経験・ひとこと（運営者が書き足す。入っていれば公開される） */
  experience?: string;
  /** 運営者が確認済み。確認済みのものだけが公開される */
  reviewed?: boolean;
};

// ───────────── お悩み別ガイド（「できない」から原因を探す） ─────────────
export type TroubleCategory = "hit" | "move" | "defense" | "game";

export const TROUBLE_CATEGORY_LABELS: Record<TroubleCategory, string> = {
  hit: "打つ（ショット）",
  move: "動く（フットワーク）",
  defense: "受ける（守備）",
  game: "試合・体力",
};

export const TROUBLE_CATEGORY_ORDER: TroubleCategory[] = ["hit", "move", "defense", "game"];

export type Trouble = {
  id: string;
  category: TroubleCategory;
  /** お悩み（「〇〇が△△」の形） */
  title: string;
  /** よくある状態 */
  summary: string;
  /** 考えられる原因 */
  causes: string[];
  /** 自分で確かめる方法 */
  checks: string[];
  /** 直し方・練習のコツ */
  fixes: string[];
  /** 関連する課題タグ（tags.ts の id）。メニュー一覧の絞り込みへのリンクになる */
  tags?: string[];
  /** 運営者の経験・ひとこと（運営者が書き足す。入っていれば公開される） */
  experience?: string;
  /** 運営者が確認済み。確認済みのものだけが公開される */
  reviewed?: boolean;
};

// ───────────── はじめてのバドミントン／試合の日ガイド（初心者・保護者向け） ─────────────
export type GuideGroup = "start" | "matchday";

export const GUIDE_GROUP_LABELS: Record<GuideGroup, string> = {
  start: "はじめてのバドミントン",
  matchday: "試合の日ガイド",
};

export type GuideCategory =
  | "s-first"
  | "s-grip"
  | "s-basic"
  | "s-day1"
  | "s-manner"
  | "s-parents"
  | "s-gear"
  | "d-before"
  | "d-morning"
  | "d-venue"
  | "d-between"
  | "d-after"
  | "d-parents"
  | "d-first";

export const GUIDE_CATEGORY_LABELS: Record<GuideCategory, string> = {
  "s-first": "まず知っておきたいこと",
  "s-grip": "握り方・構え",
  "s-basic": "基本の動き",
  "s-day1": "最初の1日の流れ",
  "s-manner": "体育館での約束・マナー",
  "s-parents": "保護者の方へ",
  "s-gear": "用具の最低限",
  "d-before": "前日までの準備",
  "d-morning": "当日の朝・会場へ",
  "d-venue": "会場での過ごし方",
  "d-between": "試合の合間",
  "d-after": "試合のあと",
  "d-parents": "保護者の方へ（応援・サポート）",
  "d-first": "初めての大会で知っておきたいこと",
};

export const GUIDE_CATEGORY_ORDER: Record<GuideGroup, GuideCategory[]> = {
  start: ["s-first", "s-gear", "s-grip", "s-basic", "s-day1", "s-manner", "s-parents"],
  matchday: ["d-first", "d-before", "d-morning", "d-venue", "d-between", "d-after", "d-parents"],
};

export const guideGroupOf = (c: GuideCategory): GuideGroup => (c.startsWith("d-") ? "matchday" : "start");

export type Guide = {
  id: string;
  category: GuideCategory;
  title: string;
  /** 本文（やさしい言葉で） */
  body: string;
  /** 箇条書きのポイント */
  points?: string[];
  /** 持ち物などのチェックリスト（□つきで表示。印刷しやすい） */
  checklist?: string[];
  /** ひとこと補足 */
  tip?: string;
  /** 関連するページへのリンク（サイト内は / から、外部は https://） */
  links?: { label: string; href: string; external?: boolean }[];
  /** 運営者の経験・ひとこと（運営者が書き足す。入っていれば公開される） */
  experience?: string;
  /** 運営者が確認済み。確認済みのものだけが公開される */
  reviewed?: boolean;
};
