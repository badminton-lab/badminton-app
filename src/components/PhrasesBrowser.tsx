"use client";

import { useMemo, useState } from "react";
import {
  PHRASE_CATEGORY_LABELS,
  PHRASE_CATEGORY_ORDER,
  type Phrase,
  type PhraseCategory,
  type PhraseGroup,
} from "@/data/coachingTypes";

const chipBase = "min-h-12 rounded-full border-2 px-4 text-base font-bold transition-colors active:scale-95";
const chipOn =
  "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-slate-950";
const chipOff =
  "border-slate-400 bg-white text-slate-900 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100";

/** 声かけ集。キーワード検索と、場面の区分での絞り込みができる。内容は、サーバー側のページから受け取る */
export default function PhrasesBrowser({ group, items }: { group: PhraseGroup; items: Phrase[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<PhraseCategory | "all">("all");

  const order = PHRASE_CATEGORY_ORDER[group].filter((c) => items.some((p) => p.category === c));

  const results = useMemo(() => {
    const keywords = query.toLowerCase().split(/[\s　]+/).filter(Boolean);
    return items.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      const text = [p.title, ...p.phrases, p.intent, ...(p.avoid ?? []), p.tip ?? "", p.experience ?? ""]
        .join(" ")
        .toLowerCase();
      return keywords.every((k) => text.includes(k));
    });
  }, [items, query, category]);

  const groups = order.map((c) => ({ c, list: results.filter((p) => p.category === c) })).filter((g) => g.list.length > 0);

  return (
    <div>
      <section aria-label="声かけの絞り込み" className="flex flex-col gap-4">
        <div>
          <label htmlFor="phrase-query" className="sr-only">
            声かけをキーワードで検索
          </label>
          <input
            id="phrase-query"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              group === "match"
                ? "キーワード（例：リード、連続失点、ダブルス、緊張）"
                : "キーワード（例：ミス、ほめる、集中、フォーム）"
            }
            className="min-h-14 w-full rounded-xl border-2 border-slate-400 bg-white px-4 text-base text-slate-900 outline-none placeholder:text-slate-500 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/30 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400"
          />
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">場面</legend>
          <div className="flex flex-wrap gap-2">
            {(["all", ...order] as const).map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={c === category}
                onClick={() => setCategory(c)}
                className={`${chipBase} ${c === category ? chipOn : chipOff}`}
              >
                {c === category && <span aria-hidden="true">✓ </span>}
                {c === "all" ? "すべて" : PHRASE_CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
        </fieldset>
      </section>

      <p aria-live="polite" className="mt-6 mb-3 text-base font-bold text-slate-700 dark:text-slate-300">
        {results.length}件の声かけ
      </p>

      {groups.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-400 p-8 text-center text-base text-slate-700 dark:border-slate-600 dark:text-slate-300">
          条件に合う声かけがありません。キーワードや場面を変えてみてください。
        </div>
      ) : (
        groups.map((g) => (
          <section key={g.c} className="mb-8">
            <h2 className="mb-3 text-lg font-bold">{PHRASE_CATEGORY_LABELS[g.c]}</h2>
            <ul className="flex flex-col gap-3">
              {g.list.map((p) => (
                <li key={p.id}>
                  <article className="rounded-xl border-2 border-slate-300 bg-white p-4 dark:border-slate-600 dark:bg-slate-900">
                    <h3 className="text-lg font-bold leading-snug">{p.title}</h3>
                    <ul className="mt-3 flex flex-col gap-2">
                      {p.phrases.map((t) => (
                        <li
                          key={t}
                          className="rounded-lg bg-emerald-100 p-3 text-base leading-relaxed text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100"
                        >
                          「{t}」
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-base leading-relaxed text-slate-700 dark:text-slate-300">
                      <b className="mr-1 text-slate-900 dark:text-slate-100">ねらい</b>
                      {p.intent}
                    </p>
                    {p.avoid && p.avoid.length > 0 && (
                      <ul className="mt-3 flex flex-col gap-1">
                        {p.avoid.map((a) => (
                          <li key={a} className="flex gap-2 text-base leading-relaxed">
                            <span aria-hidden="true" className="font-bold text-rose-700 dark:text-rose-400">
                              ×
                            </span>
                            <span>
                              <b className="mr-1">避けたい</b>
                              {a}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {p.tip && <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">※ {p.tip}</p>}
                    {p.experience && (
                      <p className="mt-3 rounded-lg border-2 border-amber-500 p-3 text-base leading-relaxed">
                        <b className="mr-1">運営者より</b>
                        {p.experience}
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
