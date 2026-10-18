/**
 * 開発用エディタのAPI（/api/dev/*）を守る。
 * 開発サーバーは、同じネットワークの他の端末や、開いているほかのサイトからも、届いてしまうことがある。
 * 保存や公開（git push）を、運営者本人の画面以外から、実行されないようにする。
 *  - 本番ビルドでは、常に 404（存在しないものとして扱う）
 *  - 宛先（Host）が localhost / 127.0.0.1 / [::1] のときだけ許可（ネットワーク越し・DNSの書き換え対策）
 *  - ブラウザが付ける送信元（Origin / Sec-Fetch-Site）が、同じ場所のものだけ許可（ほかのサイトからの送信対策）
 *  - 書き込み系は、JSON で送られたものだけ許可（フォーム形式での送信対策）
 */
const LOCAL_HOST = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;

export function devApiGuard(request: Request, opts: { write?: boolean } = {}): Response | null {
  if (process.env.NODE_ENV !== "development") return new Response("Not found", { status: 404 });
  const forbidden = (why: string) => Response.json({ error: why }, { status: 403 });

  const host = request.headers.get("host") ?? "";
  if (!LOCAL_HOST.test(host)) return forbidden("このAPIは、このパソコンの localhost からだけ使えます");

  const origin = request.headers.get("origin");
  if (origin) {
    let originHost = "";
    try {
      originHost = new URL(origin).host;
    } catch {
      return forbidden("送信元が不正です");
    }
    if (originHost !== host) return forbidden("ほかのサイトからは使えません");
  }
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") return forbidden("ほかのサイトからは使えません");

  if (opts.write && !(request.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json"))
    return forbidden("JSON 形式で送ってください");
  return null;
}
