/**
 * localStorage を useSyncExternalStore で読むための小さなストア。
 * サーバー描画時は serverValue を返すため、ハイドレーション不一致が起きない。
 * 他のタブでの変更（storage イベント）も反映される。
 */
export function createLocalStore<T>(
  key: string,
  parse: (raw: string | null) => T,
  serverValue: T,
) {
  const listeners = new Set<() => void>();
  let cachedRaw: string | null | undefined;
  let cachedValue = serverValue;

  function getSnapshot(): T {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(key);
    } catch {
      // ストレージが使えない環境（プライベートモード等）では既定値のまま動かす
    }
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedValue = parse(raw);
    }
    return cachedValue;
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key || e.key === null) listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  function write(raw: string) {
    try {
      localStorage.setItem(key, raw);
    } catch {
      // 保存できなくても、このセッション中は表示を更新する
      cachedRaw = raw;
      cachedValue = parse(raw);
    }
    listeners.forEach((l) => l());
  }

  return { getSnapshot, getServerSnapshot: () => serverValue, subscribe, write };
}
