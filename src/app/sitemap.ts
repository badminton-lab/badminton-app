import type { MetadataRoute } from "next";
import { drills } from "@/data/drills";
import { absoluteUrl } from "@/lib/site";

/** 公開ページの一覧。全メニューの個別ページを含む。 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/rules", priority: 0.8, changeFrequency: "monthly" },
    { path: "/trivia", priority: 0.6, changeFrequency: "monthly" },
    { path: "/gear", priority: 0.6, changeFrequency: "monthly" },
    { path: "/about", priority: 0.4, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.2, changeFrequency: "yearly" },
  ];

  return [
    ...pages.map((p) => ({
      url: absoluteUrl(p.path),
      lastModified: now,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })),
    ...drills.map((d) => ({
      url: absoluteUrl(`/menu/${d.id}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
