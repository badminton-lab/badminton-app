import type { Metadata } from "next";
import Link from "next/link";
import TroublesBrowser from "@/components/TroublesBrowser";
import { troubles } from "@/data/coaching";
import { drills } from "@/data/drills";
import { TAG_LABELS } from "@/data/tags";

export const metadata: Metadata = {
  title: "お悩み別ガイド（できないを解決）",
  alternates: { canonical: "/coach/troubles" },
  description:
    "スマッシュが飛ばない、クリアが届かない、動き出しが遅い、ダブルスでぶつかる。バドミントンの「できない」を、原因・確かめ方・直し方でまとめました。",
};

export default function TroublesPage() {
  // 公開中のメニューがある課題タグだけ、メニュー一覧へのリンクにする
  const tagLinks: Record<string, string> = {};
  for (const [id, label] of Object.entries(TAG_LABELS)) if (drills.some((d) => d.tags?.includes(id))) tagLinks[id] = label;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5">
      <p className="text-sm">
        <Link href="/coach" className="font-bold underline underline-offset-4">
          ← 指導のヒント
        </Link>
      </p>
      <h1 className="mt-2 text-xl font-bold">お悩み別ガイド（できないを解決）</h1>
      <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">
        バドミントンの「できない」を、考えられる原因・自分で確かめる方法・直し方の順にまとめました。原因は人によって違うので、「当てはまるものから試す」使い方がおすすめです。痛みがあるときは、無理をせず、専門の医療機関に相談してください。
      </p>
      {troubles.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-slate-400 p-8 text-center text-base">
          準備中です。運営者が確認してから公開します。
        </p>
      ) : (
        <div className="mt-5">
          <TroublesBrowser items={troubles} tagLinks={tagLinks} />
        </div>
      )}
    </main>
  );
}
