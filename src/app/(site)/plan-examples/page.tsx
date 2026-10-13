import type { Metadata } from "next";
import Link from "next/link";
import UsePlanButton from "@/components/UsePlanButton";
import { allDrills, drills } from "@/data/drills";
import { planMinutes, samplePlans } from "@/data/samplePlans";

export const metadata: Metadata = {
  title: "練習プラン例（小学生・中学部活・ダブルス・サークル・試合前）",
  alternates: { canonical: "/plan-examples" },
  description:
    "バドミントンの練習プラン例。小学生クラブ90分、中学部活120分、少人数ダブルス、コート1面に12人のサークル、試合前の調整まで、時間配分つきで紹介します。",
};

export default function PlanExamplesPage() {
  // リンクにできるのは、公開されている（確認済みの）メニューだけ。名前は、全メニューから引く
  const byId = new Map(drills.map((d) => [d.id, d]));
  const titleOf = new Map(allDrills.map((d) => [d.id, d.title]));
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5">
      <h1 className="text-xl font-bold">練習プラン例</h1>
      <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">
        人数や目的に合わせた、練習の流れの例です（{samplePlans.length}パターン）。時間配分は目安なので、体育館や参加者の様子に合わせて調整してください。メニュー名を押すと、くわしい説明が開きます。気に入った例は、そのまま「今日のプラン」に入れて、時間を直せます。
      </p>
      <nav aria-label="プラン例の一覧" className="mt-4 flex flex-wrap gap-2">
        {samplePlans.map((p) => (
          <a key={p.id} href={`#${p.id}`} className="flex min-h-12 items-center rounded-full border-2 border-slate-400 bg-white px-4 text-base font-bold dark:border-slate-500 dark:bg-slate-900">
            {p.title}
          </a>
        ))}
      </nav>

      {samplePlans.map((p) => {
        const items = p.steps.filter((s) => byId.has(s.id)).map((s) => ({ id: s.id, minutes: s.minutes }));
        const sections = p.steps.reduce<{ name: string; steps: typeof p.steps }[]>((acc, s) => {
          const last = acc[acc.length - 1];
          if (last && last.name === s.section) last.steps.push(s);
          else acc.push({ name: s.section, steps: [s] });
          return acc;
        }, []);
        return (
          <section key={p.id} id={p.id} className="mt-10 scroll-mt-4 rounded-xl border-2 border-slate-300 bg-white p-4 dark:border-slate-600 dark:bg-slate-900">
            <h2 className="text-lg font-bold">{p.title}</h2>
            <p className="mt-2 text-base leading-relaxed">{p.summary}</p>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-base">
              <dt className="font-bold">対象</dt><dd>{p.audience}</dd>
              <dt className="font-bold">人数</dt><dd>{p.people}</dd>
              <dt className="font-bold">コート</dt><dd>{p.courts}</dd>
              <dt className="font-bold">レベル</dt><dd>{p.level}</dd>
              <dt className="font-bold">時間</dt><dd>{planMinutes(p)}分</dd>
              <dt className="font-bold">目標</dt><dd>{p.goal}</dd>
            </dl>

            <ol className="mt-4 flex flex-col gap-4">
              {sections.map((sec) => (
                <li key={sec.name + sec.steps[0].id}>
                  <h3 className="text-base font-bold text-emerald-800 dark:text-emerald-300">
                    {sec.name}（{sec.steps.reduce((a, s) => a + s.minutes, 0)}分）
                  </h3>
                  <ul className="mt-1 flex flex-col gap-1">
                    {sec.steps.map((s) => {
                      const d = byId.get(s.id);
                      const name = titleOf.get(s.id) ?? s.id;
                      return (
                        <li key={s.id} className="text-base leading-relaxed">
                          <span className="font-bold tabular-nums">{s.minutes}分</span>　
                          {d ? (
                            <Link href={`/menu/${s.id}`} className="font-bold underline underline-offset-4">{name}</Link>
                          ) : (
                            <span className="font-bold">{name}<span className="ml-1 text-sm font-normal text-slate-600 dark:text-slate-400">（詳細は準備中）</span></span>
                          )}
                          {s.note && <span className="block pl-12 text-sm text-slate-700 dark:text-slate-300">{s.note}</span>}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ol>

            <h3 className="mt-5 text-base font-bold">運営のコツ</h3>
            <ul className="mt-1 flex flex-col gap-1">
              {p.tips.map((t) => (
                <li key={t} className="flex gap-2 text-base leading-relaxed">
                  <span aria-hidden="true" className="font-bold text-emerald-700 dark:text-emerald-400">・</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5">
              <UsePlanButton title={p.title} targetMinutes={planMinutes(p)} items={items} />
            </div>
          </section>
        );
      })}
    </main>
  );
}

