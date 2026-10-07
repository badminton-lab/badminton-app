"use client";

import { useCallback, useSyncExternalStore } from "react";
import { createLocalStore } from "./localStore";

export type PlanItem = { id: string; minutes: number };
export type Plan = {
  title: string;
  /** 練習の目標時間（分）。0 は未設定 */
  targetMinutes: number;
  items: PlanItem[];
  note: string;
};

const EMPTY: Plan = { title: "", targetMinutes: 0, items: [], note: "" };

function parse(raw: string | null): Plan {
  if (!raw) return EMPTY;
  try {
    const v: unknown = JSON.parse(raw);
    if (!v || typeof v !== "object") return EMPTY;
    const o = v as Record<string, unknown>;
    const items = Array.isArray(o.items)
      ? o.items.flatMap((it): PlanItem[] => {
          if (!it || typeof it !== "object") return [];
          const { id, minutes } = it as Record<string, unknown>;
          return typeof id === "string" && typeof minutes === "number" && Number.isFinite(minutes)
            ? [{ id, minutes: Math.min(240, Math.max(1, Math.round(minutes))) }]
            : [];
        })
      : [];
    return {
      title: typeof o.title === "string" ? o.title : "",
      targetMinutes: typeof o.targetMinutes === "number" && o.targetMinutes > 0 ? Math.min(600, Math.round(o.targetMinutes)) : 0,
      items,
      note: typeof o.note === "string" ? o.note : "",
    };
  } catch {
    return EMPTY;
  }
}

const store = createLocalStore<Plan>("badminton-drill-plan", parse, EMPTY);

/** 今日の練習プラン。この端末のブラウザ（localStorage）に保存される。 */
export function usePlan() {
  const plan = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  const save = useCallback((next: Plan) => store.write(JSON.stringify(next)), []);
  const current = () => store.getSnapshot();

  return {
    plan,
    has: (id: string) => plan.items.some((i) => i.id === id),
    add: (id: string, minutes: number) => {
      const p = current();
      if (p.items.some((i) => i.id === id)) return;
      save({ ...p, items: [...p.items, { id, minutes }] });
    },
    remove: (id: string) => {
      const p = current();
      save({ ...p, items: p.items.filter((i) => i.id !== id) });
    },
    setMinutes: (id: string, minutes: number) => {
      const p = current();
      const m = Math.min(240, Math.max(1, Math.round(minutes)));
      save({ ...p, items: p.items.map((i) => (i.id === id ? { ...i, minutes: m } : i)) });
    },
    /** 並び順を、delta（-1 で1つ上、+1 で1つ下）だけ動かす */
    move: (id: string, delta: -1 | 1) => {
      const p = current();
      const i = p.items.findIndex((x) => x.id === id);
      const j = i + delta;
      if (i < 0 || j < 0 || j >= p.items.length) return;
      const items = [...p.items];
      [items[i], items[j]] = [items[j], items[i]];
      save({ ...p, items });
    },
    setTitle: (title: string) => save({ ...current(), title }),
    setNote: (note: string) => save({ ...current(), note }),
    setTarget: (targetMinutes: number) => save({ ...current(), targetMinutes }),
    clear: () => save({ ...current(), items: [] }),
  };
}
