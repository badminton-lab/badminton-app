import DrillBrowser from "@/components/DrillBrowser";
import { drills } from "@/data/drills";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5">
      <h1 className="text-xl font-bold">今日の練習メニューを探す</h1>
      <p className="mt-1 mb-4 text-base leading-relaxed text-slate-700 dark:text-slate-300">
        区分・レベル・人数から、コート図つきの練習メニュー（{drills.length}件）がすぐ見つかります。
      </p>
      <DrillBrowser />
    </main>
  );
}
