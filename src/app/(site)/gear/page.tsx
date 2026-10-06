import type { Metadata } from "next";
import { gearGuides } from "@/data/gear";
import { PRODUCT_KIND_LABELS, products } from "@/data/products";

export const metadata: Metadata = {
  title: "用品の選び方・おすすめ",
  description: "初心者のラケットの選び方、シャトル、シューズ、指導書の選び方と、おすすめ商品の紹介。",
};

export default function GearPage() {
  const hasAffiliate = products.some((p) => p.affiliate);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5">
      <h1 className="text-xl font-bold">用品の選び方・おすすめ</h1>
      <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">
        初心者のラケットや、指導に役立つ本など、用品を選ぶときの考え方をまとめました。価格や仕様は変わることがあるため、購入前に販売元の最新情報を確認してください。
      </p>

      {hasAffiliate && (
        <p className="mt-4 rounded-lg border-2 border-amber-500 bg-amber-100 p-3 text-base font-bold text-amber-950 dark:bg-amber-900 dark:text-amber-100">
          【広告】このページには、アフィリエイトリンク（広告）を含む商品紹介があります。「PR」と表示している商品が該当します。
        </p>
      )}

      <nav aria-label="このページの内容" className="mt-4 flex flex-wrap gap-2">
        <a
          href="#products"
          className="flex min-h-12 items-center rounded-full border-2 border-slate-400 bg-white px-4 text-base font-bold dark:border-slate-500 dark:bg-slate-900"
        >
          おすすめ商品
        </a>
        <a
          href="#guides"
          className="flex min-h-12 items-center rounded-full border-2 border-slate-400 bg-white px-4 text-base font-bold dark:border-slate-500 dark:bg-slate-900"
        >
          選び方ガイド
        </a>
      </nav>

      <section id="products" className="mt-8 scroll-mt-4">
        <h2 className="mb-3 text-lg font-bold">おすすめ商品</h2>
        {products.length === 0 ? (
          <p className="rounded-xl border-2 border-dashed border-slate-400 p-6 text-center text-base text-slate-700 dark:border-slate-600 dark:text-slate-300">
            おすすめ商品は、準備中です。下の「選び方ガイド」を、参考にしてください。
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {products.map((p) => (
              <li key={p.id}>
                <article className="rounded-xl border-2 border-slate-300 bg-white p-4 dark:border-slate-600 dark:bg-slate-900">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-sm font-bold">
                    <span className="rounded-full bg-emerald-200 px-3 py-1 text-emerald-950 dark:bg-emerald-900 dark:text-emerald-100">
                      {PRODUCT_KIND_LABELS[p.kind]}
                    </span>
                    {p.affiliate && (
                      <span className="rounded-full bg-amber-300 px-3 py-1 text-amber-950">PR</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold leading-snug">{p.name}</h3>
                  {p.maker && (
                    <p className="text-sm text-slate-600 dark:text-slate-400">{p.maker}</p>
                  )}
                  <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">
                    {p.description}
                  </p>
                  {p.points && p.points.length > 0 && (
                    <ul className="mt-2 list-disc pl-5 text-base leading-relaxed">
                      {p.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                  )}
                  {p.price && (
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">価格の目安：{p.price}</p>
                  )}
                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel={p.affiliate ? "sponsored noopener noreferrer" : "noopener noreferrer"}
                      className="mt-3 flex min-h-12 items-center justify-center rounded-xl bg-emerald-700 text-base font-bold text-white dark:bg-emerald-400 dark:text-slate-950"
                    >
                      商品ページを見る{p.affiliate ? "（広告）" : ""}
                    </a>
                  )}
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="guides" className="mt-10 scroll-mt-4">
        <h2 className="mb-3 text-lg font-bold">選び方ガイド</h2>
        <ul className="flex flex-col gap-3">
          {gearGuides.map((g) => (
            <li key={g.id}>
              <article className="rounded-xl border-2 border-slate-300 bg-white p-4 dark:border-slate-600 dark:bg-slate-900">
                <h3 className="text-lg font-bold leading-snug">{g.title}</h3>
                <p className="mt-1 text-base text-slate-700 dark:text-slate-300">{g.summary}</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {g.points.map((pt) => (
                    <li key={pt} className="flex gap-2 text-base leading-relaxed">
                      <span aria-hidden="true" className="mt-0.5 font-bold text-emerald-700 dark:text-emerald-400">
                        ✓
                      </span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
