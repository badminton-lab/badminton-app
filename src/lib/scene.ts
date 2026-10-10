import type { ColorName, PropKind, Scene, ScenePart } from "@/data/types";

/** 場面図の大きさ（座標の範囲） */
export const SCENE_SIZE = { width: 320, height: 200 } as const;
/** コートの白い線の範囲 */
export const COURT_BOX = { x: 16, y: 22, w: 288, h: 160 } as const;

export const FLOOR_COLORS = { wood: "#e8d5b0", plain: "#f1f5f9" } as const;

export const PROP_LABELS: Record<PropKind, string> = {
  tail: "しっぽ",
  balloon: "風船",
  racket: "ラケット",
  shuttle: "シャトル",
  ball: "ボール",
  cone: "コーン",
  hoop: "フープ・的",
  treasure: "宝",
  flag: "旗",
  basket: "カゴ",
};

/** 道具ごとの、初期の色 */
export const PROP_DEFAULT_COLOR: Partial<Record<PropKind, ColorName>> = {
  tail: "yellow",
  balloon: "red",
  ball: "yellow",
  cone: "orange",
  hoop: "red",
  treasure: "yellow",
  flag: "red",
  basket: "gray",
};

export type NewScenePartType = ScenePart["type"];

export const SCENE_PART_LABELS: Record<NewScenePartType, string> = {
  token: "コマ（人）",
  zone: "エリア",
  line: "ライン",
  arrow: "矢印",
  text: "文字",
  bubble: "吹き出し",
  prop: "道具",
};

let counter = 0;
export function newSceneId(parts: ScenePart[], prefix: string): string {
  const used = new Set(parts.map((p) => p.id));
  let id = "";
  do {
    counter += 1;
    id = `${prefix}${counter}`;
  } while (used.has(id));
  return id;
}

/** 種類ごとの、初期の部品（位置 x, y に置く） */
export function makeScenePart(type: NewScenePartType, id: string, x: number, y: number, kind: PropKind = "ball"): ScenePart {
  switch (type) {
    case "token":
      return { id, type, x, y, color: "blue", label: "" };
    case "zone":
      return { id, type, x: x - 40, y: y - 30, w: 80, h: 60, color: "blue", label: "" };
    case "line":
      return { id, type, x1: x - 50, y1: y, x2: x + 50, y2: y, color: "red", width: 4 };
    case "arrow":
      return { id, type, x1: x - 30, y1: y, x2: x + 30, y2: y, color: "dark" };
    case "text":
      return { id, type, x, y, text: "文字", size: 12, color: "dark" };
    case "bubble":
      return { id, type, x, y, text: "合図", size: 12, color: "dark" };
    case "prop":
      return { id, type, kind, x, y, color: PROP_DEFAULT_COLOR[kind] };
  }
}

export const EMPTY_SCENE: Scene = { parts: [], floor: "wood", court: true };
