"use client";

import { useCallback, useSyncExternalStore } from "react";
import { createLocalStore } from "./localStore";

const EMPTY: ReadonlySet<string> = new Set();

const store = createLocalStore<ReadonlySet<string>>(
  "badminton-drill-favorites",
  (raw) => {
    if (!raw) return EMPTY;
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed)
        ? new Set(parsed.filter((v): v is string => typeof v === "string"))
        : EMPTY;
    } catch {
      return EMPTY;
    }
  },
  EMPTY,
);

export function useFavorites() {
  const favorites = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  const toggle = useCallback((id: string) => {
    const next = new Set(store.getSnapshot());
    if (!next.delete(id)) next.add(id);
    store.write(JSON.stringify([...next]));
  }, []);

  return { favorites, toggle };
}
