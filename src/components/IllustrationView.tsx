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

/** 輪郭線の色と太さ（scale = 1 のとき）。人は、すべて、この輪郭線で囲む */
const OUTLINE = "#3b3346";
const OUTLINE_W = 2.2;
const SKIN = "#fdd9b8";
const HAIR = "#5a3d2e";
const CHEEK = "#fb9aa0";
const SHOE = "#f8fafc";

/** 色を、白（t>0）や黒（t<0）に近づける。体の部分ごとの色分けに使う */
function shade(hex: string, t: number): string {
  const n = parseInt(hex.slice(1), 16);
  const mix = (v: number) => Math.round(t >= 0 ? v + (255 - v) * t : v * (1 + t));
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

type Pt = { x: number; y: number };

/** a から b へ、全体の t（0〜1）の位置 */
const lerp = (a: Pt, b: Pt, t: number): Pt => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });

/** 輪郭線つきの、太い折れ線（手足・胴体）。輪郭を先に描いてから、中の色を重ねるので、関節の継ぎ目に線が出ない */
function Stroke({ pts, w, fill, s, outline = true }: { pts: Pt[]; w: number; fill: string; s: number; outline?: boolean }) {
  const d = pts.map((q) => `${q.x},${q.y}`).join(" ");
  const common = { fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <>
      {outline && <polyline points={d} stroke={OUTLINE} strokeWidth={w + OUTLINE_W * s} {...common} />}
      <polyline points={d} stroke={fill} strokeWidth={w} {...common} />
    </>
  );
}

/**
 * 人（ちびキャラ）。骨組み（figureJoints）は変えず、見た目だけを、顔・髪・半袖・短パン・手・くつつきで描く。
 * 決まりは docs/ILLUSTRATION_RULES.md。
 */
