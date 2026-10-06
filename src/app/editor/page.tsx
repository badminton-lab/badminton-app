import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EditorApp from "@/components/editor/EditorApp";

export const metadata: Metadata = {
  title: "メニュー編集（開発用）",
  robots: { index: false },
};

export default function EditorPage() {
  // 開発サーバーでのみ使える。本番では存在しないページとして扱う。
  if (process.env.NODE_ENV !== "development") notFound();
  return <EditorApp />;
}
