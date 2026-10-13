import { RULE_CATEGORY_LABELS } from "./rules";
import { TRIVIA_CATEGORY_LABELS } from "./trivia";
import { QUIZ_CATEGORY_LABELS, QUIZ_KIND_LABELS, QUIZ_LEVEL_LABELS } from "./quiz";
import { PRODUCT_KIND_LABELS } from "./products";
import { PHRASE_CATEGORY_LABELS, TROUBLE_CATEGORY_LABELS, WORRY_CATEGORY_LABELS } from "./coachingTypes";

/**
 * メニュー以外の内容を編集するための、項目の定義。
 * エディタの入力欄と、保存 API の検証の、両方で使う。
 */
export type Field = {
  key: string;
  label: string;
  kind: "text" | "area" | "select" | "lines" | "bool" | "links";
  options?: Record<string, string>;
  required?: boolean;
  hint?: string;
  max?: number;
};

export type Collection = {
  key: "rules" | "trivia" | "quiz" | "shuttleNumbers" | "gearGuides" | "products" | "worries" | "phrases" | "troubles";
  label: string;
  /** 一覧に出す項目名 */
  titleKey: string;
  /** 新規追加する項目の id の頭文字（id を持つ一覧のみ） */
  idPrefix?: string;
  fields: Field[];
  /** 公開ページ */
  page: string;
};

