import type { Metadata, Viewport } from "next";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import { SITE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  // 相対パスの canonical や、SNS共有画像のURLを、完全なURLにするための基準
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE.fullName,
    // 各ページの title の後ろにサイト名をつける
    template: `%s | ${SITE.fullName}`,
  },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.fullName,
    locale: SITE.locale,
    title: SITE.fullName,
    description: SITE.description,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#047857",
};

const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem('badminton-theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* 初回描画前にテーマを適用してチラつきを防ぐ */}
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_INIT_SCRIPT,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE.fullName,
            url: SITE_URL,
            inLanguage: "ja",
            description: SITE.description,
          }}
        />
        {children}
      </body>
    </html>
  );
}
