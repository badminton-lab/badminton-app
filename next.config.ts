import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

/**
 * 公開サイトに付ける、防御用の応答ヘッダー。
 * - CSP は本番だけ（開発中は、画面の更新などに別の許可が要るため）。
 * - script-src の 'unsafe-inline' は、Next.js が埋め込む初期化スクリプトと、テーマ切り替えの小さなスクリプトのため。
 *   （毎回違う値を付ける方式は、全ページを都度描画にするため、静的な公開サイトには使わない）
 * - connect-src の formspree.io は、サイト設定の「お問い合わせフォームの送信先URL」を使う場合のため。別のサービスにするときは、ここも直す。
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://formspree.io",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  ...(isProd ? [{ key: "Content-Security-Policy", value: csp }] : []),
];

const nextConfig: NextConfig = {
  // 「X-Powered-By: Next.js」を出さない（使っている技術を、わざわざ知らせない）
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
