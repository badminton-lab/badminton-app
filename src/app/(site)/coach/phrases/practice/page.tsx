import type { Metadata } from "next";
import Link from "next/link";
import PhrasesBrowser from "@/components/PhrasesBrowser";
import { phrasesOf } from "@/data/coaching";

export const metadata: Metadata = {
  title: "普段の練習中の声かけ集",
  alternates: { canonical: "/coach/phrases/practice" },
  description:
    "ミスをしたとき、ほめるとき、集中が切れたとき。ジュニア指導で使える練習中の声かけを、場面別にまとめました。",
};

export default function Page() {
  const items = phrasesOf("practice");
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5">
      <p className="text-sm">
        <Link href="/coach" className="font-bold underline underline-offset-4">
          ← 指導のヒント
        </Link>
      </p>
      <h1 className="mt-2 text-xl font-bold">普段の練習中の声かけ集</h1>
      <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">
        練習の場面ごとに、言い方の例と、ねらい、避けたい言い方をまとめました。
      </p>
      {items.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-slate-400 p-8 text-center text-base">
          準備中です。運営者が確認してから公開します。
        </p>
      ) : (
        <div className="mt-5">
          <PhrasesBrowser group="practice" items={items} />
        </div>
      )}
      <p className="mt-8 text-base">
        <Link href="/coach/phrases/match" className="font-bold text-emerald-800 underline underline-offset-4 dark:text-emerald-300">
          試合中の声かけ（インターバル）はこちら
        </Link>
      </p>
    </main>
  );
}
