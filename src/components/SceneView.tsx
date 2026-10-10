import { useId } from "react";
import type { ColorName, PropPart, Scene, ScenePart, TokenPart } from "@/data/types";
import { COLORS } from "@/lib/figure";
import { COURT_BOX, FLOOR_COLORS, SCENE_SIZE } from "@/lib/scene";

const color = (c: ColorName | undefined, fallback: ColorName) => COLORS[c ?? fallback];
/** 黄色の上は、白い文字が読みにくいので、濃い色にする */
const onColor = (c: ColorName | undefined) => (c === "yellow" ? "#0f172a" : "#fff");

function Token({ p }: { p: TokenPart }) {
  const s = p.scale ?? 1;
  const r = 11 * s;
  const c = p.color ?? "blue";
  const label = p.label ?? "";
  return (
    <g>
      {p.dir !== undefined && (
        // 向きの印（小さな三角）
        <path
          transform={`translate(${p.x} ${p.y}) rotate(${p.dir})`}
          d={`M0 ${-r - 7 * s} L${4.5 * s} ${-r - 0.5 * s} L${-4.5 * s} ${-r - 0.5 * s} Z`}
          fill={COLORS[c]}
          stroke="#fff"
          strokeWidth={1}
          strokeLinejoin="round"
        />
      )}
      <circle cx={p.x} cy={p.y} r={r} fill={COLORS[c]} stroke="#fff" strokeWidth={2} />
      {label && (
        <text
          x={p.x}
          y={p.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={(label.length > 2 ? 7 : label.length > 1 ? 8.5 : 10.5) * s}
          fontWeight={700}
          fill={onColor(c)}
        >
          {label}
        </text>
      )}
    </g>
  );
}

function Prop({ p }: { p: PropPart }) {
  const s = p.scale ?? 1;
  const t = `translate(${p.x} ${p.y}) rotate(${p.rotation ?? 0}) scale(${s})`;
  const col = (fallback: ColorName) => color(p.color, fallback);
  switch (p.kind) {
    case "tail":
      return <path transform={t} d="M0 0 q7 -7 14 0 q7 7 14 0 q7 -7 12 -2" fill="none" stroke={col("yellow")} strokeWidth={4} strokeLinecap="round" />;
    case "balloon":
      return (
        <g transform={t}>
          <path d="M0 10 q-3 7 2 14" fill="none" stroke="#64748b" strokeWidth={1} />
          <ellipse cx={0} cy={0} rx={8} ry={10} fill={col("red")} stroke="#fff" strokeWidth={1} />
          <ellipse cx={-2.6} cy={-3.4} rx={1.8} ry={2.6} fill="#fff" opacity={0.55} />
        </g>
      );
    case "racket":
      return (
        <g transform={t}>
          <line x1={0} y1={0} x2={0} y2={13} stroke="#1e293b" strokeWidth={2.6} strokeLinecap="round" />
          <ellipse cx={0} cy={-8} rx={6} ry={8.5} fill="rgba(255,255,255,0.7)" stroke="#1e293b" strokeWidth={1.6} />
          <line x1={-5} y1={-8} x2={5} y2={-8} stroke="#94a3b8" strokeWidth={0.6} />
          <line x1={0} y1={-15} x2={0} y2={-1} stroke="#94a3b8" strokeWidth={0.6} />
        </g>
      );
    case "shuttle":
      return (
        <g transform={t}>
          <path d="M-5.5 -13 L-2 -2 L2 -2 L5.5 -13 Z" fill="#fff" stroke="#334155" strokeWidth={0.9} strokeLinejoin="round" />
          <circle cx={0} cy={0} r={2.8} fill="#f8fafc" stroke="#334155" strokeWidth={0.9} />
        </g>
      );
    case "ball":
      return <circle transform={t} cx={0} cy={0} r={5.5} fill={col("yellow")} stroke="#334155" strokeWidth={0.9} />;
    case "cone":
      return (
        <g transform={t}>
          <circle cx={0} cy={0} r={6} fill={col("orange")} stroke="#fff" strokeWidth={1.4} />
          <circle cx={0} cy={0} r={2.4} fill="#fff" opacity={0.85} />
        </g>
      );
    case "hoop":
      return <circle transform={t} cx={0} cy={0} r={12} fill="rgba(255,255,255,0.35)" stroke={col("red")} strokeWidth={3} />;
    case "treasure":
      return (
        <g transform={t}>
          <path d="M0 -9 L2.6 -3 L9 -2.6 L4.2 1.8 L5.6 8.4 L0 5 L-5.6 8.4 L-4.2 1.8 L-9 -2.6 L-2.6 -3 Z" fill={col("yellow")} stroke="#92400e" strokeWidth={1} strokeLinejoin="round" />
        </g>
      );
    case "flag":
      return (
        <g transform={t}>
          <line x1={0} y1={9} x2={0} y2={-11} stroke="#475569" strokeWidth={1.8} strokeLinecap="round" />
          <path d="M0 -11 L12 -7 L0 -3 Z" fill={col("red")} stroke="#fff" strokeWidth={0.8} strokeLinejoin="round" />
        </g>
      );
    case "basket":
      return (
        <g transform={t}>
          <rect x={-11} y={-8} width={22} height={16} rx={3} fill={col("gray")} opacity={0.9} stroke="#fff" strokeWidth={1.2} />
          <line x1={-11} y1={-2} x2={11} y2={-2} stroke="#fff" strokeWidth={0.8} />
          <line x1={-11} y1={3} x2={11} y2={3} stroke="#fff" strokeWidth={0.8} />
        </g>
      );
  }
}

const bend = (x1: number, y1: number, x2: number, y2: number, b: number) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  return { cx: (x1 + x2) / 2 + (-dy / len) * b, cy: (y1 + y2) / 2 + (dx / len) * b };
};

