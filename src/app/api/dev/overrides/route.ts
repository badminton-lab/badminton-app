import { promises as fs } from "node:fs";
import path from "node:path";
import {
  CATEGORY_LABELS,
  COURT_TYPE_LABELS,
  LEVEL_LABELS,
  TIMING_LABELS,
  rawDrills,
  type Drill,
} from "@/data/drills";
import {
  EDITABLE_KEYS,
  stable,
  type DrillOverride,
} from "@/data/overrides";

// 開発用エディタ専用。本番ビルドでは常に 404 を返す。
const FILE = path.join(process.cwd(), "src/data/overrides.json");
const notFound = () => new Response("Not found", { status: 404 });
const isDev = () => process.env.NODE_ENV === "development";

async function readAll(): Promise<Record<string, DrillOverride>> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    return {};
  }
}

async function writeAll(data: Record<string, DrillOverride>) {
  const sorted = Object.fromEntries(Object.entries(data).sort(([a], [b]) => a.localeCompare(b)));
  await fs.writeFile(FILE, JSON.stringify(sorted, null, 2) + "\n", "utf8");
}

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object";
const isStr = (v: unknown): v is string => typeof v === "string";
const isCoord = (v: unknown): v is number => typeof v === "number" && v >= 0 && v <= 1;
const isPoint = (v: unknown) => isObj(v) && isCoord(v.x) && isCoord(v.y);

/** エディタから届いたデータを検証し、保存してよい形に整える。不正なら理由の文字列を返す。 */

const PART_TYPES = ["person", "racket", "shuttle", "ball", "cone", "ring", "arrow", "line", "rect", "text"];
const COLOR_KEYS = ["blue", "orange", "gray", "green", "red", "yellow", "dark"];
const num = (v: unknown, min = -1000, max = 1000): v is number => typeof v === "number" && Number.isFinite(v) && v >= min && v <= max;
const optNum = (v: unknown, min?: number, max?: number) => v === undefined || num(v, min, max);
const optColor = (v: unknown) => v === undefined || (isStr(v) && COLOR_KEYS.includes(v));
const optBool = (v: unknown) => v === undefined || typeof v === "boolean";
const pair = (v: unknown): v is [number, number] => Array.isArray(v) && v.length === 2 && v.every((n) => num(n, -720, 720));

/** イメージ図（部品の組み合わせ）を検証する。不正なら文字列、図がなければ undefined */
function parseIllustration(v: unknown): Drill["illustration"] | string {
  if (v === undefined || v === null) return undefined;
  const bad = "イメージ図が不正です";
  if (!isObj(v) || !Array.isArray(v.parts) || v.parts.length > 60) return bad;
  if (!optBool(v.ground)) return bad;
  const ids = new Set<string>();
  for (const q of v.parts) {
    if (!isObj(q) || !isStr(q.id) || !q.id || q.id.length > 20 || ids.has(q.id) || !isStr(q.type) || !PART_TYPES.includes(q.type)) return bad;
    ids.add(q.id);
    if (!optColor(q.color) || !optNum(q.scale, 0.1, 5)) return bad;
    switch (q.type) {
      case "person": {
        const po = q.pose;
        if (!num(q.x, -100, 420) || !num(q.y, -100, 300) || !optBool(q.flip) || !optBool(q.feet)) return bad;
        if (q.label !== undefined && (!isStr(q.label) || q.label.length > 3)) return bad;
        if (!isObj(po) || !num(po.torso, -720, 720) || !num(po.head, -720, 720)) return bad;
        if (!pair(po.armL) || !pair(po.armR) || !pair(po.legL) || !pair(po.legR)) return bad;
        break;
      }
      case "racket":
        if (!num(q.x, -100, 420) || !num(q.y, -100, 300) || !num(q.rotation, -720, 720)) return bad;
        if (q.attach !== undefined && !(isObj(q.attach) && isStr(q.attach.to) && (q.attach.hand === "L" || q.attach.hand === "R"))) return bad;
        break;
      case "shuttle":
        if (!num(q.x, -100, 420) || !num(q.y, -100, 300) || !optNum(q.rotation, -720, 720)) return bad;
        break;
      case "arrow":
      case "line":
        if (!num(q.x1, -100, 420) || !num(q.y1, -100, 300) || !num(q.x2, -100, 420) || !num(q.y2, -100, 300)) return bad;
        if (!optBool(q.dashed) || !optNum(q.bend, -300, 300) || !optNum(q.width, 0.1, 20)) return bad;
        break;
      case "rect":
        if (!num(q.x, -100, 420) || !num(q.y, -100, 300) || !num(q.w, 1, 500) || !num(q.h, 1, 400)) return bad;
        break;
      case "text":
        if (!num(q.x, -100, 420) || !num(q.y, -100, 300) || !isStr(q.text) || q.text.length > 40 || !optNum(q.size, 4, 40)) return bad;
        break;
      default:
        if (!num(q.x, -100, 420) || !num(q.y, -100, 300)) return bad;
    }
  }
  return v as Drill["illustration"];
}

