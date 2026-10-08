import { content } from "@/data/content";

const saved = content.site ?? {};

/**
 * サイト全体の設定。
 * 公開する前に、「運営者」と「お問い合わせ」を記入すること（プライバシーポリシー・お問い合わせページに表示される）。
 */
type SiteInfo = {
  name: string;
  fullName: string;
  description: string;
  locale: string;
  operator: { name: string; profile: string[] };
  contact: { label: string; href: string };
};

export const SITE: SiteInfo = {
  name: "バドミントン練習メニュー",
  fullName: "バドミントン練習メニュー検索",
  description:
    "バドミントン指導者のための練習メニュー集。人数・レベル・区分から、コート図つきの練習メニュー、指導のコツ、ルール、用品の選び方まで探せます。",
  locale: "ja_JP",

  operator: {
    /** 運営者名やハンドルネーム。空のままなら「個人」とだけ表示する */
    name: saved.operatorName ?? "",
    /** 運営者のプロフィール（実績）。About ページに表示する */
    profile: saved.operatorProfile ?? ["バドミントン歴20年以上", "指導者歴10年以上", "公認審判員2級"],
  },

  /**
   * お問い合わせ先。href には、フォームのURL（https://…）かメールアドレス（mailto:…）を入れる。
   * 空のままなら、ページに「準備中」と表示される。
   */
  contact: {
    label: saved.contactLabel ?? "",
    href: saved.contactHref ?? "",
  },
};

/** 公開URL。公開する環境で、環境変数 NEXT_PUBLIC_SITE_URL に設定する（例: https://example.com） */
function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const hasContact = () => SITE.contact.href.trim() !== "";