export const COLLECTIONS: Collection[] = [
  {
    key: "rules",
    label: "ルール（Q&A）",
    titleKey: "question",
    idPrefix: "r",
    page: "/rules",
    fields: [
      { key: "category", label: "区分", kind: "select", options: RULE_CATEGORY_LABELS, required: true },
      { key: "question", label: "質問", kind: "text", required: true },
      { key: "answer", label: "答え", kind: "area", required: true },
      { key: "points", label: "補足（箇条書き）", kind: "lines", hint: "1行に1項目" },
      { key: "basis", label: "根拠（条文など）", kind: "text" },
      { key: "note", label: "注意点・よくある勘違い", kind: "area" },
    ],
  },
  {
    key: "trivia",
    label: "雑学",
    titleKey: "title",
    idPrefix: "t",
    page: "/trivia",
    fields: [
      { key: "category", label: "区分", kind: "select", options: TRIVIA_CATEGORY_LABELS, required: true },
      { key: "title", label: "見出し", kind: "text", required: true },
      { key: "body", label: "本文", kind: "area", required: true },
      { key: "tip", label: "指導メモ", kind: "area" },
    ],
  },
  {
    key: "quiz",
    label: "クイズ",
    titleKey: "question",
    idPrefix: "q",
    page: "/quiz",
    fields: [
      { key: "kind", label: "形式", kind: "select", options: QUIZ_KIND_LABELS, required: true },
      { key: "category", label: "区分", kind: "select", options: QUIZ_CATEGORY_LABELS, required: true },
      { key: "level", label: "対象", kind: "select", options: QUIZ_LEVEL_LABELS, required: true },
      { key: "question", label: "問題", kind: "text", required: true },
      { key: "choices", label: "選択肢（正解を1行目に）", kind: "lines", required: true, hint: "○×クイズは「○」「×」の2行（正解を先に）。3択は3行。画面では並べ替えて表示します" },
      { key: "explanation", label: "解説", kind: "area", required: true },
      { key: "sources", label: "出典（公式の資料など）", kind: "links", hint: "確認に使った資料" },
      { key: "checkedAt", label: "確認時期", kind: "text", hint: "例：2026年10月" },
      { key: "factCheck", label: "ファクトチェックの記録（公開されません）", kind: "area", hint: "何を、どの資料で確認したか" },
    ],
  },
  {
    key: "shuttleNumbers",
    label: "シャトルの番号表",
    titleKey: "no",
    page: "/trivia#shuttle-numbers",
    fields: [
      { key: "no", label: "番号", kind: "text", required: true, max: 4 },
      { key: "temp", label: "室温の目安", kind: "text", required: true },
      { key: "season", label: "季節", kind: "text", required: true },
      { key: "flight", label: "飛び方（任意）", kind: "text" },
    ],
  },
  {
    key: "gearGuides",
    label: "用品の選び方ガイド",
    titleKey: "title",
    idPrefix: "g",
    page: "/gear#guides",
    fields: [
      { key: "title", label: "見出し", kind: "text", required: true },
      { key: "summary", label: "要約", kind: "area", required: true },
      { key: "points", label: "ポイント（箇条書き）", kind: "lines", required: true, hint: "1行に1項目" },
      { key: "links", label: "関連リンク", kind: "links" },
    ],
  },
  {
    key: "products",
    label: "おすすめ商品",
    titleKey: "name",
    idPrefix: "p",
    page: "/gear#products",
    fields: [
      { key: "kind", label: "種類", kind: "select", options: PRODUCT_KIND_LABELS, required: true },
      { key: "name", label: "商品名", kind: "text", required: true },
      { key: "maker", label: "メーカー・出版社", kind: "text" },
      { key: "description", label: "おすすめする理由", kind: "area", required: true },
      { key: "points", label: "確認できた特徴", kind: "lines", hint: "1行に1項目。公式の情報で確認できたことだけ" },
      { key: "url", label: "公式ページのURL", kind: "text", hint: "https:// から。販売店ではなく、メーカー・出版社のページ" },
      { key: "affiliate", label: "アフィリエイト（広告）リンク", kind: "bool", hint: "チェックすると「PR」表示と広告の注意書きが出ます" },
      { key: "price", label: "価格", kind: "text" },
      { key: "checkedAt", label: "確認時期", kind: "text", hint: "例：2026年10月" },
      { key: "source", label: "出典", kind: "text" },
    ],
  },
  {
    key: "troubles",
    label: "お悩み別ガイド",
    titleKey: "title",
    idPrefix: "tr",
    page: "/coach/troubles",
    fields: [
      { key: "reviewed", label: "運営者確認済み（チェックすると公開されます）", kind: "bool" },
      { key: "category", label: "区分", kind: "select", options: TROUBLE_CATEGORY_LABELS, required: true },
      { key: "title", label: "お悩み（見出し）", kind: "text", required: true },
      { key: "summary", label: "よくある状態", kind: "area", required: true },
      { key: "causes", label: "考えられる原因", kind: "lines", required: true, hint: "1行に1項目" },
      { key: "checks", label: "自分で確かめる方法", kind: "lines", required: true, hint: "1行に1項目" },
      { key: "fixes", label: "直し方・練習のコツ", kind: "lines", required: true, hint: "1行に1項目" },
      { key: "tags", label: "関連する課題タグ（メニュー一覧へのリンクになります）", kind: "lines", hint: "タグの id を1行に1つ（power, control, form, racketwork, speed, reaction, footwork, jump, stamina, flexibility, core, care, attack, defense, net, back, serve, switch, tactics, pair, match）" },
      { key: "experience", label: "運営者の経験・ひとこと（入れると公開されます）", kind: "area", hint: "実際に効いた直し方や、指導での気づきなど" },
    ],
  },
  {
    key: "worries",
    label: "指導のお悩み",
    titleKey: "title",
    idPrefix: "wr",
    page: "/coach/worries",
    fields: [
      { key: "reviewed", label: "運営者確認済み（チェックすると公開されます）", kind: "bool" },
      { key: "category", label: "区分", kind: "select", options: WORRY_CATEGORY_LABELS, required: true },
      { key: "title", label: "お悩み（見出し）", kind: "text", required: true },
      { key: "scene", label: "よくある場面", kind: "area", required: true },
      { key: "cause", label: "原因の見立て", kind: "area", required: true },
      { key: "actions", label: "今日からできる一手", kind: "lines", required: true, hint: "1行に1項目" },
      { key: "avoid", label: "避けたい対応", kind: "lines", hint: "1行に1項目" },
      { key: "phrases", label: "声かけの例", kind: "lines", hint: "1行に1項目" },
      { key: "experience", label: "運営者の経験・ひとこと（入れると公開されます）", kind: "area", hint: "実際にあった場面や、うまくいった対応など" },
    ],
  },
  {
    key: "phrases",
    label: "声かけ集",
    titleKey: "title",
    idPrefix: "ph",
    page: "/coach/phrases/match",
    fields: [
      { key: "reviewed", label: "運営者確認済み（チェックすると公開されます）", kind: "bool" },
      { key: "category", label: "区分（p-＝普段の練習中、m-＝試合中）", kind: "select", options: PHRASE_CATEGORY_LABELS, required: true },
      { key: "title", label: "場面", kind: "text", required: true },
      { key: "phrases", label: "言い方の例", kind: "lines", required: true, hint: "1行に1項目" },
      { key: "intent", label: "ねらい・考え方", kind: "area", required: true },
      { key: "avoid", label: "避けたい言い方・やり方", kind: "lines", hint: "1行に1項目" },
      { key: "tip", label: "ひとこと補足", kind: "area" },
      { key: "experience", label: "運営者の経験・ひとこと（入れると公開されます）", kind: "area", hint: "実際にかけた言葉や、反応など" },
    ],
  },
];

export const SITE_FIELDS: Field[] = [
  { key: "operatorName", label: "運営者名", kind: "text", hint: "空のままなら「個人」と表示されます" },
  { key: "operatorProfile", label: "運営者のプロフィール", kind: "lines", hint: "1行に1項目（「バドミントン歴20年以上」など）" },
  { key: "contactLabel", label: "お問い合わせのボタンの文字", kind: "text" },
  { key: "contactFormEndpoint", label: "お問い合わせフォームの送信先URL", kind: "text", hint: "Formspree などで作ったフォームの送信先（https://formspree.io/f/…）。入れると、サイト内にフォームが出ます" },
  { key: "contactHref", label: "お問い合わせ先", kind: "text", hint: "フォームのURL（https://…）または mailto:…。空のままなら「準備中」と表示されます" },
];

export const SHUTTLE_POINTS_LABEL = "シャトルの番号：覚えておきたいポイント";

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => !!v && typeof v === "object" && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === "string";

