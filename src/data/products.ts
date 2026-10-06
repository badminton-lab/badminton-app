export type ProductKind = "racket" | "book" | "shuttle" | "other";

export const PRODUCT_KIND_LABELS: Record<ProductKind, string> = {
  racket: "ラケット",
  book: "指導書",
  shuttle: "シャトル",
  other: "その他",
};

export type Product = {
  id: string;
  kind: ProductKind;
  name: string;
  /** メーカー・著者・出版社など */
  maker?: string;
  /** おすすめする理由 */
  description: string;
  /** おすすめのポイント */
  points?: string[];
  /** 商品ページへのリンク */
  url?: string;
  /**
   * アフィリエイトリンク（成果報酬のある広告）の場合は true にする。
   * true の商品には「PR」表示が付き、ページ上部に広告である旨が自動で表示される。
   */
  affiliate?: boolean;
  /** 価格の目安（変動するため、確認日も書くこと。例: "約5,000円（2026年10月確認）"） */
  price?: string;
};

/**
 * おすすめ商品。ここに追加すると、/gear ページの「おすすめ商品」に表示される。
 * 商品名・価格・仕様は、販売元の最新情報で確認してから書くこと。
 */
export const products: Product[] = [];
