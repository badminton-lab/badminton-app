import type { Metadata } from "next";
import Link from "next/link";
import { phrasesOf, worries } from "@/data/coaching";

export const metadata: Metadata = {
  title: "指導のヒント（お悩み・声かけ集）",
  alternates: { canonical: "/coach" },
  description:
    "ジュニアを指導する人のための、お悩み別の対処のヒントと、練習中・試合中（インターバル）の声かけ集です。",
};

const card = "rounded-xl border-2 border-slate-300 bg-white p-4 dark:border-slate-600 dark:bg-slate-900";
const link = "text-lg font-bold text-emerald-800 underline underline-offset-4 dark:text-emerald-300";

export default function CoachPage() {
  const practice = phrasesOf("practice").length;
  const match = phrasesOf("match").length;
  const entries = [
    { href: "/coach/worries", title: "指導のお悩み（あるある）", count: worries.length, unit: "件", text: "集中が続かない、同じミスを繰り返す、保護者との関係など。場面・原因・今日できる一手をまとめました。" },
    { href: "/coach/phrases/match", title: "試合中の声かけ（インターバル）", count: match, unit: "件", text: "インターバルに何を伝えればよいか迷う指導者向け。リード・負け・接戦・ダブルスなど、場面別に。" },
    { href: "/coach/phrases/practice", title: "普段の練習中の声かけ", count: practice, unit: "件", text: "ミスをしたとき、ほめるとき、集中が切れたときなど、練習で使える言葉。" },
  ].filter((e) => e.count > 0);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5">
      <h1 className="text-xl font-bold">指導のヒント</h1>
      <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">
        ジュニアを指導する人の「あるある」なお悩みと、場面別の声かけをまとめました。考え方の一例なので、目の前の子どもに合わせて使ってください。
      </p>
      {entries.length === 0 ? (
        <section className={`mt-4 ${card}`}>
          <h2 className="text-lg font-bold">準備中です</h2>
          <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">
            運営者が一つずつ内容を確認してから、順に公開します。もうしばらくお待ちください。
          </p>
        </section>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {entries.map((e) => (
            <li key={e.href} className={card}>
              <Link href={e.href} className={link}>
                {e.title}（{e.count}{e.unit}）
              </Link>
              <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">{e.text}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
