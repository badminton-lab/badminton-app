import { useId } from "react";
import type { CourtType, DrillDiagram } from "@/data/drills";

// 1単位 = 10cm。コートは長さ13.4m × 幅6.1m（ダブルス）、シングルスはサイド各46cm内側。
const LENGTH = 134;
const WIDTH = 61;
const PAD = 6;
const NET_X = LENGTH / 2;
const SINGLES_SIDE = 4.6;
const DOUBLES_LONG_SERVICE = 7.6;
const SHORT_SERVICE = 19.8;
const PLAYER_R = 3.4;

const LINE = "#ffffff";
const LINE_W = 0.6;

type Props = {
  courtType: CourtType;
  /** 位置・矢印はコート全体に対する0〜1の割合（x: 長さ方向 左→右、y: 幅方向 上→下）。 */
  diagram?: DrillDiagram;
  className?: string;
};

const px = (x: number) => PAD + x * LENGTH;
const py = (y: number) => PAD + y * WIDTH;

export default function CourtDiagram({ courtType, diagram, className }: Props) {
  const uid = useId();
  const shotMarker = `${uid}-shot`;
  const moveMarker = `${uid}-move`;
  const players = diagram?.players ?? [];
  const arrows = diagram?.arrows ?? [];

  const L = (x1: number, y1: number, x2: number, y2: number) => (
    <line x1={PAD + x1} y1={PAD + y1} x2={PAD + x2} y2={PAD + y2} />
  );

  return (
    <svg
      viewBox={`0 0 ${LENGTH + PAD * 2} ${WIDTH + PAD * 2}`}
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
      <rect x={0} y={0} width={LENGTH + PAD * 2} height={WIDTH + PAD * 2} rx={3} fill="#047857" />
      <rect x={PAD} y={PAD} width={LENGTH} height={WIDTH} fill="#059669" />

      {/* シングルス: サイドのアレーはインプレー外なので暗くする */}
      {courtType === "singles" && (
        <g fill="#064e3b" opacity={0.55}>
          <rect x={PAD} y={PAD} width={LENGTH} height={SINGLES_SIDE} />
          <rect x={PAD} y={PAD + WIDTH - SINGLES_SIDE} width={LENGTH} height={SINGLES_SIDE} />
        </g>
      )}

      {/* ライン */}
      <g stroke={LINE} strokeWidth={LINE_W} fill="none" strokeLinecap="square">
        <rect x={PAD} y={PAD} width={LENGTH} height={WIDTH} />
        {/* シングルス サイドライン */}
        {L(0, SINGLES_SIDE, LENGTH, SINGLES_SIDE)}
        {L(0, WIDTH - SINGLES_SIDE, LENGTH, WIDTH - SINGLES_SIDE)}
        {/* ダブルス ロングサービスライン */}
        {L(DOUBLES_LONG_SERVICE, 0, DOUBLES_LONG_SERVICE, WIDTH)}
        {L(LENGTH - DOUBLES_LONG_SERVICE, 0, LENGTH - DOUBLES_LONG_SERVICE, WIDTH)}
        {/* ショートサービスライン */}
        {L(NET_X - SHORT_SERVICE, 0, NET_X - SHORT_SERVICE, WIDTH)}
        {L(NET_X + SHORT_SERVICE, 0, NET_X + SHORT_SERVICE, WIDTH)}
        {/* センターライン（ショートサービスライン〜バックライン） */}
        {L(0, WIDTH / 2, NET_X - SHORT_SERVICE, WIDTH / 2)}
        {L(NET_X + SHORT_SERVICE, WIDTH / 2, LENGTH, WIDTH / 2)}
      </g>

      {/* ネット */}
      <line x1={px(0.5)} y1={PAD - 2.5} x2={px(0.5)} y2={PAD + WIDTH + 2.5} stroke="#0f172a" strokeWidth={1.4} />
      <line x1={px(0.5)} y1={PAD - 2.5} x2={px(0.5)} y2={PAD + WIDTH + 2.5} stroke="#e2e8f0" strokeWidth={0.5} strokeDasharray="1 1" />

      {/* 矢印: shot=シャトルの軌道（破線の曲線）, move=選手の移動（実線） */}
      <g fill="none" strokeLinecap="round">
        {arrows.map((a, i) => {
          const x1 = px(a.from.x), y1 = py(a.from.y), x2 = px(a.to.x), y2 = py(a.to.y);
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
      {players.map((p, i) => (
        <g key={i}>
          <circle
            cx={px(p.x)}
            cy={py(p.y)}
            r={PLAYER_R}
            fill={p.role === "feeder" ? "#f97316" : p.role === "opponent" ? "#64748b" : "#2563eb"}
            stroke="#fff"
            strokeWidth={0.6}
          />
          {p.label && (
            <text x={px(p.x)} y={py(p.y)} textAnchor="middle" dominantBaseline="central" fontSize={4} fontWeight={700} fill="#fff">
              {p.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