const SCENE_TYPES = ["token", "zone", "line", "arrow", "text", "bubble", "prop"];
const PROPS = ["tail", "balloon", "racket", "shuttle", "ball", "cone", "hoop", "treasure", "flag", "basket"];

/** 場面図を検証する。不正なら文字列、図がなければ undefined */
function parseScene(v: unknown): Drill["scene"] | string {
  if (v === undefined || v === null) return undefined;
  const bad = "場面図が不正です";
  if (!isObj(v) || !Array.isArray(v.parts) || v.parts.length > 80) return bad;
  if (!optBool(v.court) || (v.floor !== undefined && v.floor !== "wood" && v.floor !== "plain")) return bad;
  const ids = new Set<string>();
  for (const q of v.parts) {
    if (!isObj(q) || !isStr(q.id) || !q.id || q.id.length > 20 || ids.has(q.id) || !isStr(q.type) || !SCENE_TYPES.includes(q.type)) return bad;
    ids.add(q.id);
    if (!optColor(q.color) || !optNum(q.scale, 0.1, 5)) return bad;
    switch (q.type) {
      case "token":
        if (!num(q.x, -100, 420) || !num(q.y, -100, 300) || !optNum(q.dir, -720, 720)) return bad;
        if (q.label !== undefined && (!isStr(q.label) || q.label.length > 3)) return bad;
        break;
      case "zone":
        if (!num(q.x, -100, 420) || !num(q.y, -100, 300) || !num(q.w, 1, 500) || !num(q.h, 1, 400) || !optBool(q.round)) return bad;
        if (q.label !== undefined && (!isStr(q.label) || q.label.length > 20)) return bad;
        break;
      case "line":
      case "arrow":
        if (!num(q.x1, -100, 420) || !num(q.y1, -100, 300) || !num(q.x2, -100, 420) || !num(q.y2, -100, 300)) return bad;
        if (!optBool(q.dashed) || !optNum(q.bend, -300, 300) || !optNum(q.width, 0.1, 20)) return bad;
        break;
      case "text":
      case "bubble":
        if (!num(q.x, -100, 420) || !num(q.y, -100, 300) || !isStr(q.text) || q.text.length > 40 || !optNum(q.size, 4, 40)) return bad;
        break;
      case "prop":
        if (!num(q.x, -100, 420) || !num(q.y, -100, 300) || !isStr(q.kind) || !PROPS.includes(q.kind) || !optNum(q.rotation, -720, 720)) return bad;
        break;
    }
  }
  return v as Drill["scene"];
}

