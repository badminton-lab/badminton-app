"use client";

import { useMemo, useState } from "react";
import { TRIVIA_CATEGORY_LABELS, TRIVIA_CATEGORY_ORDER, trivia, type TriviaCategory } from "@/data/trivia";

const chipBase = "min-h-12 rounded-full border-2 px-4 text-base font-bold transition-colors active:scale-95";
const chipOn =
  "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-slate-950";
const chipOff =
  "border-slate-400 bg-white text-slate-900 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100";

/** 雑学の一覧。キーワード検索と、区分（ラベル）での絞り込みができる */
export default function TriviaBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<TriviaCategory | "all">("all");

  const results = useMemo(() => {
    const keywords = query.toLowerCase().split(/[\s　]+/).filter(Boolean);
    return trivia.filter((t) => {
      if (category !== "all" && t.category !== category) return false;
      const text = [t.title, t.body, t.tip ?? ""].join(" ").toLowerCase();
      return keywords.every((k) => text.includes(k));
    });
  }, [query, category]);

  const groups = TRIVIA_CATEGORY_ORDER.map((c) => ({ c, items: results.filter((t) => t.category === c) })).filter(
    (g) => g.items.length > 0,
  );

  return (
    <div>
      <section aria-label="雑学の絞り込み" className="flex flex-col gap-4">
        <div>
          <label htmlFor="trivia-query" className="sr-only">
            雑学をキーワードで検索
          </label>
          <input
            id="trivia-query"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="キーワード（例：シャトル、羽根、歴史、ラケット）"
            className="min-h-14 w-full rounded-xl border-2 border-slate-400 bg-white px-4 text-base text-slate-900 outline-none placeholder:text-slate-500 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/30 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400"
          />
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">区分</legend>
          <div className="flex flex-wrap gap-2">
            {(["all", ...TRIVIA_CATEGORY_ORDER] as const).map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={c === category}
                onClick={() => setCategory(c)}
                className={`${chipBase} ${c === category ? chipOn : chipOff}`}
              >
                {c === category && <span aria-hidden="true">✓ </span>}
                {c === "all" ? "すべて" : TRIVIA_CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
        </fieldset>
      </section>

      <p aria-live="polite" className="mt-6 mb-3 text-base font-bold text-slate-700 dark:text-slate-300">
        {results.length}件の雑学
      </p>

      {groups.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-400 p-8 text-center text-base text-slate-700 dark:border-slate-600 dark:text-slate-300">
          条件に合う雑学がありません。キーワードや区分を変えてみてください。
        </div>
      ) : (
        groups.map((g) => (
          <section key={g.c} id={g.c} className="mb-8 scroll-mt-4">
            <h2 className="mb-3 text-lg font-bold">{TRIVIA_CATEGORY_LABELS[g.c]}</h2>
            <ul className="flex flex-col gap-3">
              {g.items.map((t) => (
                <li key={t.id}>
                  <article className="rounded-xl border-2 border-slate-300 bg-white p-4 dark:border-slate-600 dark:bg-slate-900">
                    <h3 className="text-lg font-bold leading-snug">{t.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">{t.body}</p>
                    {t.tip && (
                      <p className="mt-3 rounded-lg bg-emerald-100 p-3 text-base leading-relaxed text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100">
                        <b className="mr-1">指導のヒント</b>
                        {t.tip}
                      </p>
                    )}
                  </article>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
