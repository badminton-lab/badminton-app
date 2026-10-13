"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TROUBLE_CATEGORY_LABELS, TROUBLE_CATEGORY_ORDER, type Trouble, type TroubleCategory } from "@/data/coachingTypes";

const chipBase = "min-h-12 rounded-full border-2 px-4 text-base font-bold transition-colors active:scale-95";
const chipOn =
  "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-slate-950";
const chipOff =
  "border-slate-400 bg-white text-slate-900 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100";
const sub = "mt-4 mb-1 text-sm font-bold text-slate-700 dark:text-slate-300";

/** お悩み別ガイド。tagLinks は、公開中のメニューがある課題タグだけ（サーバー側のページから受け取る） */
export default function TroublesBrowser({
  items,
  tagLinks,
}: {
  items: Trouble[];
  tagLinks: Record<string, string>;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<TroubleCategory | "all">("all");

  const results = useMemo(() => {
    const keywords = query.toLowerCase().split(/[\s　]+/).filter(Boolean);
    return items.filter((x) => {
      if (category !== "all" && x.category !== category) return false;
      const text = [x.title, x.summary, ...x.causes, ...x.checks, ...x.fixes, x.experience ?? ""].join(" ").toLowerCase();
      return keywords.every((k) => text.includes(k));
    });
  }, [items, query, category]);

  const used = TROUBLE_CATEGORY_ORDER.filter((c) => items.some((x) => x.category === c));
  const list = (arr: string[], mark: string, color: string) => (
    <ul className="flex flex-col gap-1">
      {arr.map((a) => (
        <li key={a} className="flex gap-2 text-base leading-relaxed">
          <span aria-hidden="true" className={`font-bold ${color}`}>
            {mark}
          </span>
          <span>{a}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <section aria-label="お悩みの絞り込み" className="flex flex-col gap-4">
        <div>
          <label htmlFor="trouble-query" className="sr-only">
            お悩みをキーワードで検索
          </label>
          <input
            id="trouble-query"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="キーワード（例：スマッシュ、ネット、動き出し、ダブルス）"
            className="min-h-14 w-full rounded-xl border-2 border-slate-400 bg-white px-4 text-base text-slate-900 outline-none placeholder:text-slate-500 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/30 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400"
          />
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">区分</legend>
          <div className="flex flex-wrap gap-2">
            {(["all", ...used] as const).map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={c === category}
                onClick={() => setCategory(c)}
                className={`${chipBase} ${c === category ? chipOn : chipOff}`}
              >
                {c === category && <span aria-hidden="true">✓ </span>}
                {c === "all" ? "すべて" : TROUBLE_CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
        </fieldset>
      </section>

      <p aria-live="polite" className="mt-6 mb-3 text-base font-bold text-slate-700 dark:text-slate-300">
        {results.length}件のお悩み
      </p>

      {results.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-400 p-8 text-center text-base text-slate-700 dark:border-slate-600 dark:text-slate-300">
          条件に合うお悩みがありません。キーワードや区分を変えてみてください。
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {results.map((x) => {
            const tags = (x.tags ?? []).filter((t) => tagLinks[t]);
            return (
              <li key={x.id}>
                <details className="rounded-xl border-2 border-slate-300 bg-white p-4 dark:border-slate-600 dark:bg-slate-900">
                  <summary className="min-h-10 cursor-pointer text-lg font-bold leading-snug">
                    <span className="mr-2 inline-block rounded-full bg-slate-200 px-2 py-0.5 align-middle text-xs font-bold text-slate-800 dark:bg-slate-700 dark:text-slate-100">
                      {TROUBLE_CATEGORY_LABELS[x.category]}
                    </span>
                    {x.title}
                  </summary>
                  <p className="mt-3 text-base leading-relaxed">{x.summary}</p>
                  <h3 className={sub}>考えられる原因</h3>
                  {list(x.causes, "・", "text-slate-500")}
                  <h3 className={sub}>自分で確かめる方法</h3>
                  {list(x.checks, "◎", "text-emerald-700 dark:text-emerald-400")}
                  <h3 className={sub}>直し方・練習のコツ</h3>
                  {list(x.fixes, "✓", "text-emerald-700 dark:text-emerald-400")}
                  {tags.length > 0 && (
                    <>
                      <h3 className={sub}>効く練習メニューを探す</h3>
                      <ul className="flex flex-wrap gap-2">
                        {tags.map((t) => (
                          <li key={t}>
                            <Link
                              href={`/?g=${t}`}
                              className="inline-flex min-h-10 items-center rounded-full border-2 border-emerald-700 px-3 text-base font-bold text-emerald-900 dark:border-emerald-400 dark:text-emerald-200"
                            >
                              # {tagLinks[t]}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {x.experience && (
                    <p className="mt-4 rounded-lg border-2 border-amber-500 p-3 text-base leading-relaxed">
                      <b className="mr-1">運営者より</b>
                      {x.experience}
                    </p>
                  )}
                </details>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
