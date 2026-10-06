import type { Drill, DrillDiagram } from "./types";
import overridesJson from "./overrides.json";

/**
 * 開発用エディタ（/editor）で保存した、メニューごとの上書きデータ。
 * 元データ（menus/*.ts）に対する差分だけを overrides.json に持つ。
 * null は「その項目を削除する」（shots・diagram を消す場合）。
 */
export const EDITABLE_KEYS = [
  "title",
  "description",
  "minPlayers",
  "maxPlayers",
  "level",
  "category",
  "courtType",
  "duration",
  "shots",
  "feedPattern",
  "coachingPoints",
  "diagram",
] as const;

export type EditableKey = (typeof EDITABLE_KEYS)[number];

export type DrillOverride = {
  [K in EditableKey]?: Drill[K] | null;
};

export const overrides = overridesJson as unknown as Record<string, DrillOverride>;

export function applyOverrides(list: Drill[]): Drill[] {
  return list.map((drill) => {
    const o = overrides[drill.id];
    if (!o) return drill;
    const next: Record<string, unknown> = { ...drill };
    for (const key of EDITABLE_KEYS) {
      if (!(key in o)) continue;
      if (o[key] === null) delete next[key];
      else next[key] = o[key];
    }
    return next as Drill;
  });
}

/** キー順に依存しない比較用の文字列化 */
export function stable(value: unknown): string {
  return JSON.stringify(value, (_k, v) =>
    v && typeof v === "object" && !Array.isArray(v)
      ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b)))
      : v,
  );
}

/** 要素が1つも無い図は「図なし」として扱う */
export function normalizeDiagram(d: DrillDiagram | undefined): DrillDiagram | undefined {
  if (!d) return undefined;
  return (d.players?.length ?? 0) + (d.arrows?.length ?? 0) > 0 ? d : undefined;
}
