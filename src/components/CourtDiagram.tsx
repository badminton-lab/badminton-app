import { useId } from "react";
import type { CourtType, DrillDiagram } from "@/data/drills";

// 1単位 = 10cm。コートは長さ13.4m × 幅6.1m（ダブルス）、シングルスはサイド各46cm内側。
const LENGTH = 134;
const WIDTH = 61;
const PAD = 6;
const NET = LENGTH / 2;
const SINGLES_SIDE = 4.6;
const DOUBLES_LONG_SERVICE = 7.6;
const SHORT_SERVICE = 19.8;
/** 選手の円の半径（SVG単位）。エディタが矢印の位置調整に使う */
export const PLAYER_RADIUS = 3.4;

const LINE = "#ffffff";
const LINE_W = 0.6;

/**
 * 図の向き。どれも真上から見た図を回転しただけで、左右が反転することはない。
 * vertical: 縦。x（長さ方向）が大きい側が下。
 * verticalFlipped: 縦。x が小さい側が下（vertical を180°回した向き）。
 * horizontal: 横。x が大きい側が右。
 */
export type Orientation = "vertical" | "verticalFlipped" | "horizontal";

/**
 * 図を見る人（ノッカー、いなければ練習者）が下に来るように、向きを決める。
 * ノッカーがいる図はノッカー側、いない図（1人のフットワークなど）は練習者側が下。
 */
export function autoOrientation(diagram?: DrillDiagram): Orientation {
  const players = diagram?.players ?? [];
  const feeders = players.filter((p) => p.role === "feeder");
  const anchors = feeders.length > 0 ? feeders : players.filter((p) => (p.role ?? "player") === "player");
  if (anchors.length === 0) return "vertical";
  const cx = anchors.reduce((sum, p) => sum + p.x, 0) / anchors.length;
  return cx >= 0.5 ? "vertical" : "verticalFlipped";
}

type Props = {
  courtType: CourtType;
  /** 位置・矢印はコート全体に対する0〜1の割合（x: 長さ方向 ネット=0.5、y: 幅方向）。 */
  diagram?: DrillDiagram;
  /** 省略すると autoOrientation で決める（見る人が下） */
  orientation?: Orientation;
  className?: string;
};

type Pt = { x: number; y: number };

/** コート上の位置（長さ方向 lx・幅方向 ly。単位は10cm、余白なし）を、SVG上の座標へ */
function project(orientation: Orientation) {
  switch (orientation) {
    case "vertical":
      return (lx: number, ly: number): [number, number] => [PAD + (WIDTH - ly), PAD + lx];
    case "verticalFlipped":
      return (lx: number, ly: number): [number, number] => [PAD + ly, PAD + (LENGTH - lx)];
    default:
      return (lx: number, ly: number): [number, number] => [PAD + lx, PAD + ly];
  }
}

export const courtViewBox = (orientation: Orientation = "vertical") =>
  orientation === "horizontal"
    ? { width: LENGTH + PAD * 2, height: WIDTH + PAD * 2 }
    : { width: WIDTH + PAD * 2, height: LENGTH + PAD * 2 };

