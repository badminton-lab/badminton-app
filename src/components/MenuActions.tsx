"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { useFavorites } from "@/lib/favorites";
import { usePlan } from "@/lib/plan";

const noopSubscribe = () => () => {};
/** ブラウザでだけ使える値を、ハイドレーションのずれなく読む（サーバー描画時は fallback） */
function useBrowserValue<T>(read: () => T, fallback: T): T {
  return useSyncExternalStore(noopSubscribe, read, () => fallback);
}

const btn =
  "flex min-h-14 items-center justify-center gap-2 rounded-xl border-2 px-4 text-base font-bold active:scale-[0.98]";
const plain =
  "border-slate-400 bg-white text-slate-900 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100";

/** メニュー詳細ページの操作ボタン（お気に入り・プランに追加・共有） */
export default function MenuActions({
  id,
  title,
  defaultMinutes,
}: {
  id: string;
  title: string;
  defaultMinutes: number;
}) {
  const { favorites, toggle } = useFavorites();
  const { has, add, remove } = usePlan();
  const [copied, setCopied] = useState<"ok" | "ng" | null>(null);
  const href = useBrowserValue(() => window.location.href, "");
  const canShare = useBrowserValue(() => "share" in navigator, false);
  const isFav = favorites.has(id);
  const inPlan = has(id);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(href);
      setCopied("ok");
    } catch {
      setCopied("ng");
    }
    window.setTimeout(() => setCopied(null), 2500);
  };

  const share = async () => {
    try {
      await navigator.share({ title, url: href });
    } catch {
      // 共有をキャンセルしたときなどは、何もしない
    }
  };

  const lineHref = `https://line.me/R/msg/text/?${encodeURIComponent(`${title}\n${href}`)}`;

  return (
    <div className="flex flex-col gap-3 print:hidden">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          aria-pressed={isFav}
          onClick={() => toggle(id)}
          className={`${btn} ${isFav ? "border-amber-500 bg-amber-400 text-slate-950" : plain}`}
        >
          <span aria-hidden="true" className="text-2xl leading-none">
            {isFav ? "★" : "☆"}
          </span>
          {isFav ? "お気に入り済み" : "お気に入り"}
        </button>

        <button
          type="button"
          aria-pressed={inPlan}
          onClick={() => (inPlan ? remove(id) : add(id, defaultMinutes))}
          className={`${btn} ${
            inPlan
              ? "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-slate-950"
              : plain
          }`}
        >
          <span aria-hidden="true">{inPlan ? "✓" : "＋"}</span>
          {inPlan ? "プランに追加済み" : "プランに追加"}
        </button>
      </div>

      {inPlan && (
        <Link
          href="/plan"
          className="text-base font-bold text-emerald-800 underline underline-offset-4 dark:text-emerald-300"
        >
          今日のプランを見る ›
        </Link>
      )}

      <details className="group">
        <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 text-base font-bold text-emerald-800 dark:text-emerald-300 [&::-webkit-details-marker]:hidden">
          <span aria-hidden="true" className="transition-transform group-open:rotate-90">▶</span>
          このページを共有する
        </summary>
        <div className="mt-1 flex flex-wrap items-center gap-2">
        <button type="button" onClick={copy} className={`${btn} min-h-12 ${plain}`}>
          {copied === "ok" ? "コピーしました" : copied === "ng" ? "コピーできませんでした" : "URLをコピー"}
        </button>
        <a
          href={lineHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btn} min-h-12 ${plain}`}
        >
          LINEで送る
        </a>
        {canShare && (
          <button type="button" onClick={share} className={`${btn} min-h-12 ${plain}`}>
            共有…
          </button>
        )}
        </div>
      </details>
    </div>
  );
}