/**
 * 上から見た場面図。人は色つきの丸のコマ。エリア・ライン・矢印・吹き出し・道具のアイコンを重ねて描く。
 * 運動遊びなど、コート図では伝わらないメニューで使う。
 */
export default function SceneView({ scene, className, label }: { scene: Scene; className?: string; label?: string }) {
  const uid = useId();
  const { width, height } = SCENE_SIZE;
  const markerId = (c: ColorName) => `${uid}-m-${c}`;
  const arrowColors = Array.from(new Set(scene.parts.filter((q) => q.type === "arrow").map((q) => (q.type === "arrow" ? q.color ?? "dark" : "dark"))));
  const { x, y, w, h } = COURT_BOX;

  const part = (q: ScenePart) => {
    switch (q.type) {
      case "token":
        return <Token key={q.id} p={q} />;
      case "prop":
        return <Prop key={q.id} p={q} />;
      case "zone":
        return (
          <g key={q.id}>
            {q.round ? (
              <ellipse cx={q.x + q.w / 2} cy={q.y + q.h / 2} rx={q.w / 2} ry={q.h / 2} fill={color(q.color, "blue")} opacity={0.28} stroke={color(q.color, "blue")} strokeWidth={1.2} />
            ) : (
              <rect x={q.x} y={q.y} width={q.w} height={q.h} rx={3} fill={color(q.color, "blue")} opacity={0.28} stroke={color(q.color, "blue")} strokeWidth={1.2} />
            )}
            {q.label && (
              <text x={q.x + q.w / 2} y={q.y + 13} textAnchor="middle" fontSize={11} fontWeight={700} fill="#0f172a">
                {q.label}
              </text>
            )}
          </g>
        );
      case "line":
        return (
          <line key={q.id} x1={q.x1} y1={q.y1} x2={q.x2} y2={q.y2} stroke={color(q.color, "red")} strokeWidth={q.width ?? 4} strokeLinecap="round" strokeDasharray={q.dashed ? "6 4" : undefined} />
        );
      case "arrow": {
        const c = q.color ?? "dark";
        const common = {
          stroke: COLORS[c],
          strokeWidth: 2,
          strokeLinecap: "round" as const,
          strokeDasharray: q.dashed ? "4 3" : undefined,
          markerEnd: `url(#${markerId(c)})`,
          fill: "none",
        };
        if (!q.bend) return <line key={q.id} x1={q.x1} y1={q.y1} x2={q.x2} y2={q.y2} {...common} />;
        const { cx, cy } = bend(q.x1, q.y1, q.x2, q.y2, q.bend);
        return <path key={q.id} d={`M${q.x1} ${q.y1} Q${cx} ${cy} ${q.x2} ${q.y2}`} {...common} />;
      }
      case "text":
        return (
          <text key={q.id} x={q.x} y={q.y} textAnchor="middle" dominantBaseline="central" fontSize={q.size ?? 12} fontWeight={700} fill={color(q.color, "dark")}>
            {q.text}
          </text>
        );
      case "bubble": {
        const size = q.size ?? 12;
        const bw = Math.max(24, q.text.length * size + 14);
        const bh = size + 12;
        return (
          <g key={q.id}>
            <rect x={q.x - bw / 2} y={q.y - bh / 2} width={bw} height={bh} rx={bh / 2.4} fill="#fff" stroke="#334155" strokeWidth={1} />
            <text x={q.x} y={q.y} textAnchor="middle" dominantBaseline="central" fontSize={size} fontWeight={700} fill={color(q.color, "dark")}>
              {q.text}
            </text>
          </g>
        );
      }
    }
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ aspectRatio: `${width} / ${height}` }} role="img" aria-label={label ?? "練習の場面図"} className={className}>
      <defs>
        {arrowColors.map((c) => (
          <marker key={c} id={markerId(c)} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={COLORS[c]} />
          </marker>
        ))}
      </defs>
      <rect width={width} height={height} rx={8} fill={FLOOR_COLORS[scene.floor ?? "wood"]} />
      {scene.court !== false && (
        <g fill="none" stroke="#fff" strokeWidth={2}>
          <rect x={x} y={y} width={w} height={h} />
          <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} strokeWidth={1.5} />
        </g>
      )}
      {scene.parts.map(part)}
    </svg>
  );
}
