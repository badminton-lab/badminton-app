import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "バドミントン練習メニュー検索",
  description: "バドミントン指導者向けの練習メニュー検索アプリ",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
