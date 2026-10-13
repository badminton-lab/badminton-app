"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePlan, type PlanItem } from "@/lib/plan";

/** 練習プラン例を、自分の「今日のプラン」に入れる。すでにプランがあるときは、置き換えてよいか確認する */
export default function UsePlanButton({ title, targetMinutes, items }: { title: string; targetMinutes: number; items: PlanItem[] }) {
  const { plan, replaceAll } = usePlan();
  const router = useRouter();

  if (items.length === 0)
    return (
      <p className="text-sm text-slate-600 dark:text-slate-400">
        この例のメニューは、準備中です。公開されると、ここから「今日のプラン」に入れられます。
      </p>
    );

  const go = () => {
    if (plan.items.length > 0 && !window.confirm("いまのプランを、この例で置き換えますか？（元には戻せません）")) return;
    replaceAll(title, targetMinutes, items);
    router.push("/plan");
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={go} className="min-h-14 rounded-xl bg-emerald-700 px-5 text-base font-bold text-white active:scale-[0.99] dark:bg-emerald-400 dark:text-slate-950">
        この例を「今日のプラン」に入れる
      </button>
      <Link href="/plan" className="text-sm font-bold text-emerald-800 underline underline-offset-4 dark:text-emerald-300">
        今日のプランを見る
      </Link>
    </div>
  );
}
