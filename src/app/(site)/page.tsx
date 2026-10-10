import Link from "next/link";
import DrillBrowser from "@/components/DrillBrowser";
import { drills } from "@/data/drills";
import { CATEGORY_HELP, CATEGORY_LABELS, CATEGORY_ORDER } from "@/data/types";

const card = "rounded-xl border-2 border-slate-300 bg-white p-4 dark:border-slate-600 dark:bg-slate-900";
const entry =
  "flex min-h-14 flex-col justify-center rounded-xl border-2 border-slate-400 bg-white px-4 py-2 dark:border-slate-500 dark:bg-slate-900";

export default function Home() {
  // 公開しているメニューがある区分だけを、入口に出す
  const categories = CATEGORY_ORDER.filter((c) => drills.some((d) => d.category === c));

  if (drills.length === 0) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-5">
        <h1 className="text-xl font-bold">今日の練習メニューを探す</h1>
        <section className={`mt-4 ${card}`}>
          <h2 className="text-lg font-bold">練習メニューは、準備中です</h2>
          <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">
            練習メニューは、運営者が一つずつ内容を確認してから、順に公開しています。いまは準備中のため、もうしばらくお待ちください。
          </p>
          <p className="mt-3 text-base leading-relaxed text-slate-700 dark:text-slate-300">
            先に、次のページをご覧いただけます。
          </p>
          <ul className="mt-2 flex flex-col gap-2">
            <li>
              <Link href="/rules" className="text-base font-bold text-emerald-800 underline underline-offset-4 dark:text-emerald-300">
                バドミントンのルール（質問形式）
              </Link>
            </li>
            <li>
              <Link href="/trivia" className="text-base font-bold text-emerald-800 underline underline-offset-4 dark:text-emerald-300">
                雑学・シャトルの番号
              </Link>
            </li>
            <li>
              <Link href="/gear" className="text-base font-bold text-emerald-800 underline underline-offset-4 dark:text-emerald-300">
                用品の選び方・おすすめ商品
              </Link>
            </li>
          </ul>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5">
      <h1 className="text-xl font-bold">今日の練習メニューを探す</h1>
      <p className="mt-1 mb-4 text-base leading-relaxed text-slate-700 dark:text-slate-300">
        区分・レベル・人数から、コート図やイラストつきの練習メニュー（{drills.length}件）がすぐ見つかります。
      </p>

      <details className={`mb-5 ${card}`}>
        <summary className="min-h-10 cursor-pointer text-base font-bold">はじめての方へ（使い方）</summary>
        <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-base leading-relaxed">
          <li>下の入口か、検索欄から、今日の練習に合うメニューを探します。</li>
          <li>気になるカードを押すと、図・進め方・指導のコツを見られます。</li>
          <li>使うものは、☆でお気に入りに入れるか、「今日のプランに追加」で、時間つきのプランにして、印刷やLINE共有ができます。</li>
        </ol>
        <h2 className="mt-4 mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">人数から探す</h2>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            ["1", "1人でできる"],
            ["2", "2人で"],
            ["3", "3人で"],
            ["4", "4人以上で"],
          ].map(([p, label]) => (
            <li key={p}>
              <Link href={`/?p=${p}`} className={`${entry} text-center text-base font-bold`}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <h2 className="mt-4 mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">区分から探す</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {categories.map((c) => (
            <li key={c}>
              <Link href={`/?c=${c}`} className={entry}>
                <span className="text-base font-bold">{CATEGORY_LABELS[c]}</span>
                <span className="text-xs leading-snug text-slate-600 dark:text-slate-400">{CATEGORY_HELP[c]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </details>

      <DrillBrowser />
    </main>
  );
}
