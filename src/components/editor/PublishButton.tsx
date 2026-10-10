"use client";

import { useCallback, useEffect, useState } from "react";

const API = "/api/dev/publish";

type Status = { branch?: string; changed?: string[]; unpushed?: number; error?: string };

const btn =
  "min-h-10 rounded-md border-2 border-emerald-700 bg-white px-3 text-sm font-bold text-emerald-900 hover:bg-emerald-50 disabled:opacity-40 dark:border-emerald-400 dark:bg-slate-900 dark:text-emerald-200 dark:hover:bg-slate-800";

/**
 * 「公開する」ボタン。編集したデータ（overrides.json・content.json）を、コミットしてプッシュする。
 * 保存ボタンとは別。押すと、確認してから実行する。
 */
export default function PublishButton({ refreshKey }: { refreshKey?: unknown }) {
  const [status, setStatus] = useState<Status | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(API);
      setStatus(await res.json());
    } catch {
      setStatus({ error: "状態を取得できませんでした" });
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 保存のたびに、未公開の変更を読み直す
    void load();
  }, [load, refreshKey]);

  const pending = (status?.changed?.length ?? 0) + (status?.unpushed ?? 0);

  const publish = async () => {
    const files = status?.changed ?? [];
    const lines = [
      "編集した内容を、コミットして、プッシュします（公開サイトに反映されます）。",
      "",
      files.length > 0 ? `対象：${files.join("、")}` : `未プッシュのコミットが ${status?.unpushed} 件あります。`,
      "",
      "メモ（任意。コミットメッセージに添えます）：",
    ];
    const note = prompt(lines.join("\n"), "");
    if (note === null) return; // キャンセル
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ note }) });
      const data = await res.json();
      setStatus(data);
      setMessage(res.ok && data.ok ? { text: data.message } : { text: data.error ?? "公開できませんでした", error: true });
    } catch {
      setMessage({ text: "公開できませんでした（開発サーバーが動いているか確認してください）", error: true });
    } finally {
      setBusy(false);
    }
  };

  return (
    <span className="flex flex-wrap items-center gap-2">
      {message && (
        <span role="status" className={`max-w-sm text-xs font-bold ${message.error ? "text-rose-700 dark:text-rose-300" : "text-emerald-800 dark:text-emerald-300"}`}>
          {message.text}
        </span>
      )}
      {status?.error && !message && <span className="text-xs text-slate-500">{status.error}</span>}
      <button type="button" className={btn} disabled={busy || !status || !!status.error || pending === 0} onClick={() => void publish()} title="編集した内容を、コミットして、プッシュします">
        {busy ? "公開中…" : pending > 0 ? `公開する（未公開 ${pending}）` : "公開する（変更なし）"}
      </button>
    </span>
  );
}
