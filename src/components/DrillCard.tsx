"use client";

import FavoriteButton from "./FavoriteButton";
import CourtDiagram from "./CourtDiagram";
import {
  CATEGORY_LABELS,
  COURT_TYPE_LABELS,
  LEVEL_LABELS,
  type Drill,
  type Level,
} from "@/data/drills";

const levelStyles: Record<Level, string> = {
  beginner: "bg-sky-200 text-sky-950 dark:bg-sky-900 dark:text-sky-100",
  intermediate: "bg-amber-200 text-amber-950 dark:bg-amber-900 dark:text-amber-100",
  advanced: "bg-rose-200 text-rose-950 dark:bg-rose-900 dark:text-rose-100",
};

function playersLabel(drill: Drill): string {
  return drill.minPlayers === drill.maxPlayers
    ? `${drill.minPlayers}人`
    : `${drill.minPlayers}〜${drill.maxPlayers}人`;
}

export default function DrillCard({
  drill,
  isFavorite,
  onToggleFavorite,
  onSelect,
}: {
  drill: Drill;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSelect: (drill: Drill) => void;
}) {
  return (
    <article className="relative rounded-xl transition-shadow focus-within:ring-2 focus-within:ring-emerald-500 hover:shadow-md border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-1 flex flex-wrap items-center gap-2 text-sm font-bold">
        <span className="rounded-full bg-emerald-200 px-3 py-1 text-emerald-950 dark:bg-emerald-900 dark:text-emerald-100">
          {CATEGORY_LABELS[drill.category]}
        </span>
        <span className={`rounded-full px-3 py-1 ${levelStyles[drill.level]}`}>
          {LEVEL_LABELS[drill.level]}
        </span>
        {/* z-10 でタイトルの全面リンクより前面に出し、星だけ単独でタップできるようにする */}
        <FavoriteButton
          active={isFavorite}
          onToggle={onToggleFavorite}
          className="relative z-10 -my-2 -mr-2 ml-auto"
        />
      </div>
      <h3 className="text-xl font-bold leading-snug">
        {/* after:inset-0 でボタンをカード全面に広げ、カード全体をクリック可能にする */}
        <button
          type="button"
          onClick={() => onSelect(drill)}
          className="text-left outline-none after:absolute after:inset-0 after:content-['']"
        >
          {drill.title}
        </button>
      </h3>
      <p className="mt-1.5 text-base leading-relaxed text-slate-700 dark:text-slate-300">
        {drill.description}
      </p>
      <CourtDiagram
        courtType={drill.courtType}
        diagram={drill.diagram}
        className="mt-3 h-auto w-full rounded-lg"
      />
      <dl className="mt-3 flex gap-4 border-t-2 border-slate-200 pt-3 text-base dark:border-slate-700">
        <div>
          <dt className="text-sm text-slate-600 dark:text-slate-400">人数</dt>
          <dd className="font-medium">{playersLabel(drill)}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-600 dark:text-slate-400">コート</dt>
          <dd className="font-medium">{COURT_TYPE_LABELS[drill.courtType]}</dd>
        </div>
      </dl>
      <p className="mt-2 text-right text-base font-bold text-emerald-800 dark:text-emerald-300">
        詳細を見る ›
      </p>
    </article>
  );
}