function parseDrill(input: unknown, id: string): Drill | string {
  if (!isObj(input)) return "データが不正です";
  const { title, description, duration, feedPattern, shots, minPlayers, maxPlayers } = input;
  if (!isStr(title) || !title.trim()) return "タイトルを入力してください";
  if (!isStr(description) || !isStr(duration) || !isStr(feedPattern)) return "文面が不正です";
  if (!Number.isInteger(minPlayers) || !Number.isInteger(maxPlayers)) return "人数が不正です";
  if ((minPlayers as number) < 1 || (maxPlayers as number) < (minPlayers as number))
    return "人数は 1 以上で、最大は最小以上にしてください";
  if (!isStr(input.level) || !(input.level in LEVEL_LABELS)) return "レベルが不正です";
  if (!isStr(input.category) || !(input.category in CATEGORY_LABELS)) return "区分が不正です";
  if (!isStr(input.courtType) || !(input.courtType in COURT_TYPE_LABELS)) return "種目が不正です";
  if (!Array.isArray(input.coachingPoints) || !input.coachingPoints.every(isStr))
    return "指導のコツが不正です";

  let diagram: Drill["diagram"];
  if (input.diagram !== undefined && input.diagram !== null) {
    if (!isObj(input.diagram)) return "コート図が不正です";
    const { players = [], arrows = [] } = input.diagram;
    if (!Array.isArray(players) || !Array.isArray(arrows)) return "コート図が不正です";
    if (!players.every((p) => isPoint(p))) return "選手の位置が不正です";
    if (
      !arrows.every(
        (a) =>
          isObj(a) &&
          isPoint(a.from) &&
          isPoint(a.to) &&
          (a.kind === "shot" || a.kind === "move") &&
          (a.order === undefined || (Number.isInteger(a.order) && (a.order as number) >= 1 && (a.order as number) <= 99)),
      )
    )
      return "矢印が不正です";
    // 要素が0個の図も有効（コートだけを表示する）。図を使わない場合は diagram 自体を持たない。
    diagram = { players, arrows } as Drill["diagram"];
  }

  const illustration = parseIllustration(input.illustration);
  if (typeof illustration === "string") return illustration;
  const scene = parseScene(input.scene);
  if (typeof scene === "string") return scene;

  // 深掘りの項目（すべて任意）。空のものは保存しない
  const list = (v: unknown): string[] | undefined | "invalid" => {
    if (v === undefined || v === null) return undefined;
    if (!Array.isArray(v) || !v.every(isStr)) return "invalid";
    const items = v.map((t) => t.trim()).filter(Boolean);
    return items.length > 0 ? items : undefined;
  };
  const lists = {
    equipment: list(input.equipment),
    steps: list(input.steps),
    variations: list(input.variations),
    commonMistakes: list(input.commonMistakes),
    feederTips: list(input.feederTips),
    safety: list(input.safety),
  };
  if (Object.values(lists).includes("invalid" as never)) return "深掘りの項目が不正です";
  if (input.purpose !== undefined && input.purpose !== null && !isStr(input.purpose)) return "ねらいが不正です";
  if (input.timing !== undefined && input.timing !== null && !(isStr(input.timing) && input.timing in TIMING_LABELS))
    return "実施時期が不正です";

  return {
    id,
    ...(lists as Record<string, string[] | undefined>),
    purpose: isStr(input.purpose) && input.purpose.trim() ? input.purpose.trim() : undefined,
    timing: isStr(input.timing) ? (input.timing as Drill["timing"]) : undefined,
    reviewed: input.reviewed === true ? true : undefined,
    title: title.trim(),
    description: description.trim(),
    minPlayers: minPlayers as number,
    maxPlayers: maxPlayers as number,
    level: input.level as Drill["level"],
    category: input.category as Drill["category"],
    courtType: input.courtType as Drill["courtType"],
    duration: duration.trim(),
    shots: isStr(shots) && shots.trim() ? shots.trim() : undefined,
    feedPattern: feedPattern.trim(),
    coachingPoints: input.coachingPoints.map((s) => s.trim()).filter(Boolean),
    diagram,
    illustration,
    scene,
  };
}

export async function GET() {
  if (!isDev()) return notFound();
  return Response.json(await readAll());
}

export async function PUT(request: Request) {
  if (!isDev()) return notFound();
  const body: unknown = await request.json().catch(() => null);
  if (!isObj(body) || !isStr(body.id)) return Response.json({ error: "id がありません" }, { status: 400 });

  const base = rawDrills.find((d) => d.id === body.id);
  if (!base) return Response.json({ error: "存在しないメニューです" }, { status: 404 });

  const parsed = parseDrill(body.drill, base.id);
  if (typeof parsed === "string") return Response.json({ error: parsed }, { status: 400 });

  // 元データとの差分だけを保存する
  const diff: Record<string, unknown> = {};
  for (const key of EDITABLE_KEYS) {
    if (stable(base[key] ?? null) !== stable(parsed[key] ?? null)) diff[key] = parsed[key] ?? null;
  }

  const all = await readAll();
  if (Object.keys(diff).length > 0) all[base.id] = diff as DrillOverride;
  else delete all[base.id];
  await writeAll(all);
  return Response.json(all);
}

export async function DELETE(request: Request) {
  if (!isDev()) return notFound();
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ error: "id がありません" }, { status: 400 });
  const all = await readAll();
  delete all[id];
  await writeAll(all);
  return Response.json(all);
}
