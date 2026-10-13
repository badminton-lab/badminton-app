import type { Metadata } from "next";
import Link from "next/link";
import WorriesBrowser from "@/components/WorriesBrowser";
import { worries } from "@/data/coaching";

export const metadata: Metadata = {
  title: "ジュニア指導のお悩みあるある",
  alternates: { canonical: "/coach/worries" },
  description:
    "おしゃべりが止まらない、同じミスを繰り返す、負けて泣く、保護者が口を出す。ジュニア指導のお悩みを、場面・原因・今日できる一手でまとめました。",
};

export default function WorriesPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5">
      <p className="text-sm">
        <Link href="/coach" className="font-bold underline underline-offset-4">
          ← 指導のヒント
        </Link>
      </p>
      <h1 className="mt-2 text-xl font-bold">ジュニア指導のお悩みあるある</h1>
      <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">
        よくあるお悩みを、場面・原因の見立て・今日からできる一手の順にまとめました。正解は一つではないので、考え方の一例として使ってください。
      </p>
      {worries.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-slate-400 p-8 text-center text-base">
          準備中です。運営者が確認してから公開します。
        </p>
      ) : (
        <div className="mt-5">
          <WorriesBrowser items={worries} />
        </div>
      )}
    </main>
  );
}
