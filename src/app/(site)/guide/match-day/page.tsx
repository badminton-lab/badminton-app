import type { Metadata } from "next";
import Link from "next/link";
import GuidesBrowser from "@/components/GuidesBrowser";
import { guidesOf } from "@/data/coaching";

export const metadata: Metadata = {
  title: "試合の日ガイド（初めての大会）",
  alternates: { canonical: "/guide/match-day" },
  description:
    "初めての大会に出る選手と保護者の方へ。前日の準備、持ち物チェックリスト、当日の流れ、試合の合間の過ごし方、応援のしかたをまとめました。",
};

export default function Page() {
  const items = guidesOf("matchday");
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5">
      <h1 className="text-xl font-bold">試合の日ガイド（初めての大会）</h1>
      <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">
        初めての大会に出る人と、保護者の方へ。前日から当日、試合のあとまでの流れと、持ち物チェックリストをまとめました。大会ごとに決まりが違うので、必ず大会の要項も確認してください。
      </p>
      {items.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-slate-400 p-8 text-center text-base">
          準備中です。運営者が確認してから公開します。
        </p>
      ) : (
        <div className="mt-5">
          <GuidesBrowser group="matchday" items={items} />
        </div>
      )}
      <p className="mt-8 text-base print:hidden">
        <Link href="/guide/start" className="font-bold text-emerald-800 underline underline-offset-4 dark:text-emerald-300">
          はじめてのバドミントンはこちら
        </Link>
      </p>
    </main>
  );
}
