"use client";

import { useMemo, useState } from "react";
import {
  DEFAULT_FILTERS,
  drills,
  filterDrills,
  type Drill,
  type DrillFilters,
} from "@/data/drills";
import { useFavorites } from "@/lib/favorites";
import DrillDetailModal from "./DrillDetailModal";
import DrillCard from "./DrillCard";
import DrillFilterPanel from "./DrillFilterPanel";

export default function DrillBrowser() {
  const [filters, setFilters] = useState<DrillFilters>(DEFAULT_FILTERS);

  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selected, setSelected] = useState<Drill | null>(null);
  const { favorites, toggle } = useFavorites();

  const results = useMemo(() => {
    const filtered = filterDrills(drills, filters);
    return favoritesOnly ? filtered.filter((d) => favorites.has(d.id)) : filtered;
  }, [filters, favoritesOnly, favorites]);
  const isFiltered =
    favoritesOnly || JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  return (
    <>
      <DrillFilterPanel
        filters={filters}
        onChange={setFilters}
        favoritesOnly={favoritesOnly}
        favoriteCount={favorites.size}
        onToggleFavoritesOnly={() => setFavoritesOnly((v) => !v)}
        onReset={() => {
          setFilters(DEFAULT_FILTERS);
          setFavoritesOnly(false);
        }}
        isFiltered={isFiltered}
      />

      <p aria-live="polite" className="mt-6 mb-3 text-base font-bold text-slate-700 dark:text-slate-300">
        {results.length}件の練習メニュー
      </p>

      {results.length > 0 ? (
        <ul className="flex flex-col gap-3 sm:grid sm:grid-cols-2">
          {results.map((drill) => (
            <li key={drill.id}>
              <DrillCard
                drill={drill}
                isFavorite={favorites.has(drill.id)}
                onToggleFavorite={() => toggle(drill.id)}
                onSelect={setSelected}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-400 p-8 text-center text-slate-700 dark:border-slate-600 dark:text-slate-300">
          {favoritesOnly && favorites.size === 0
            ? "まだお気に入りがありません。カードの ☆ をタップして追加できます。"
            : "条件に合う練習メニューがありません。条件を変えてみてください。"}
        </div>
      )}

      {selected && (
        <DrillDetailModal
          drill={selected}
          isFavorite={favorites.has(selected.id)}
          onToggleFavorite={() => toggle(selected.id)}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