function Person({ p }: { p: PersonPart }) {
  const j = figureJoints(p);
  const s = p.scale ?? 1;
  const f = p.flip ? -1 : 1;
  const front = p.feet === false; // 正面向き
  const c = color(p.color, "blue");
  const shirt = c;
  const shorts = shade(c, -0.38);
  const R = BODY.headR * s;
  const armW = 5.8 * s;
  const legW = 7 * s;
  const torsoW = (front ? 19 : 17) * s;

  // 手前（R）と、奥（L）。奥は、少し暗くして、手前と重なっても見分けられるようにする
  const limbs = (side: "L" | "R") => {
    const far = side === "L";
    const k = far ? -0.14 : 0;
    const skin = shade(SKIN, k);
    const sleeve = shade(shirt, far ? -0.2 : 0);
    const pants = shade(shorts, far ? 0.12 : 0);
    const shoulder = j.shoulder;
    const elbow = side === "L" ? j.elbowL : j.elbowR;
    const wrist = side === "L" ? j.wristL : j.wristR;
    const knee = side === "L" ? j.kneeL : j.kneeR;
    const ankle = side === "L" ? j.ankleL : j.ankleR;
    const shin = Math.hypot(ankle.x - knee.x, ankle.y - knee.y) || 1;
    // くつ：すねが立っているときは、進む向きへ。すねが寝ているとき（正座など）は、すねの延長へ
    const vx = (ankle.x - knee.x) / shin;
    const vy = (ankle.y - knee.y) / shin;
    const flat = Math.abs(vy) < 0.5;
    const toe: Pt = front
      ? { x: ankle.x + Math.sign(ankle.x - j.hip.x || 1) * 2.2 * s, y: ankle.y + 1.6 * s }
      : flat
        ? { x: ankle.x + vx * 6 * s, y: ankle.y + vy * 6 * s }
        : { x: ankle.x + f * 6.5 * s, y: ankle.y + 1.2 * s };
    const heel: Pt = front ? { x: ankle.x, y: ankle.y + 1.6 * s } : { x: ankle.x - (flat ? 0 : f * 1.2 * s), y: ankle.y + (flat ? 0 : 1.2 * s) };
    return (
      <g>
        {/* 脚：肌 → 短パン → くつ */}
        <Stroke pts={[j.hip, knee, ankle]} w={legW} fill={skin} s={s} />
        <Stroke pts={[j.hip, lerp(j.hip, knee, 0.5)]} w={legW + 1.6 * s} fill={pants} s={s} />
        <Stroke pts={[heel, toe]} w={6.2 * s} fill={far ? shade(SHOE, -0.12) : SHOE} s={s} />
        {/* 腕：肌 → 半袖 → 手 */}
        <Stroke pts={[shoulder, elbow, wrist]} w={armW} fill={skin} s={s} />
        <Stroke pts={[shoulder, lerp(shoulder, elbow, 0.62)]} w={armW + 1.8 * s} fill={sleeve} s={s} />
        <circle cx={wrist.x} cy={wrist.y} r={3.5 * s} fill={skin} stroke={OUTLINE} strokeWidth={OUTLINE_W * 0.7 * s} />
      </g>
    );
  };

  // 顔は、頭が向いている向きに合わせて回す（前屈やあお向けでも、顔が正しい向きになる）
  const headDir = { x: j.head.x - j.neck.x, y: j.head.y - j.neck.y };
  const tilt = (Math.atan2(headDir.x, -headDir.y) * 180) / Math.PI;
  // 横向きは、目を進行方向へ寄せる。正面は、中央に
  const eyes = front ? [-0.38, 0.38] : [0.1, 0.62];
  const mouthX = front ? 0 : 0.36;
  const hairTop = `M ${-R} ${0.12 * R} A ${R} ${R} 0 0 1 ${R} ${0.12 * R} Q ${0.62 * R} ${-0.42 * R} ${0.1 * R} ${-0.32 * R} Q ${-0.36 * R} ${-0.5 * R} ${-R} ${0.12 * R} Z`;
  const bust = lerp(j.hip, j.neck, 0.52);

  return (
    <g>
      {limbs("L")}
      {/* 胴体（シャツ）と、腰の短パン */}
      <Stroke pts={[j.hip, lerp(j.hip, j.neck, 0.9)]} w={torsoW} fill={shirt} s={s} />
      <Stroke pts={[j.hip, lerp(j.hip, j.neck, 0.14)]} w={torsoW} fill={shorts} s={s} />
      {p.label && (
        <g>
          <circle cx={bust.x} cy={bust.y} r={6.4 * s} fill="#fff" stroke={OUTLINE} strokeWidth={OUTLINE_W * 0.6 * s} />
          <text x={bust.x} y={bust.y} textAnchor="middle" dominantBaseline="central" fontSize={8.6 * s} fontWeight={800} fill="#1e293b">
            {p.label}
          </text>
        </g>
      )}
      {/* 頭 */}
      <g transform={`translate(${j.head.x} ${j.head.y}) rotate(${tilt}) scale(${f < 0 && !front ? -1 : 1} 1)`}>
        {p.hair === "ponytail" && !front && <ellipse cx={-1.02 * R} cy={-0.05 * R} rx={0.42 * R} ry={0.58 * R} fill={HAIR} stroke={OUTLINE} strokeWidth={OUTLINE_W * 0.8 * s} transform={`rotate(24 ${-R} 0)`} />}
        <circle r={R} fill={SKIN} stroke={OUTLINE} strokeWidth={OUTLINE_W * s} />
        {/* 髪（横向きは、うしろの髪を多めに） */}
        <path d={hairTop} fill={HAIR} stroke={OUTLINE} strokeWidth={OUTLINE_W * 0.7 * s} strokeLinejoin="round" />
        {!front && <path d={`M ${-R} ${0.12 * R} A ${R} ${R} 0 0 0 ${-0.55 * R} ${0.82 * R} Q ${-0.5 * R} ${0.2 * R} ${-0.15 * R} ${-0.1 * R} Z`} fill={HAIR} />}
        {eyes.map((ex, i) => (
          <ellipse key={i} cx={ex * R} cy={0.2 * R} rx={0.11 * R} ry={0.15 * R} fill={OUTLINE} />
        ))}
        {eyes.map((ex, i) => (
          <circle key={`c${i}`} cx={(ex + (front ? (ex < 0 ? -0.2 : 0.2) : i === 0 ? -0.12 : 0.14)) * R} cy={0.52 * R} r={0.13 * R} fill={CHEEK} opacity={0.7} />
        ))}
        <path d={`M ${(mouthX - 0.13) * R} ${0.5 * R} Q ${mouthX * R} ${0.68 * R} ${(mouthX + 0.13) * R} ${0.5 * R}`} fill="none" stroke={OUTLINE} strokeWidth={1.1 * s} strokeLinecap="round" />
      </g>
      {limbs("R")}
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

