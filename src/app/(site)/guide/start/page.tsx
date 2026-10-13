import type { Metadata } from "next";
import Link from "next/link";
import GuidesBrowser from "@/components/GuidesBrowser";
import { guidesOf } from "@/data/coaching";

export const metadata: Metadata = {
  title: "はじめてのバドミントン（初心者・保護者の方へ）",
  alternates: { canonical: "/guide/start" },
  description:
    "バドミントンを始める人と、その保護者の方へ。握り方・構え、最初の1日の流れ、体育館のマナー、始めるときに確認したいことをやさしくまとめました。",
};

export default function Page() {
  const items = guidesOf("start");
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5">
      <h1 className="text-xl font-bold">はじめてのバドミントン（初心者・保護者の方へ）</h1>
      <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">
        初めての人や、お子さんを始めさせたい保護者の方へ。そろえるもの、握り方、最初の1日の流れ、体育館での約束をまとめました。団体ごとに条件が違うことは、直接確認してください。
      </p>
      {items.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-slate-400 p-8 text-center text-base">
          準備中です。運営者が確認してから公開します。
        </p>
      ) : (
        <div className="mt-5">
          <GuidesBrowser group="start" items={items} />
        </div>
      )}
      <p className="mt-8 text-base print:hidden">
        <Link href="/guide/match-day" className="font-bold text-emerald-800 underline underline-offset-4 dark:text-emerald-300">
          試合の日ガイドはこちら
        </Link>
      </p>
    </main>
  );
}
