import type { GearGuide } from "./gear";
import type { Product } from "./products";
import type { Rule } from "./rules";
import type { Trivia } from "./trivia";
import contentJson from "./content.json";

export type ShuttleNumberRow = { no: string; temp: string; season: string; flight?: string };

export type SiteSettings = {
  operatorName?: string;
  operatorProfile?: string[];
  contactLabel?: string;
  contactHref?: string;
  /** お問い合わせフォームの送信先（Formspree などの https のURL） */
  contactFormEndpoint?: string;
};

/**
 * 開発用エディタ（/editor/content）で保存した、メニュー以外の内容。
 * 項目があるものだけが、元データ（rules.ts など）の代わりに使われる。
 * 一覧（ルール・雑学・商品など）は、まるごと置き換える。
 */
export type ContentOverrides = {
  rules?: Rule[];
  trivia?: Trivia[];
  shuttleNumbers?: ShuttleNumberRow[];
  shuttlePoints?: string[];
  gearGuides?: GearGuide[];
  products?: Product[];
  site?: SiteSettings;
};

export const content = contentJson as unknown as ContentOverrides;
