"use client";

import { useRef, useState } from "react";
import SceneView from "../SceneView";
import { PROP_KINDS, type ColorName, type PropKind, type PropPart, type Scene, type ScenePart } from "@/data/types";
import { COLORS, COLOR_LABELS } from "@/lib/figure";
import {
  PROP_LABELS,
  SCENE_PART_LABELS,
  SCENE_SIZE,
  makeScenePart,
  newSceneId,
  type NewScenePartType,
} from "@/lib/scene";

type Pt = { x: number; y: number };
const ADDABLE: NewScenePartType[] = ["token", "zone", "line", "arrow", "bubble", "text"];
const COLOR_NAMES = Object.keys(COLORS) as ColorName[];
const round = (n: number, d = 0) => Math.round(n * 10 ** d) / 10 ** d;

type Drag =
  | { kind: "move"; id: string; last: Pt }
  | { kind: "point"; id: string; key: "p1" | "p2" | "bend" | "br" | "rot" | "dir" }
  | null;

const btn =
  "min-h-9 rounded-md border border-slate-400 bg-white px-3 text-sm font-medium text-slate-900 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700";
const input =
  "rounded border border-slate-400 bg-white px-2 py-1 text-sm dark:border-slate-500 dark:bg-slate-900";

function Handle({ at, color, onDown, r = 4.5 }: { at: Pt; color: string; onDown: (e: React.PointerEvent) => void; r?: number }) {
  return <circle cx={at.x} cy={at.y} r={r} fill={color} stroke="#fff" strokeWidth={1.2} style={{ cursor: "pointer" }} onPointerDown={onDown} />;
}

function partName(q: ScenePart, i: number): string {
  const base = SCENE_PART_LABELS[q.type];
  if (q.type === "token") return `${i + 1}. コマ${q.label ? `「${q.label}」` : ""}`;
  if (q.type === "text" || q.type === "bubble") return `${i + 1}. ${base}「${q.text}」`;
  if (q.type === "zone") return `${i + 1}. エリア${q.label ? `「${q.label}」` : ""}`;
  if (q.type === "prop") return `${i + 1}. 道具（${PROP_LABELS[q.kind]}）`;
  return `${i + 1}. ${base}`;
}

/** 部品の、つかむ位置（中心）と、おおよその大きさ */
function bounds(q: ScenePart): { x: number; y: number; w: number; h: number } {
  switch (q.type) {
    case "token": {
      const r = 14 * (q.scale ?? 1);
      return { x: q.x - r, y: q.y - r, w: r * 2, h: r * 2 };
    }
    case "zone":
      return { x: q.x, y: q.y, w: q.w, h: q.h };
    case "prop": {
      const s = 16 * (q.scale ?? 1) * (q.kind === "tail" ? 2 : 1);
      return { x: q.x - s / (q.kind === "tail" ? 8 : 1), y: q.y - s, w: s * 2, h: s * 2 };
    }
    case "text":
    case "bubble": {
      const size = q.size ?? 12;
      const w = Math.max(24, q.text.length * size + 14);
      return { x: q.x - w / 2, y: q.y - size, w, h: size * 2 };
    }
    default: {
      const x = Math.min(q.x1, q.x2);
      const y = Math.min(q.y1, q.y2);
      return { x, y, w: Math.abs(q.x2 - q.x1), h: Math.abs(q.y2 - q.y1) };
    }
  }
}

