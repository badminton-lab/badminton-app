import type { Category, Drill, Level } from "./types";
import { CATEGORY_LABELS, COURT_TYPE_LABELS, LEVEL_LABELS } from "./types";
import { enrichments } from "./enrichments";
import { applyOverrides } from "./overrides";
import { baseDrills } from "./menus/base";
import { drillDrills } from "./menus/drill";
import {
  footworkFormDrills,
  handFeedFormDrills,
  patternFormDrills,
  playFormDrills,
  warmupFormDrills,
} from "./menus/formDrills";
import { footworkDrills } from "./menus/footwork";
import { handFeedDrills } from "./menus/handFeed";
import { patternDrills } from "./menus/pattern";
import { playDrills } from "./menus/play";
import { racketFeedDrills } from "./menus/racketFeed";
import { stretchDrills } from "./menus/stretch";
import { warmupDrills } from "./menus/warmup";

export * from "./types";

const menus: Drill[] = [
  ...baseDrills,
  ...patternDrills,
  ...handFeedDrills,
  ...racketFeedDrills,
  ...drillDrills,
  ...footworkDrills,
  ...warmupDrills,
  ...stretchDrills,
  ...playDrills,
  // 1人・少人数でできるフォーム・ショット・反応の基礎練習（各区分へ追加。id は wx/fx/hx/px/yx）
  ...warmupFormDrills,
  ...footworkFormDrills,
  ...handFeedFormDrills,
  ...patternFormDrills,
  ...playFormDrills,
];

/** menus/*.ts の元データに、enrichments.ts の深掘りを足したもの（開発用エディタの上書き前） */
export const rawDrills: Drill[] = menus.map((d) => ({ ...d, ...enrichments[d.id] }));

/** 表示に使うデータ（開発用エディタの上書きを適用済み） */
export const drills: Drill[] = applyOverrides(rawDrills);

/** 人数フィルター: "all" または人数。4 は「4人以上」として扱う。 */
export type PlayerFilter = "all" | 1 | 2 | 3 | 4;

export type DrillFilters = {
  query: string;
  category: Category | "all";
  level: Level | "all";
  players: PlayerFilter;
};

export const DEFAULT_FILTERS: DrillFilters = {
  query: "",
  category: "all",
  level: "all",
  players: "all",
};

function matchesPlayers(drill: Drill, players: PlayerFilter): boolean {
  if (players === "all") return true;
  // 4人以上: 4人以上で実施できるメニュー
  if (players === 4) return drill.maxPlayers >= 4;
  return drill.minPlayers <= players && players <= drill.maxPlayers;
}

export function filterDrills(list: Drill[], filters: DrillFilters): Drill[] {
  const keywords = filters.query.toLowerCase().split(/[\s　]+/).filter(Boolean);

  return list.filter((drill) => {
    if (filters.category !== "all" && drill.category !== filters.category) return false;
    if (filters.level !== "all" && drill.level !== filters.level) return false;
    if (!matchesPlayers(drill, filters.players)) return false;

    const haystack = [
      drill.title,
      drill.description,
      drill.feedPattern,
      ...drill.coachingPoints,
      CATEGORY_LABELS[drill.category],
      LEVEL_LABELS[drill.level],
      COURT_TYPE_LABELS[drill.courtType],
    ]
      .join(" ")
      .toLowerCase();
    return keywords.every((k) => haystack.includes(k));
  });
}
