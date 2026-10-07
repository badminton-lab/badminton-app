import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/** ホーム画面に追加したときの、名前・色・アイコン */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.fullName,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    lang: "ja",
    background_color: "#f8fafc",
    theme_color: "#047857",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
