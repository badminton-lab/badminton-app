import Link from "next/link";
import BottomNav from "@/components/site/BottomNav";
import ThemeToggle from "@/components/ThemeToggle";

/** 公開ページ共通の枠（ヘッダー・下部ナビ・フッター）。/editor はこの外にある。 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    // 下部ナビに隠れないよう、下に余白をとる
    <div className="flex flex-1 flex-col pb-20">
      <header className="border-b-2 border-slate-300 dark:border-slate-700">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="text-lg font-bold">
            🏸 バドミントン練習メニュー
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="px-4 py-6 text-center text-sm text-slate-600 dark:text-slate-400">
        <p>
          <Link href="/about" className="font-bold underline underline-offset-4">
            このサイトについて
          </Link>
        </p>
        <p className="mt-2">© Badminton Drill Lab</p>
      </footer>

      <BottomNav />
    </div>
  );
}
