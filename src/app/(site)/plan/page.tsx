import type { Metadata } from "next";
import PlanApp from "@/components/PlanApp";

export const metadata: Metadata = {
  title: "今日の練習プラン",
  description: "選んだ練習メニューを並べて、時間を決めて、印刷やLINEで共有できます。",
  alternates: { canonical: "/plan" },
  // 個人の入力内容を扱うページなので、検索結果には出さない
  robots: { index: false },
};

export default function PlanPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5">
      <h1 className="text-xl font-bold print:hidden">今日の練習プラン</h1>
      <p className="mt-1 mb-4 text-base leading-relaxed text-slate-700 print:hidden dark:text-slate-300">
        メニューを並べて、時間を決めます。印刷（PDFで保存）や、LINEへの共有もできます。
      </p>
      <PlanApp />
    </main>
  );
}
