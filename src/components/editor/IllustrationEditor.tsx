"use client";

import { useRef, useState } from "react";
import IllustrationView from "../IllustrationView";
import { POSES, POSE_ORDER } from "@/data/poses";
import type {
  ColorName,
  Illustration,
  IllustrationPart,
  PersonPart,
  PersonPose,
  RacketPart,
} from "@/data/types";
import {
  COLORS,
  COLOR_LABELS,

  ILLUSTRATION_SIZE,
  PART_LABELS,
  angleOf,
  figureJoints,
  groundedY,
  makePart,

  newPartId,
  racketPlacement,
  type NewPartType,
  type Pt,
} from "@/lib/figure";

const ADDABLE: NewPartType[] = ["person", "racket", "shuttle", "ball", "cone", "ring", "arrow", "line", "rect", "text"];
const COLOR_NAMES = Object.keys(COLORS) as ColorName[];
const round = (n: number, d = 0) => Math.round(n * 10 ** d) / 10 ** d;

type HandleKey =
  | "torso" | "head"
  | "armL0" | "armL1" | "armR0" | "armR1"
  | "legL0" | "legL1" | "legR0" | "legR1";

type Drag =
  | { kind: "move"; id: string; last: Pt }
  | { kind: "joint"; id: string; key: HandleKey }
  | { kind: "point"; id: string; key: "p1" | "p2" | "bend" | "br" | "racketTip" }
  | null;

/** ドラッグした位置から、その関節につながる線分の角度を決める（人の座標系の絶対角度） */
function jointAngle(p: PersonPart, key: HandleKey, pointer: Pt): number {
  const j = figureJoints(p);
  const f = p.flip ? -1 : 1;
  const from: Record<HandleKey, Pt> = {
    torso: j.hip, head: j.neck,
    armL0: j.shoulder, armL1: j.elbowL, armR0: j.shoulder, armR1: j.elbowR,
    legL0: j.hip, legL1: j.kneeL, legR0: j.hip, legR1: j.kneeR,
  };
  const o = from[key];
  return round(angleOf((pointer.x - o.x) / f, pointer.y - o.y));
}

function withAngle(pose: PersonPose, key: HandleKey, a: number): PersonPose {
  switch (key) {
    case "torso": return { ...pose, torso: a };
    case "head": return { ...pose, head: a };
    case "armL0": return { ...pose, armL: [a, pose.armL[1]] };
    case "armL1": return { ...pose, armL: [pose.armL[0], a] };
    case "armR0": return { ...pose, armR: [a, pose.armR[1]] };
    case "armR1": return { ...pose, armR: [pose.armR[0], a] };
    case "legL0": return { ...pose, legL: [a, pose.legL[1]] };
    case "legL1": return { ...pose, legL: [pose.legL[0], a] };
    case "legR0": return { ...pose, legR: [a, pose.legR[1]] };
    case "legR1": return { ...pose, legR: [pose.legR[0], a] };
  }
}

const btn =
  "min-h-9 rounded-md border border-slate-400 bg-white px-3 text-sm font-medium text-slate-900 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700";
const input =
  "rounded border border-slate-400 bg-white px-2 py-1 text-sm dark:border-slate-500 dark:bg-slate-900";

function Handle({ at, color, onDown, r = 4.5 }: { at: Pt; color: string; onDown: (e: React.PointerEvent) => void; r?: number }) {
  return <circle cx={at.x} cy={at.y} r={r} fill={color} stroke="#fff" strokeWidth={1.2} style={{ cursor: "pointer" }} onPointerDown={onDown} />;
}

function partName(q: IllustrationPart, i: number): string {
  const base = PART_LABELS[q.type].replace(/（.*）/, "");
  if (q.type === "person") return `${i + 1}. ${base}${q.label ? `「${q.label}」` : ""}`;
  if (q.type === "text") return `${i + 1}. 文字「${q.text}」`;
  return `${i + 1}. ${base}`;
}

