"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePlan } from "@/lib/plan";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const ITEMS = [
  {
    href: "/",
    label: "メニュー",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" {...stroke}>
        <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
      </svg>
    ),
  },
  {
    href: "/plan",
    label: "プラン",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" {...stroke}>
        <path d="M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1ZM8 6H6a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-2M9 12l2 2 4-4M9 17h6" />
      </svg>
    ),
  },
  {
    href: "/rules",
    label: "ルール",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" {...stroke}>
        <path d="M5 4a2 2 0 0 1 2-2h12v17H7a2 2 0 0 0-2 2V4ZM5 21a2 2 0 0 1 2-2h12M9 7h6M9 11h6" />
      </svg>
    ),
  },
  {
    href: "/trivia",
    label: "雑学",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" {...stroke}>
        <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z" />
      </svg>
    ),
  },
  {
    href: "/gear",
    label: "用品",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" {...stroke}>
        <path d="M6 7h12l1 13H5L6 7ZM9 7a3 3 0 0 1 6 0" />
      </svg>
    ),
  },
];

/** 片手（親指）で押せるよう、画面下に固定したナビゲーション */
export default function BottomNav() {
  const pathname = usePathname();
  const { plan } = usePlan();
  const planCount = plan.items.length;

  return (
    <nav
      aria-label="サイト内の移動"
      className="fixed inset-x-0 bottom-0 z-30 print:hidden border-t-2 border-slate-300 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-950/95"
    >
      <ul className="mx-auto grid max-w-3xl grid-cols-5">
        {ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-16 flex-col items-center justify-center gap-0.5 text-xs font-bold ${
                  active
                    ? "text-emerald-800 dark:text-emerald-300"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                <span
                  className={`relative flex h-8 w-14 items-center justify-center rounded-full ${
                    active ? "bg-emerald-200 dark:bg-emerald-900" : ""
                  }`}
                >
                  {item.icon}
                  {item.href === "/plan" && planCount > 0 && (
                    <span
                      aria-label={`${planCount}件`}
                      className="absolute -top-1 right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-xs font-bold text-white"
                    >
                      {planCount}
                    </span>
                  )}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
