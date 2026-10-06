"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  COURT_TYPE_LABELS,
  LEVEL_LABELS,
  drills,
  rawDrills,
  type Category,
  type CourtType,
  type Drill,
  type DrillDiagram,
  type Level,
} from "@/data/drills";
import { stable } from "@/data/overrides";
import DrillCard from "../DrillCard";
import DiagramEditor from "./DiagramEditor";

const API = "/api/dev/overrides";

type History = { past: Drill[]; future: Drill[] };
const HISTORY_LIMIT = 100;
/** 同じ項目の連続入力は、この時間内なら1回の操作として履歴にまとめる */
const COALESCE_MS = 1000;

/** 保存・比較用に整える（前後の空白や空行を取り除く） */
function normalize(d: Drill): Drill {
  return {
    ...d,
    title: d.title.trim(),
    description: d.description.trim(),
    duration: d.duration.trim(),
    feedPattern: d.feedPattern.trim(),
    shots: d.shots?.trim() || undefined,
    coachingPoints: d.coachingPoints.map((s) => s.trim()).filter(Boolean),
  };
}

const field =
  "w-full rounded-md border border-slate-400 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/30 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-bold text-slate-700 dark:text-slate-300">
      {label}
      {children}
    </label>
  );
}

export default function EditorApp() {
  const [saved, setSaved] = useState<Record<string, Drill>>(() =>
    Object.fromEntries(drills.map((d) => [d.id, d])),
  );
  const [drafts, setDrafts] = useState<Record<string, Drill>>({});
  const [selectedId, setSelectedId] = useState(drills[0].id);
  const [overrideIds, setOverrideIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  // 元に戻す／やり直し用の履歴（メニューごと）
  const [history, setHistory] = useState<Record<string, History>>({});
  const lastEdit = useRef<{ id: string; key: string; at: number } | null>(null);
  // 「図を表示しない」にしたとき、チェックを戻したら復元できるよう図を退避しておく
  const diagramStash = useRef<Record<string, DrillDiagram>>({});

  const isDirty = (id: string) => id in drafts && stable(normalize(drafts[id])) !== stable(normalize(saved[id]));
  const dirtyIds = Object.keys(drafts).filter(isDirty);
  const current = drafts[selectedId] ?? saved[selectedId];
  const dirty = isDirty(selectedId);

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then((o: Record<string, unknown>) => setOverrideIds(new Set(Object.keys(o))))
      .catch(() => setStatus({ ok: false, text: "保存済みデータの読み込みに失敗しました" }));
  }, []);

  // 未保存の変更があるままタブを閉じようとしたら警告する
  const hasDirty = dirtyIds.length > 0;
  useEffect(() => {
    if (!hasDirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [hasDirty]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return drills.filter(
      (d) =>
        (categoryFilter === "all" || d.category === categoryFilter) &&
        (!q || (d.title + d.id).toLowerCase().includes(q)),
    );
  }, [query, categoryFilter]);

  const update = (patch: Partial<Drill>) =>
    setDrafts((prev) => ({ ...prev, [selectedId]: { ...(prev[selectedId] ?? saved[selectedId]), ...patch } }));

  const dropDraft = (id: string) =>
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

  const clearHistory = (id: string) =>
    setHistory((h) => {
      const next = { ...h };
      delete next[id];
      return next;
    });

  /** 変更の直前の状態を履歴に積む。key が同じ連続入力はまとめる。 */
  const checkpoint = (key?: string) => {
    const now = Date.now();
    const last = lastEdit.current;
    if (key && last && last.id === selectedId && last.key === key && now - last.at < COALESCE_MS) {
      lastEdit.current = { ...last, at: now };
      return;
    }
    lastEdit.current = key ? { id: selectedId, key, at: now } : null;
    const snapshot = current;
    setHistory((h) => {
      const cur = h[selectedId] ?? { past: [], future: [] };
      return { ...h, [selectedId]: { past: [...cur.past, snapshot].slice(-HISTORY_LIMIT), future: [] } };
    });
  };

  /** フォーム入力用: 履歴に積んでから更新する */
  const edit = (patch: Partial<Drill>) => {
    checkpoint(Object.keys(patch)[0]);
    update(patch);
  };

  const toggleDiagram = (on: boolean) => {
    checkpoint();
    if (on) {
      update({ diagram: diagramStash.current[selectedId] ?? { players: [], arrows: [] } });
    } else {
      if (current.diagram) diagramStash.current[selectedId] = current.diagram;
      update({ diagram: undefined });
    }
  };

  const undo = () => {
    const h = history[selectedId];
    if (!h || h.past.length === 0) return;
    lastEdit.current = null;
    setHistory((all) => ({
      ...all,
      [selectedId]: { past: h.past.slice(0, -1), future: [current, ...h.future] },
    }));
    setDrafts((d) => ({ ...d, [selectedId]: h.past[h.past.length - 1] }));
  };

  const redo = () => {
    const h = history[selectedId];
    if (!h || h.future.length === 0) return;
    lastEdit.current = null;
    setHistory((all) => ({
      ...all,
      [selectedId]: { past: [...h.past, current], future: h.future.slice(1) },
    }));
    setDrafts((d) => ({ ...d, [selectedId]: h.future[0] }));
  };

  // Ctrl/Cmd+Z で元に戻す、Ctrl/Cmd+Shift+Z または Ctrl+Y でやり直し。
  // 入力欄の中でもこちらの履歴を使う（ブラウザ標準の取り消しとの二重実行を避ける）。
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.isComposing || !(e.ctrlKey || e.metaKey) || e.altKey) return;
      const key = e.key.toLowerCase();
      if (key === "z" && !e.shiftKey) undo();
      else if ((key === "z" && e.shiftKey) || key === "y") redo();
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  async function request(init: RequestInit, url = API) {
    setBusy(true);
    try {
      const res = await fetch(url, init);
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "保存に失敗しました");
      setOverrideIds(new Set(Object.keys(body)));
      return true;
    } catch (e) {
      setStatus({ ok: false, text: e instanceof Error ? e.message : "保存に失敗しました" });
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    const next = normalize(current);
    const ok = await request({
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedId, drill: next }),
    });
    if (!ok) return;
    setSaved((s) => ({ ...s, [selectedId]: next }));
    dropDraft(selectedId);
    setStatus({ ok: true, text: `「${next.title}」を保存しました（src/data/overrides.json）` });
  }

  async function resetToDefault() {
    if (!confirm("このメニューの編集内容をすべて捨てて、元のデータに戻しますか？")) return;
    const ok = await request({ method: "DELETE" }, `${API}?id=${encodeURIComponent(selectedId)}`);
    if (!ok) return;
    const raw = rawDrills.find((d) => d.id === selectedId)!;
    setSaved((s) => ({ ...s, [selectedId]: raw }));
    dropDraft(selectedId);
    clearHistory(selectedId);
    setStatus({ ok: true, text: "元のデータに戻しました" });
  }

  const preview = normalize(current);
  const canUndo = (history[selectedId]?.past.length ?? 0) > 0;
  const canRedo = (history[selectedId]?.future.length ?? 0) > 0;
  const btnPlain = "border-slate-400 bg-white text-slate-900 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100";
  const btn =
    "min-h-10 rounded-md border px-4 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex min-h-screen flex-col lg:h-screen lg:flex-row">
      {/* 左: メニュー一覧 */}
      <aside className="flex max-h-72 shrink-0 flex-col border-b-2 border-slate-300 lg:max-h-none lg:w-72 lg:border-r-2 lg:border-b-0 dark:border-slate-700">
        <div className="flex flex-col gap-2 p-3">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-bold">メニュー編集（開発用）</h1>
            <Link href="/" className="text-xs font-bold text-emerald-800 underline dark:text-emerald-300">
              アプリへ
            </Link>
          </div>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="タイトル・IDで検索" className={field} />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as Category | "all")} className={field}>
            <option value="all">すべての区分（{drills.length}）</option>
            {CATEGORY_ORDER.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}（{drills.filter((d) => d.category === c).length}）
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            未保存 {dirtyIds.length} 件 / 編集済み {overrideIds.size} 件
          </p>
        </div>
        <ul className="flex-1 overflow-y-auto">
          {list.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => setSelectedId(d.id)}
                className={`flex w-full flex-col gap-0.5 border-t border-slate-200 px-3 py-2 text-left text-sm dark:border-slate-800 ${
                  d.id === selectedId ? "bg-emerald-100 dark:bg-emerald-950" : "hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                <span className="font-bold">{(drafts[d.id] ?? saved[d.id]).title}</span>
                <span className="flex flex-wrap gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {d.id} ・ {CATEGORY_LABELS[(drafts[d.id] ?? saved[d.id]).category]}
                  {isDirty(d.id) && <b className="text-amber-700 dark:text-amber-300">● 未保存</b>}
                  {overrideIds.has(d.id) && !isDirty(d.id) && <b className="text-emerald-700 dark:text-emerald-300">編集済み</b>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* 右: 編集 */}
      <main className="flex min-w-0 flex-1 flex-col lg:overflow-y-auto">
        <div className="sticky top-0 z-20 flex flex-wrap items-center gap-2 border-b-2 border-slate-300 bg-white/95 px-4 py-2 backdrop-blur dark:border-slate-700 dark:bg-slate-950/95">
          <span className="mr-auto text-sm font-bold">
            {current.id}：{current.title}
          </span>
          {status && (
            <span className={`text-sm font-bold ${status.ok ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}`}>
              {status.text}
            </span>
          )}
          <button type="button" disabled={!canUndo} onClick={undo} title="元に戻す（Ctrl+Z）" className={`${btn} ${btnPlain}`}>
            ↶ 元に戻す
          </button>
          <button type="button" disabled={!canRedo} onClick={redo} title="やり直し（Ctrl+Shift+Z / Ctrl+Y）" className={`${btn} ${btnPlain}`}>
            ↷ やり直し
          </button>
          <button type="button" disabled={busy || !overrideIds.has(selectedId)} onClick={resetToDefault} title="保存済みの編集をすべて捨てて、元のデータに戻します" className={`${btn} ${btnPlain}`}>
            初期データに戻す
          </button>
          <button type="button" disabled={!dirty} onClick={() => { dropDraft(selectedId); clearHistory(selectedId); }} title="未保存の変更を捨てて、最後に保存した状態に戻します" className={`${btn} ${btnPlain}`}>
            変更を破棄
          </button>
          <button type="button" disabled={busy || !dirty} onClick={save} className={`${btn} border-emerald-700 bg-emerald-700 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-slate-950`}>
            保存
          </button>
        </div>

        <div className="grid gap-6 p-4 xl:grid-cols-2">
          {/* コート図 + プレビュー */}
          <section className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-bold">コート図</h2>
              <label className="flex items-center gap-2 text-sm font-bold">
                <input
                  type="checkbox"
                  checked={current.diagram !== undefined}
                  onChange={(e) => toggleDiagram(e.target.checked)}
                  className="h-5 w-5"
                />
                このメニューでコート図を使用する
              </label>
            </div>
            {current.diagram ? (
              <DiagramEditor key={selectedId} courtType={current.courtType} diagram={current.diagram} onChange={(diagram) => update({ diagram })} onCheckpoint={checkpoint} />
            ) : (
              <p className="rounded-lg border border-dashed border-slate-400 p-4 text-sm text-slate-700 dark:border-slate-600 dark:text-slate-300">
                コート図は使用しません（カードにもモーダルにも表示されません）。チェックを入れると、直前の図が復元されます。
              </p>
            )}
            <h2 className="text-sm font-bold">カードのプレビュー</h2>
            <div className="max-w-md">
              <DrillCard drill={preview} isFavorite={false} onToggleFavorite={() => {}} onSelect={() => {}} />
            </div>
          </section>

          {/* 文面 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-bold">文面</h2>
            <Field label="タイトル">
              <input value={current.title} onChange={(e) => edit({ title: e.target.value })} className={field} />
            </Field>
            <Field label="説明">
              <textarea value={current.description} rows={3} onChange={(e) => edit({ description: e.target.value })} className={field} />
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="区分">
                <select value={current.category} onChange={(e) => edit({ category: e.target.value as Category })} className={field}>
                  {CATEGORY_ORDER.map((c) => (
                    <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                  ))}
                </select>
              </Field>
              <Field label="レベル">
                <select value={current.level} onChange={(e) => edit({ level: e.target.value as Level })} className={field}>
                  {(Object.keys(LEVEL_LABELS) as Level[]).map((l) => (
                    <option key={l} value={l}>{LEVEL_LABELS[l]}</option>
                  ))}
                </select>
              </Field>
              <Field label="種目">
                <select value={current.courtType} onChange={(e) => edit({ courtType: e.target.value as CourtType })} className={field}>
                  {(Object.keys(COURT_TYPE_LABELS) as CourtType[]).map((c) => (
                    <option key={c} value={c}>{COURT_TYPE_LABELS[c]}</option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="最小人数">
                <input type="number" min={1} value={current.minPlayers} onChange={(e) => edit({ minPlayers: Number(e.target.value) })} className={field} />
              </Field>
              <Field label="最大人数">
                <input type="number" min={1} value={current.maxPlayers} onChange={(e) => edit({ maxPlayers: Number(e.target.value) })} className={field} />
              </Field>
            </div>
            <Field label="推奨時間">
              <input value={current.duration} onChange={(e) => edit({ duration: e.target.value })} className={field} />
            </Field>
            <Field label="推奨球数・回数（任意）">
              <input value={current.shots ?? ""} onChange={(e) => edit({ shots: e.target.value })} className={field} />
            </Field>
            <Field label="球出し・進め方">
              <textarea value={current.feedPattern} rows={3} onChange={(e) => edit({ feedPattern: e.target.value })} className={field} />
            </Field>
            <Field label="指導のコツ・着眼点（1行に1項目）">
              <textarea value={current.coachingPoints.join("\n")} rows={6} onChange={(e) => edit({ coachingPoints: e.target.value.split("\n") })} className={field} />
            </Field>
          </section>
        </div>
      </main>
    </div>
  );
}
