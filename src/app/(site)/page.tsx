import DrillBrowser from "@/components/DrillBrowser";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5">
      <h1 className="mb-4 text-xl font-bold">練習メニュー検索</h1>
      <DrillBrowser />
    </main>
  );
}