const safeHref = (v: string, allowMail: boolean) =>
  /^https:\/\//i.test(v) || (allowMail && /^mailto:/i.test(v));

/** 1件分の入力を検証して整える。不正なら理由の文字列を返す */
function cleanItem(fields: Field[], input: unknown, where: string, extra: { mail?: boolean } = {}): Obj | string {
  if (!isObj(input)) return `${where}が不正です`;
  const out: Obj = {};
  for (const f of fields) {
    const v = input[f.key];
    const name = `${where}の「${f.label}」`;
    switch (f.kind) {
      case "text":
      case "area": {
        if (v === undefined || v === null || v === "") {
          if (f.required) return `${name}が空です`;
          break;
        }
        if (!isStr(v) || v.length > (f.kind === "area" ? 4000 : 400)) return `${name}が不正です`;
        const t = v.trim();
        if (!t) {
          if (f.required) return `${name}が空です`;
          break;
        }
        if (f.max && t.length > f.max) return `${name}が長すぎます`;
        if ((f.key === "url" || f.key === "contactHref" || f.key === "contactFormEndpoint") && !safeHref(t, f.key === "contactHref" && !!extra.mail))
          return `${name}は、https:// から始まるURLにしてください`;
        out[f.key] = t;
        break;
      }
      case "select": {
        if (!isStr(v) || !f.options || !(v in f.options)) return `${name}が不正です`;
        out[f.key] = v;
        break;
      }
      case "bool": {
        if (v !== undefined && typeof v !== "boolean") return `${name}が不正です`;
        if (v === true) out[f.key] = true;
        break;
      }
      case "lines": {
        if (v === undefined || v === null) {
          if (f.required) return `${name}が空です`;
          break;
        }
        if (!Array.isArray(v) || !v.every(isStr) || v.length > 100) return `${name}が不正です`;
        const items = v.map((t) => t.trim()).filter(Boolean);
        if (items.length === 0) {
          if (f.required) return `${name}が空です`;
          break;
        }
        out[f.key] = items;
        break;
      }
      case "links": {
        if (v === undefined || v === null) break;
        if (!Array.isArray(v) || v.length > 20) return `${name}が不正です`;
        const links: { label: string; href: string; external?: boolean }[] = [];
        for (const l of v) {
          if (!isObj(l) || !isStr(l.label) || !isStr(l.href)) return `${name}が不正です`;
          const label = l.label.trim();
          const href = l.href.trim();
          if (!label && !href) continue;
          if (!label) return `${name}に、表示する文字のないリンクがあります`;
          const external = /^https:\/\//i.test(href);
          if (!external && !(href.startsWith("/") && !href.startsWith("//"))) return `${name}は、https:// か、/ から始まるアドレスにしてください`;
          links.push(external ? { label, href, external: true } : { label, href });
        }
        if (links.length > 0) out[f.key] = links;
        break;
      }
    }
  }
  return out;
}

/** クイズの選択肢が、形式に合っているかを調べる。問題があれば、理由を返す */
function quizProblem(item: Obj): string | null {
  const choices = Array.isArray(item.choices) ? (item.choices as string[]) : [];
  if (item.kind === "tf") {
    const ok = choices.length === 2 && [...choices].sort().join("") === ["○", "×"].sort().join("");
    return ok ? null : "○×クイズの選択肢は、「○」と「×」の2行にしてください（正解を1行目に）";
  }
  if (choices.length < 2 || choices.length > 4) return "3択クイズの選択肢は、2〜4行にしてください（正解を1行目に）";
  if (new Set(choices).size !== choices.length) return "選択肢に、同じものがあります";
  return null;
}

/** 一覧を検証して整える。不正なら理由の文字列を返す */
export function cleanCollection(col: Collection, input: unknown): Obj[] | string {
  if (!Array.isArray(input) || input.length > 1000) return "一覧が不正です";
  const ids = new Set<string>();
  const out: Obj[] = [];
  for (let i = 0; i < input.length; i++) {
    const raw = input[i];
    const where = `${i + 1}件目`;
    const item = cleanItem(col.fields, raw, where);
    if (typeof item === "string") return item;
    if (col.key === "quiz") {
      const bad = quizProblem(item);
      if (bad) return `${where}：${bad}`;
    }
    if (col.idPrefix) {
      const id = isObj(raw) ? raw.id : undefined;
      if (!isStr(id) || !/^[A-Za-z0-9_-]{1,30}$/.test(id)) return `${where}の id が不正です`;
      if (ids.has(id)) return `id「${id}」が重複しています`;
      ids.add(id);
      out.push({ id, ...item });
    } else out.push(item);
  }
  return out;
}

export function cleanLines(input: unknown): string[] | string {
  if (!Array.isArray(input) || !input.every(isStr) || input.length > 100) return "一覧が不正です";
  return input.map((t) => t.trim()).filter(Boolean);
}

export function cleanSite(input: unknown): Obj | string {
  return cleanItem(SITE_FIELDS, input, "サイト設定", { mail: true });
}
