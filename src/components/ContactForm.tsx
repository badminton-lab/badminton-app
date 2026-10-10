"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

const KINDS = ["内容の誤りのご指摘", "追加してほしい練習・機能", "ご意見・ご感想", "その他"] as const;

const field =
  "w-full rounded-xl border-2 border-slate-400 bg-white px-4 py-3 text-base text-slate-900 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/30 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100";

/**
 * お問い合わせフォーム。送信先（Formspree など）に、JSON で送る。
 * 送信先のURLは、サイト設定（contactFormEndpoint）で決める。
 */
export default function ContactForm({ endpoint }: { endpoint: string }) {
  const params = useSearchParams();
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    // 迷惑メール対策の、見えない欄。入力されていたら、送らずに、完了のふりをする
    if (data.get("_gotcha")) {
      setState("done");
      return;
    }
    setState("sending");
    try {
      const res = await fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p role="status" className="rounded-xl border-2 border-emerald-700 bg-emerald-100 p-4 text-base font-bold text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100">
        送信しました。ありがとうございます。すべてのご連絡に、返信できるとは限りません。あらかじめご了承ください。
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-base font-bold">種類</span>
        <select name="種類" className={field} defaultValue={KINDS[0]}>
          {KINDS.map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-base font-bold">
          該当するページ・メニュー名 <span className="text-sm font-normal text-slate-600 dark:text-slate-400">（任意）</span>
        </span>
        <input name="該当ページ" maxLength={200} defaultValue={params.get("page") ?? ""} className={field} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-base font-bold">
          内容 <span className="text-rose-700 dark:text-rose-300">（必須）</span>
        </span>
        <textarea name="内容" required rows={6} maxLength={2000} className={field} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-base font-bold">
          返信先のメールアドレス <span className="text-sm font-normal text-slate-600 dark:text-slate-400">（返信が必要な場合のみ）</span>
        </span>
        <input name="email" type="email" maxLength={200} autoComplete="email" className={field} />
      </label>
      {/* 迷惑メール対策（人には見えない） */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          空のままにしてください
          <input name="_gotcha" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state === "error" && (
        <p role="alert" className="rounded-lg bg-rose-100 p-3 text-base font-bold text-rose-900 dark:bg-rose-950 dark:text-rose-100">
          送信できませんでした。時間をおいて、もう一度お試しください。
        </p>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="min-h-14 rounded-xl bg-emerald-700 px-6 text-base font-bold text-white disabled:opacity-60 dark:bg-emerald-400 dark:text-slate-950"
      >
        {state === "sending" ? "送信中…" : "送信する"}
      </button>
    </form>
  );
}
