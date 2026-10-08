import { content } from "./content";

export type ProductKind = "racket" | "shuttle" | "book" | "other";

export const PRODUCT_KIND_LABELS: Record<ProductKind, string> = {
  racket: "ラケット",
  shuttle: "シャトル",
  book: "指導書・ルールの本",
  other: "その他",
};

/** 表示の並び順 */
export const PRODUCT_KIND_ORDER: ProductKind[] = ["racket", "shuttle", "other", "book"];

export type Product = {
  id: string;
  kind: ProductKind;
  name: string;
  /** メーカー・出版社など */
  maker?: string;
  /** おすすめする理由 */
  description: string;
  /** 確認できた特徴（公式の情報にもとづくもの） */
  points?: string[];
  /** 商品の公式ページ（メーカー・出版社）。販売店のリンクではない */
  url?: string;
  /**
   * アフィリエイトリンク（成果報酬のある広告）の場合は true にする。
   * true の商品には「PR」表示が付き、ページ上部に広告である旨が自動で表示される。
   */
  affiliate?: boolean;
  /** 価格（変動するため、出典と確認時期を、必ず書くこと） */
  price?: string;
  /** 情報を確認した時期（例: "2026年10月"） */
  checkedAt?: string;
  /** 情報の出典（例: "ヨネックス公式（シャトルコック製品情報）"） */
  source?: string;
};

const CHECKED = "2026年10月";
const YONEX_SHUTTLE = "ヨネックス公式（シャトルコック製品情報）";
const YONEX_SELECTOR = "ヨネックス公式（ラケットセレクター・2026年カタログ）";
const SHUTTLE_URL = "https://www.yonex.co.jp/sp/badminton/shuttlecock/";
const SELECTOR_URL = "https://www.yonex.co.jp/badminton/pdf/bad_racquets_selector.pdf";

/**
 * おすすめ商品。ここに追加すると、/gear ページの「おすすめ商品」に表示される。
 * 商品名・価格・仕様は、販売元（メーカー・出版社）の公式の情報で確認してから書くこと。
 * リンクは、特定の販売店ではなく、メーカー・出版社の公式ページにしている。
 * （ラケットは、公式のラケットセレクターで「初・中級者向け」とされているモデルを、シリーズ単位で紹介している。）
 */
