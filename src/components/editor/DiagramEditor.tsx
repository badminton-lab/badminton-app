"use client";

import { useEffect, useRef, useState } from "react";
import CourtDiagram, { courtToSvg, courtViewBox, svgToCourt, type Orientation } from "../CourtDiagram";
import { PLAYER_HIT, settleArrows, snapOut, svgDist } from "./arrowSnap";
import type { CourtType, DiagramArrow, DiagramPlayer, DrillDiagram, Point } from "@/data/types";

type Tool = "select" | "player" | "feeder" | "opponent" | "shot" | "move";
type Selection = { kind: "player" | "arrow"; i: number } | null;
/** 選手にくっついている矢印の端（ドラッグ開始時の位置つき） */
type Link = { i: number; end: "from" | "to"; origin: Point };
type Drag =
  | { kind: "player"; i: number; origin: Point; links: Link[] }
  | { kind: "arrow"; i: number; end: "from" | "to" }
  | { kind: "new-arrow"; arrowKind: "shot" | "move"; from: Point; to: Point }
  | null;

const TOOLS: { value: Tool; label: string; hint: string }[] = [
  { value: "select", label: "選択・移動", hint: "ドラッグで移動" },
  { value: "player", label: "＋練習者", hint: "クリックで配置" },
  { value: "feeder", label: "＋ノッカー", hint: "クリックで配置" },
  { value: "opponent", label: "＋相手", hint: "クリックで配置" },
  { value: "shot", label: "＋シャトル軌道", hint: "ドラッグで矢印" },
  { value: "move", label: "＋選手の移動", hint: "ドラッグで矢印" },
];

const ROLE_LABELS: Record<NonNullable<DiagramPlayer["role"]>, string> = {
  player: "練習者",
  feeder: "ノッカー",
  opponent: "相手",
};

const SELECTED_STROKE = "#fde047";

/** 矢印の端が選手の中心からこの距離（SVG単位）以内なら「くっついている」とみなす */
const ATTACH_DISTANCE = 5.5;

const clamp01 = (v: number) => Math.round(Math.min(1, Math.max(0, v)) * 1000) / 1000;

