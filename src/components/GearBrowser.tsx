"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { gearGuides } from "@/data/gear";
import { PRODUCT_KIND_LABELS, PRODUCT_KIND_ORDER, products, type ProductKind } from "@/data/products";

type Filter = "all" | ProductKind | "guide";

const chipBase = "min-h-12 rounded-full border-2 px-4 text-base font-bold transition-colors active:scale-95";
const chipOn =
  "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-slate-950";
const chipOff =
  "border-slate-400 bg-white text-slate-900 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100";
const link = "text-base font-bold text-emerald-800 underline underline-offset-4 dark:text-emerald-300";

/** おすすめ商品と、選び方ガイドの一覧。キーワード検索と、種類（ラベル）での絞り込みができる */
export default function GearBrowser() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const keywords = useMemo(() => query.toLowerCase().split(/[\s　]+/).filter(Boolean), [query]);
  const match = (text: string) => keywords.every((k) => text.toLowerCase().includes(k));

  const shownProducts = products.filter(
    (p) =>
      (filter === "all" || filter === p.kind) &&
      match([p.name, p.maker ?? "", p.description, ...(p.points ?? []), PRODUCT_KIND_LABELS[p.kind]].join(" ")),
  );
  const shownGuides =
    filter === "all" || filter === "guide"
      ? gearGuides.filter((g) => match([g.title, g.summary, ...g.points].join(" ")))
      : [];

  const groups = PRODUCT_KIND_ORDER.map((kind) => ({ kind, items: shownProducts.filter((p) => p.kind === kind) })).filter(
    (g) => g.items.length > 0,
  );

  const usedKinds = PRODUCT_KIND_ORDER.filter((k) => products.some((p) => p.kind === k));
  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "すべて" },
    ...usedKinds.map((k) => ({ key: k as Filter, label: PRODUCT_KIND_LABELS[k] })),
    { key: "guide", label: "選び方ガイド" },
  ];
  const empty = groups.length === 0 && shownGuides.length === 0;

  return (
    <div>
      <section aria-label="商品・ガイドの絞り込み" className="flex flex-col gap-4">
        <div>
          <label htmlFor="gear-query" className="sr-only">
            商品・ガイドをキーワードで検索
          </label>
          <input
            id="gear-query"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="キーワード（例：ジュニア、初心者、ヨネックス、シューズ）"
            className="min-h-14 w-full rounded-xl border-2 border-slate-400 bg-white px-4 text-base text-slate-900 outline-none placeholder:text-slate-500 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/30 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400"
          />
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">種類</legend>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                aria-pressed={f.key === filter}
                onClick={() => setFilter(f.key)}
                className={`${chipBase} ${f.key === filter ? chipOn : chipOff}`}
              >
                {f.key === filter && <span aria-hidden="true">✓ </span>}
                {f.label}
              </button>
            ))}
          </div>
        </fieldset>
      </section>

      <p aria-live="polite" className="mt-6 mb-3 text-base font-bold text-slate-700 dark:text-slate-300">
        商品 {shownProducts.length}件・ガイド {shownGuides.length}件
      </p>

      {empty && (
        <div className="rounded-lg border border-dashed border-slate-400 p-8 text-center text-base text-slate-700 dark:border-slate-600 dark:text-slate-300">
          条件に合う商品・ガイドがありません。キーワードや種類を変えてみてください。
        </div>
      )}

      {groups.length > 0 && (
        <section id="products" className="scroll-mt-4">
          <h2 className="mb-2 text-lg font-bold">おすすめ商品</h2>
          {groups.map((g) => (
            <div key={g.kind} className="mb-8">
              <h3 className="mb-3 text-base font-bold text-emerald-900 dark:text-emerald-300">{PRODUCT_KIND_LABELS[g.kind]}</h3>
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
                      <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">{p.description}</p>
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
                      {p.price && (
                        <p className="mt-2 text-sm font-bold">
                          価格：{p.price}
                          {p.checkedAt && <span className="font-normal">（{p.checkedAt}時点）</span>}
                        </p>
                      )}
                      {(p.source || p.checkedAt) && (
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                          {p.checkedAt && `${p.checkedAt}時点の情報`}
                          {p.source && p.checkedAt && "　"}
                          {p.source && `出典：${p.source}`}
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

      {shownGuides.length > 0 && (
        <section id="guides" className="mt-4 scroll-mt-4">
          <h2 className="mb-3 text-lg font-bold">選び方ガイド</h2>
          <ul className="flex flex-col gap-3">
            {shownGuides.map((g) => (
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
                      {g.links.map((l) => (
                        <li key={l.href}>
                          {l.external ? (
                            <a href={l.href} target="_blank" rel="noopener noreferrer" className={link}>
                              {l.label}
                            </a>
                          ) : (
                            <Link href={l.href} className={link}>
                              {l.label} ›
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
