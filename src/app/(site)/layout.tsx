import Link from "next/link";
import BottomNav from "@/components/site/BottomNav";
import ThemeToggle from "@/components/ThemeToggle";

/** 公開ページ共通の枠（ヘッダー・下部ナビ・フッター）。/editor はこの外にある。 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    // 下部ナビに隠れないよう、下に余白をとる
    <div className="flex flex-1 flex-col pb-20">
      <header className="print:hidden border-b-2 border-slate-300 dark:border-slate-700">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="text-lg font-bold">
            🏸 バドミントン練習メニュー
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="px-4 py-6 text-center text-sm text-slate-600 print:hidden dark:text-slate-400">
        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {[
            ["/about", "このサイトについて"],
            ["/privacy", "プライバシーポリシー"],
            ["/terms", "免責事項・著作権"],
            ["/contact", "お問い合わせ"],
          ].map(([href, label]) => (
            <li key={href}>
              <Link href={href} className="inline-flex min-h-10 items-center font-bold underline underline-offset-4">
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-2">© Badminton Drill Lab</p>
      </footer>

      <BottomNav />
    </div>
  );
}