/** 場面図（上から見た図）のエディタ。部品を追加し、ドラッグで動かし、色や文字を変える */
export default function SceneEditor({
  scene,
  onChange,
  onCheckpoint,
}: {
  scene: Scene;
  onChange: (scene: Scene) => void;
  /** 変更の直前に呼ぶ（元に戻す用の履歴）。key が同じ連続操作はまとめられる */
  onCheckpoint: (key?: string) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drag, setDrag] = useState<Drag>(null);
  const [propKind, setPropKind] = useState<PropKind>("ball");
  const movedRef = useRef(false);

  const parts = scene.parts;
  const selected = parts.find((q) => q.id === selectedId) ?? null;
  const emit = (next: ScenePart[]) => onChange({ ...scene, parts: next });
  const patch = (id: string, change: Partial<ScenePart>, key?: string) => {
    onCheckpoint(key ?? `part-${id}`);
    emit(parts.map((q) => (q.id === id ? ({ ...q, ...change } as ScenePart) : q)));
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

  const add = (type: NewScenePartType) => {
    onCheckpoint();
    const id = newSceneId(parts, type[0]);
    const off = (parts.length % 6) * 12;
    emit([...parts, makeScenePart(type, id, 140 + off, 100 + off, propKind)]);
    setSelectedId(id);
  };
  const remove = (id: string) => {
    onCheckpoint();
    emit(parts.filter((q) => q.id !== id));
    setSelectedId(null);
  };
  const duplicate = (id: string) => {
    const src = parts.find((q) => q.id === id);
    if (!src) return;
    onCheckpoint();
    const nid = newSceneId(parts, src.type[0]);
    const sh = (n: number) => round(n + 14, 1);
    let copy: ScenePart = { ...src, id: nid };
    if (copy.type === "arrow" || copy.type === "line") copy = { ...copy, x1: sh(copy.x1), x2: sh(copy.x2) };
    else copy = { ...copy, x: sh(copy.x) } as ScenePart;
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

  const startMove = (e: React.PointerEvent, id: string) => {
    const p = toPoint(e);
    if (!p) return;
    e.stopPropagation();
    svgRef.current?.setPointerCapture(e.pointerId);
    setSelectedId(id);
    movedRef.current = false;
    setDrag({ kind: "move", id, last: p });
  };
  const startPoint = (e: React.PointerEvent, id: string, key: "p1" | "p2" | "bend" | "br" | "rot" | "dir") => {
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
    const set = (change: Partial<ScenePart>) => emit(parts.map((q) => (q.id === drag.id ? ({ ...q, ...change } as ScenePart) : q)));

    if (drag.kind === "move") {
      const dx = p.x - drag.last.x;
      const dy = p.y - drag.last.y;
      setDrag({ ...drag, last: p });
      if (target.type === "arrow" || target.type === "line")
        set({ x1: round(target.x1 + dx, 1), y1: round(target.y1 + dy, 1), x2: round(target.x2 + dx, 1), y2: round(target.y2 + dy, 1) });
      else set({ x: round(target.x + dx, 1), y: round(target.y + dy, 1) } as Partial<ScenePart>);
      return;
    }
    if ((target.type === "arrow" || target.type === "line") && drag.key === "p1") set({ x1: p.x, y1: p.y });
    else if ((target.type === "arrow" || target.type === "line") && drag.key === "p2") set({ x2: p.x, y2: p.y });
    else if (target.type === "arrow" && drag.key === "bend") {
      const mx = (target.x1 + target.x2) / 2;
      const my = (target.y1 + target.y2) / 2;
      const dx = target.x2 - target.x1;
      const dy = target.y2 - target.y1;
      const len = Math.hypot(dx, dy) || 1;
      set({ bend: round(((p.x - mx) * (-dy / len) + (p.y - my) * (dx / len)) * 2, 1) });
    } else if (target.type === "zone" && drag.key === "br") set({ w: Math.max(8, round(p.x - target.x, 1)), h: Math.max(8, round(p.y - target.y, 1)) });
    else if (target.type === "prop" && drag.key === "rot") set({ rotation: round((Math.atan2(p.x - target.x, -(p.y - target.y)) * 180) / Math.PI) });
    else if (target.type === "token" && drag.key === "dir") set({ dir: round((Math.atan2(p.x - target.x, -(p.y - target.y)) * 180) / Math.PI) });
  };
  const onUp = () => setDrag(null);

  const hits = parts.map((q) => {
    const b = bounds(q);
    return (
      <rect
        key={q.id}
        x={b.x - 3}
        y={b.y - 3}
        width={Math.max(b.w, 12) + 6}
        height={Math.max(b.h, 12) + 6}
        fill="transparent"
        style={{ cursor: "grab" }}
        onPointerDown={(e) => startMove(e, q.id)}
      />
    );
  });

  const handles = (() => {
    if (!selected) return null;
    const q = selected;
    const b = bounds(q);
    const outline = <rect x={b.x - 2} y={b.y - 2} width={Math.max(b.w, 12) + 4} height={Math.max(b.h, 12) + 4} fill="none" stroke="#7c3aed" strokeWidth={1} strokeDasharray="3 2" pointerEvents="none" />;
    if (q.type === "arrow" || q.type === "line") {
      const dx = q.x2 - q.x1;
      const dy = q.y2 - q.y1;
      const len = Math.hypot(dx, dy) || 1;
      const bd = q.type === "arrow" ? q.bend ?? 0 : 0;
      return (
        <g>
          <Handle at={{ x: q.x1, y: q.y1 }} color="#0ea5e9" onDown={(e) => startPoint(e, q.id, "p1")} />
          <Handle at={{ x: q.x2, y: q.y2 }} color="#e11d48" onDown={(e) => startPoint(e, q.id, "p2")} />
          {q.type === "arrow" && (
            <Handle at={{ x: (q.x1 + q.x2) / 2 + (-dy / len) * bd * 0.5, y: (q.y1 + q.y2) / 2 + (dx / len) * bd * 0.5 }} color="#f59e0b" r={3.6} onDown={(e) => startPoint(e, q.id, "bend")} />
          )}
        </g>
      );
    }
    if (q.type === "zone")
      return (
        <g>
          {outline}
          <Handle at={{ x: q.x + q.w, y: q.y + q.h }} color="#f59e0b" onDown={(e) => startPoint(e, q.id, "br")} />
        </g>
      );
    if (q.type === "prop") {
      const a = ((q.rotation ?? 0) * Math.PI) / 180;
      const d = 24 * (q.scale ?? 1);
      return (
        <g>
          {outline}
          <Handle at={{ x: q.x + Math.sin(a) * d, y: q.y - Math.cos(a) * d }} color="#f59e0b" r={3.6} onDown={(e) => startPoint(e, q.id, "rot")} />
        </g>
      );
    }
    if (q.type === "token") {
      const a = ((q.dir ?? 0) * Math.PI) / 180;
      const d = 22 * (q.scale ?? 1);
      return (
        <g>
          {outline}
          <Handle at={{ x: q.x + Math.sin(a) * d, y: q.y - Math.cos(a) * d }} color="#f59e0b" r={3.6} onDown={(e) => startPoint(e, q.id, "dir")} />
        </g>
      );
    }
    return outline;
  })();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2" role="toolbar" aria-label="部品を追加">
        {ADDABLE.map((t) => (
          <button key={t} type="button" onClick={() => add(t)} className={btn}>
            ＋{SCENE_PART_LABELS[t]}
          </button>
        ))}
        <span className="flex items-center gap-1">
          <select value={propKind} onChange={(e) => setPropKind(e.target.value as PropKind)} className={input} aria-label="追加する道具">
            {PROP_KINDS.map((k) => (
              <option key={k} value={k}>{PROP_LABELS[k]}</option>
            ))}
          </select>
          <button type="button" onClick={() => add("prop")} className={btn}>＋道具</button>
        </span>
      </div>

      <div className="relative mx-auto w-full max-w-2xl select-none">
        <SceneView scene={scene} className="h-auto w-full rounded-lg border border-slate-300 dark:border-slate-600" />
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SCENE_SIZE.width} ${SCENE_SIZE.height}`}
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
        部品をクリックして選び、ドラッグで動かします。選ぶと、色のついた丸が出ます。矢印・ラインは両端の丸で長さと向きを、矢印の中央のオレンジの丸で曲がりを、エリアは右下の丸で大きさを、道具・コマはオレンジの丸で向きを変えられます。
      </p>

      <div className="grid gap-3 md:grid-cols-[14rem_1fr]">
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
            onPatch={(c, key) => patch(selected.id, c, key)}
            onRemove={() => remove(selected.id)}
            onDuplicate={() => duplicate(selected.id)}
            onReorder={(d) => reorder(selected.id, d)}
          />
        ) : (
          <div className="flex flex-col gap-2 rounded-lg border border-slate-300 p-3 text-sm dark:border-slate-600">
            <label className="flex items-center gap-2 font-bold">
              床の色
              <select
                value={scene.floor ?? "wood"}
                onChange={(e) => {
                  onCheckpoint();
                  onChange({ ...scene, floor: e.target.value as "wood" | "plain" });
                }}
                className={input}
              >
                <option value="wood">体育館の床（木の色）</option>
                <option value="plain">無地（うすいグレー）</option>
              </select>
            </label>
            <label className="flex items-center gap-2 font-bold">
              <input
                type="checkbox"
                checked={scene.court !== false}
                onChange={(e) => {
                  onCheckpoint();
                  onChange({ ...scene, court: e.target.checked });
                }}
                className="h-4 w-4"
              />
              コートの白い線を描く
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

function PartPanel({
  part,
  onPatch,
  onRemove,
  onDuplicate,
  onReorder,
}: {
  part: ScenePart;
  onPatch: (change: Partial<ScenePart>, key?: string) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onReorder: (delta: -1 | 1) => void;
}) {
  const colorSelect = (value: ColorName | undefined, fallback: ColorName) => (
    <label className="flex items-center gap-1">
      色
      <select value={value ?? fallback} onChange={(e) => onPatch({ color: e.target.value as ColorName } as Partial<ScenePart>, "color")} className={input}>
        {COLOR_NAMES.map((c) => (
          <option key={c} value={c}>{COLOR_LABELS[c]}</option>
        ))}
      </select>
    </label>
  );
  const slider = (label: string, value: number, min: number, max: number, step: number, field: string) => (
    <label className="flex items-center gap-2">
      <span className="w-14 shrink-0">{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onPatch({ [field]: Number(e.target.value) } as Partial<ScenePart>, field)} className="min-w-0 flex-1" />
      <span className="w-12 text-right tabular-nums">{value}</span>
    </label>
  );
  const textField = (label: string, value: string, field: string, max: number, width = "min-w-0 flex-1") => (
    <label className="flex items-center gap-2">
      <span className="w-14 shrink-0">{label}</span>
      <input value={value} maxLength={max} onChange={(e) => onPatch({ [field]: e.target.value } as Partial<ScenePart>, field)} className={`${input} ${width}`} />
    </label>
  );

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-slate-300 p-3 text-sm dark:border-slate-600">
      <div className="flex flex-wrap items-center gap-2">
        <b>{SCENE_PART_LABELS[part.type]}</b>
        <span className="ml-auto flex flex-wrap gap-2">
          <button type="button" className={btn} onClick={() => onReorder(-1)} title="奥へ（先に描く）">奥へ</button>
          <button type="button" className={btn} onClick={() => onReorder(1)} title="手前へ（後に描く）">手前へ</button>
          <button type="button" className={btn} onClick={onDuplicate}>複製</button>
          <button type="button" className={`${btn} text-rose-700 dark:text-rose-300`} onClick={onRemove}>削除</button>
        </span>
      </div>

      {part.type === "token" && (
        <>
          {textField("中の文字", part.label ?? "", "label", 3, "w-24")}
          <div className="flex flex-wrap items-center gap-3">
            {colorSelect(part.color, "blue")}
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={part.dir !== undefined} onChange={(e) => onPatch({ dir: e.target.checked ? 0 : undefined })} className="h-4 w-4" />
              向きの印を付ける
            </label>
          </div>
          {slider("大きさ", part.scale ?? 1, 0.5, 2.5, 0.05, "scale")}
        </>
      )}

      {part.type === "zone" && (
        <>
          {textField("名前", part.label ?? "", "label", 12)}
          <div className="flex flex-wrap items-center gap-3">
            {colorSelect(part.color, "blue")}
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={!!part.round} onChange={(e) => onPatch({ round: e.target.checked })} className="h-4 w-4" />
              丸いエリア
            </label>
          </div>
        </>
      )}

      {part.type === "line" && (
        <>
          {slider("太さ", part.width ?? 4, 1, 10, 0.5, "width")}
          <div className="flex flex-wrap items-center gap-3">
            {colorSelect(part.color, "red")}
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={!!part.dashed} onChange={(e) => onPatch({ dashed: e.target.checked })} className="h-4 w-4" />
              破線
            </label>
          </div>
        </>
      )}

      {part.type === "arrow" && (
        <>
          {slider("曲がり", part.bend ?? 0, -80, 80, 1, "bend")}
          <div className="flex flex-wrap items-center gap-3">
            {colorSelect(part.color, "dark")}
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={!!part.dashed} onChange={(e) => onPatch({ dashed: e.target.checked })} className="h-4 w-4" />
              破線（物の動き）
            </label>
          </div>
        </>
      )}

      {(part.type === "text" || part.type === "bubble") && (
        <>
          {textField("文字", part.text, "text", 30)}
          {slider("大きさ", part.size ?? 12, 6, 28, 1, "size")}
          {colorSelect(part.color, "dark")}
        </>
      )}

      {part.type === "prop" && (
        <>
          <label className="flex items-center gap-2">
            <span className="w-14 shrink-0">道具</span>
            <select value={part.kind} onChange={(e) => onPatch({ kind: e.target.value as PropKind } as Partial<PropPart>)} className={input}>
              {PROP_KINDS.map((k) => (
                <option key={k} value={k}>{PROP_LABELS[k]}</option>
              ))}
            </select>
          </label>
          {slider("向き", part.rotation ?? 0, -180, 180, 1, "rotation")}
          {slider("大きさ", part.scale ?? 1, 0.5, 3, 0.05, "scale")}
          {colorSelect(part.color, "gray")}
        </>
      )}
    </div>
  );
}