export const baseProducts: Product[] = [
  // ───────────── ラケット ─────────────
  {
    id: "racket-arcsaber-1-3",
    kind: "racket",
    name: "アークセイバー 1 / 3（ARCSABER 1・3）",
    maker: "ヨネックス",
    description:
      "ヨネックス公式のラケットセレクターで、「初・中級者向け（基本のショットが打てる）」とされているモデルです。セレクター上では、ヘッドヘビー（パワー）とヘッドライト（スピード）の中間に、置かれています。",
    points: [
      "公式の区分：初・中級者向け（基本のショットが打てる）",
      "2026年のカタログに掲載（確認時点）",
      "重さ・グリップサイズ・価格は、公式ページや店頭で確認する",
    ],
    url: SELECTOR_URL,
    checkedAt: CHECKED,
    source: YONEX_SELECTOR,
  },
  {
    id: "racket-astrox-11-33",
    kind: "racket",
    name: "アストロクス 11 / 33（ASTROX 11・33）",
    maker: "ヨネックス",
    description:
      "アストロクスは、ヨネックス公式のラケットセレクターで、ヘッドヘビー（先端が重い、パワー寄り）の側に置かれているシリーズです。その中で、11と33は、「初・中級者向け」とされています。",
    points: [
      "公式の区分：初・中級者向け（基本のショットが打てる）",
      "シリーズの特徴：ヘッドヘビー側（公式セレクターより）",
      "2026年のカタログに掲載（確認時点）",
    ],
    url: SELECTOR_URL,
    checkedAt: CHECKED,
    source: YONEX_SELECTOR,
  },
  {
    id: "racket-nanoflare-300-400",
    kind: "racket",
    name: "ナノフレア 300 / 400（NANOFLARE 300・400）",
    maker: "ヨネックス",
    description:
      "ナノフレアは、ヨネックス公式のラケットセレクターで、ヘッドライト（先端が軽い、振り抜きやすさ寄り）の側に置かれているシリーズです。その中で、300と400は、「初・中級者向け」とされています。",
    points: [
      "公式の区分：初・中級者向け（基本のショットが打てる）",
      "シリーズの特徴：ヘッドライト側（公式セレクターより）",
      "2026年のカタログに掲載（確認時点）",
    ],
    url: SELECTOR_URL,
    checkedAt: CHECKED,
    source: YONEX_SELECTOR,
  },

  // ───── 子ども・初心者向け ─────
  {
    id: "racket-nanoflare-junior",
    kind: "racket",
    name: "ナノフレア ジュニア（NF-JR）",
    maker: "ヨネックス",
    description:
      "ヨネックス公式で「レギュラー長の競技向けジュニアラケット」とされているモデルです。大人と同じ長さで、試合を目指す子どもが、ラケットの長さに慣れておきたいときの候補です。",
    points: [
      "公式の説明：高次元エアロ形状が生み出す振り抜きと操作性",
      "素材：カーボンフレーム＋ナノセルネオ＋高弾性カーボン、カーボンシャフト",
      "推奨テンション：17〜22ポンド",
      "価格：8,250円（税込）",
    ],
    url: "https://yonexshop.jp/item/detail/1_1_NF-JR_1/470",
    price: "8,250円（税込）",
    checkedAt: CHECKED,
    source: "ヨネックス公式オンラインショップ",
  },
  {
    id: "racket-musclepower2-junior",
    kind: "racket",
    name: "マッスルパワー2 ジュニア（MP2JRG）",
    maker: "ヨネックス",
    description:
      "ヨネックス公式で「3歳〜5歳（身長90cm〜110cm）対象、レジャー向けジュニア用ラケット」とされているモデルです。はじめてラケットを持つ、小さな子どもの遊びや体験の場面に。",
    points: [
      "対象：3歳〜5歳（身長90〜110cm）",
      "全長：21インチ",
      "素材：アルミフレーム、スチールシャフト",
      "専用ケース付き",
      "価格：3,520円（税込）",
    ],
    url: "https://yonexshop.jp/item/detail/1_1_MP2JRG_1/",
    price: "3,520円（税込）",
    checkedAt: CHECKED,
    source: "ヨネックス公式オンラインショップ",
  },
  {
    id: "racket-arcsaber-1",
    kind: "racket",
    name: "アークセイバー 1（ARC1）",
    maker: "ヨネックス",
    description:
      "ヨネックス公式で、男女とも「初級者」向けとされているエントリーモデルです。イーブンバランスで、シャトルコントロールと楽な飛びを追求した、とされています。",
    points: [
      "公式の説明：シャトルコントロールと楽な飛びを追求。イーブンバランスで扱いやすい",
      "推奨テンション：17〜22ポンド",
      "価格：16,500円（税込）",
    ],
    url: "https://yonexshop.jp/item/detail/1_1_ARC1_1/327",
    price: "16,500円（税込）",
    checkedAt: CHECKED,
    source: "ヨネックス公式オンラインショップ",
  },
  {
    id: "racket-mizuno-fortius-80",
    kind: "racket",
    name: "フォルティウス 80（FORTIUS 80）",
    maker: "ミズノ",
    description:
      "ミズノ公式で「柔らかいシャフトでクリアの飛びもスマッシュの威力も追求した初級者モデル」とされているラケットです。ヨネックス以外のメーカーも比べたいときの候補です。",
    points: [
      "重さ：4U6（平均83g）、全長：675mm、フェイス：56平方インチ",
      "推奨テンション：18〜22ポンド",
      "日本バドミントン協会の検定合格品",
      "価格：14,300円（税込）",
    ],
    url: "https://jpn.mizuno.com/ec/disp/attgrp/73JTB180/",
    price: "14,300円（税込）",
    checkedAt: CHECKED,
    source: "ミズノ公式オンラインショップ",
  },

  // ───────────── シャトル ─────────────
  {
    id: "shuttle-mavis-40p",
    kind: "shuttle",
    name: "メイビス 40P（M-40P）",
    maker: "ヨネックス",
    description:
      "練習用の、ナイロン（合成）シャトルです。壊れにくいので、基礎練習やノック、初心者・子どもの練習に向いています。",
    points: [
      "ナイロンの羽根と、合成コルクの台",
      "6個入り",
      "SLOW／MIDDLE／FASTの分類があり、体育館の室温に合わせて選ぶ",
    ],
    url: SHUTTLE_URL,
    checkedAt: CHECKED,
    source: YONEX_SHUTTLE,
  },
  {
    id: "shuttle-mavis-600p",
    kind: "shuttle",
    name: "メイビス 600P（M-600P）",
    maker: "ヨネックス",
    description:
      "ナイロン（合成）の羽根で、台に天然コルクを使ったシャトルです。メイビス40P（合成コルクの台）と、台の素材が違います。",
    points: ["ナイロンの羽根と、天然コルクの台", "6個入り", "SLOW／MIDDLE／FASTの分類がある"],
    url: SHUTTLE_URL,
    checkedAt: CHECKED,
    source: YONEX_SHUTTLE,
  },
  {
    id: "shuttle-aerosensa-300",
    kind: "shuttle",
    name: "エアロセンサ 300（AS-300）",
    maker: "ヨネックス",
    description:
      "水鳥の羽根を使った、シャトルです。羽根のシャトルで、実戦に近い飛び方を、練習で確かめたいときに。",
    points: [
      "水鳥の羽根と、2層コンポジットコルクの台",
      "温度表示番号は、2〜5番",
      "1ダース（12個）入り",
    ],
    url: SHUTTLE_URL,
    checkedAt: CHECKED,
    source: YONEX_SHUTTLE,
  },
  {
    id: "shuttle-aerosensa-700",
    kind: "shuttle",
    name: "エアロセンサ 700（AS-700）",
    maker: "ヨネックス",
    description:
      "水鳥の羽根を使った、検定合格球です。大会に出るときは、大会要項で、使用球を確認します。",
    points: [
      "水鳥の羽根と、天然コルクの台",
      "第2種検定合格球（公式の一覧の表記）",
      "温度表示番号は、1〜7番",
      "1ダース（12個）入り",
    ],
    url: SHUTTLE_URL,
    checkedAt: CHECKED,
    source: YONEX_SHUTTLE,
  },

  // ───────────── その他 ─────────────
  {
    id: "grip-wet-super-ac102",
    kind: "other",
    name: "ウェットスーパーグリップ（AC102）",
    maker: "ヨネックス",
    description:
      "ラケットのグリップに巻く、グリップテープです。汗で滑ると、力が入りすぎるため、予備を、練習バッグに入れておくと便利です。",
    points: ["3本入り", "バドミントンのほか、テニス・ソフトテニスでも使える"],
    url: "https://www.yonex.co.jp/badminton/products/?category_m=ACCESSORIES",
    checkedAt: CHECKED,
    source: "ヨネックス公式（製品一覧・価格改定のお知らせ）",
  },

  // ───────────── 指導書・ルールの本 ─────────────
  {
    id: "book-ikeda-menu200",
    kind: "book",
    name: "指導者と選手が一緒に学べる！バドミントン練習メニュー２００",
    maker: "池田書店（監修：堂下智寛）",
    description:
      "基本から戦術まで、練習メニューが200載っている本です。初心者向けのお手本や、NG例、つまずきやすい点も載っています。指導者が、声かけのコツを知りたいときにも。",
    points: ["A5判・192ページ", "ISBN 978-4-262-16665-0", "「足を使ってシャトルの下に体を入れる」ことを重視"],
    url: "https://www.ikedashoten.co.jp/book-details.php?isbn=978-4-262-16665-0",
    price: "税込2,420円（出版社の公式ページより）",
    checkedAt: CHECKED,
    source: "池田書店 公式ページ",
  },
  {
    id: "book-bbm-rules",
    kind: "book",
    name: "マンガで見て考える！バドミントンルール講座",
    maker: "ベースボール・マガジン社（監修：遠井努）",
    description:
      "試合で起こる「トラブル」の対応を、マンガで解説した、ルールブックです。BWF公認審判員が、判定のポイントやトラブルへの対応を、解説しています。フォルト・レット、サービス関連など、4章構成。",
    points: ["A5並製・160頁", "2024年9月4日発売", "ISBN 978-4-583-11713-3"],
    url: "https://www.bbm-japan.com/article/detail/54468",
    price: "税込1,870円（出版社の公式ページより）",
    checkedAt: CHECKED,
    source: "ベースボール・マガジン社 公式ページ",
  },
  {
    id: "book-bbm-parents",
    kind: "book",
    name: "子どもがバドミントンを始めたら読む本",
    maker: "ベースボール・マガジン社（監修：廣瀬栄理子）",
    description:
      "子どもがバドミントンを始めた、保護者の悩みに、8人の専門家が答える形でまとめた本です。ケガの予防、正しい動き、栄養、用具選び、メンタルなどを扱っています。保護者との関わりを考える、指導者にも。",
    points: ["A5並製・304頁", "2024年12月25日発売", "ISBN 978-4-583-11714-0"],
    url: "https://www.bbm-japan.com/article/detail/57152",
    price: "税込1,980円（出版社の公式ページより）",
    checkedAt: CHECKED,
    source: "ベースボール・マガジン社 公式ページ",
  },
  {
    id: "book-bbm-junior-coaching",
    kind: "book",
    name: "子どものためのバドミントン指導BOOK",
    maker: "ベースボール・マガジン社（日本小学生バドミントン連盟 編著）",
    description:
      "小学生を指導するときに大切なことを、技術の基本、練習方法、フィジカルケア、生活習慣などのテーマごとに、まとめた本です。写真やイラストが多く、子どもの健やかな成長を考えた指導を、学べます。",
    points: ["2026年1月5日発売"],
    url: "https://www.bbm-japan.com/category/new-badmintonbook",
    checkedAt: CHECKED,
    source: "ベースボール・マガジン社（書籍一覧）",
  },
];

/** 公開される一覧。エディタで保存した内容があれば、そちらを使う */
export const products: Product[] = content.products ?? baseProducts;
