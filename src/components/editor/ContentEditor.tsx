"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { COLLECTIONS, SHUTTLE_POINTS_LABEL, SITE_FIELDS, type Collection, type Field } from "@/data/contentSchema";

const API = "/api/dev/content";

type Item = Record<string, unknown>;
type State = { base: Record<string, unknown>; saved: Record<string, unknown> };
type TabKey = Collection["key"] | "shuttlePoints" | "site";

const TABS: { key: TabKey; label: string; page: string }[] = [
  ...COLLECTIONS.map((c) => ({ key: c.key as TabKey, label: c.label, page: c.page })),
  { key: "shuttlePoints", label: SHUTTLE_POINTS_LABEL, page: "/trivia#shuttle-numbers" },
  { key: "site", label: "サイト設定（運営者・連絡先）", page: "/about" },
];

const btn =
  "min-h-10 rounded-md border border-slate-400 bg-white px-3 text-sm font-medium text-slate-900 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700";
const primary =
  "min-h-10 rounded-md bg-emerald-700 px-4 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-40 dark:bg-emerald-500 dark:text-slate-950";
const input =
  "w-full rounded border border-slate-400 bg-white px-2 py-1.5 text-sm dark:border-slate-500 dark:bg-slate-900";

const same = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
const asArray = (v: unknown): Item[] => (Array.isArray(v) ? (v as Item[]) : []);

