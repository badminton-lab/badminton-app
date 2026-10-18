import { promises as fs } from "node:fs";
import path from "node:path";
import type { ContentOverrides } from "@/data/content";
import { COLLECTIONS, cleanCollection, cleanLines, cleanSite } from "@/data/contentSchema";
import { baseGuides } from "@/data/coachingGuides";
import { baseTroubles } from "@/data/coachingTroubles";
import { baseWorries } from "@/data/coachingWorries";
import { basePhrases } from "@/data/coachingPhrases";
import { baseGearGuides } from "@/data/gear";
import { baseProducts } from "@/data/products";
import { baseRules } from "@/data/rules";
import { baseQuiz } from "@/data/quiz";
import { baseShuttleNumbers, baseShuttlePoints, baseTrivia } from "@/data/trivia";

import { devApiGuard } from "@/lib/devGuard";

// 開発用エディタ専用。本番ビルドでは常に 404 を返す。
const FILE = path.join(process.cwd(), "src/data/content.json");

const KEYS = [...COLLECTIONS.map((c) => c.key), "shuttlePoints", "site"] as const;
type Key = (typeof KEYS)[number];

async function readSaved(): Promise<ContentOverrides> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    return {};
  }
}

/** 元データ（ソースコードに書かれている内容） */
const BASE = {
  rules: baseRules,
  trivia: baseTrivia,
  quiz: baseQuiz,
  shuttleNumbers: baseShuttleNumbers,
  gearGuides: baseGearGuides,
  products: baseProducts,
  guides: baseGuides,
  troubles: baseTroubles,
  worries: baseWorries,
  phrases: basePhrases,
  shuttlePoints: baseShuttlePoints,
  site: {},
};

async function state() {
  // 保存済みの内容は、ファイルから読み直す（import のキャッシュを使わない）
  return { base: BASE, saved: await readSaved() };
}

export async function GET(request: Request) {
  const denied = devApiGuard(request);
  if (denied) return denied;
  return Response.json(await state());
}

/** body: { key, value }。value が null なら、元データに戻す（保存した内容を消す） */
export async function PUT(request: Request) {
  const denied = devApiGuard(request, { write: true });
  if (denied) return denied;
  const body: unknown = await request.json().catch(() => null);
  const key = (body as { key?: unknown } | null)?.key;
  if (typeof key !== "string" || !(KEYS as readonly string[]).includes(key))
    return Response.json({ error: "項目が不正です" }, { status: 400 });
  const value = (body as { value?: unknown }).value;

  const all = (await readSaved()) as Record<string, unknown>;
  if (value === null) delete all[key];
  else {
    const col = COLLECTIONS.find((c) => c.key === key);
    const cleaned = col ? cleanCollection(col, value) : key === "shuttlePoints" ? cleanLines(value) : cleanSite(value);
    if (typeof cleaned === "string") return Response.json({ error: cleaned }, { status: 400 });
    all[key as Key] = cleaned;
  }
  await fs.writeFile(FILE, JSON.stringify(all, null, 2) + "\n", "utf8");
  return Response.json(await state());
}