export default function IllustrationEditor({
  illustration,
  onChange,
  onCheckpoint,
}: {
  illustration: Illustration;
  onChange: (illustration: Illustration) => void;
  /** 変更の直前に呼ぶ（元に戻す用の履歴）。key が同じ連続操作はまとめられる */
  onCheckpoint: (key?: string) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drag, setDrag] = useState<Drag>(null);
  const movedRef = useRef(false);

  const parts = illustration.parts;
  const selected = parts.find((q) => q.id === selectedId) ?? null;
  const emit = (next: IllustrationPart[], ground = illustration.ground) => onChange({ ...illustration, parts: next, ground });
  const patch = (id: string, change: Partial<IllustrationPart>, key?: string) => {
    onCheckpoint(key ?? `part-${id}`);
    emit(parts.map((q) => (q.id === id ? ({ ...q, ...change } as IllustrationPart) : q)));
  };

  const toPoint = (e: React.PointerEvent): Pt | null => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(ctm.inverse());
    return { x: round(p.x, 1), y: round(p.y, 1) };
  };

  const add = (type: NewPartType) => {
    onCheckpoint();
    const id = newPartId(parts, type[0]);
    const offset = (parts.length % 5) * 14;
    const q = makePart(type, id, 110 + offset, type === "person" ? 100 : 90 + offset);
    // 人は、床に着くように置く
    const placed = q.type === "person" ? { ...q, y: groundedY(q) } : q;
    emit([...parts, placed]);
    setSelectedId(id);
  };

  const remove = (id: string) => {
    onCheckpoint();
    // この人に持たせていたラケットは、手から離す
    emit(
      parts
        .filter((q) => q.id !== id)
        .map((q) => (q.type === "racket" && q.attach?.to === id ? { ...q, attach: undefined } : q)),
    );
    setSelectedId(null);
  };

  const duplicate = (id: string) => {
    const src = parts.find((q) => q.id === id);
    if (!src) return;
    onCheckpoint();
    const nid = newPartId(parts, src.type[0]);
    const shift = (n: number) => round(n + 14, 1);
    let copy: IllustrationPart = { ...src, id: nid };
    if ("x" in copy && "y" in copy && copy.type !== "rect") copy = { ...copy, x: shift(copy.x), y: copy.y } as IllustrationPart;
    if (copy.type === "rect") copy = { ...copy, x: shift(copy.x) };
    if (copy.type === "arrow" || copy.type === "line") copy = { ...copy, x1: shift(copy.x1), x2: shift(copy.x2) };
    if (copy.type === "racket") copy = { ...copy, attach: undefined };
    emit([...parts, copy]);
    setSelectedId(nid);
  };

  const reorder = (id: string, delta: -1 | 1) => {
    const i = parts.findIndex((q) => q.id === id);
    const j = i + delta;
    if (i < 0 || j < 0 || j >= parts.length) return;
    onCheckpoint();
    const next = [...parts];
    [next[i], next[j]] = [next[j], next[i]];
    emit(next);
  };

  // ───── ドラッグ ─────
  const startMove = (e: React.PointerEvent, id: string) => {
    const p = toPoint(e);
    if (!p) return;
    e.stopPropagation();
    svgRef.current?.setPointerCapture(e.pointerId);
    setSelectedId(id);
    movedRef.current = false;
    setDrag({ kind: "move", id, last: p });
  };
  const startJoint = (e: React.PointerEvent, id: string, key: HandleKey) => {
    e.stopPropagation();
    svgRef.current?.setPointerCapture(e.pointerId);
    movedRef.current = false;
    setDrag({ kind: "joint", id, key });
  };
  const startPoint = (e: React.PointerEvent, id: string, key: "p1" | "p2" | "bend" | "br" | "racketTip") => {
    e.stopPropagation();
    svgRef.current?.setPointerCapture(e.pointerId);
    movedRef.current = false;
    setDrag({ kind: "point", id, key });
  };

  const onMove = (e: React.PointerEvent) => {
    if (!drag) return;
    const p = toPoint(e);
    if (!p) return;
    if (!movedRef.current) {
      movedRef.current = true;
      onCheckpoint();
    }
    const target = parts.find((q) => q.id === drag.id);
    if (!target) return;
    const set = (change: Partial<IllustrationPart>) =>
      emit(parts.map((q) => (q.id === drag.id ? ({ ...q, ...change } as IllustrationPart) : q)));

    if (drag.kind === "move") {
      const dx = p.x - drag.last.x;
      const dy = p.y - drag.last.y;
      setDrag({ ...drag, last: p });
      if (target.type === "arrow" || target.type === "line")
        set({ x1: round(target.x1 + dx, 1), y1: round(target.y1 + dy, 1), x2: round(target.x2 + dx, 1), y2: round(target.y2 + dy, 1) });
      else if (target.type === "racket" && target.attach) return; // 手に持たせているものは、人と一緒に動く
      else if ("x" in target && "y" in target) set({ x: round(target.x + dx, 1), y: round(target.y + dy, 1) });
    } else if (drag.kind === "joint" && target.type === "person") {
      set({ pose: withAngle(target.pose, drag.key, jointAngle(target, drag.key, p)) });
    } else if (drag.kind === "point") {
      if ((target.type === "arrow" || target.type === "line") && drag.key === "p1") set({ x1: p.x, y1: p.y });
      else if ((target.type === "arrow" || target.type === "line") && drag.key === "p2") set({ x2: p.x, y2: p.y });
      else if (target.type === "arrow" && drag.key === "bend") {
        const mx = (target.x1 + target.x2) / 2;
        const my = (target.y1 + target.y2) / 2;
        const dx = target.x2 - target.x1;
        const dy = target.y2 - target.y1;
        const len = Math.hypot(dx, dy) || 1;
        // 弦の中点から、法線方向へ、どれだけ離れたか
        const bend = (p.x - mx) * (-dy / len) + (p.y - my) * (dx / len);
        set({ bend: round(bend * 2, 1) });
      } else if (target.type === "rect" && drag.key === "br") set({ w: Math.max(4, round(p.x - target.x, 1)), h: Math.max(4, round(p.y - target.y, 1)) });
      else if (target.type === "racket" && drag.key === "racketTip") {
        const place = racketPlacement(target, parts);
        const world = angleOf(p.x - place.grip.x, p.y - place.grip.y);
        if (target.attach) {
          const person = parts.find((q): q is PersonPart => q.type === "person" && q.id === target.attach!.to);
          if (person) {
            const fore = target.attach.hand === "L" ? person.pose.armL[1] : person.pose.armR[1];
            const f = person.flip ? -1 : 1;
            set({ rotation: round(f * world - fore) });
          }
        } else set({ rotation: round(world) });
      }
    }
  };
  const onUp = () => setDrag(null);

  // ───── オーバーレイ（選択用の当たり判定と、ハンドル） ─────
  const hitProps = (id: string) => ({
    fill: "transparent",
    stroke: "transparent",
    style: { cursor: "grab" } as const,
    onPointerDown: (e: React.PointerEvent) => startMove(e, id),
  });
  const hits = parts.map((q) => {
    switch (q.type) {
      case "person": {
        const j = figureJoints(q);
        const xs = [j.hip, j.neck, j.head, j.elbowL, j.elbowR, j.wristL, j.wristR, j.kneeL, j.kneeR, j.ankleL, j.ankleR].map((p) => p.x);
        const ys = [j.hip, j.neck, j.head, j.elbowL, j.elbowR, j.wristL, j.wristR, j.kneeL, j.kneeR, j.ankleL, j.ankleR].map((p) => p.y);
        const x = Math.min(...xs) - 4, y = Math.min(...ys) - 8;
        return <rect key={q.id} x={x} y={y} width={Math.max(...xs) - x + 8} height={Math.max(...ys) - y + 6} {...hitProps(q.id)} />;
      }
      case "racket": {
        const pl = racketPlacement(q, parts);
        return <circle key={q.id} cx={pl.grip.x} cy={pl.grip.y} r={9} {...hitProps(q.id)} />;
      }
      case "arrow":
      case "line":
        return <line key={q.id} x1={q.x1} y1={q.y1} x2={q.x2} y2={q.y2} strokeWidth={12} strokeLinecap="round" {...hitProps(q.id)} />;
      case "rect":
        return <rect key={q.id} x={q.x} y={q.y} width={q.w} height={q.h} {...hitProps(q.id)} />;
      case "text":
        return <rect key={q.id} x={q.x - (q.text.length * (q.size ?? 12)) / 2 - 3} y={q.y - (q.size ?? 12) / 2 - 3} width={q.text.length * (q.size ?? 12) + 6} height={(q.size ?? 12) + 6} {...hitProps(q.id)} />;
      default:
        return <circle key={q.id} cx={q.x} cy={q.y} r={12} {...hitProps(q.id)} />;
    }
  });

  const handles = (() => {
    if (!selected) return null;
    const q = selected;
    if (q.type === "person") {
      const j = figureJoints(q);
      const J = (key: HandleKey, at: Pt, c: string) => <Handle key={key} at={at} color={c} onDown={(e) => startJoint(e, q.id, key)} />;
      return (
        <g>
          <circle cx={j.hip.x} cy={j.hip.y} r={5.5} fill="#7c3aed" stroke="#fff" strokeWidth={1.2} style={{ cursor: "grab" }} onPointerDown={(e) => startMove(e, q.id)} />
          {J("torso", j.neck, "#f59e0b")}
          {J("head", j.head, "#f59e0b")}
          {J("armL0", j.elbowL, "#0ea5e9")}
          {J("armL1", j.wristL, "#0ea5e9")}
          {J("armR0", j.elbowR, "#e11d48")}
          {J("armR1", j.wristR, "#e11d48")}
          {J("legL0", j.kneeL, "#0ea5e9")}
          {J("legL1", j.ankleL, "#0ea5e9")}
          {J("legR0", j.kneeR, "#e11d48")}
          {J("legR1", j.ankleR, "#e11d48")}
        </g>
      );
    }
    if (q.type === "racket") {
      const pl = racketPlacement(q, parts);
      const len = (12 + 10 + 19) * pl.scale;
      const d = { x: Math.sin((pl.angle * Math.PI) / 180), y: Math.cos((pl.angle * Math.PI) / 180) };
      const tip = { x: pl.grip.x + d.x * len, y: pl.grip.y + d.y * len };
      return (
        <g>
          {!q.attach && <Handle at={pl.grip} color="#7c3aed" onDown={(e) => startMove(e, q.id)} />}
          <Handle at={tip} color="#f59e0b" onDown={(e) => startPoint(e, q.id, "racketTip")} />
        </g>
      );
    }
    if (q.type === "arrow" || q.type === "line") {
      const mid = { x: (q.x1 + q.x2) / 2, y: (q.y1 + q.y2) / 2 };
      const dx = q.x2 - q.x1, dy = q.y2 - q.y1, len = Math.hypot(dx, dy) || 1;
      const bend = q.type === "arrow" ? q.bend ?? 0 : 0;
      return (
        <g>
          <Handle at={{ x: q.x1, y: q.y1 }} color="#0ea5e9" onDown={(e) => startPoint(e, q.id, "p1")} />
          <Handle at={{ x: q.x2, y: q.y2 }} color="#e11d48" onDown={(e) => startPoint(e, q.id, "p2")} />
          {q.type === "arrow" && (
            <Handle at={{ x: mid.x + (-dy / len) * bend * 0.5, y: mid.y + (dx / len) * bend * 0.5 }} color="#f59e0b" r={3.6} onDown={(e) => startPoint(e, q.id, "bend")} />
          )}
        </g>
      );
    }
    if (q.type === "rect") return <Handle at={{ x: q.x + q.w, y: q.y + q.h }} color="#f59e0b" onDown={(e) => startPoint(e, q.id, "br")} />;
    if ("x" in q) return <Handle at={{ x: q.x, y: q.y }} color="#7c3aed" onDown={(e) => startMove(e, q.id)} />;
    return null;
  })();

  const persons = parts.filter((q): q is PersonPart => q.type === "person");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2" role="toolbar" aria-label="部品を追加">
        {ADDABLE.map((t) => (
          <button key={t} type="button" onClick={() => add(t)} className={btn}>
            ＋{PART_LABELS[t].replace(/（.*）/, "")}
          </button>
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-2xl select-none">
        <IllustrationView illustration={illustration} className="h-auto w-full rounded-lg border border-slate-300 dark:border-slate-600" />
        <svg
          ref={svgRef}
          viewBox={`0 0 ${ILLUSTRATION_SIZE.width} ${ILLUSTRATION_SIZE.height}`}
          className="absolute inset-0 h-full w-full touch-none"
          onPointerDown={() => setSelectedId(null)}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          {hits}
          {handles}
        </svg>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400">
        部品をクリックして選び、ドラッグで動かします。人は、色のついた丸（■ 腰＝紫、首・頭＝オレンジ、手足の関節＝青・赤）をドラッグして、ポーズを作ります。ラケットは、先端の丸で、向きを変えられます。
      </p>

      <div className="grid gap-3 md:grid-cols-[14rem_1fr]">
        {/* 部品の一覧（重なっていても選べる。上ほど奥、下ほど手前） */}
        <ol className="max-h-56 overflow-y-auto rounded-lg border border-slate-300 text-sm dark:border-slate-600">
          {parts.length === 0 && <li className="p-3 text-slate-600 dark:text-slate-400">部品がありません。上のボタンで追加します。</li>}
          {parts.map((q, i) => (
            <li key={q.id}>
              <button
                type="button"
                onClick={() => setSelectedId(q.id)}
                className={`w-full px-3 py-1.5 text-left ${q.id === selectedId ? "bg-emerald-100 font-bold dark:bg-emerald-950" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
              >
                {partName(q, i)}
              </button>
            </li>
          ))}
        </ol>

        {selected ? (
          <PartPanel
            part={selected}
            persons={persons}
            onPatch={(c, key) => patch(selected.id, c, key)}
            onRemove={() => remove(selected.id)}
            onDuplicate={() => duplicate(selected.id)}
            onReorder={(d) => reorder(selected.id, d)}
          />
        ) : (
          <div className="flex flex-col gap-2 rounded-lg border border-slate-300 p-3 text-sm dark:border-slate-600">
            <label className="flex items-center gap-2 font-bold">
              <input
                type="checkbox"
                checked={illustration.ground !== false}
                onChange={(e) => {
                  onCheckpoint();
                  onChange({ ...illustration, ground: e.target.checked });
                }}
                className="h-4 w-4"
              />
              床の線を描く
            </label>
            <button
              type="button"
              className={`${btn} self-start text-rose-700 dark:text-rose-300`}
              onClick={() => {
                if (parts.length === 0 || confirm("この図の部品をすべて消しますか？（Ctrl+Z で元に戻せます）")) {
                  onCheckpoint();
                  emit([]);
                  setSelectedId(null);
                }
              }}
            >
              図を全消去
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/** 選んだ部品の設定 */
function PartPanel({
  part,
  persons,
  onPatch,
  onRemove,
  onDuplicate,
  onReorder,
}: {
  part: IllustrationPart;
  persons: PersonPart[];
  onPatch: (change: Partial<IllustrationPart>, key?: string) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onReorder: (delta: -1 | 1) => void;
}) {
  const colorSelect = (value: ColorName | undefined, fallback: ColorName) => (
    <label className="flex items-center gap-1">
      色
      <select value={value ?? fallback} onChange={(e) => onPatch({ color: e.target.value as ColorName } as Partial<IllustrationPart>, "color")} className={input}>
        {COLOR_NAMES.map((c) => (
          <option key={c} value={c}>{COLOR_LABELS[c]}</option>
        ))}
      </select>
    </label>
  );
  const slider = (label: string, value: number, min: number, max: number, step: number, field: string) => (
    <label className="flex items-center gap-2">
      <span className="w-14 shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onPatch({ [field]: Number(e.target.value) } as Partial<IllustrationPart>, field)}
        className="min-w-0 flex-1"
      />
      <span className="w-12 text-right tabular-nums">{value}</span>
    </label>
  );

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-slate-300 p-3 text-sm dark:border-slate-600">
      <div className="flex flex-wrap items-center gap-2">
        <b>{PART_LABELS[part.type]}</b>
        <span className="ml-auto flex flex-wrap gap-2">
          <button type="button" className={btn} onClick={() => onReorder(-1)} title="奥へ（先に描く）">奥へ</button>
          <button type="button" className={btn} onClick={() => onReorder(1)} title="手前へ（後に描く）">手前へ</button>
          <button type="button" className={btn} onClick={onDuplicate}>複製</button>
          <button type="button" className={`${btn} text-rose-700 dark:text-rose-300`} onClick={onRemove}>削除</button>
        </span>
      </div>

      {part.type === "person" && (
        <>
          <label className="flex items-center gap-2">
            <span className="w-14 shrink-0">ポーズ</span>
            <select
              value=""
              onChange={(e) => {
                const def = POSES[e.target.value];
                if (!def) return;
                const next = { ...part, pose: def.pose, feet: def.front ? false : part.feet };
                onPatch({ pose: def.pose, feet: next.feet, y: groundedY(next) });
              }}
              className={`${input} min-w-0 flex-1`}
            >
              <option value="">ひな型から選ぶ…</option>
              {POSE_ORDER.map((k) => (
                <option key={k} value={k}>{POSES[k].label}</option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={!!part.flip} onChange={(e) => onPatch({ flip: e.target.checked })} className="h-4 w-4" />
              左向きにする（左右反転）
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={part.feet !== false} onChange={(e) => onPatch({ feet: e.target.checked })} className="h-4 w-4" />
              足を描く
            </label>
            <button type="button" className={btn} onClick={() => onPatch({ y: groundedY(part) })} title="足や手が、床に着くように、高さを合わせます">
              床に合わせる
            </button>
          </div>
          {slider("大きさ", part.scale ?? 1, 0.4, 2.2, 0.05, "scale")}
          <div className="flex flex-wrap items-center gap-3">
            {colorSelect(part.color, "blue")}
            <label className="flex items-center gap-1">
              番号・文字
              <input value={part.label ?? ""} maxLength={2} onChange={(e) => onPatch({ label: e.target.value }, "label")} className={`${input} w-14`} />
            </label>
          </div>
        </>
      )}

      {part.type === "racket" && (
        <>
          <label className="flex flex-wrap items-center gap-2">
            <span className="w-14 shrink-0">持たせる</span>
            <select
              value={part.attach ? `${part.attach.to}:${part.attach.hand}` : ""}
              onChange={(e) => {
                const v = e.target.value;
                if (!v) return onPatch({ attach: undefined });
                const [to, hand] = v.split(":");
                onPatch({ attach: { to, hand: hand as "L" | "R" }, rotation: 15 });
              }}
              className={`${input} min-w-0 flex-1`}
            >
              <option value="">持たせない（自由に置く）</option>
              {persons.flatMap((p) => [
                <option key={`${p.id}R`} value={`${p.id}:R`}>人{p.label ? `「${p.label}」` : `（${p.id}）`}の、手前の手</option>,
                <option key={`${p.id}L`} value={`${p.id}:L`}>人{p.label ? `「${p.label}」` : `（${p.id}）`}の、奥の手</option>,
              ])}
            </select>
          </label>
          {slider("向き", (part as RacketPart).rotation, -180, 180, 1, "rotation")}
          {slider("大きさ", part.scale ?? 1, 0.5, 2.5, 0.05, "scale")}
        </>
      )}

      {part.type === "shuttle" && (
        <>
          {slider("向き", part.rotation ?? 0, -180, 180, 1, "rotation")}
          {slider("大きさ", part.scale ?? 1, 0.5, 3, 0.05, "scale")}
        </>
      )}

      {(part.type === "ball" || part.type === "cone" || part.type === "ring") && (
        <>
          {slider("大きさ", part.scale ?? 1, 0.4, 3, 0.05, "scale")}
          {colorSelect(part.color, part.type === "ball" ? "yellow" : part.type === "cone" ? "orange" : "red")}
        </>
      )}

      {part.type === "arrow" && (
        <>
          {slider("曲がり", part.bend ?? 0, -80, 80, 1, "bend")}
          <div className="flex flex-wrap items-center gap-3">
            {colorSelect(part.color, "dark")}
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={!!part.dashed} onChange={(e) => onPatch({ dashed: e.target.checked })} className="h-4 w-4" />
              破線
            </label>
          </div>
        </>
      )}

      {part.type === "line" && (
        <>
          {slider("太さ", part.width ?? 2, 0.5, 8, 0.5, "width")}
          <div className="flex flex-wrap items-center gap-3">
            {colorSelect(part.color, "gray")}
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={!!part.dashed} onChange={(e) => onPatch({ dashed: e.target.checked })} className="h-4 w-4" />
              破線
            </label>
          </div>
        </>
      )}

      {part.type === "rect" && (
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-1">
            幅
            <input type="number" min={2} max={320} value={part.w} onChange={(e) => onPatch({ w: Math.max(2, Number(e.target.value) || 2) }, "w")} className={`${input} w-20`} />
          </label>
          <label className="flex items-center gap-1">
            高さ
            <input type="number" min={2} max={200} value={part.h} onChange={(e) => onPatch({ h: Math.max(2, Number(e.target.value) || 2) }, "h")} className={`${input} w-20`} />
          </label>
          {colorSelect(part.color, "gray")}
        </div>
      )}

      {part.type === "text" && (
        <>
          <label className="flex items-center gap-2">
            <span className="w-14 shrink-0">文字</span>
            <input value={part.text} maxLength={30} onChange={(e) => onPatch({ text: e.target.value }, "text")} className={`${input} min-w-0 flex-1`} />
          </label>
          {slider("大きさ", part.size ?? 12, 6, 28, 1, "size")}
          {colorSelect(part.color, "dark")}
        </>
      )}
    </div>
  );
}
