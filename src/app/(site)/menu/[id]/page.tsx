import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CourtDiagram from "@/components/CourtDiagram";
import IllustrationView from "@/components/IllustrationView";
import SceneView from "@/components/SceneView";
import JsonLd from "@/components/JsonLd";
import MenuActions from "@/components/MenuActions";
import {
  CATEGORY_LABELS,
  COURT_TYPE_LABELS,
  LEVEL_HELP,
  LEVEL_LABELS,
  TIMING_HELP,
  TIMING_LABELS,
  SHOW_UNREVIEWED,
  allDrills,
  drills,
  type Drill,
} from "@/data/drills";
import { DEFAULT_PLAN_MINUTES, FEED_HEADING, estimateMinutes, playersLabel } from "@/lib/drillText";
import { SITE, absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ id: string }> };

/** 全メニューを、ビルド時に静的なページとして作る */
export function generateStaticParams() {
  return drills.map((d) => ({ id: d.id }));
}

// 公開サイトでは、確認済みのメニューだけ。開発中は、編集ページから、確認前のメニューもプレビューできる。
const isDev = process.env.NODE_ENV === "development";
const find = (id: string) => (isDev || SHOW_UNREVIEWED ? allDrills : drills).find((d) => d.id === id);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const drill = find((await params).id);
  if (!drill) return {};
  return {
    title: `${drill.title}｜${CATEGORY_LABELS[drill.category]}`,
    description: `${drill.description}（${LEVEL_LABELS[drill.level]}・${playersLabel(drill)}・${drill.duration}）`,
    alternates: { canonical: `/menu/${drill.id}` },
    // 子ページで openGraph を指定すると、親の共有画像が引き継がれないため、画像も明示する
    openGraph: {
      type: "article",
      siteName: SITE.fullName,
      locale: SITE.locale,
      title: drill.title,
      description: drill.description,
      url: `/menu/${drill.id}`,
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", images: ["/opengraph-image.png"] },
  };
}

const levelStyles = {
  beginner: "bg-sky-200 text-sky-950 dark:bg-sky-900 dark:text-sky-100",
  intermediate: "bg-amber-200 text-amber-950 dark:bg-amber-900 dark:text-amber-100",
  advanced: "bg-rose-200 text-rose-950 dark:bg-rose-900 dark:text-rose-100",
} as const;

const legend = [
  { color: "bg-blue-600", label: "練習者" },
  { color: "bg-orange-500", label: "ノッカー（出し手）" },
  { color: "bg-slate-500", label: "相手" },
];

