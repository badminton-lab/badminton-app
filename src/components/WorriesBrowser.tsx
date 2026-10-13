"use client";

import { useMemo, useState } from "react";
import { WORRY_CATEGORY_LABELS, WORRY_CATEGORY_ORDER, type Worry, type WorryCategory } from "@/data/coachingTypes";

const chipBase = "min-h-12 rounded-full border-2 px-4 text-base font-bold transition-colors active:scale-95";
const chipOn =
  "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-slate-950";
const chipOff =
  "border-slate-400 bg-white text-slate-900 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100";
const sub = "mt-4 mb-1 text-sm font-bold text-slate-700 dark:text-slate-300";

/** 指導のお悩み一覧。キーワード検索と、区分での絞り込みができる。内容は、サーバー側のページから受け取る */
export default function WorriesBrowser({ items }: { items: Worry[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<WorryCategory | "all">("all");

  const results = useMemo(() => {
    const keywords = query.toLowerCase().split(/[\s　]+/).filter(Boolean);
    return items.filter((w) => {
      if (category !== "all" && w.category !== category) return false;
      const text = [w.title, w.scene, w.cause, ...w.actions, ...(w.avoid ?? []), ...(w.phrases ?? []), w.experience ?? ""]
        .join(" ")
        .toLowerCase();
      return keywords.every((k) => text.includes(k));
    });
  }, [items, query, category]);

  const used = WORRY_CATEGORY_ORDER.filter((c) => items.some((w) => w.category === c));

  return (
    <div>
      <section aria-label="お悩みの絞り込み" className="flex flex-col gap-4">
        <div>
          <label htmlFor="worry-query" className="sr-only">
            お悩みをキーワードで検索
          </label>
          <input
            id="worry-query"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="キーワード（例：おしゃべり、泣く、保護者、緊張）"
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
                {c === "all" ? "すべて" : WORRY_CATEGORY_LABELS[c]}
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
          {results.map((w) => (
            <li key={w.id}>
              <details className="rounded-xl border-2 border-slate-300 bg-white p-4 dark:border-slate-600 dark:bg-slate-900">
                <summary className="min-h-10 cursor-pointer text-lg font-bold leading-snug">
                  <span className="mr-2 inline-block rounded-full bg-slate-200 px-2 py-0.5 align-middle text-xs font-bold text-slate-800 dark:bg-slate-700 dark:text-slate-100">
                    {WORRY_CATEGORY_LABELS[w.category]}
                  </span>
                  {w.title}
                </summary>
                <h3 className={sub}>よくある場面</h3>
                <p className="text-base leading-relaxed">{w.scene}</p>
                <h3 className={sub}>原因の見立て</h3>
                <p className="text-base leading-relaxed">{w.cause}</p>
                <h3 className={sub}>今日からできる一手</h3>
                <ul className="flex flex-col gap-1">
                  {w.actions.map((a) => (
                    <li key={a} className="flex gap-2 text-base leading-relaxed">
                      <span aria-hidden="true" className="font-bold text-emerald-700 dark:text-emerald-400">
                        ✓
                      </span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
                {w.avoid && w.avoid.length > 0 && (
                  <>
                    <h3 className={sub}>避けたい対応</h3>
                    <ul className="flex flex-col gap-1">
                      {w.avoid.map((a) => (
                        <li key={a} className="flex gap-2 text-base leading-relaxed">
                          <span aria-hidden="true" className="font-bold text-rose-700 dark:text-rose-400">
                            ×
                          </span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {w.phrases && w.phrases.length > 0 && (
                  <>
                    <h3 className={sub}>声かけの例</h3>
                    <ul className="flex flex-col gap-2">
                      {w.phrases.map((p) => (
                        <li
                          key={p}
                          className="rounded-lg bg-emerald-100 p-3 text-base leading-relaxed text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100"
                        >
                          「{p}」
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {w.experience && (
                  <p className="mt-4 rounded-lg border-2 border-amber-500 p-3 text-base leading-relaxed">
                    <b className="mr-1">運営者より</b>
                    {w.experience}
                  </p>
                )}
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
