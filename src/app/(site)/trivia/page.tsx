import type { Metadata } from "next";
import { TRIVIA_CATEGORY_LABELS, TRIVIA_CATEGORY_ORDER, trivia } from "@/data/trivia";

export const metadata: Metadata = {
  title: "バドミントンの雑学",
  description: "シャトルの羽根の話から、歴史、ルールまで。練習の合間に話したくなるバドミントンの雑学をまとめました。",
};

export default function TriviaPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5">
      <h1 className="text-xl font-bold">バドミントンの雑学</h1>
      <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">
        練習の合間や、子どもたちへの声かけに使える話を集めました。数値は一般的な公式ルールに基づく目安です。大会に関わることは、最新の競技規則で確認してください。
      </p>

      {/* 見出しへのジャンプ（押しやすい大きさのリンク） */}
      <nav aria-label="雑学のカテゴリー" className="mt-4 flex flex-wrap gap-2">
        {TRIVIA_CATEGORY_ORDER.map((c) => (
          <a
            key={c}
            href={`#${c}`}
            className="flex min-h-12 items-center rounded-full border-2 border-slate-400 bg-white px-4 text-base font-bold text-slate-900 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100"
          >
            {TRIVIA_CATEGORY_LABELS[c]}
          </a>
        ))}
      </nav>

      {TRIVIA_CATEGORY_ORDER.map((c) => {
        const items = trivia.filter((t) => t.category === c);
        if (items.length === 0) return null;
        return (
          <section key={c} id={c} className="mt-8 scroll-mt-4">
            <h2 className="mb-3 text-lg font-bold">{TRIVIA_CATEGORY_LABELS[c]}</h2>
            <ul className="flex flex-col gap-3">
              {items.map((t) => (
                <li key={t.id}>
                  <article className="rounded-xl border-2 border-slate-300 bg-white p-4 dark:border-slate-600 dark:bg-slate-900">
                    <h3 className="text-lg font-bold leading-snug">{t.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">
                      {t.body}
                    </p>
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
        );
      })}
    </main>
  );
}
