import type { Metadata } from "next";
import GearBrowser from "@/components/GearBrowser";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "用品の選び方・おすすめ商品",
  alternates: { canonical: "/gear" },
  description:
    "初心者のラケットの選び方、シャトルの番号、シューズ、指導書の選び方と、具体的なおすすめ商品（ラケット・シャトル・指導書など）の紹介。",
};

export default function GearPage() {
  const hasAffiliate = products.some((p) => p.affiliate);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5">
      <h1 className="text-xl font-bold">用品の選び方・おすすめ商品</h1>
      <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">
        初心者のラケットや、指導に役立つ本など、用品を選ぶときの考え方と、具体的な商品をまとめました。価格や仕様は変わることがあるため、購入前に販売元の最新情報を確認してください。各商品には、情報を確認した時点（例：2026年10月時点）を書いています。
      </p>

      {hasAffiliate && (
        <p className="mt-4 rounded-lg border-2 border-amber-500 bg-amber-100 p-3 text-base font-bold text-amber-950 dark:bg-amber-900 dark:text-amber-100">
          【広告】このページには、アフィリエイトリンク（広告）を含む商品紹介があります。「PR」と表示している商品が該当します。
        </p>
      )}

      {products.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 text-lg font-bold">商品を見る前に</h2>

          <ul className="mb-4 flex flex-col gap-2 rounded-lg bg-slate-100 p-3 text-base leading-relaxed text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            <li className="flex gap-2">
              <span aria-hidden="true">・</span>
              <span>商品の特徴は、メーカーや出版社の、公式の情報で確認できたものだけを書いています。リンクも、販売店ではなく、公式のページです。</span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true">・</span>
              <span>
                ラケットは、ヨネックス公式のラケットセレクターで「初・中級者向け」とされているモデルと、子ども向け、ほかのメーカーの初級者向けモデルを紹介しています。実際に選ぶときは、重さ・バランス・グリップを、店頭で握って確かめてください。
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true">・</span>
              <span>シューズは、足に合うことが何より大切なため、特定のモデルは紹介していません（選び方は、下のガイドをご覧ください）。</span>
            </li>
          </ul>

        </section>
      )}

      <div className="mt-8">
        <GearBrowser />
      </div>
    </main>
  );
}