function FieldInput({ f, value, onChange }: { f: Field; value: unknown; onChange: (v: unknown) => void }) {
  const label = (
    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
      {f.label}
      {f.required && <span className="text-rose-600"> *</span>}
      {f.hint && <span className="ml-2 font-normal text-slate-600 dark:text-slate-400">{f.hint}</span>}
    </span>
  );
  if (f.kind === "bool")
    return (
      <label className="flex items-center gap-2 text-sm font-bold">
        <input type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5" />
        <span>
          {f.label}
          {f.hint && <span className="ml-2 text-xs font-normal text-slate-600 dark:text-slate-400">{f.hint}</span>}
        </span>
      </label>
    );
  if (f.kind === "select")
    return (
      <label className="flex flex-col gap-1">
        {label}
        <select value={typeof value === "string" ? value : ""} onChange={(e) => onChange(e.target.value)} className={input}>
          {Object.entries(f.options ?? {}).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </label>
    );
  if (f.kind === "area")
    return (
      <label className="flex flex-col gap-1">
        {label}
        <textarea rows={4} value={typeof value === "string" ? value : ""} onChange={(e) => onChange(e.target.value)} className={input} />
      </label>
    );
  if (f.kind === "lines")
    return (
      <label className="flex flex-col gap-1">
        {label}
        <textarea
          rows={Math.min(10, Math.max(3, (Array.isArray(value) ? value.length : 0) + 1))}
          value={Array.isArray(value) ? (value as string[]).join("\n") : ""}
          onChange={(e) => onChange(e.target.value.split("\n"))}
          className={input}
        />
      </label>
    );
  if (f.kind === "links") {
    const links = (Array.isArray(value) ? value : []) as { label: string; href: string }[];
    const set = (i: number, c: Partial<{ label: string; href: string }>) =>
      onChange(links.map((l, j) => (j === i ? { ...l, ...c } : l)));
    return (
      <div className="flex flex-col gap-1">
        {label}
        {links.map((l, i) => (
          <div key={i} className="flex flex-wrap gap-2">
            <input placeholder="表示する文字" value={l.label} onChange={(e) => set(i, { label: e.target.value })} className={`${input} min-w-0 flex-1`} />
            <input placeholder="https://… または /rules" value={l.href} onChange={(e) => set(i, { href: e.target.value })} className={`${input} min-w-0 flex-1`} />
            <button type="button" className={btn} onClick={() => onChange(links.filter((_, j) => j !== i))}>削除</button>
          </div>
        ))}
        <button type="button" className={`${btn} self-start`} onClick={() => onChange([...links, { label: "", href: "" }])}>
          ＋リンクを追加
        </button>
      </div>
    );
  }
  return (
    <label className="flex flex-col gap-1">
      {label}
      <input value={typeof value === "string" ? value : ""} onChange={(e) => onChange(e.target.value)} className={input} />
    </label>
  );
}

function nextId(prefix: string, items: Item[]): string {
  const used = new Set(items.map((i) => String(i.id)));
  for (let n = items.length + 1; ; n++) {
    const id = `${prefix}${String(n).padStart(2, "0")}`;
    if (!used.has(id)) return id;
  }
}

export default function ContentEditor() {
  const [state, setState] = useState<State | null>(null);
  const [tab, setTab] = useState<TabKey>("rules");
  const [drafts, setDrafts] = useState<Record<string, unknown>>({});
  const [index, setIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(API);
    if (res.ok) setState(await res.json());
  }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 初回の読み込み
    void load();
  }, [load]);

  if (!state) return <p className="p-6">読み込み中…</p>;

  const effective = (key: TabKey): unknown => state.saved[key] ?? state.base[key];
  const draft = (key: TabKey): unknown => (key in drafts ? drafts[key] : effective(key));
  const dirty = (key: TabKey) => key in drafts && !same(drafts[key], effective(key));
  const setDraft = (key: TabKey, v: unknown) => setDrafts((d) => ({ ...d, [key]: v }));
  const dropDraft = (key: TabKey) =>
    setDrafts((d) => {
      const n = { ...d };
      delete n[key];
      return n;
    });

  const save = async (key: TabKey, value: unknown) => {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(API, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, value }) });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.error ?? "保存できませんでした", error: true });
        return;
      }
      setState(data);
      dropDraft(key);
      setMessage({ text: value === null ? "元の内容に戻しました" : "保存しました" });
    } catch {
      setMessage({ text: "保存できませんでした（開発サーバーが動いているか確認してください）", error: true });
    } finally {
      setBusy(false);
    }
  };

  const tabInfo = TABS.find((t) => t.key === tab)!;
  const col = COLLECTIONS.find((c) => c.key === tab);
  const hasSaved = tab in state.saved;

  const switchTab = (k: TabKey) => {
    setTab(k);
    setIndex(0);
    setQuery("");
    setMessage(null);
  };

  let body: React.ReactNode;
  if (col) {
    const items = asArray(draft(tab));
    const cur = items[Math.min(index, items.length - 1)];
    const curIndex = cur ? items.indexOf(cur) : -1;
    const q = query.trim();
    const visible = items.map((it, i) => ({ it, i })).filter(({ it }) => !q || JSON.stringify(it).includes(q));
    const setItems = (next: Item[]) => setDraft(tab, next);
    const update = (c: Item) => setItems(items.map((it, i) => (i === curIndex ? { ...it, ...c } : it)));
    const add = () => {
      const blank: Item = col.idPrefix ? { id: nextId(col.idPrefix, items) } : {};
      for (const f of col.fields) {
        if (f.kind === "select") blank[f.key] = Object.keys(f.options ?? {})[0];
        else if (f.kind === "lines") blank[f.key] = [];
        else if (f.kind === "links") blank[f.key] = [];
        else blank[f.key] = "";
      }
      setItems([...items, blank]);
      setIndex(items.length);
      setQuery("");
    };
    const move = (d: -1 | 1) => {
      const j = curIndex + d;
      if (curIndex < 0 || j < 0 || j >= items.length) return;
      const next = [...items];
      [next[curIndex], next[j]] = [next[j], next[curIndex]];
      setItems(next);
      setIndex(j);
    };
    const remove = () => {
      if (curIndex < 0) return;
      if (!confirm(`「${String(cur[col.titleKey] ?? "")}」を削除しますか？（保存するまでは、「変更を破棄」で戻せます）`)) return;
      setItems(items.filter((_, i) => i !== curIndex));
      setIndex(Math.max(0, curIndex - 1));
    };
    body = (
      <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input placeholder="検索" value={query} onChange={(e) => setQuery(e.target.value)} className={input} />
            <button type="button" className={`${primary} shrink-0 whitespace-nowrap`} onClick={add}>＋追加</button>
          </div>
          <ol className="max-h-[60vh] overflow-y-auto rounded-lg border border-slate-300 text-sm dark:border-slate-600">
            {visible.map(({ it, i }) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`w-full px-3 py-2 text-left ${i === curIndex ? "bg-emerald-100 font-bold dark:bg-emerald-950" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                >
                  {col.idPrefix && <span className="mr-2 text-xs text-slate-500">{String(it.id)}</span>}
                  {String(it[col.titleKey] ?? "") || "（無題）"}
                </button>
              </li>
            ))}
            {visible.length === 0 && <li className="p-3 text-slate-600">該当なし</li>}
          </ol>
          <p className="text-xs text-slate-600 dark:text-slate-400">{items.length}件</p>
        </div>
        {cur ? (
          <div className="flex flex-col gap-3 rounded-lg border border-slate-300 p-4 dark:border-slate-600">
            <div className="flex flex-wrap items-center gap-2">
              {col.idPrefix && <span className="text-xs text-slate-500">id: {String(cur.id)}</span>}
              <span className="ml-auto flex gap-2">
                <button type="button" className={btn} disabled={curIndex === 0} onClick={() => move(-1)}>↑ 上へ</button>
                <button type="button" className={btn} disabled={curIndex === items.length - 1} onClick={() => move(1)}>↓ 下へ</button>
                <button type="button" className={`${btn} text-rose-700 dark:text-rose-300`} onClick={remove}>削除</button>
              </span>
            </div>
            {col.fields.map((f) => (
              <FieldInput key={`${curIndex}-${f.key}`} f={f} value={cur[f.key]} onChange={(v) => update({ [f.key]: v })} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-slate-400 p-6 text-sm">項目がありません。「＋追加」で作ります。</p>
        )}
      </div>
    );
  } else if (tab === "shuttlePoints") {
    body = (
      <div className="max-w-3xl">
        <FieldInput
          f={{ key: "p", label: SHUTTLE_POINTS_LABEL, kind: "lines", hint: "1行に1項目" }}
          value={draft(tab)}
          onChange={(v) => setDraft(tab, v)}
        />
      </div>
    );
  } else {
    const site = (draft("site") ?? {}) as Item;
    body = (
      <div className="flex max-w-3xl flex-col gap-3">
        {SITE_FIELDS.map((f) => (
          <FieldInput key={f.key} f={f} value={site[f.key]} onChange={(v) => setDraft("site", { ...site, [f.key]: v })} />
        ))}
        <p className="text-xs text-slate-600 dark:text-slate-400">
          公開URLは、ここではなく、環境変数 NEXT_PUBLIC_SITE_URL で設定します（README 参照）。
        </p>
      </div>
    );
  }

  const isDirty = dirty(tab);
  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-20 flex flex-wrap items-center gap-2 border-b border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
        <h1 className="mr-2 text-base font-bold">サイトの内容を編集（開発用）</h1>
        <Link href="/editor" className={`${btn} inline-flex items-center`}>← メニューの編集</Link>
        <span className="ml-auto flex flex-wrap items-center gap-2">
          {message && (
            <span role="status" className={`text-sm font-bold ${message.error ? "text-rose-700 dark:text-rose-300" : "text-emerald-800 dark:text-emerald-300"}`}>
              {message.text}
            </span>
          )}
          <a href={tabInfo.page} target="_blank" rel="noreferrer" className={`${btn} inline-flex items-center`}>ページを開く ↗</a>
          <button type="button" className={btn} disabled={!isDirty || busy} onClick={() => dropDraft(tab)}>変更を破棄</button>
          <button
            type="button"
            className={btn}
            disabled={!hasSaved || busy}
            onClick={() => {
              if (confirm("この項目を、ソースコードに書かれた元の内容に戻しますか？（編集で保存した内容は消えます）")) void save(tab, null);
            }}
          >
            元の内容に戻す
          </button>
          <button type="button" className={primary} disabled={!isDirty || busy} onClick={() => void save(tab, draft(tab))}>
            保存
          </button>
        </span>
      </header>

      <nav className="flex flex-wrap gap-2 border-b border-slate-300 px-4 py-3 dark:border-slate-700" aria-label="編集する内容">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => switchTab(t.key)}
            className={`min-h-10 rounded-full border-2 px-4 text-sm font-bold ${t.key === tab ? "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-slate-950" : "border-slate-400 bg-white dark:border-slate-500 dark:bg-slate-900"}`}
          >
            {t.label}
            {dirty(t.key) && <span aria-label="未保存" className="ml-1 text-amber-400">●</span>}
          </button>
        ))}
      </nav>

      <main className="p-4">{body}</main>
    </div>
  );
}
