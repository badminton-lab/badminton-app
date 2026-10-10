"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { CATEGORY_LABELS, LEVEL_LABELS, drills, type Drill } from "@/data/drills";
import { useFavorites } from "@/lib/favorites";
import { DEFAULT_PLAN_MINUTES, FEED_HEADING, estimateMinutes, playersLabel } from "@/lib/drillText";
import { usePlan } from "@/lib/plan";
import CourtDiagram from "./CourtDiagram";
import IllustrationView from "./IllustrationView";
import SceneView from "./SceneView";

const byId = new Map(drills.map((d) => [d.id, d]));

const btn =
  "flex min-h-12 items-center justify-center rounded-xl border-2 px-4 text-base font-bold active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40";
const plain =
  "border-slate-400 bg-white text-slate-900 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100";

function formatMinutes(total: number): string {
  if (total < 60) return `${total}分`;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m === 0 ? `${h}時間` : `${h}時間${m}分`;
}

const noopSubscribe = () => () => {};

export default function PlanApp() {
  const { plan, add, remove, setMinutes, move, setTitle, setNote, setTarget, clear } = usePlan();
  const { favorites } = useFavorites();
  const [message, setMessage] = useState<string | null>(null);
  const origin = useSyncExternalStore(noopSubscribe, () => window.location.origin, () => "");
  const canShare = useSyncExternalStore(noopSubscribe, () => "share" in navigator, () => false);

  const items = useMemo(
    () =>
      plan.items.flatMap((it) => {
        const drill = byId.get(it.id);
        return drill ? [{ ...it, drill }] : [];
      }),
    [plan.items],
  );
  const total = items.reduce((sum, it) => sum + it.minutes, 0);
  const remaining = plan.targetMinutes > 0 ? plan.targetMinutes - total : null;
  const candidates = [...favorites].map((id) => byId.get(id)).filter((d): d is Drill => !!d && !plan.items.some((i) => i.id === d.id));

  const planText = () => {
    const lines: string[] = [`【練習プラン】${plan.title || "今日の練習"}`, `合計 ${formatMinutes(total)}`, ""];
    items.forEach((it, i) => {
      lines.push(`${i + 1}. ${it.drill.title}（${it.minutes}分）`);
      lines.push(`   ${it.drill.feedPattern}`);
      if (origin) lines.push(`   ${origin}/menu/${it.drill.id}`);
      lines.push("");
    });
    if (plan.note.trim()) lines.push(`メモ：${plan.note.trim()}`);
    return lines.join("\n").trim();
  };

  const flash = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 2500);
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(planText());
      flash("プランをコピーしました");
    } catch {
      flash("コピーできませんでした");
    }
  };

  const shareText = async () => {
    try {
      await navigator.share({ title: plan.title || "練習プラン", text: planText() });
    } catch {
      // 共有をキャンセルしたときは、何もしない
    }
  };

  if (items.length === 0 && candidates.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-slate-400 p-6 text-center dark:border-slate-600">
        <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
          まだ、プランにメニューがありません。メニューのページで「今日のプランに追加」を押すと、ここに並びます。
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex min-h-14 items-center justify-center rounded-xl bg-emerald-700 px-6 text-base font-bold text-white dark:bg-emerald-400 dark:text-slate-950"
        >
          練習メニューを探す
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* ───── 画面での操作 ───── */}
      <div className="flex flex-col gap-4 print:hidden">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <div>
            <label htmlFor="plan-title" className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-300">
              プランの名前
            </label>
            <input
              id="plan-title"
              value={plan.title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例：土曜・中学生12人"
              className="min-h-14 w-full rounded-xl border-2 border-slate-400 bg-white px-4 text-base text-slate-900 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/30 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label htmlFor="plan-target" className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-300">
              練習時間の目標（分）
            </label>
            <input
              id="plan-target"
              type="number"
              inputMode="numeric"
              min={0}
              max={600}
              value={plan.targetMinutes || ""}
              onChange={(e) => setTarget(Math.max(0, Number(e.target.value) || 0))}
              placeholder="例：120"
              className="min-h-14 w-full rounded-xl border-2 border-slate-400 bg-white px-4 text-base text-slate-900 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/30 sm:w-40 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div
          aria-live="polite"
          className="rounded-xl bg-emerald-100 p-4 text-base font-bold text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100"
        >
          合計 {formatMinutes(total)}（{items.length}件）
          {remaining !== null && (
            <span className={remaining < 0 ? "ml-2 text-rose-700 dark:text-rose-300" : "ml-2"}>
              {remaining >= 0 ? `目標まで あと${formatMinutes(remaining)}` : `目標を ${formatMinutes(-remaining)} 超えています`}
            </span>
          )}
        </div>

        <ol className="flex flex-col gap-3">
          {items.map((it, i) => (
            <li
              key={it.id}
              className="rounded-xl border-2 border-slate-300 bg-white p-4 dark:border-slate-600 dark:bg-slate-900"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-base font-bold text-white dark:bg-emerald-400 dark:text-slate-950">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <Link href={`/menu/${it.id}`} className="text-lg font-bold leading-snug underline-offset-4 hover:underline">
                    {it.drill.title}
                  </Link>
                  <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                    {CATEGORY_LABELS[it.drill.category]}・{LEVEL_LABELS[it.drill.level]}・{playersLabel(it.drill)}・目安 {it.drill.duration}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button type="button" aria-label={`${it.drill.title}の時間を5分減らす`} onClick={() => setMinutes(it.id, it.minutes - 5)} className={`${btn} w-16 shrink-0 whitespace-nowrap ${plain}`}>
                  −5
                </button>
                <label className="flex items-center gap-1 text-base font-bold">
                  <span className="sr-only">{it.drill.title}の時間（分）</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={240}
                    value={it.minutes}
                    onChange={(e) => setMinutes(it.id, Number(e.target.value) || 1)}
                    className="min-h-12 w-20 rounded-xl border-2 border-slate-400 bg-white px-2 text-center text-lg text-slate-900 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100"
                  />
                  分
                </label>
                <button type="button" aria-label={`${it.drill.title}の時間を5分増やす`} onClick={() => setMinutes(it.id, it.minutes + 5)} className={`${btn} w-16 shrink-0 whitespace-nowrap ${plain}`}>
                  +5
                </button>

                <span className="ml-auto flex gap-2">
                  <button type="button" aria-label="1つ上へ" disabled={i === 0} onClick={() => move(it.id, -1)} className={`${btn} w-12 ${plain}`}>
                    ▲
                  </button>
                  <button type="button" aria-label="1つ下へ" disabled={i === items.length - 1} onClick={() => move(it.id, 1)} className={`${btn} w-12 ${plain}`}>
                    ▼
                  </button>
                  <button type="button" aria-label={`${it.drill.title}をプランから外す`} onClick={() => remove(it.id)} className={`${btn} px-3 text-rose-700 dark:text-rose-300 ${plain}`}>
                    外す
                  </button>
                </span>
              </div>
            </li>
          ))}
        </ol>

        {candidates.length > 0 && (
          <section className="rounded-xl border-2 border-slate-300 p-4 dark:border-slate-600">
            <h2 className="mb-2 text-base font-bold">お気に入りから追加</h2>
            <ul className="flex flex-col gap-2">
              {candidates.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-3">
                  <span className="min-w-0 text-base">{d.title}</span>
                  <button
                    type="button"
                    onClick={() => add(d.id, estimateMinutes(d.duration) ?? DEFAULT_PLAN_MINUTES)}
                    className={`${btn} shrink-0 ${plain}`}
                  >
                    ＋追加
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div>
          <label htmlFor="plan-note" className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-300">
            メモ（印刷や共有にも入ります）
          </label>
          <textarea
            id="plan-note"
            rows={3}
            value={plan.note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="例：シャトル2缶、コーン10個。最後にミニゲーム。"
            className="w-full rounded-xl border-2 border-slate-400 bg-white p-4 text-base text-slate-900 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/30 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        {items.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => window.print()} className={`${btn} flex-1 bg-emerald-700 text-white border-emerald-700 dark:bg-emerald-400 dark:text-slate-950 dark:border-emerald-400`}>
              印刷・PDFで保存
            </button>
            <button type="button" onClick={copyText} className={`${btn} flex-1 ${plain}`}>
              テキストをコピー
            </button>
            {canShare && (
              <button type="button" onClick={shareText} className={`${btn} flex-1 ${plain}`}>
                共有…
              </button>
            )}
            <a
              href={`https://line.me/R/msg/text/?${encodeURIComponent(planText())}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btn} flex-1 ${plain}`}
            >
              LINEで送る
            </a>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("プランのメニューを、すべて外しますか？（お気に入りは残ります）")) clear();
              }}
              className={`${btn} text-rose-700 dark:text-rose-300 ${plain}`}
            >
              プランをクリア
            </button>
          </div>
        )}
        <p role="status" className="min-h-6 text-base font-bold text-emerald-800 dark:text-emerald-300">
          {message}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          プランは、この端末のブラウザに保存されます（他の端末とは共有されません）。
        </p>
      </div>

      {/* ───── 印刷用（画面では非表示） ───── */}
      <div className="hidden print:block">
        <h1 className="text-2xl font-bold">{plan.title || "今日の練習プラン"}</h1>
        <p className="mt-1 text-base">
          合計 {formatMinutes(total)}（{items.length}件）
        </p>
        <ol className="mt-4 flex flex-col gap-4">
          {items.map((it, i) => (
            <li key={it.id} className="break-inside-avoid border-t-2 border-slate-400 pt-3">
              <div className="flex gap-4">
                {it.drill.diagram && (
                  <CourtDiagram
                    courtType={it.drill.courtType}
                    diagram={it.drill.diagram}
                    className="h-40 w-auto shrink-0 rounded"
                  />
                )}
                {!it.drill.diagram && it.drill.scene && (
                  <SceneView scene={it.drill.scene} label={`${it.drill.title}の場面図`} className="h-32 w-auto shrink-0 rounded border border-slate-300" />
                )}
                {!it.drill.diagram && !it.drill.scene && it.drill.illustration && (
                  <IllustrationView
                    illustration={it.drill.illustration}
                    label={`${it.drill.title}のイメージ図`}
                    className="h-32 w-auto shrink-0 rounded border border-slate-300"
                  />
                )}
                <div className="min-w-0 flex-1 text-sm leading-relaxed">
                  <h2 className="text-lg font-bold">
                    {i + 1}. {it.drill.title}（{it.minutes}分）
                  </h2>
                  <p className="text-xs">
                    {CATEGORY_LABELS[it.drill.category]}・{LEVEL_LABELS[it.drill.level]}・{playersLabel(it.drill)}
                  </p>
                  <p className="mt-1">
                    <b>{FEED_HEADING[it.drill.category]}：</b>
                    {it.drill.feedPattern}
                  </p>
                  <p className="mt-1 font-bold">指導のコツ</p>
                  <ul className="list-disc pl-5">
                    {it.drill.coachingPoints.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
        {plan.note.trim() && (
          <p className="mt-4 whitespace-pre-wrap border-t-2 border-slate-400 pt-3 text-sm">
            <b>メモ：</b>
            {plan.note}
          </p>
        )}
      </div>
    </div>
  );
}
