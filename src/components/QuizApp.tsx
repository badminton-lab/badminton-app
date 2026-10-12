"use client";

import { useMemo, useState } from "react";
import {
  QUIZ_CATEGORY_LABELS,
  QUIZ_CATEGORY_ORDER,
  QUIZ_LEVEL_LABELS,
  correctChoice,
  displayChoices,
  quiz,
  type Quiz,
  type QuizCategory,
  type QuizLevel,
} from "@/data/quiz";

const chipBase = "min-h-12 rounded-full border-2 px-4 text-base font-bold transition-colors active:scale-95";
const chipOn =
  "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-slate-950";
const chipOff =
  "border-slate-400 bg-white text-slate-900 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100";
const bigBtn =
  "min-h-14 w-full rounded-xl border-2 px-4 font-bold active:scale-[0.99] disabled:active:scale-100";

const COUNTS = [5, 10, 20] as const;
type Count = (typeof COUNTS)[number] | "all";

/** 問題の並びを、ランダムにする（開始ボタンを押したときだけ使う） */
function shuffled<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = { name: "setup" } | { name: "play"; list: Quiz[]; index: number; picked: string | null; correct: number; missed: Quiz[] } | { name: "result"; total: number; correct: number; missed: Quiz[] };

export default function QuizApp() {
  const [category, setCategory] = useState<QuizCategory | "all">("all");
  const [level, setLevel] = useState<QuizLevel | "all">("all");
  const [count, setCount] = useState<Count>(10);
  const [phase, setPhase] = useState<Phase>({ name: "setup" });

  const pool = useMemo(
    () => quiz.filter((q) => (category === "all" || q.category === category) && (level === "all" || q.level === level)),
    [category, level],
  );
  const take = count === "all" ? pool.length : Math.min(count, pool.length);

  const start = () => {
    const list = shuffled(pool).slice(0, take);
    if (list.length === 0) return;
    setPhase({ name: "play", list, index: 0, picked: null, correct: 0, missed: [] });
  };

  if (phase.name === "setup") {
    return (
      <section aria-label="クイズの設定" className="flex flex-col gap-5 rounded-xl border-2 border-slate-300 bg-white p-4 dark:border-slate-600 dark:bg-slate-900">
        <fieldset>
          <legend className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">区分</legend>
          <div className="flex flex-wrap gap-2">
            {(["all", ...QUIZ_CATEGORY_ORDER] as const).map((c) => (
              <button key={c} type="button" aria-pressed={c === category} onClick={() => setCategory(c)} className={`${chipBase} ${c === category ? chipOn : chipOff}`}>
                {c === category && <span aria-hidden="true">✓ </span>}
                {c === "all" ? "すべて" : QUIZ_CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">対象</legend>
          <div className="flex flex-wrap gap-2">
            {(["all", "elementary", "junior"] as const).map((l) => (
              <button key={l} type="button" aria-pressed={l === level} onClick={() => setLevel(l)} className={`${chipBase} ${l === level ? chipOn : chipOff}`}>
                {l === level && <span aria-hidden="true">✓ </span>}
                {l === "all" ? "すべて" : QUIZ_LEVEL_LABELS[l]}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">問題の数</legend>
          <div className="flex flex-wrap gap-2">
            {([...COUNTS, "all"] as const).map((n) => (
              <button key={n} type="button" aria-pressed={n === count} onClick={() => setCount(n)} className={`${chipBase} ${n === count ? chipOn : chipOff}`}>
                {n === count && <span aria-hidden="true">✓ </span>}
                {n === "all" ? "ぜんぶ" : `${n}問`}
              </button>
            ))}
          </div>
        </fieldset>
        <button
          type="button"
          onClick={start}
          disabled={pool.length === 0}
          className="min-h-14 rounded-xl bg-emerald-700 text-lg font-bold text-white active:scale-[0.99] disabled:opacity-40 dark:bg-emerald-400 dark:text-slate-950"
        >
          {pool.length === 0 ? "この条件の問題はありません" : `クイズを始める（${take}問）`}
        </button>
      </section>
    );
  }

  if (phase.name === "result") {
    const rate = phase.total === 0 ? 0 : Math.round((phase.correct / phase.total) * 100);
    return (
      <section aria-label="クイズの結果" className="flex flex-col gap-4 rounded-xl border-2 border-slate-300 bg-white p-4 dark:border-slate-600 dark:bg-slate-900">
        <h2 className="text-lg font-bold">結果</h2>
        <p className="text-3xl font-bold tabular-nums text-emerald-800 dark:text-emerald-300">
          {phase.correct} <span className="text-lg text-slate-700 dark:text-slate-300">/ {phase.total} 問 正解（{rate}%）</span>
        </p>
        {phase.missed.length > 0 && (
          <div>
            <h3 className="mb-2 text-base font-bold">まちがえた問題</h3>
            <ul className="flex flex-col gap-3">
              {phase.missed.map((q) => (
                <li key={q.id} className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                  <p className="text-base font-bold">{q.question}</p>
                  <p className="mt-1 text-base">
                    正解：<b className="text-emerald-800 dark:text-emerald-300">{correctChoice(q)}</b>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{q.explanation}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={start} className="min-h-14 flex-1 rounded-xl bg-emerald-700 px-4 text-base font-bold text-white dark:bg-emerald-400 dark:text-slate-950">
            もう一度（問題を入れ替える）
          </button>
          <button type="button" onClick={() => setPhase({ name: "setup" })} className="min-h-14 flex-1 rounded-xl border-2 border-slate-400 px-4 text-base font-bold dark:border-slate-500">
            条件を変える
          </button>
        </div>
      </section>
    );
  }

  const q = phase.list[phase.index];
  const answered = phase.picked !== null;
  const isLast = phase.index === phase.list.length - 1;
  const choose = (c: string) => {
    if (answered) return;
    const ok = c === correctChoice(q);
    setPhase({ ...phase, picked: c, correct: phase.correct + (ok ? 1 : 0), missed: ok ? phase.missed : [...phase.missed, q] });
  };
  const next = () => {
    if (isLast) setPhase({ name: "result", total: phase.list.length, correct: phase.correct, missed: phase.missed });
    else setPhase({ ...phase, index: phase.index + 1, picked: null });
  };

  return (
    <section aria-label="クイズ" className="flex flex-col gap-4 rounded-xl border-2 border-slate-300 bg-white p-4 dark:border-slate-600 dark:bg-slate-900">
      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
        {phase.index + 1} / {phase.list.length} 問　<span className="font-normal">{QUIZ_CATEGORY_LABELS[q.category]}・{QUIZ_LEVEL_LABELS[q.level]}</span>
      </p>
      <h2 className="text-lg font-bold leading-relaxed">{q.question}</h2>
      <div className={q.kind === "tf" ? "grid grid-cols-2 gap-3" : "flex flex-col gap-3"} role="group" aria-label="こたえ">
        {displayChoices(q).map((c) => {
          const isRight = c === correctChoice(q);
          const isPicked = c === phase.picked;
          const tone = !answered
            ? "border-slate-400 bg-white dark:border-slate-500 dark:bg-slate-900"
            : isRight
              ? "border-emerald-700 bg-emerald-100 text-emerald-950 dark:border-emerald-400 dark:bg-emerald-950 dark:text-emerald-100"
              : isPicked
                ? "border-rose-600 bg-rose-100 text-rose-950 dark:bg-rose-950 dark:text-rose-100"
                : "border-slate-300 opacity-60 dark:border-slate-600";
          return (
            <button key={c} type="button" disabled={answered} onClick={() => choose(c)} className={`${bigBtn} ${tone} ${q.kind === "tf" ? "min-h-20 text-center text-4xl" : "text-left text-base"}`}>
              {answered && isRight && <span aria-hidden="true">◎ </span>}
              {answered && isPicked && !isRight && <span aria-hidden="true">✕ </span>}
              {c}
            </button>
          );
        })}
      </div>
      {answered && (
        <div aria-live="polite" className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
          <p className="text-lg font-bold">
            {phase.picked === correctChoice(q) ? (
              <span className="text-emerald-800 dark:text-emerald-300">せいかい！</span>
            ) : (
              <span className="text-rose-700 dark:text-rose-300">ざんねん… 正解は「{correctChoice(q)}」</span>
            )}
          </p>
          <p className="mt-2 text-base leading-relaxed">{q.explanation}</p>
          {q.sources && q.sources.length > 0 && (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              出典：
              {q.sources.map((s, i) => (
                <span key={s.href}>
                  {i > 0 && "、"}
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                    {s.label}
                  </a>
                </span>
              ))}
              {q.checkedAt && `（${q.checkedAt}に確認）`}
            </p>
          )}
        </div>
      )}
      {answered && (
        <button type="button" onClick={next} className="min-h-14 rounded-xl bg-emerald-700 text-lg font-bold text-white active:scale-[0.99] dark:bg-emerald-400 dark:text-slate-950">
          {isLast ? "結果を見る" : "つぎの問題へ"}
        </button>
      )}
    </section>
  );
}