// 開発用エディタが、画面上の位置と 0〜1 の座標を相互変換するために使う。
// orientation を省略すると横向きの変換になる（距離の計算など、向きに依存しない用途向け）。
export const courtToSvg = (p: Pt, orientation: Orientation = "horizontal") => {
  const [x, y] = project(orientation)(p.x * LENGTH, p.y * WIDTH);
  return { x, y };
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
// 微調整できるよう小数3桁まで保持する（1.0 = コート全長 13.4m → 約1.3cm 刻み）
const round3 = (v: number) => Math.round(v * 1000) / 1000;

export const svgToCourt = (x: number, y: number, orientation: Orientation = "horizontal"): Pt => {
  let lx: number, ly: number;
  if (orientation === "vertical") [lx, ly] = [y - PAD, WIDTH - (x - PAD)];
  else if (orientation === "verticalFlipped") [lx, ly] = [LENGTH - (y - PAD), x - PAD];
  else [lx, ly] = [x - PAD, y - PAD];
  return { x: round3(clamp01(lx / LENGTH)), y: round3(clamp01(ly / WIDTH)) };
};

export default function CourtDiagram({ courtType, diagram, orientation: orientationProp, className }: Props) {
  const orientation = orientationProp ?? autoOrientation(diagram);
  const uid = useId();
  const shotMarker = `${uid}-shot`;
  const moveMarker = `${uid}-move`;
  const players = diagram?.players ?? [];
  const arrows = diagram?.arrows ?? [];

  const f = project(orientation);
  const { width: vw, height: vh } = courtViewBox(orientation);
  const at = (p: Pt) => {
    const [x, y] = f(p.x * LENGTH, p.y * WIDTH);
    return { x, y };
  };

  // コート座標の2点で決まる長方形・線分を、向きに合わせて描く
  const rect = (lx1: number, ly1: number, lx2: number, ly2: number) => {
    const [ax, ay] = f(lx1, ly1);
    const [bx, by] = f(lx2, ly2);
    return { x: Math.min(ax, bx), y: Math.min(ay, by), width: Math.abs(bx - ax), height: Math.abs(by - ay) };
  };
  const line = (lx1: number, ly1: number, lx2: number, ly2: number) => {
    const [x1, y1] = f(lx1, ly1);
    const [x2, y2] = f(lx2, ly2);
    return <line x1={x1} y1={y1} x2={x2} y2={y2} />;
  };

  return (
    <svg
      viewBox={`0 0 ${vw} ${vh}`}
      // 高さだけを指定して使っても、縦横比が保たれるようにする
      style={{ aspectRatio: `${vw} / ${vh}` }}
      role="img"
      aria-label={`バドミントンコート図（${
        courtType === "singles" ? "シングルス" : courtType === "doubles" ? "ダブルス" : "シングルス/ダブルス兼用"
      }）`}
      className={className}
    >
      <defs>
        <marker id={shotMarker} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#fde047" />
        </marker>
        <marker id={moveMarker} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#ffffff" />
        </marker>
      </defs>

      {/* 外周とコート面 */}
      <rect x={0} y={0} width={vw} height={vh} rx={3} fill="#047857" />
      <rect {...rect(0, 0, LENGTH, WIDTH)} fill="#059669" />

      {/* シングルス: サイドのアレーはインプレー外なので暗くする */}
      {courtType === "singles" && (
        <g fill="#064e3b" opacity={0.55}>
          <rect {...rect(0, 0, LENGTH, SINGLES_SIDE)} />
          <rect {...rect(0, WIDTH - SINGLES_SIDE, LENGTH, WIDTH)} />
        </g>
      )}

      {/* ライン */}
      <g stroke={LINE} strokeWidth={LINE_W} fill="none" strokeLinecap="square">
        <rect {...rect(0, 0, LENGTH, WIDTH)} />
        {/* シングルス サイドライン */}
        {line(0, SINGLES_SIDE, LENGTH, SINGLES_SIDE)}
        {line(0, WIDTH - SINGLES_SIDE, LENGTH, WIDTH - SINGLES_SIDE)}
        {/* ダブルス ロングサービスライン */}
        {line(DOUBLES_LONG_SERVICE, 0, DOUBLES_LONG_SERVICE, WIDTH)}
        {line(LENGTH - DOUBLES_LONG_SERVICE, 0, LENGTH - DOUBLES_LONG_SERVICE, WIDTH)}
        {/* ショートサービスライン */}
        {line(NET - SHORT_SERVICE, 0, NET - SHORT_SERVICE, WIDTH)}
        {line(NET + SHORT_SERVICE, 0, NET + SHORT_SERVICE, WIDTH)}
        {/* センターライン（ショートサービスライン〜バックライン） */}
        {line(0, WIDTH / 2, NET - SHORT_SERVICE, WIDTH / 2)}
        {line(NET + SHORT_SERVICE, WIDTH / 2, LENGTH, WIDTH / 2)}
      </g>

      {/* ネット */}
      <g stroke="#0f172a" strokeWidth={1.4}>{line(NET, -2.5, NET, WIDTH + 2.5)}</g>
      <g stroke="#e2e8f0" strokeWidth={0.5} strokeDasharray="1 1">{line(NET, -2.5, NET, WIDTH + 2.5)}</g>

      {/* 矢印: shot=シャトルの軌道（破線の曲線）, move=選手の移動（実線） */}
      <g fill="none" strokeLinecap="round">
        {arrows.map((a, i) => {
          const { x: x1, y: y1 } = at(a.from);
          const { x: x2, y: y2 } = at(a.to);
          if (a.kind === "move") {
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth={0.9} markerEnd={`url(#${moveMarker})`} />
            );
          }
          // 軌道は進行方向に対して垂直に少し膨らませる
          const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
          const dx = x2 - x1, dy = y2 - y1;
          const len = Math.hypot(dx, dy) || 1;
          const bend = Math.min(len * 0.18, 9);
          const cx = mx + (-dy / len) * bend, cy = my + (dx / len) * bend;
          return (
            <path
              key={i}
              d={`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`}
              stroke="#fde047"
              strokeWidth={1}
              strokeDasharray="2.4 1.6"
              markerEnd={`url(#${shotMarker})`}
            />
          );
        })}
      </g>

      {/* 選手 */}
      {players.map((p, i) => {
        const c = at(p);
        return (
          <g key={i}>
            <circle
              cx={c.x}
              cy={c.y}
              r={PLAYER_RADIUS}
              fill={p.role === "feeder" ? "#f97316" : p.role === "opponent" ? "#64748b" : "#2563eb"}
              stroke="#fff"
              strokeWidth={0.6}
            />
            {p.label && (
              <text x={c.x} y={c.y} textAnchor="middle" dominantBaseline="central" fontSize={4} fontWeight={700} fill="#fff">
                {p.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
