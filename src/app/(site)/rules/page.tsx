import type { Metadata } from "next";
import RulesBrowser from "@/components/RulesBrowser";
import { RULES_CHECKED_AT, RULE_SOURCES, rules } from "@/data/rules";

export const metadata: Metadata = {
  title: "バドミントンのルール",
  description:
    "サーブの右左を間違えたときの対処、15点制・21点制、フォルト、レットなど、バドミントンのルールを質問形式でまとめました。",
  alternates: { canonical: "/rules" },
};

const quick = [
  {
    title: "サービスの位置",
    body: "サービスをするサイドの得点が、偶数（0を含む）なら右、奇数なら左のサービスコートからです。",
  },
  {
    title: "サービスの高さ",
    body: "打つ瞬間に、シャトル全体が床から1.15m以下です。",
  },
  {
    title: "間違いに気づいたら",
    body: "右左や順番を間違えたら、インプレーでないときに直し、スコアはそのままで続けます。",
  },
  {
    title: "ラインの上",
    body: "ラインの上に落ちたシャトルは、インです。",
  },
];

export default function RulesPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5">
      <h1 className="text-xl font-bold">バドミントンのルール</h1>
      <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">
        試合や練習試合で迷いやすいルールを、質問形式でまとめました（{rules.length}件）。公式の競技規則に基づいています。
      </p>

      <section
        aria-label="得点方式についてのお知らせ"
        className="mt-4 rounded-xl border-2 border-amber-500 bg-amber-100 p-4 text-amber-950 dark:bg-amber-900 dark:text-amber-100"
      >
        <h2 className="text-base font-bold">得点方式は、21点制から15点制への移行期です</h2>
        <p className="mt-1 text-base leading-relaxed">
          国際大会は、2027年1月4日から1ゲーム15点制の予定です。日本でも、日本バドミントン協会の主催・主管する大会で、2026年から段階的に導入されています。参加する大会の方式は、大会要項で確認してください。
        </p>
      </section>

      <section aria-label="すぐ確認したい4つのポイント" className="mt-5">
        <h2 className="mb-3 text-lg font-bold">すぐ確認したい4つのポイント</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {quick.map((q) => (
            <li
              key={q.title}
              className="rounded-xl border-2 border-slate-300 bg-white p-4 dark:border-slate-600 dark:bg-slate-900"
            >
              <h3 className="text-base font-bold text-emerald-800 dark:text-emerald-300">{q.title}</h3>
              <p className="mt-1 text-base leading-relaxed">{q.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8">
        <RulesBrowser />
      </div>

      <section className="mt-10 rounded-xl border-2 border-slate-300 bg-white p-4 dark:border-slate-600 dark:bg-slate-900">
        <h2 className="text-lg font-bold">このページについて</h2>
        <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">
          {RULES_CHECKED_AT}時点の、日本バドミントン協会の競技規則（BAJルールブック2026）と、BWFの競技規則（2025年版）をもとに、要約しました。実際の試合では、最新の競技規則、大会要項、審判の判定が優先されます。
        </p>
        <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">
          「練習試合・指導の場で」の項目は、規則ではなく、運用の目安です。
        </p>
        <h3 className="mt-4 text-base font-bold">参考にした資料</h3>
        <ul className="mt-2 flex flex-col gap-2">
          {RULE_SOURCES.map((s) => (
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
