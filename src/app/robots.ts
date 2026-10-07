import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 開発用の編集ページ・API と、個人の入力を扱うプランのページは、検索の対象にしない
      disallow: ["/editor", "/api/", "/plan"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
