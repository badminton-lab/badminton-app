import { execFile } from "node:child_process";
import { promisify } from "node:util";

// 開発用エディタ専用。本番ビルドでは常に 404 を返す。
// 編集で変わるデータファイルだけを、コミットしてプッシュする（ほかのファイルには触れない）。
const run = promisify(execFile);
const FILES = ["src/data/overrides.json", "src/data/content.json"];
const notFound = () => new Response("Not found", { status: 404 });
const isDev = () => process.env.NODE_ENV === "development";

async function git(args: string[], timeout = 60_000) {
  return run("git", args, { cwd: process.cwd(), timeout, env: { ...process.env, GIT_TERMINAL_PROMPT: "0" } });
}

async function status() {
  const branch = (await git(["rev-parse", "--abbrev-ref", "HEAD"])).stdout.trim();
  const porcelain = (await git(["status", "--porcelain", "--", ...FILES])).stdout;
  const changed = porcelain
    .split("\n")
    .filter(Boolean)
    .map((l) => l.slice(3));
  // まだプッシュしていないコミット数（上流がなければ 0）
  let unpushed = 0;
  try {
    unpushed = Number((await git(["rev-list", "--count", "@{u}..HEAD"])).stdout.trim()) || 0;
  } catch {
    unpushed = 0;
  }
  return { branch, changed, unpushed };
}

export async function GET() {
  if (!isDev()) return notFound();
  try {
    return Response.json(await status());
  } catch (e) {
    return Response.json({ error: `git の状態を取得できませんでした：${String((e as Error).message).slice(0, 200)}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isDev()) return notFound();
  const body = (await request.json().catch(() => null)) as { note?: unknown } | null;
  // メモは、コミットメッセージの末尾に添える（改行・制御文字は除く）
  const note = typeof body?.note === "string" ? body.note.replace(/[\u0000-\u001f]/g, " ").trim().slice(0, 80) : "";
  try {
    const before = await status();
    if (before.changed.length === 0 && before.unpushed === 0) {
      return Response.json({ ok: true, message: "公開していない変更はありません。", ...before });
    }
    if (before.changed.length > 0) {
      await git(["add", "--", ...FILES]);
      const message = `編集内容を更新（メニュー・サイトの内容）${note ? `：${note}` : ""}`;
      // 指定したファイルだけをコミットする（ほかの未コミットの変更は含めない）
      await git(["commit", "-m", message, "--", ...FILES]);
    }
    await git(["push"], 120_000);
    return Response.json({ ok: true, message: "コミットして、プッシュしました。公開サイトは、自動で作り直されます（ホスティングの設定による）。", ...(await status()) });
  } catch (e) {
    const err = e as { stderr?: string; message?: string };
    const detail = String(err.stderr || err.message || "").trim().slice(0, 400);
    return Response.json({ ok: false, error: `公開できませんでした。${detail}`, ...(await status().catch(() => ({}))) }, { status: 500 });
  }
}
