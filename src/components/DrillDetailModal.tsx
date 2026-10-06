"use client";

import { useEffect, useRef } from "react";
import {
  CATEGORY_LABELS,
  COURT_TYPE_LABELS,
  LEVEL_LABELS,
  type Drill,
} from "@/data/drills";
import CourtDiagram from "./CourtDiagram";

const legend = [
  { color: "bg-blue-600", label: "練習者" },
  { color: "bg-orange-500", label: "ノッカー（出し手）" },
  { color: "bg-slate-500", label: "相手" },
];

function playersLabel(drill: Drill): string {
  return drill.minPlayers === drill.maxPlayers
    ? `${drill.minPlayers}人`
    : `${drill.minPlayers}〜${drill.maxPlayers}人`;
}

export default function DrillDetailModal({
  drill,
  isFavorite,
  onToggleFavorite,
  onClose,
}: {
  drill: Drill;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    // 背面のスクロールを止める
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby="drill-modal-title"
      onClose={onClose}
      // ダイアログ外（::backdrop）のクリックで閉じる
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
      className="m-auto max-h-[92dvh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-t-2xl bg-white p-0 text-slate-900 backdrop:bg-black/60 max-sm:mb-0 sm:rounded-2xl dark:bg-slate-900 dark:text-slate-100"
    >
      <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b-2 border-slate-300 bg-white/95 px-4 py-3 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
        <div>
          <div className="mb-1 flex flex-wrap gap-2 text-sm font-bold">
            <span className="rounded-full bg-emerald-200 px-3 py-1 text-emerald-950 dark:bg-emerald-900 dark:text-emerald-100">
              {CATEGORY_LABELS[drill.category]}
            </span>
            <span className="rounded-full bg-slate-200 px-3 py-1 text-slate-900 dark:bg-slate-700 dark:text-slate-100">
              {LEVEL_LABELS[drill.level]}
            </span>
          </div>
          <h2 id="drill-modal-title" className="text-lg font-bold leading-snug">
            {drill.title}
          </h2>
        </div>
        <button
          type="button"
          aria-label="閉じる"
          onClick={() => ref.current?.close()}
          className="-mr-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-3xl leading-none text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          ×
        </button>
      </div>

      <div className="flex flex-col gap-5 px-4 py-4">
        <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
          {drill.description}
        </p>

        <div>
          <CourtDiagram
            courtType={drill.courtType}
            diagram={drill.diagram}
            className="h-auto w-full rounded-lg"
          />
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-700 dark:text-slate-300">
            {legend.map((l) => (
              <li key={l.label} className="flex items-center gap-1.5">
                <span className={`inline-block h-3 w-3 rounded-full ${l.color}`} />
                {l.label}
              </li>
            ))}
            <li className="flex items-center gap-1.5">
              <span className="inline-block w-5 border-t-2 border-dashed border-yellow-500" />
              シャトルの軌道
            </li>
            <li className="flex items-center gap-1.5">
              <span className="inline-block w-5 border-t-2 border-slate-400" />
              選手の移動
            </li>
          </ul>
        </div>

        <dl className="grid grid-cols-2 gap-3">
          <Info label="人数" value={playersLabel(drill)} />
          <Info label="コート" value={COURT_TYPE_LABELS[drill.courtType]} />
          <Info label="推奨時間" value={drill.duration} />
          {drill.shots && <Info label="推奨球数" value={drill.shots} />}
        </dl>

        <section>
          <h3 className="mb-2 text-base font-bold">球出し・配球パターン</h3>
          <p className="rounded-lg bg-slate-100 p-3 text-base leading-relaxed dark:bg-slate-800">
            {drill.feedPattern}
          </p>
        </section>

        <section>
          <h3 className="mb-2 text-base font-bold">指導のコツ・着眼点</h3>
          <ol className="flex flex-col gap-2">
            {drill.coachingPoints.map((point, i) => (
              <li key={i} className="flex gap-3 text-base leading-relaxed">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white dark:bg-emerald-400 dark:text-slate-950">
                  {i + 1}
                </span>
                {point}
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* 親指で押しやすい下部の操作バー */}
      <div className="sticky bottom-0 flex gap-3 border-t-2 border-slate-300 bg-white/95 px-4 py-3 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
        <button
          type="button"
          aria-pressed={isFavorite}
          onClick={onToggleFavorite}
          className={`flex min-h-14 flex-1 items-center justify-center gap-2 rounded-xl border-2 text-base font-bold active:scale-[0.98] ${
            isFavorite
              ? "border-amber-500 bg-amber-400 text-slate-950"
              : "border-slate-400 bg-white text-slate-900 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100"
          }`}
        >
          <span aria-hidden="true" className="text-2xl leading-none">
            {isFavorite ? "★" : "☆"}
          </span>
          {isFavorite ? "お気に入り済み" : "お気に入りに追加"}
        </button>
        <button
          type="button"
          onClick={() => ref.current?.close()}
          className="min-h-14 rounded-xl bg-slate-900 px-6 text-base font-bold text-white active:scale-[0.98] dark:bg-slate-100 dark:text-slate-950"
        >
          閉じる
        </button>
      </div>
    </dialog>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border-2 border-slate-300 px-3 py-2 dark:border-slate-700">
      <dt className="text-sm text-slate-600 dark:text-slate-400">{label}</dt>
      <dd className="text-base font-bold">{value}</dd>
    </div>
  );
}
