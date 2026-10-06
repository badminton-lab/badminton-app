"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createLocalStore } from "@/lib/localStore";

type Theme = "auto" | "light" | "dark";

const store = createLocalStore<Theme>(
  "badminton-theme",
  (raw) => (raw === "light" || raw === "dark" ? raw : "auto"),
  "auto",
);

const NEXT: Record<Theme, Theme> = { auto: "light", light: "dark", dark: "auto" };
const LABEL: Record<Theme, string> = {
  auto: "🌓 自動",
  light: "☀️ ライト",
  dark: "🌙 ダーク",
};

function apply(theme: Theme) {
  const dark =
    theme === "dark" ||
    (theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  useEffect(() => {
    apply(theme);
    if (theme !== "auto") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply("auto");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => store.write(NEXT[theme])}
      aria-label={`表示モード: ${LABEL[theme]}（タップで切り替え）`}
      className="min-h-12 rounded-full border-2 border-slate-400 px-4 text-sm font-bold text-slate-900 active:scale-95 dark:border-slate-500 dark:text-slate-100"
    >
      {LABEL[theme]}
    </button>
  );
}
