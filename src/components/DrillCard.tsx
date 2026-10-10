"use client";

import Link from "next/link";
import FavoriteButton from "./FavoriteButton";
import CourtDiagram from "./CourtDiagram";
import IllustrationView from "./IllustrationView";
import SceneView from "./SceneView";
import {
  CATEGORY_LABELS,
  COURT_TYPE_LABELS,
  LEVEL_LABELS,
  TIMING_LABELS,
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
}: {
  drill: Drill;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <article className="relative rounded-xl transition-shadow focus-within:ring-2 focus-within:ring-emerald-500 hover:shadow-md border-2 border-slate-300 bg-white p-4 shadow-sm dark:border-slate-600 dark:bg-slate-900">
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
      {/* 図がある場合は、左に縦向きのコート図（ノッカー側が下）、右にタイトルと説明を並べる */}
      <div className={drill.diagram ? "grid grid-cols-[38%_1fr] items-start gap-3" : drill.scene || drill.illustration ? "flex flex-col gap-2" : undefined}>
        {drill.diagram && (
          <CourtDiagram
            courtType={drill.courtType}
            diagram={drill.diagram}
            className="h-auto w-full rounded-lg"
          />
        )}
        {!drill.diagram && drill.scene && (
          <SceneView scene={drill.scene} label={`${drill.title}の場面図`} className="h-auto w-full rounded-lg" />
        )}
        {!drill.diagram && !drill.scene && drill.illustration && (
          <IllustrationView
            illustration={drill.illustration}
            label={`${drill.title}のイメージ図`}
            className="h-auto w-full rounded-lg bg-slate-50 dark:bg-slate-800"
          />
        )}
        <div className="min-w-0">
          <h3 className={`font-bold leading-snug ${drill.diagram ? "text-lg" : "text-xl"}`}>
            {/* after:inset-0 でリンクをカード全面に広げ、カード全体をタップできるようにする */}
            <Link
              href={`/menu/${drill.id}`}
              className="text-left outline-none after:absolute after:inset-0 after:content-['']"
            >
              {drill.title}
            </Link>
          </h3>
          <p
            className={`mt-1.5 leading-relaxed text-slate-700 dark:text-slate-300 ${
              drill.diagram ? "text-sm" : "text-base"
            }`}
          >
            {drill.description}
          </p>
        </div>
      </div>
      <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t-2 border-slate-200 pt-3 text-base dark:border-slate-700">
        <div>
          <dt className="text-sm text-slate-600 dark:text-slate-400">人数</dt>
          <dd className="font-medium">{playersLabel(drill)}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-600 dark:text-slate-400">種目</dt>
          <dd className="font-medium">{COURT_TYPE_LABELS[drill.courtType]}</dd>
        </div>
        {drill.timing && (
          <div>
            <dt className="text-sm text-slate-600 dark:text-slate-400">実施</dt>
            <dd className="font-medium">{TIMING_LABELS[drill.timing]}</dd>
          </div>
        )}
      </dl>
      <p className="mt-2 text-right text-base font-bold text-emerald-800 dark:text-emerald-300">
        詳細を見る ›
      </p>
    </article>
  );
}
