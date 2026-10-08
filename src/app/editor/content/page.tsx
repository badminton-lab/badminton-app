import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentEditor from "@/components/editor/ContentEditor";

export const metadata: Metadata = {
  title: "サイトの内容を編集（開発用）",
  robots: { index: false },
};

export default function ContentEditorPage() {
  // 開発サーバーでのみ使える。本番では存在しないページとして扱う。
  if (process.env.NODE_ENV !== "development") notFound();
  return <ContentEditor />;
}
