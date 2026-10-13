import type { Metadata } from "next";
import Link from "next/link";
import PhrasesBrowser from "@/components/PhrasesBrowser";
import { phrasesOf } from "@/data/coaching";

export const metadata: Metadata = {
  title: "試合中の声かけ集（インターバルのアドバイス）",
  alternates: { canonical: "/coach/phrases/match" },
  description:
    "インターバルに何を伝えればよいか分からない指導者向け。リード・負け・接戦・ダブルスなど、場面別の声かけと考え方をまとめました。",
};

export default function Page() {
  const items = phrasesOf("match");
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5">
      <p className="text-sm">
        <Link href="/coach" className="font-bold underline underline-offset-4">
          ← 指導のヒント
        </Link>
      </p>
      <h1 className="mt-2 text-xl font-bold">試合中の声かけ集（インターバルのアドバイス）</h1>
      <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">
        インターバルは短く、選手は息が上がっています。伝える内容を絞り、場面別に、言い方の例とねらいをまとめました。ルールでは、ゲーム中のインターバルは60秒以内、ゲームの間は120秒以内です（くわしくは「ルール」のページ）。助言ができる場面や人数は、大会の要項で確認してください。
      </p>
      {items.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-slate-400 p-8 text-center text-base">
          準備中です。運営者が確認してから公開します。
        </p>
      ) : (
        <div className="mt-5">
          <PhrasesBrowser group="match" items={items} />
        </div>
      )}
      <p className="mt-8 text-base">
        <Link href="/coach/phrases/practice" className="font-bold text-emerald-800 underline underline-offset-4 dark:text-emerald-300">
          普段の練習中の声かけはこちら
        </Link>
      </p>
    </main>
  );
}
