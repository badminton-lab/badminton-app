"use client";

import {
  CATEGORY_LABELS,
  LEVEL_LABELS,
  type Category,
  type DrillFilters,
  type Level,
  type PlayerFilter,
} from "@/data/drills";

type Option<T> = { value: T; label: string };

const categoryOptions: Option<DrillFilters["category"]>[] = [
  { value: "all", label: "すべて" },
  ...(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => ({
    value: c,
    label: CATEGORY_LABELS[c],
  })),
];

const levelOptions: Option<DrillFilters["level"]>[] = [
  { value: "all", label: "すべて" },
  ...(Object.keys(LEVEL_LABELS) as Level[]).map((l) => ({
    value: l,
    label: LEVEL_LABELS[l],
  })),
];

const playerOptions: Option<PlayerFilter>[] = [
  { value: "all", label: "指定なし" },
  { value: 2, label: "2人" },
  { value: 3, label: "3人" },
  { value: 4, label: "4人以上" },
];

// 体育館の照明下でも見えるよう、枠線を太く・文字色を濃く。選択中は色だけでなく ✓ でも示す。
const chipBase =
  "min-h-12 rounded-full border-2 px-4 text-base font-bold transition-colors active:scale-95";
const chipOn =
  "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-slate-950";
const chipOff =
  "border-slate-400 bg-white text-slate-900 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100";

function ChipGroup<T extends string | number>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">
        {legend}
      </legend>
      {/* 横スクロールではなく折り返しにして、全選択肢を親指で押せる範囲に出す */}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <button
              key={String(opt.value)}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(opt.value)}
              className={`${chipBase} ${selected ? chipOn : chipOff}`}
            >
              {selected && <span aria-hidden="true">✓ </span>}
              {opt.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function DrillFilterPanel({
  filters,
  onChange,
  favoritesOnly,
  favoriteCount,
  onToggleFavoritesOnly,
  onReset,
  isFiltered,
}: {
  filters: DrillFilters;
  onChange: (filters: DrillFilters) => void;
  favoritesOnly: boolean;
  favoriteCount: number;
  onToggleFavoritesOnly: () => void;
  onReset: () => void;
  isFiltered: boolean;
}) {
  return (
    <section aria-label="絞り込み" className="flex flex-col gap-5">
      <div>
        <label htmlFor="drill-query" className="sr-only">
          キーワード検索
        </label>
        <input
          id="drill-query"
          type="search"
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          placeholder="キーワード（例：ハイクリア、ネット前）"
          className="min-h-14 w-full rounded-xl border-2 border-slate-400 bg-white px-4 text-base text-slate-900 outline-none placeholder:text-slate-500 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/30 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400"
        />
      </div>

      <button
        type="button"
        aria-pressed={favoritesOnly}
        onClick={onToggleFavoritesOnly}
        className={`flex min-h-14 items-center justify-center gap-2 rounded-xl border-2 text-base font-bold active:scale-[0.98] ${
          favoritesOnly
            ? "border-amber-500 bg-amber-400 text-slate-950"
            : "border-slate-400 bg-white text-slate-900 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100"
        }`}
      >
        <span aria-hidden="true">{favoritesOnly ? "★" : "☆"}</span>
        お気に入りだけ表示（{favoriteCount}）
      </button>

      <ChipGroup
        legend="カテゴリー"
        options={categoryOptions}
        value={filters.category}
        onChange={(category) => onChange({ ...filters, category })}
      />
      <ChipGroup
        legend="対象レベル"
        options={levelOptions}
        value={filters.level}
        onChange={(level) => onChange({ ...filters, level })}
      />
      <ChipGroup
        legend="人数"
        options={playerOptions}
        value={filters.players}
        onChange={(players) => onChange({ ...filters, players })}
      />

      {isFiltered && (
        <button
          type="button"
          onClick={onReset}
          className="min-h-12 self-start rounded-full px-2 text-base font-bold text-emerald-800 underline underline-offset-4 dark:text-emerald-300"
        >
          絞り込みをクリア
        </button>
      )}
    </section>
  );
}
