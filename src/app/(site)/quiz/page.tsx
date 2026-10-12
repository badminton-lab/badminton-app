import type { Metadata } from "next";
import QuizApp from "@/components/QuizApp";
import { QUIZ_CATEGORY_LABELS, QUIZ_CATEGORY_ORDER, QUIZ_LEVEL_LABELS, correctChoice, quiz } from "@/data/quiz";

export const metadata: Metadata = {
  title: "バドミントンクイズ（○×・3択）",
  alternates: { canonical: "/quiz" },
  description:
    "小学生から中学生まで楽しめる、バドミントンのクイズ。スマッシュの世界記録、日本の活躍、シャトルやラケットのひみつ、コートとルールまで、○×と3択で挑戦できます。答えと解説、出典つき。",
};

export default function QuizPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5">
      <h1 className="text-xl font-bold">バドミントンクイズ</h1>
      <p className="mt-2 mb-4 text-base leading-relaxed text-slate-700 dark:text-slate-300">
        小学生から中学生まで楽しめる、○×と3択のクイズです（{quiz.length}問）。練習の合間や、チームの交流にも使えます。答えは、公式の資料などで確認したものです。ルールや記録は変わることがあるので、大会に関わることは、最新の競技規則で確認してください。
      </p>

      <QuizApp />

      <section className="mt-10">
        <h2 className="mb-1 text-lg font-bold">問題と答えの一覧</h2>
        <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">指導の準備や、印刷して配るときに使えます。問題をタップすると、答えと解説が開きます。</p>
        {QUIZ_CATEGORY_ORDER.map((c) => {
          const items = quiz.filter((q) => q.category === c);
          if (items.length === 0) return null;
          return (
            <div key={c} className="mb-6">
              <h3 className="mb-2 text-base font-bold">{QUIZ_CATEGORY_LABELS[c]}</h3>
              <ul className="flex flex-col gap-2">
                {items.map((q) => (
                  <li key={q.id}>
                    <details className="rounded-xl border-2 border-slate-300 bg-white p-3 dark:border-slate-600 dark:bg-slate-900">
                      <summary className="cursor-pointer text-base font-bold">
                        {q.question}
                        <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 align-middle text-xs font-bold dark:bg-slate-700">{QUIZ_LEVEL_LABELS[q.level]}</span>
                      </summary>
                      {q.kind === "choice" && <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">選択肢：{[...q.choices].sort().join(" ／ ")}</p>}
                      <p className="mt-2 text-base">
                        答え：<b className="text-emerald-800 dark:text-emerald-300">{correctChoice(q)}</b>
                      </p>
                      <p className="mt-1 text-base leading-relaxed">{q.explanation}</p>
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
                    </details>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>
    </main>
  );
}