/** ストレッチ共通の注意 */
const STRETCH_SAFETY = [
  "痛みを感じる手前で止めます。",
  "反動をつけず、息を止めずに、ゆっくり行います。",
  "痛みやしびれが続くときは中止して、医療機関に相談してください。",
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border-2 border-slate-300 bg-white p-4 dark:border-slate-600 dark:bg-slate-900 print:border-slate-400">
      <h2 className="mb-2 text-base font-bold">{title}</h2>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((t) => (
        <li key={t} className="flex gap-2 text-base leading-relaxed">
          <span aria-hidden="true" className="font-bold text-emerald-700 dark:text-emerald-400">
            ・
          </span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="flex flex-col gap-2">
      {items.map((t, i) => (
        <li key={t} className="flex gap-3 text-base leading-relaxed">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white dark:bg-emerald-400 dark:text-slate-950">
            {i + 1}
          </span>
          <span>{t}</span>
        </li>
      ))}
    </ol>
  );
}

function related(drill: Drill): Drill[] {
  const same = drills.filter((d) => d.category === drill.category && d.id !== drill.id);
  // 同じレベルを先に、同じ区分の中で近い順に
  return [...same.filter((d) => d.level === drill.level), ...same.filter((d) => d.level !== drill.level)].slice(0, 6);
}

export default async function MenuPage({ params }: Props) {
  const drill = find((await params).id);
  if (!drill) notFound();

  const sameCategory = drills.filter((d) => d.category === drill.category);
  const index = sameCategory.findIndex((d) => d.id === drill.id);
  const prev = sameCategory[index - 1];
  const next = sameCategory[index + 1];
  const defaultMinutes = estimateMinutes(drill.duration) ?? DEFAULT_PLAN_MINUTES;
  const isStretch = drill.category === "stretch";
  const safety = [...(drill.safety ?? []), ...(isStretch ? STRETCH_SAFETY : [])];

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "練習メニュー", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: CATEGORY_LABELS[drill.category], item: absoluteUrl(`/?c=${drill.category}`) },
            { "@type": "ListItem", position: 3, name: drill.title, item: absoluteUrl(`/menu/${drill.id}`) },
          ],
        }}
      />

      <nav aria-label="パンくずリスト" className="mb-3 text-sm text-slate-600 print:hidden dark:text-slate-400">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/" className="font-bold underline underline-offset-4">
              練習メニュー
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li>
            <Link href={`/?c=${drill.category}`} className="font-bold underline underline-offset-4">
              {CATEGORY_LABELS[drill.category]}
            </Link>
          </li>
        </ol>
      </nav>

      <header>
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm font-bold">
          <span className="rounded-full bg-emerald-200 px-3 py-1 text-emerald-950 dark:bg-emerald-900 dark:text-emerald-100">
            {CATEGORY_LABELS[drill.category]}
          </span>
          <span className={`rounded-full px-3 py-1 ${levelStyles[drill.level]}`}>{LEVEL_LABELS[drill.level]}</span>
          {drill.timing && (
            <span className="rounded-full bg-violet-200 px-3 py-1 text-violet-950 dark:bg-violet-900 dark:text-violet-100">
              {TIMING_LABELS[drill.timing]}
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold leading-snug">{drill.title}</h1>
        <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">{drill.description}</p>
      </header>

      <div className="mt-5 flex flex-col gap-4">
        {!drill.diagram && drill.scene && (
          <SceneView
            scene={drill.scene}
            label={`${drill.title}の場面図`}
            className="mx-auto h-auto w-full max-w-xl rounded-lg border border-slate-300 dark:border-slate-600"
          />
        )}
        {!drill.diagram && !drill.scene && drill.illustration && (
          <IllustrationView
            illustration={drill.illustration}
            label={`${drill.title}のイメージ図`}
            className="mx-auto h-auto w-full max-w-xl rounded-lg border border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800"
          />
        )}
        {drill.diagram && (
          <div>
            <CourtDiagram
              courtType={drill.courtType}
              diagram={drill.diagram}
              className="mx-auto h-[min(400px,55dvh)] w-auto rounded-lg"
            />
            <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-slate-700 dark:text-slate-300">
              {legend.map((l) => (
                <li key={l.label} className="flex items-center gap-1.5">
                  <span className={`inline-block h-3 w-3 rounded-full ${l.color}`} />
                  {l.label}
                </li>
              ))}
              <li className="flex items-center gap-1.5">
                <span className="inline-block w-5 border-t-2 border-dashed border-yellow-500" />
                シャトルの軌道
              </li>
              <li className="flex items-center gap-1.5">
                <span className="inline-block w-5 border-t-2 border-slate-400" />
                選手の移動
              </li>
              {drill.diagram.arrows?.some((a) => a.order) && (
                <li className="flex items-center gap-1.5">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                    1
                  </span>
                  順番
                </li>
              )}
            </ul>
          </div>
        )}

        <dl className="grid grid-cols-2 gap-3">
          {[
            ["人数", playersLabel(drill)],
            ["種目", COURT_TYPE_LABELS[drill.courtType]],
            ["推奨時間", drill.duration],
            ...(drill.shots ? [["球数・回数", drill.shots]] : []),
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg border-2 border-slate-300 px-3 py-2 dark:border-slate-700">
              <dt className="text-sm text-slate-600 dark:text-slate-400">{k}</dt>
              <dd className="text-base font-bold">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="-mt-1 text-sm text-slate-600 dark:text-slate-400">
          レベルの目安：{LEVEL_LABELS[drill.level]}は、{LEVEL_HELP[drill.level]}です。
        </p>

        <MenuActions id={drill.id} title={drill.title} defaultMinutes={defaultMinutes} />

        {isStretch && drill.timing && (
          <p className="rounded-lg bg-violet-100 p-3 text-base leading-relaxed text-violet-950 dark:bg-violet-950 dark:text-violet-100">
            <b className="mr-1">行う時期</b>
            {TIMING_HELP}
          </p>
        )}

        {drill.purpose && (
          <Section title="ねらい">
            <p className="text-base leading-relaxed">{drill.purpose}</p>
          </Section>
        )}
        {drill.equipment && drill.equipment.length > 0 && (
          <Section title="準備するもの">
            <BulletList items={drill.equipment} />
          </Section>
        )}

        <Section title={FEED_HEADING[drill.category]}>
          <p className="text-base leading-relaxed">{drill.feedPattern}</p>
        </Section>

        {drill.steps && drill.steps.length > 0 && (
          <Section title="手順">
            <NumberedList items={drill.steps} />
          </Section>
        )}

        <Section title="指導のコツ・着眼点">
          <NumberedList items={drill.coachingPoints} />
        </Section>

        {drill.feederTips && drill.feederTips.length > 0 && (
          <Section title="ノッカー（球出し）のコツ">
            <BulletList items={drill.feederTips} />
          </Section>
        )}
        {drill.commonMistakes && drill.commonMistakes.length > 0 && (
          <Section title="よくあるミスと声かけ">
            <BulletList items={drill.commonMistakes} />
          </Section>
        )}
        {drill.variations && drill.variations.length > 0 && (
          <Section title="バリエーション（易しく・難しく）">
            <BulletList items={drill.variations} />
          </Section>
        )}
        {safety.length > 0 && (
          <section className="rounded-xl border-2 border-amber-500 bg-amber-100 p-4 text-amber-950 dark:bg-amber-900 dark:text-amber-100">
            <h2 className="mb-2 text-base font-bold">安全のために</h2>
            <BulletList items={safety} />
          </section>
        )}

      </div>

      <nav aria-label="同じ区分の前後のメニュー" className="mt-8 grid gap-3 sm:grid-cols-2 print:hidden">
        {prev ? (
          <Link
            href={`/menu/${prev.id}`}
            className="rounded-xl border-2 border-slate-300 p-4 text-base font-bold dark:border-slate-600"
          >
            <span className="block text-sm font-normal text-slate-600 dark:text-slate-400">‹ 前のメニュー</span>
            {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/menu/${next.id}`}
            className="rounded-xl border-2 border-slate-300 p-4 text-right text-base font-bold dark:border-slate-600"
          >
            <span className="block text-sm font-normal text-slate-600 dark:text-slate-400">次のメニュー ›</span>
            {next.title}
          </Link>
        )}
      </nav>

      <section className="mt-8 print:hidden">
        <h2 className="mb-3 text-lg font-bold">{CATEGORY_LABELS[drill.category]}の、ほかのメニュー</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {related(drill).map((d) => (
            <li key={d.id}>
              <Link
                href={`/menu/${d.id}`}
                className="flex min-h-14 items-center justify-between gap-3 rounded-xl border-2 border-slate-300 px-4 py-2 text-base font-bold dark:border-slate-600"
              >
                <span className="min-w-0">{d.title}</span>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs ${levelStyles[d.level]}`}>
                  {LEVEL_LABELS[d.level]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={`/?c=${drill.category}`}
          className="mt-4 flex min-h-14 items-center justify-center rounded-xl border-2 border-emerald-700 text-base font-bold text-emerald-800 dark:border-emerald-400 dark:text-emerald-300"
        >
          {CATEGORY_LABELS[drill.category]}を、一覧で見る
        </Link>
      </section>

      <p className="mt-6 text-center text-sm print:hidden">
        <Link
          href={`/contact?page=${encodeURIComponent(`${drill.title}（/menu/${drill.id}）`)}`}
          className="font-bold text-slate-600 underline underline-offset-4 dark:text-slate-400"
        >
          このメニューの誤りや、分かりにくい点を知らせる
        </Link>
      </p>
    </main>
  );
}
