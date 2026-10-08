import type { Category, Drill } from "@/data/types";

export function playersLabel(drill: Pick<Drill, "minPlayers" | "maxPlayers">): string {
  return drill.minPlayers === drill.maxPlayers
    ? `${drill.minPlayers}人`
    : `${drill.minPlayers}〜${drill.maxPlayers}人`;
}

/** 「進め方」の見出し（区分ごとに言い方を変える） */
export const FEED_HEADING: Record<Category, string> = {
  pattern: "球出し・配球パターン",
  drill: "やり方・進め方",
  handFeed: "球出し・配球パターン",
  racketFeed: "球出し・配球パターン",
  footwork: "動き方・進め方",
  warmup: "進め方",
  stretch: "やり方",
  play: "ルール・進め方",
};

/**
 * 推奨時間の文字列から、おおよその合計分数を推定する。
 * 例: "3分×4セット" → 12、"30秒×6セット" → 3、"5分（各20回×3セット）" → 5。
 * 読み取れないとき（回数・球数だけの表記など）は null。
 */
export function estimateMinutes(duration: string): number | null {
  const min = duration.match(/(\d+)\s*分(?:\s*[×x]\s*(\d+))?/);
  if (min) {
    const total = Number(min[1]) * (min[2] ? Number(min[2]) : 1);
    return clamp(total);
  }
  const sec = duration.match(/(\d+)\s*秒(?:\s*[×x]\s*(\d+))?/);
  if (sec) {
    const total = Math.ceil((Number(sec[1]) * (sec[2] ? Number(sec[2]) : 1)) / 60);
    return clamp(total);
  }
  return null;
}

const clamp = (n: number) => Math.min(120, Math.max(1, n));

/** プランに追加するときの、時間の初期値（分） */
export const DEFAULT_PLAN_MINUTES = 10;
