import type { Metadata } from "next";
import Link from "next/link";
import { gearGuides } from "@/data/gear";
import { PRODUCT_KIND_LABELS, PRODUCT_KIND_ORDER, products } from "@/data/products";

export const metadata: Metadata = {
  title: "用品の選び方・おすすめ商品",
  alternates: { canonical: "/gear" },
  description:
    "初心者のラケットの選び方、シャトルの番号、シューズ、指導書の選び方と、具体的なおすすめ商品（ラケット・シャトル・指導書など）の紹介。",
};

const chip =
  "flex min-h-12 items-center rounded-full border-2 border-slate-400 bg-white px-4 text-base font-bold dark:border-slate-500 dark:bg-slate-900";

export default function GearPage() {
  const hasAffiliate = products.some((p) => p.affiliate);
  const groups = PRODUCT_KIND_ORDER.map((kind) => ({
    kind,
    items: products.filter((p) => p.kind === kind),
  })).filter((g) => g.items.length > 0);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5">
      <h1 className="text-xl font-bold">用品の選び方・おすすめ商品</h1>
      <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">
        初心者のラケットや、指導に役立つ本など、用品を選ぶときの考え方と、具体的な商品をまとめました。価格や仕様は変わることがあるため、購入前に販売元の最新情報を確認してください。
      </p>

      {hasAffiliate && (
        <p className="mt-4 rounded-lg border-2 border-amber-500 bg-amber-100 p-3 text-base font-bold text-amber-950 dark:bg-amber-900 dark:text-amber-100">
          【広告】このページには、アフィリエイトリンク（広告）を含む商品紹介があります。「PR」と表示している商品が該当します。
        </p>
      )}

      <nav aria-label="このページの内容" className="mt-4 flex flex-wrap gap-2">
        {products.length > 0 && (
          <a href="#products" className={chip}>
            おすすめ商品
          </a>
        )}
        <a href="#guides" className={chip}>
          選び方ガイド
        </a>
      </nav>

      {products.length > 0 && (
        <section id="products" className="mt-8 scroll-mt-4">
          <h2 className="mb-2 text-lg font-bold">おすすめ商品</h2>

          <ul className="mb-4 flex flex-col gap-2 rounded-lg bg-slate-100 p-3 text-base leading-relaxed text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            <li className="flex gap-2">
              <span aria-hidden="true">・</span>
              <span>商品の特徴は、メーカーや出版社の、公式の情報で確認できたものだけを書いています。リンクも、販売店ではなく、公式のページです。</span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true">・</span>
              <span>
                ラケットは、ヨネックス公式のラケットセレクターで「初・中級者向け」とされているモデルを、シリーズごとに紹介しています。実際に選ぶときは、重さ・バランス・グリップを、店頭で握って確かめてください。
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true">・</span>
              <span>シューズは、足に合うことが何より大切なため、特定のモデルは紹介していません（選び方は、下のガイドをご覧ください）。</span>
            </li>
          </ul>

          {groups.map((g) => (
            <div key={g.kind} className="mb-8">
              <h3 className="mb-3 text-base font-bold text-emerald-900 dark:text-emerald-300">
                {PRODUCT_KIND_LABELS[g.kind]}
              </h3>
              <ul className="flex flex-col gap-3">
                {g.items.map((p) => (
                  <li key={p.id}>
                    <article className="rounded-xl border-2 border-slate-300 bg-white p-4 dark:border-slate-600 dark:bg-slate-900">
                      {p.affiliate && (
                        <div className="mb-2 text-sm font-bold">
                          <span className="rounded-full bg-amber-300 px-3 py-1 text-amber-950">PR</span>
                        </div>
                      )}
                      <h4 className="text-lg font-bold leading-snug">{p.name}</h4>
                      {p.maker && <p className="text-sm text-slate-600 dark:text-slate-400">{p.maker}</p>}
                      <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">
                        {p.description}
                      </p>
                      {p.points && p.points.length > 0 && (
                        <ul className="mt-2 flex flex-col gap-1">
                          {p.points.map((pt) => (
                            <li key={pt} className="flex gap-2 text-base leading-relaxed">
                              <span aria-hidden="true" className="font-bold text-emerald-700 dark:text-emerald-400">
                                ✓
                              </span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {p.price && <p className="mt-2 text-sm font-bold">価格：{p.price}</p>}
                      {(p.source || p.checkedAt) && (
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                          {p.source && `出典：${p.source}`}
                          {p.source && p.checkedAt && "　"}
                          {p.checkedAt && `確認時期：${p.checkedAt}`}
                        </p>
                      )}
                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel={p.affiliate ? "sponsored noopener noreferrer" : "noopener noreferrer"}
                          className="mt-3 flex min-h-12 items-center justify-center rounded-xl bg-emerald-700 text-base font-bold text-white dark:bg-emerald-400 dark:text-slate-950"
                        >
                          公式ページを見る{p.affiliate ? "（広告）" : ""}
                        </a>
                      )}
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

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
                {g.links && g.links.length > 0 && (
                  <ul className="mt-3 flex flex-col gap-2">
                    {g.links.map((l) =>
                      l.external ? (
                        <li key={l.href}>
                          <a
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base font-bold text-emerald-800 underline underline-offset-4 dark:text-emerald-300"
                          >
                            {l.label}
                          </a>
                        </li>
                      ) : (
                        <li key={l.href}>
                          <Link href={l.href} className="text-base font-bold text-emerald-800 underline underline-offset-4 dark:text-emerald-300">
                            {l.label} ›
                          </Link>
                        </li>
                      ),
                    )}
                  </ul>
                )}
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
