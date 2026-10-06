import ThemeToggle from "@/components/ThemeToggle";
import DrillBrowser from "@/components/DrillBrowser";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-slate-300 dark:border-slate-700">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <h1 className="text-xl font-bold">🏸 練習メニュー検索</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-5">
        <DrillBrowser />
      </main>

      <footer className="py-4 text-center text-sm text-slate-600 dark:text-slate-400">
        © Badminton Drill Lab
      </footer>
    </div>
  );
}
