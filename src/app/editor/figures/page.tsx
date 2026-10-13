import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IllustrationView from "@/components/IllustrationView";
import { illustrations } from "@/data/illustrations";

export const metadata: Metadata = {
  title: "イラスト見本（開発用）",
  robots: { index: false },
};

export default async function FiguresPage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  // 開発サーバーでのみ使える。本番では存在しないページとして扱う。
  if (process.env.NODE_ENV !== "development") notFound();
  const { ids } = await searchParams;
  const keys = ids ? ids.split(",") : Object.keys(illustrations);
  return (
    <main className="mx-auto grid max-w-5xl grid-cols-2 gap-3 p-4 md:grid-cols-3">
      {keys.map((k) =>
        illustrations[k] ? (
          <figure key={k} className="rounded border border-slate-200 bg-white p-1">
            <figcaption className="px-1 text-xs text-slate-500">{k}</figcaption>
            <IllustrationView illustration={illustrations[k]} className="w-full" />
          </figure>
        ) : null,
      )}
    </main>
  );
}
