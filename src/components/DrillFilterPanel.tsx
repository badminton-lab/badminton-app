"use client";

import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  LEVEL_HELP,
  LEVEL_LABELS,
  type Category,
  type DrillFilters,
  type Level,
  type PlayerFilter,
} from "@/data/drills";

type Option<T> = { value: T; label: string };

const categoryOptions: Option<DrillFilters["category"]>[] = [
  { value: "all", label: "すべて" },
  ...CATEGORY_ORDER.map((c) => ({ value: c as Category, label: CATEGORY_LABELS[c] })),
];

const levelOptions: Option<DrillFilters["level"]>[] = [
  { value: "all", label: "すべて" },
  ...(Object.keys(LEVEL_LABELS) as Level[]).map((l) => ({ value: l, label: LEVEL_LABELS[l] })),
];

const playerOptions: Option<PlayerFilter>[] = [
  { value: "all", label: "指定なし" },
  { value: 1, label: "1人" },
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
      <legend className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">{legend}</legend>
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

/** 絞り込みの選択肢（区分・レベル・人数・お気に入り）。キーワード欄は DrillBrowser 側にある。 */
export default function DrillFilterPanel({
  filters,
  onChange,
  favoritesOnly,
  favoriteCount,
  onToggleFavoritesOnly,
}: {
  filters: DrillFilters;
  onChange: (filters: DrillFilters) => void;
  favoritesOnly: boolean;
  favoriteCount: number;
  onToggleFavoritesOnly: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <ChipGroup
        legend="区分"
        options={categoryOptions}
        value={filters.category}
        onChange={(category) => onChange({ ...filters, category })}
      />

      <div>
        <ChipGroup
          legend="レベル"
          options={levelOptions}
          value={filters.level}
          onChange={(level) => onChange({ ...filters, level })}
        />
        <details className="mt-2 text-sm text-slate-700 dark:text-slate-300">
          <summary className="min-h-10 cursor-pointer py-2 font-bold">レベルの目安を見る</summary>
          <ul className="flex flex-col gap-1 pb-1 pl-1">
            {(Object.keys(LEVEL_LABELS) as Level[]).map((l) => (
              <li key={l}>
                <b>{LEVEL_LABELS[l]}</b>：{LEVEL_HELP[l]}
              </li>
            ))}
          </ul>
        </details>
      </div>

      <ChipGroup
        legend="人数"
        options={playerOptions}
        value={filters.players}
        onChange={(players) => onChange({ ...filters, players })}
      />

      {/* お気に入りが1件もないときは、場所をとらないよう表示しない */}
      {(favoriteCount > 0 || favoritesOnly) && (
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
      )}
    </div>
  );
}
