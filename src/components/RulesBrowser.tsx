"use client";

import { useMemo, useState } from "react";
import {
  RULE_CATEGORY_LABELS,
  RULE_CATEGORY_ORDER,
  rules,
  type RuleCategory,
} from "@/data/rules";

const chipBase =
  "min-h-12 rounded-full border-2 px-4 text-base font-bold transition-colors active:scale-95";
const chipOn =
  "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-slate-950";
const chipOff =
  "border-slate-400 bg-white text-slate-900 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100";

export default function RulesBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<RuleCategory | "all">("all");
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(new Set());

  const results = useMemo(() => {
    const keywords = query.toLowerCase().split(/[\s　]+/).filter(Boolean);
    return rules.filter((r) => {
      if (category !== "all" && r.category !== category) return false;
      const text = [r.question, r.answer, ...(r.points ?? []), r.basis ?? "", r.note ?? ""]
        .join(" ")
        .toLowerCase();
      return keywords.every((k) => text.includes(k));
    });
  }, [query, category]);

  const grouped = RULE_CATEGORY_ORDER.map((c) => ({
    category: c,
    items: results.filter((r) => r.category === c),
  })).filter((g) => g.items.length > 0);

  const allOpen = results.length > 0 && results.every((r) => openIds.has(r.id));

  const setOpen = (id: string, open: boolean) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (open) next.add(id);
      else next.delete(id);
      return next;
    });

  const toggleAll = () =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      for (const r of results) {
        if (allOpen) next.delete(r.id);
        else next.add(r.id);
      }
      return next;
    });

  return (
    <div>
      <section aria-label="ルールの絞り込み" className="flex flex-col gap-4">
        <div>
          <label htmlFor="rule-query" className="sr-only">
            ルールをキーワードで検索
          </label>
          <input
            id="rule-query"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="キーワード（例：右左、サービス、ネット、15点）"
            className="min-h-14 w-full rounded-xl border-2 border-slate-400 bg-white px-4 text-base text-slate-900 outline-none placeholder:text-slate-500 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/30 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400"
          />
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">
            分類
          </legend>
          <div className="flex flex-wrap gap-2">
            {(["all", ...RULE_CATEGORY_ORDER] as const).map((c) => {
              const selected = c === category;
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setCategory(c)}
                  className={`${chipBase} ${selected ? chipOn : chipOff}`}
                >
                  {selected && <span aria-hidden="true">✓ </span>}
                  {c === "all" ? "すべて" : RULE_CATEGORY_LABELS[c].replace(/（.*）/, "")}
                </button>
              );
            })}
          </div>
        </fieldset>
      </section>

      <div className="mt-6 mb-3 flex flex-wrap items-center justify-between gap-2">
        <p aria-live="polite" className="text-base font-bold text-slate-700 dark:text-slate-300">
          {results.length}件のルール
        </p>
        {results.length > 0 && (
          <button
            type="button"
            onClick={toggleAll}
            className="min-h-12 rounded-full border-2 border-slate-400 px-4 text-base font-bold text-slate-900 dark:border-slate-500 dark:text-slate-100"
          >
            {allOpen ? "すべて閉じる" : "すべて開く"}
          </button>
        )}
      </div>

      {grouped.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-400 p-8 text-center text-base text-slate-700 dark:border-slate-600 dark:text-slate-300">
          条件に合うルールがありません。キーワードや分類を変えてみてください。
        </div>
      ) : (
        grouped.map((g) => (
          <section key={g.category} className="mb-8">
            <h2 className="mb-3 text-lg font-bold">{RULE_CATEGORY_LABELS[g.category]}</h2>
            <ul className="flex flex-col gap-3">
              {g.items.map((r) => (
                <li key={r.id}>
                  <details
                    open={openIds.has(r.id)}
                    onToggle={(e) => setOpen(r.id, e.currentTarget.open)}
                    className="group rounded-xl border-2 border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900"
                  >
                    <summary className="flex min-h-14 cursor-pointer list-none items-start gap-3 p-4 text-base font-bold leading-snug [&::-webkit-details-marker]:hidden">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 text-emerald-700 transition-transform group-open:rotate-90 dark:text-emerald-400"
                      >
                        ▶
                      </span>
                      <span className="min-w-0 flex-1">{r.question}</span>
                    </summary>
                    <div className="flex flex-col gap-3 border-t-2 border-slate-200 p-4 text-base leading-relaxed dark:border-slate-700">
                      <p className="text-slate-800 dark:text-slate-200">{r.answer}</p>
                      {r.points && (
                        <ul className="flex flex-col gap-2">
                          {r.points.map((pt) => (
                            <li key={pt} className="flex gap-2">
                              <span
                                aria-hidden="true"
                                className="font-bold text-emerald-700 dark:text-emerald-400"
                              >
                                ・
                              </span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {r.note && (
                        <p className="rounded-lg bg-amber-100 p-3 text-amber-950 dark:bg-amber-900 dark:text-amber-100">
                          <b className="mr-1">注意</b>
                          {r.note}
                        </p>
                      )}
                      {r.basis && (
                        <p className="text-sm text-slate-600 dark:text-slate-400">根拠：{r.basis}</p>
                      )}
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