export default function DiagramEditor({
  courtType,
  diagram,
  orientation,
  onChange,
  onCheckpoint,
}: {
  courtType: CourtType;
  /** 編集中は向きを固定する（ドラッグ中に図が回転しないように） */
  orientation: Orientation;
  diagram: DrillDiagram | undefined;
  onChange: (diagram: DrillDiagram) => void;
  /** 変更の直前に呼ぶ（元に戻す用の履歴を積む）。key が同じ連続操作はまとめられる */
  onCheckpoint: (key?: string) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const VIEWBOX = courtViewBox(orientation);
  const toSvg = (p: Point) => courtToSvg(p, orientation);
  const [tool, setTool] = useState<Tool>("select");
  const [selection, setSelection] = useState<Selection>(null);
  const [drag, setDrag] = useState<Drag>(null);
  const [linkArrows, setLinkArrows] = useState(true);
  // ドラッグ中、最初に動いた瞬間に1回だけ履歴を積むためのフラグ
  const movedRef = useRef(false);

  const players = diagram?.players ?? [];
  const arrows = diagram?.arrows ?? [];
  const emit = (p: DiagramPlayer[], a: DiagramArrow[]) => onChange({ players: p, arrows: a });

  const removeSelected = () => {
    if (!selection) return;
    onCheckpoint();
    if (selection.kind === "player") emit(players.filter((_, i) => i !== selection.i), arrows);
    else emit(players, arrows.filter((_, i) => i !== selection.i));
    setSelection(null);
  };

  // Delete / Backspace で選択中の要素を削除（入力欄にフォーカスがあるときは無効）
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (!selection) return;
      e.preventDefault();
      removeSelected();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const toCourt = (e: React.PointerEvent<SVGSVGElement>): Point | null => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(ctm.inverse());
    return svgToCourt(p.x, p.y, orientation);
  };

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const p = toCourt(e);
    if (!p) return;
    e.currentTarget.setPointerCapture(e.pointerId);

    // 既存の要素（ハンドル）はどのツールでも掴んで動かせる
    const handle = (e.target as Element).closest<SVGElement>("[data-handle]");
    if (handle) {
      const i = Number(handle.dataset.i);
      movedRef.current = false;
      if (handle.dataset.kind === "player") {
        const q = players[i];
        const qs = toSvg(q);
        const links: Link[] = linkArrows
          ? arrows.flatMap((a, ai) =>
              (["from", "to"] as const)
                .filter((end) => {
                  const as = toSvg(a[end]);
                  return Math.hypot(as.x - qs.x, as.y - qs.y) <= ATTACH_DISTANCE;
                })
                .map((end) => ({ i: ai, end, origin: a[end] })),
            )
          : [];
        setSelection({ kind: "player", i });
        setDrag({ kind: "player", i, origin: { x: q.x, y: q.y }, links });
      } else {
        setSelection({ kind: "arrow", i });
        setDrag({ kind: "arrow", i, end: handle.dataset.end as "from" | "to" });
      }
      return;
    }

    if (tool === "select") {
      setSelection(null);
    } else if (tool === "shot" || tool === "move") {
      setDrag({ kind: "new-arrow", arrowKind: tool, from: p, to: p });
    } else {
      const label =
        tool === "player"
          ? String(players.filter((q) => (q.role ?? "player") === "player").length + 1)
          : tool === "feeder"
            ? "ノ"
            : "";
      onCheckpoint();
      const nextPlayers = [...players, { ...p, label, role: tool }];
      emit(nextPlayers, settleArrows([nextPlayers[nextPlayers.length - 1]], arrows));
      setSelection({ kind: "player", i: players.length });
    }
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const p = toCourt(e);
    if (!p) return;
    if (drag.kind === "player") {
      if (!movedRef.current) {
        movedRef.current = true;
        onCheckpoint();
      }
      // くっついている矢印の端は、選手と同じだけ動かす
      const dx = p.x - drag.origin.x;
      const dy = p.y - drag.origin.y;
      const nextArrows = arrows.map((a, ai) => {
        const links = drag.links.filter((l) => l.i === ai);
        if (links.length === 0) return a;
        const next = { ...a };
        for (const l of links) next[l.end] = { x: clamp01(l.origin.x + dx), y: clamp01(l.origin.y + dy) };
        return next;
      });
      emit(players.map((q, i) => (i === drag.i ? { ...q, ...p } : q)), nextArrows);
    } else if (drag.kind === "arrow") {
      if (!movedRef.current) {
        movedRef.current = true;
        onCheckpoint();
      }
      // 選手の円に重なったら、円の外ギリギリに付ける（隠れて掴めなくなるのを防ぐ）
      const other = arrows[drag.i][drag.end === "from" ? "to" : "from"];
      const snapped = snapOut(p, other, players);
      emit(players, arrows.map((a, i) => (i === drag.i ? { ...a, [drag.end]: snapped } : a)));
    } else {
      setDrag({ ...drag, to: p });
    }
  };

  const onPointerUp = () => {
    if (drag?.kind === "player") {
      // 選手を置いた先で矢印の端と重なっていたら、その選手の円の外へ出す
      const q = players[drag.i];
      if (q) {
        const settled = settleArrows([q], arrows);
        if (JSON.stringify(settled) !== JSON.stringify(arrows)) emit(players, settled);
      }
    }
    if (drag?.kind === "new-arrow") {
      const len = Math.hypot((drag.to.x - drag.from.x) * 2, drag.to.y - drag.from.y);
      if (len > 0.06) {
        onCheckpoint();
        const from = snapOut(drag.from, drag.to, players);
        const to = snapOut(drag.to, drag.from, players);
        emit(players, [...arrows, { from, to, kind: drag.arrowKind }]);
        setSelection({ kind: "arrow", i: arrows.length });
      }
    }
    setDrag(null);
  };

  const flip = (axis: "x" | "y") => {
    onCheckpoint();
    const f = (p: Point): Point => ({ ...p, [axis]: Math.round((1 - p[axis]) * 1000) / 1000 });
    emit(
      players.map((q) => ({ ...q, ...f(q) })),
      arrows.map((a) => ({ ...a, from: f(a.from), to: f(a.to) })),
    );
  };

  const hiddenUnderPlayer = (p: Point) => players.some((q) => svgDist(p, q) < PLAYER_HIT);

  /** 矢印の線（選択時の強調）と両端のハンドル。covered: 選手の円に隠れている端のハンドルだけ描くか */
  const renderArrows = (covered: boolean) =>
    arrows.map((a, i) => {
      const sel = selection?.kind === "arrow" && selection.i === i;
      const from = toSvg(a.from);
      const to = toSvg(a.to);
      const fill = sel ? SELECTED_STROKE : "rgba(255,255,255,0.35)";
      return (
        <g key={i} className="cursor-grab">
          {sel && !covered && (
            <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={SELECTED_STROKE} strokeWidth={0.5} strokeDasharray="1 1" />
          )}
          {hiddenUnderPlayer(a.from) === covered && (
            <rect data-handle data-kind="arrow" data-i={i} data-end="from" x={from.x - 1.8} y={from.y - 1.8} width={3.6} height={3.6} fill={fill} stroke="#0f172a" strokeWidth={0.4} />
          )}
          {hiddenUnderPlayer(a.to) === covered && (
            <circle data-handle data-kind="arrow" data-i={i} data-end="to" cx={to.x} cy={to.y} r={2.2} fill={fill} stroke="#0f172a" strokeWidth={0.4} />
          )}
        </g>
      );
    });

  const selectedPlayer = selection?.kind === "player" ? players[selection.i] : undefined;
  const selectedArrow = selection?.kind === "arrow" ? arrows[selection.i] : undefined;

  const btn =
    "min-h-9 rounded-md border border-slate-400 bg-white px-3 text-sm font-medium text-slate-900 hover:bg-slate-100 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2" role="toolbar" aria-label="作図ツール">
        {TOOLS.map((t) => (
          <button
            key={t.value}
            type="button"
            aria-pressed={tool === t.value}
            title={t.hint}
            onClick={() => setTool(t.value)}
            className={`min-h-9 rounded-md border px-3 text-sm font-bold ${
              tool === t.value
                ? "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-slate-950"
                : "border-slate-400 bg-white text-slate-900 hover:bg-slate-100 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        className="relative mx-auto max-w-full select-none"
        style={{ height: "min(72vh, 760px)", aspectRatio: `${VIEWBOX.width} / ${VIEWBOX.height}` }}
      >
        <CourtDiagram courtType={courtType} diagram={diagram} orientation={orientation} className="h-full w-full rounded-lg" />
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
          className={`absolute inset-0 h-full w-full touch-none ${
            tool === "select" ? "cursor-default" : "cursor-crosshair"
          }`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* 選手の円に隠れている端（旧データなど）は選手の下に置き、選手を掴めるようにする */}
          {renderArrows(true)}
          {players.map((q, i) => {
            const sel = selection?.kind === "player" && selection.i === i;
            const c = toSvg(q);
            return (
              <circle key={i} data-handle data-kind="player" data-i={i} cx={c.x} cy={c.y} r={PLAYER_HIT} fill="transparent" stroke={sel ? SELECTED_STROKE : "none"} strokeWidth={0.6} strokeDasharray="1.2 1" className="cursor-grab" />
            );
          })}
          {/* 円の外にある端は選手より前面に出して、確実に掴めるようにする */}
          {renderArrows(false)}
          {drag?.kind === "new-arrow" && (
            <line
              x1={toSvg(drag.from).x}
              y1={toSvg(drag.from).y}
              x2={toSvg(drag.to).x}
              y2={toSvg(drag.to).y}
              stroke={drag.arrowKind === "shot" ? "#fde047" : "#ffffff"}
              strokeWidth={0.9}
              strokeDasharray={drag.arrowKind === "shot" ? "2.4 1.6" : undefined}
              opacity={0.8}
            />
          )}
        </svg>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400">
        選択ツールで要素をクリック → 移動／削除（Delete キーも可）。要素が 0 個でもコートは表示されます（表示しない場合は上のチェックを外します）。
        <br />
        矢印は両端の■（始点）・●（終点）をドラッグして調整します。図の下側が、ノッカー（いない場合は練習者）側です。選手の円に重ねると、円の外ギリギリに自動で付きます。
      </p>

      {selectedPlayer && selection && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-300 p-2 text-sm dark:border-slate-600">
          <span className="font-bold">選手</span>
          <label className="flex items-center gap-1">
            ラベル
            <input
              value={selectedPlayer.label ?? ""}
              maxLength={2}
              onChange={(e) => {
                onCheckpoint(`label-${selection.i}`);
                emit(players.map((q, i) => (i === selection.i ? { ...q, label: e.target.value } : q)), arrows);
              }}
              className="w-14 rounded border border-slate-400 bg-white px-2 py-1 dark:border-slate-500 dark:bg-slate-900"
            />
          </label>
          <select
            value={selectedPlayer.role ?? "player"}
            onChange={(e) => {
              onCheckpoint();
              emit(
                players.map((q, i) => (i === selection.i ? { ...q, role: e.target.value as DiagramPlayer["role"] } : q)),
                arrows,
              );
            }}
            className="rounded border border-slate-400 bg-white px-2 py-1 dark:border-slate-500 dark:bg-slate-900"
          >
            {(Object.keys(ROLE_LABELS) as (keyof typeof ROLE_LABELS)[]).map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
          <button type="button" onClick={removeSelected} className={`${btn} ml-auto text-rose-700 dark:text-rose-300`}>
            削除
          </button>
        </div>
      )}

      {selectedArrow && selection && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-300 p-2 text-sm dark:border-slate-600">
          <span className="font-bold">矢印</span>
          <select
            value={selectedArrow.kind}
            onChange={(e) => {
              onCheckpoint();
              emit(players, arrows.map((a, i) => (i === selection.i ? { ...a, kind: e.target.value as DiagramArrow["kind"] } : a)));
            }}
            className="rounded border border-slate-400 bg-white px-2 py-1 dark:border-slate-500 dark:bg-slate-900"
          >
            <option value="shot">シャトルの軌道（黄色の破線）</option>
            <option value="move">選手の移動（白の実線）</option>
          </select>
          <button
            type="button"
            onClick={() => {
              onCheckpoint();
              emit(players, arrows.map((a, i) => (i === selection.i ? { ...a, from: a.to, to: a.from } : a)));
            }}
            className={btn}
          >
            向きを反転
          </button>
          <label className="flex items-center gap-1">
            番号
            <input
              type="number"
              min={1}
              max={99}
              value={selectedArrow.order ?? ""}
              placeholder="なし"
              onChange={(e) => {
                onCheckpoint(`order-${selection.i}`);
                const v = e.target.value === "" ? undefined : Math.max(1, Math.min(99, Number(e.target.value)));
                emit(players, arrows.map((a, i) => (i === selection.i ? { ...a, order: v } : a)));
              }}
              className="w-16 rounded border border-slate-400 bg-white px-2 py-1 dark:border-slate-500 dark:bg-slate-900"
            />
          </label>
          <button type="button" onClick={removeSelected} className={`${btn} ml-auto text-rose-700 dark:text-rose-300`}>
            削除
          </button>
        </div>
      )}

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" checked={linkArrows} onChange={(e) => setLinkArrows(e.target.checked)} className="h-4 w-4" />
        選手を動かしたとき、くっついている矢印も一緒に動かす
      </label>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          title="選手の円に重なっている矢印の端を、すべて円の外側へ移します"
          onClick={() => {
            onCheckpoint();
            emit(players, settleArrows(players, arrows));
          }}
          className={btn}
        >
          矢印を選手の外側に整える
        </button>
        <button
          type="button"
          title="矢印の並び順（作図した順）に、1, 2, 3… の番号を付けます。番号を消すには、矢印を選んで「番号」を空にします"
          onClick={() => {
            onCheckpoint();
            emit(players, arrows.map((a, i) => ({ ...a, order: i + 1 })));
          }}
          className={btn}
        >
          矢印に番号を振る
        </button>
        <button type="button" onClick={() => flip("x")} className={btn}>
          ⇄ 左右反転（手前↔奥）
        </button>
        <button type="button" onClick={() => flip("y")} className={btn}>
          ⇅ 上下反転
        </button>
        <button
          type="button"
          onClick={() => {
            if (players.length + arrows.length === 0 || confirm("この図の要素をすべて消しますか？（Ctrl+Z で元に戻せます）")) {
              onCheckpoint();
              emit([], []);
              setSelection(null);
            }
          }}
          className={`${btn} text-rose-700 dark:text-rose-300`}
        >
          図を全消去
        </button>
      </div>
    </div>
  );
}
