"use client";

export default function FavoriteButton({
  active,
  onToggle,
  className = "",
}: {
  active: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "お気に入りから外す" : "お気に入りに追加"}
      onClick={onToggle}
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-3xl leading-none active:scale-90 ${
        active
          ? "text-amber-500 dark:text-amber-400"
          : "text-slate-500 hover:text-amber-500 dark:text-slate-400"
      } ${className}`}
    >
      {active ? "★" : "☆"}
    </button>
  );
}
