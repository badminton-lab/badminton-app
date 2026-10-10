import type { Metadata } from "next";
import TriviaBrowser from "@/components/TriviaBrowser";
import {
  SHUTTLE_NUMBERS,
  SHUTTLE_NUMBER_POINTS,
  TRIVIA_SOURCES,
  trivia,
} from "@/data/trivia";

export const metadata: Metadata = {
  title: "バドミントンの雑学・シャトルの番号",
  alternates: { canonical: "/trivia" },
  description:
    "シャトルの番号（1番〜5番）の意味と選び方、羽根の秘密、歴史、日本の活躍、ルールまで。練習の合間に話したくなるバドミントンの雑学をまとめました。",
};

const chip =
  "flex min-h-12 items-center rounded-full border-2 border-slate-400 bg-white px-4 text-base font-bold text-slate-900 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100";

export default function TriviaPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5">
      <h1 className="text-xl font-bold">バドミントンの雑学</h1>
      <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">
        練習の合間や、子どもたちへの声かけに使える話を集めました（{trivia.length}件）。数値は、公式の資料や、各社の公式情報で確認したものです。ルールは改正されるため、大会に関わることは、最新の競技規則で確認してください。
      </p>

      {/* 見出しへのジャンプ（押しやすい大きさのリンク） */}
      <nav aria-label="雑学のカテゴリー" className="mt-4 flex flex-wrap gap-2">
        <a href="#shuttle-numbers" className={`${chip} border-emerald-700 text-emerald-900 dark:border-emerald-400 dark:text-emerald-200`}>
          シャトルの番号
        </a>
        <a href="#list" className={chip}>
          雑学の一覧・検索
        </a>
      </nav>

      {/* ───── シャトルの番号 早わかり ───── */}
      <section id="shuttle-numbers" className="mt-8 scroll-mt-4">
        <h2 className="mb-3 text-lg font-bold">シャトルの番号 早わかり</h2>
        <div className="rounded-xl border-2 border-emerald-700 bg-white p-4 dark:border-emerald-400 dark:bg-slate-900">
          <p className="text-base leading-relaxed">
            シャトルには、「<b>1番〜5番</b>」などの番号が付いています。これは、<b>季節（気温）に合わせた、飛びやすさの目安</b>です。番号が大きいほど、よく飛びます。
          </p>

          <div className="mt-4">
            <table className="w-full border-collapse text-left text-base">
              <caption className="sr-only">シャトルの番号と、気温・季節の目安</caption>
              <thead>
                <tr className="border-b-2 border-slate-300 text-sm text-slate-600 dark:border-slate-600 dark:text-slate-400">
                  <th scope="col" className="py-2 pr-3 font-bold">番号</th>
                  <th scope="col" className="py-2 pr-3 font-bold whitespace-nowrap">室温の目安</th>
                  <th scope="col" className="py-2 font-bold">季節・飛び方</th>
                </tr>
              </thead>
              <tbody>
                {SHUTTLE_NUMBERS.map((r) => (
                  <tr key={r.no} className="border-b border-slate-200 dark:border-slate-700">
                    <th scope="row" className="py-3 pr-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-lg font-bold text-white dark:bg-emerald-400 dark:text-slate-950">
                        {r.no}
                      </span>
                    </th>
                    <td className="py-3 pr-3 font-bold whitespace-nowrap tabular-nums">{r.temp}</td>
                    <td className="py-3">
                      {r.season}
                      {r.flight && (
                        <span className="block text-sm font-bold text-emerald-800 dark:text-emerald-300">{r.flight}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            ※ 目安です。メーカーや製品、会場の条件で変わります。
          </p>

          <h3 className="mt-5 mb-2 text-base font-bold">覚えておきたいポイント</h3>
          <ul className="flex flex-col gap-2">
            {SHUTTLE_NUMBER_POINTS.map((p) => (
              <li key={p} className="flex gap-2 text-base leading-relaxed">
                <span aria-hidden="true" className="font-bold text-emerald-700 dark:text-emerald-400">
                  ・
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <p className="mt-4 rounded-lg bg-emerald-100 p-3 text-base leading-relaxed text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100">
            <b className="mr-1">指導のヒント</b>
            練習の前に、体育館の室温を確認して、その日のシャトルの番号を決める習慣をつけると、「今日は飛ばない」「飛びすぎる」というばらつきを、減らせます。
          </p>
        </div>
      </section>

      <section id="list" className="mt-10 scroll-mt-4">
        <h2 className="mb-3 text-lg font-bold">雑学の一覧</h2>
        <TriviaBrowser />
      </section>

      <section className="mt-10 rounded-xl border-2 border-slate-300 bg-white p-4 dark:border-slate-600 dark:bg-slate-900">
        <h2 className="text-lg font-bold">参考にした資料</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          数値や内容は、2026年10月時点で確認したものです。資料によって表現が分かれる内容は、「とされています」と書いています。
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {TRIVIA_SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-bold text-emerald-800 underline underline-offset-4 dark:text-emerald-300"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
