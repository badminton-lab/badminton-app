import { useId } from "react";
import type { ColorName, Illustration, IllustrationPart, PersonPart, RacketPart } from "@/data/types";
import {
  BODY,
  COLORS,
  GROUND_Y,
  ILLUSTRATION_SIZE,
  RACKET,
  figureJoints,
  racketPlacement,
} from "@/lib/figure";

const color = (c: ColorName | undefined, fallback: ColorName) => COLORS[c ?? fallback];

/** 手前側（R）の手足は、少し濃く。奥側（L）は、少し薄く描く */
const FAR_OPACITY = 0.62;

/** 色を、白（t>0）や黒（t<0）に近づける。体の部分ごとの色分けに使う */
function shade(hex: string, t: number): string {
  const n = parseInt(hex.slice(1), 16);
  const mix = (v: number) => Math.round(t >= 0 ? v + (255 - v) * t : v * (1 + t));
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

/** 点 b を、a の方向へ d だけ引き戻した点 */
function shortened(a: { x: number; y: number }, b: { x: number; y: number }, d: number) {
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  const k = Math.min(d, len * 0.5) / len;
  return { x: b.x - (b.x - a.x) * k, y: b.y - (b.y - a.y) * k };
}

function Person({ p }: { p: PersonPart }) {
  const j = figureJoints(p);
  const s = p.scale ?? 1;
  const c = color(p.color, "blue");
  const limb = 5.2 * s;
  const f = p.flip ? -1 : 1;
  // 胴体は太く、腕は明るい色、脚は暗い色にして、部分の違いが分かるようにする
  const front = p.feet === false;
  const bodyW = (front ? 16 : 12) * s;
  const armC = shade(c, 0.38);
  const legC = shade(c, -0.32);
  // 頭は、体より濃い色にして、体との境目を分かりやすくする
  const headC = shade(c, -0.35);
  const line = (a: { x: number; y: number }, b: { x: number; y: number }, w: number, op = 1, col = c) => (
    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={col} strokeWidth={w} strokeLinecap="round" opacity={op} />
  );
  const foot = (ankle: { x: number; y: number }, op = 1) =>
    p.feet === false ? null : line(ankle, { x: ankle.x + f * BODY.foot * s, y: ankle.y }, limb * 0.9, op, legC);
  return (
    <g>
      {/* 奥側の脚・腕 */}
      {line(j.hip, j.kneeL, limb, FAR_OPACITY, legC)}
      {line(j.kneeL, j.ankleL, limb, FAR_OPACITY, legC)}
      {foot(j.ankleL, FAR_OPACITY)}
      {line(j.shoulder, j.elbowL, limb * 0.9, FAR_OPACITY, armC)}
      {line(j.elbowL, j.wristL, limb * 0.9, FAR_OPACITY, armC)}
      {/* 体幹・頭 */}
      {/* 胴体。丸い端の分だけ短くして、先端が首の位置にくるようにする（頭との境目をはっきりさせる） */}
      {line(j.hip, shortened(j.hip, j.neck, bodyW * 0.45), bodyW)}
      {/* 首（胴体より細い） */}
      {line(j.neck, j.head, limb * 0.9)}
      <circle cx={j.head.x} cy={j.head.y} r={BODY.headR * s} fill={headC} stroke="#fff" strokeWidth={1.8 * s} />
      {/* 手前側の脚・腕 */}
      {line(j.hip, j.kneeR, limb, 1, legC)}
      {line(j.kneeR, j.ankleR, limb, 1, legC)}
      {foot(j.ankleR)}
      {line(j.shoulder, j.elbowR, limb * 0.9, 1, armC)}
      {line(j.elbowR, j.wristR, limb * 0.9, 1, armC)}
      {p.label && (
        <text
          x={j.head.x}
          y={j.head.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={8.5 * s}
          fontWeight={700}
          fill="#fff"
        >
          {p.label}
        </text>
      )}
    </g>
  );
}

function Racket({ r, parts }: { r: RacketPart; parts: IllustrationPart[] }) {
  const { grip, angle, scale } = racketPlacement(r, parts);
  const neck = RACKET.handle + RACKET.shaft;
  // 図は +y（下）向きに描き、向きに合わせて回す。angle は、0=下、90=右、180=上
  return (
    <g transform={`translate(${grip.x} ${grip.y}) rotate(${-angle}) scale(${scale})`}>
      <line x1={0} y1={0} x2={0} y2={RACKET.handle} stroke="#1e293b" strokeWidth={3.4} strokeLinecap="round" />
      <line x1={0} y1={RACKET.handle} x2={0} y2={neck} stroke="#475569" strokeWidth={1.6} strokeLinecap="round" />
      <ellipse
        cx={0}
        cy={neck + RACKET.headRy}
        rx={RACKET.headRx}
        ry={RACKET.headRy}
        fill="rgba(255,255,255,0.55)"
        stroke="#1e293b"
        strokeWidth={1.7}
      />
      <line x1={-RACKET.headRx + 1.4} y1={neck + RACKET.headRy} x2={RACKET.headRx - 1.4} y2={neck + RACKET.headRy} stroke="#94a3b8" strokeWidth={0.6} />
      <line x1={0} y1={neck + 1.4} x2={0} y2={neck + RACKET.headRy * 2 - 1.4} stroke="#94a3b8" strokeWidth={0.6} />
    </g>
  );
}

const arrowControl = (x1: number, y1: number, x2: number, y2: number, bend: number) => {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  return { cx: mx + (-dy / len) * bend, cy: my + (dx / len) * bend };
};

/**
 * 体・ラケット・道具のイメージ図。汎用的な部品（人・ラケット・シャトル・ボール・コーン・的・矢印・線・四角・文字）を、
 * 配列の順に重ねて描く。コート図がないメニューで使う。
 */
export default function IllustrationView({
  illustration,
  className,
  label,
}: {
  illustration: Illustration;
  className?: string;
  label?: string;
}) {
  const uid = useId();
  const { width, height } = ILLUSTRATION_SIZE;
  const parts = illustration.parts;
  const markerId = (c: ColorName) => `${uid}-m-${c}`;
  const usedArrowColors = Array.from(new Set(parts.filter((q) => q.type === "arrow").map((q) => (q.type === "arrow" ? q.color ?? "dark" : "dark"))));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ aspectRatio: `${width} / ${height}` }}
      role="img"
      aria-label={label ?? "練習のイメージ図"}
      className={className}
    >
      <defs>
        {usedArrowColors.map((c) => (
          <marker key={c} id={markerId(c)} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={COLORS[c]} />
          </marker>
        ))}
      </defs>

      <rect width={width} height={height} rx={8} fill="#ecfdf5" />
      {illustration.ground !== false && (
        <>
          <rect x={0} y={GROUND_Y} width={width} height={height - GROUND_Y} fill="#d1fae5" />
          <line x1={0} y1={GROUND_Y} x2={width} y2={GROUND_Y} stroke="#6ee7b7" strokeWidth={1.4} />
        </>
      )}

      {parts.map((q) => {
        const s = (q as { scale?: number }).scale ?? 1;
        switch (q.type) {
          case "person":
            return <Person key={q.id} p={q} />;
          case "racket":
            return <Racket key={q.id} r={q} parts={parts} />;
          case "shuttle": {
            const r = q.rotation ?? 0;
            return (
              <g key={q.id} transform={`translate(${q.x} ${q.y}) rotate(${-r}) scale(${s})`}>
                <path d="M-6 -15 L-2.4 -2 L2.4 -2 L6 -15 Z" fill="#fff" stroke="#334155" strokeWidth={0.9} strokeLinejoin="round" />
                <line x1={0} y1={-14.5} x2={0} y2={-2.4} stroke="#94a3b8" strokeWidth={0.6} />
                <circle cx={0} cy={0} r={3} fill="#f8fafc" stroke="#334155" strokeWidth={0.9} />
              </g>
            );
          }
          case "ball":
            return <circle key={q.id} cx={q.x} cy={q.y} r={5 * s} fill={color(q.color, "yellow")} stroke="#334155" strokeWidth={0.9} />;
          case "cone":
            return (
              <g key={q.id} transform={`translate(${q.x} ${q.y}) scale(${s})`}>
                <path d="M0 -14 L7 0 L-7 0 Z" fill={color(q.color, "orange")} stroke="#334155" strokeWidth={0.9} strokeLinejoin="round" />
                <line x1={-3.2} y1={-6} x2={3.2} y2={-6} stroke="#fff" strokeWidth={1.4} />
              </g>
            );
          case "ring":
            return <ellipse key={q.id} cx={q.x} cy={q.y} rx={14 * s} ry={5 * s} fill="none" stroke={color(q.color, "red")} strokeWidth={2.2 * Math.max(0.6, s)} />;
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
            const { cx, cy } = arrowControl(q.x1, q.y1, q.x2, q.y2, q.bend);
            return <path key={q.id} d={`M${q.x1} ${q.y1} Q${cx} ${cy} ${q.x2} ${q.y2}`} {...common} />;
          }
          case "line":
            return (
              <line
                key={q.id}
                x1={q.x1}
                y1={q.y1}
                x2={q.x2}
                y2={q.y2}
                stroke={color(q.color, "gray")}
                strokeWidth={q.width ?? 2}
                strokeLinecap="round"
                strokeDasharray={q.dashed ? "4 3" : undefined}
              />
            );
          case "rect":
            return <rect key={q.id} x={q.x} y={q.y} width={q.w} height={q.h} rx={2} fill={color(q.color, "gray")} opacity={0.85} />;
          case "text":
            return (
              <text
                key={q.id}
                x={q.x}
                y={q.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={q.size ?? 12}
                fontWeight={700}
                fill={color(q.color, "dark")}
                stroke="#ecfdf5"
                strokeWidth={3}
                paintOrder="stroke"
              >
                {q.text}
              </text>
            );
        }
      })}
    </svg>
  );
}

