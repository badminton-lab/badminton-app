"use client";

import { useSyncExternalStore } from "react";

/**
 * 画面の状態（絞り込み条件など）を、URLのクエリ文字列に持たせる。
 * - ブラウザの「戻る」「進む」や、URLの共有・ブックマークでも、同じ状態が再現される。
 * - サーバー描画時は空の状態（既定値）で描画し、ハイドレーション後にURLの内容を反映する。
 */
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("popstate", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("popstate", listener);
  };
}

const getSearch = () => window.location.search;
const getServerSearch = () => "";

/** 現在のクエリ文字列（先頭の ? を含む）。URLが変わると再描画される */
export function useSearch(): string {
  return useSyncExternalStore(subscribe, getSearch, getServerSearch);
}

/** 履歴を増やさずに、クエリ文字列を置き換える */
export function replaceSearch(params: URLSearchParams) {
  const qs = params.toString();
  const url = window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash;
  window.history.replaceState(null, "", url);
  listeners.forEach((l) => l());
}
