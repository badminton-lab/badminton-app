"use client";

import { useMemo, useState } from "react";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  DEFAULT_FILTERS,
  LEVEL_LABELS,
  drills,
  filterDrills,
  type DrillFilters,
  type Level,
  type PlayerFilter,
} from "@/data/drills";
import { useFavorites } from "@/lib/favorites";
import { replaceSearch, useSearch } from "@/lib/urlState";
import DrillCard from "./DrillCard";
import DrillFilterPanel from "./DrillFilterPanel";

/** 一度に表示する件数。228件を一度に描画すると、スマホで重くなるため分割する。 */
const PAGE_SIZE = 24;

type View = { filters: DrillFilters; favoritesOnly: boolean; visible: number };

/** URLのクエリ文字列から、表示の状態を復元する（不正な値は既定値にする） */
function parseView(search: string): View {
  const p = new URLSearchParams(search);
  const category = p.get("c");
  const level = p.get("l");
  const players = p.get("p");
  const n = Number(p.get("n"));
  return {
    filters: {
      query: p.get("q") ?? "",
      category: CATEGORY_ORDER.includes(category as never) ? (category as DrillFilters["category"]) : "all",
      level: level && level in LEVEL_LABELS ? (level as Level) : "all",
      players: (["1", "2", "3", "4"].includes(players ?? "") ? Number(players) : "all") as PlayerFilter,
    },
    favoritesOnly: p.get("fav") === "1",
    visible: Number.isFinite(n) && n > PAGE_SIZE ? Math.min(Math.floor(n), drills.length) : PAGE_SIZE,
  };
}

function toParams(v: View): URLSearchParams {
  const p = new URLSearchParams();
  if (v.filters.query) p.set("q", v.filters.query);
  if (v.filters.category !== "all") p.set("c", v.filters.category);
  if (v.filters.level !== "all") p.set("l", v.filters.level);
  if (v.filters.players !== "all") p.set("p", String(v.filters.players));
  if (v.favoritesOnly) p.set("fav", "1");
  if (v.visible > PAGE_SIZE) p.set("n", String(v.visible));
  return p;
}

const PLAYER_TEXT: Record<string, string> = { "1": "1人", "2": "2人", "3": "3人", "4": "4人以上" };

export default function DrillBrowser() {
  const search = useSearch();
  const view = useMemo(() => parseView(search), [search]);
  const { filters, favoritesOnly, visible } = view;
  const [panelOpen, setPanelOpen] = useState(false);
  const { favorites, toggle } = useFavorites();

  const commit = (next: View) => replaceSearch(toParams(next));
  // 条件を変えたら、表示件数は最初の件数に戻す
  const setFilters = (f: DrillFilters) => commit({ filters: f, favoritesOnly, visible: PAGE_SIZE });
  const setFavoritesOnly = (v: boolean) => commit({ filters, favoritesOnly: v, visible: PAGE_SIZE });

  const results = useMemo(() => {
    const filtered = filterDrills(drills, filters);
    return favoritesOnly ? filtered.filter((d) => favorites.has(d.id)) : filtered;
  }, [filters, favoritesOnly, favorites]);

  const shown = results.slice(0, visible);
  const isFiltered = favoritesOnly || JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  // 現在の条件（キーワード以外）を、1行にまとめる
  const summary = [
    filters.category !== "all" && CATEGORY_LABELS[filters.category],
    filters.level !== "all" && LEVEL_LABELS[filters.level],
    filters.players !== "all" && PLAYER_TEXT[String(filters.players)],
    favoritesOnly && "お気に入り",
  ].filter(Boolean);

  return (
    <>
      <section aria-label="練習メニューの検索" className="flex flex-col gap-3">
        <div>
          <label htmlFor="drill-query" className="sr-only">
            キーワード検索
          </label>
          <input
            id="drill-query"
            type="search"
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            placeholder="キーワード（例：ハイクリア、ネット前）"
            className="min-h-14 w-full rounded-xl border-2 border-slate-400 bg-white px-4 text-base text-slate-900 outline-none placeholder:text-slate-500 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/30 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400"
          />
        </div>

        {/* 条件は折りたたんでおき、最初の画面から、メニューが見えるようにする */}
        <div className="flex items-stretch gap-2">
          <button
            type="button"
            aria-expanded={panelOpen}
            aria-controls="filter-panel"
            onClick={() => setPanelOpen((v) => !v)}
            className="flex min-h-14 flex-1 items-center justify-between gap-3 rounded-xl border-2 border-slate-400 bg-white px-4 text-left text-base font-bold text-slate-900 active:scale-[0.99] dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100"
          >
            <span className="min-w-0">
              <span className="block text-sm text-slate-600 dark:text-slate-400">条件</span>
              <span className="block truncate">{summary.length > 0 ? summary.join("・") : "すべて"}</span>
            </span>
            <span className="shrink-0 text-emerald-800 dark:text-emerald-300">
              {panelOpen ? "閉じる ▲" : "変更 ▼"}
            </span>
          </button>
          {isFiltered && (
            <button
              type="button"
              onClick={() => commit({ filters: { ...DEFAULT_FILTERS, query: filters.query }, favoritesOnly: false, visible: PAGE_SIZE })}
              className="min-h-14 shrink-0 rounded-xl border-2 border-slate-400 px-4 text-base font-bold text-slate-900 active:scale-95 dark:border-slate-500 dark:text-slate-100"
            >
              リセット
            </button>
          )}
        </div>

        {panelOpen && (
          <div
            id="filter-panel"
            className="flex flex-col gap-5 rounded-xl border-2 border-slate-300 bg-white p-4 dark:border-slate-600 dark:bg-slate-900"
          >
            <DrillFilterPanel
              filters={filters}
              onChange={setFilters}
              favoritesOnly={favoritesOnly}
              favoriteCount={favorites.size}
              onToggleFavoritesOnly={() => setFavoritesOnly(!favoritesOnly)}
            />
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              className="min-h-14 rounded-xl bg-emerald-700 text-base font-bold text-white active:scale-[0.99] dark:bg-emerald-400 dark:text-slate-950"
            >
              {results.length}件を見る
            </button>
          </div>
        )}
      </section>

      <h2 aria-live="polite" className="mt-6 mb-3 text-base font-bold text-slate-700 dark:text-slate-300">
        {results.length}件の練習メニュー
        {results.length > shown.length && `（${shown.length}件を表示中）`}
      </h2>

      {shown.length > 0 ? (
        <ul className="flex flex-col gap-3 sm:grid sm:grid-cols-2">
          {shown.map((drill) => (
            <li key={drill.id}>
              <DrillCard
                drill={drill}
                isFavorite={favorites.has(drill.id)}
                onToggleFavorite={() => toggle(drill.id)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-400 p-8 text-center text-base text-slate-700 dark:border-slate-600 dark:text-slate-300">
          {favoritesOnly && favorites.size === 0
            ? "まだお気に入りがありません。カードの ☆ をタップして追加できます。"
            : "条件に合う練習メニューがありません。条件を変えてみてください。"}
        </div>
      )}

      {results.length > shown.length && (
        <button
          type="button"
          onClick={() => commit({ ...view, visible: visible + PAGE_SIZE })}
          className="mt-4 min-h-14 w-full rounded-xl border-2 border-emerald-700 text-base font-bold text-emerald-800 active:scale-[0.99] dark:border-emerald-400 dark:text-emerald-300"
        >
          さらに{Math.min(PAGE_SIZE, results.length - shown.length)}件を表示
        </button>
      )}
    </>
  );
}
