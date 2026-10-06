import type { Metadata } from "next";
import Link from "next/link";
import { drills } from "@/data/drills";

export const metadata: Metadata = {
  title: "このサイトについて",
  description: "練習メニューに悩む指導者の、少しでも助けになればという思いで作ったサイトです。",
};

const card =
  "rounded-xl border-2 border-slate-300 bg-white p-4 dark:border-slate-600 dark:bg-slate-900";
const body = "text-base leading-relaxed text-slate-700 dark:text-slate-300";

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5">
      <h1 className="text-xl font-bold">このサイトについて</h1>

      <section className={`mt-4 ${card}`}>
        <h2 className="text-lg font-bold">作った思い</h2>
        <p className={`mt-2 ${body}`}>
          「今日の練習、何をやろう」と、練習メニューに悩む指導者の方の、少しでも助けになればという思いで作りました。
        </p>
        <p className={`mt-3 ${body}`}>
          コートの横で、スマホ1つで、さっと探せること。人数やレベルに合うメニューが、すぐ見つかること。コートの図で、位置や動きが一目で伝わること。そんな使いやすさを目指しています。
        </p>
      </section>

      <section className={`mt-4 ${card}`}>
        <h2 className="text-lg font-bold">できること</h2>
        <ul className="mt-2 flex flex-col gap-2">
          <li className={body}>
            <b>メニューを探す：</b>
            {drills.length}件の練習メニューを、区分・レベル・人数・キーワードで絞り込めます。
          </li>
          <li className={body}>
            <b>コート図で確認：</b>
            選手の位置、シャトルの軌道、動きを、図で見られます。ノックの図は、ノッカーが下になる向きで表示します。
          </li>
          <li className={body}>
            <b>指導のコツ：</b>
            各メニューに、着眼点と、球出しや進め方を載せています。
          </li>
          <li className={body}>
            <b>お気に入り：</b>
            今日使うメニューを、☆で保存できます（この端末のブラウザに保存されます）。
          </li>
          <li className={body}>
            <b>ルール：</b>
            <Link href="/rules" className="font-bold underline underline-offset-4">
              ルールのページ
            </Link>
            に、サーブの右左を間違えたときの対処など、迷いやすいルールを、質問形式でまとめています。
          </li>
          <li className={body}>
            <b>雑学と用品：</b>
            <Link href="/trivia" className="font-bold underline underline-offset-4">
              雑学
            </Link>
            や、
            <Link href="/gear" className="font-bold underline underline-offset-4">
              用品の選び方
            </Link>
            も、まとめています。
          </li>
        </ul>
      </section>

      <section className={`mt-4 ${card}`}>
        <h2 className="text-lg font-bold">使い方</h2>
        <ol className="mt-2 flex list-decimal flex-col gap-2 pl-5">
          <li className={body}>
            <Link href="/" className="font-bold underline underline-offset-4">
              メニュー
            </Link>
            のページで、区分・レベル・人数を選びます。
          </li>
          <li className={body}>気になるメニューのカードを、タップします。</li>
          <li className={body}>詳細で、コート図、進め方、指導のコツを確認します。</li>
          <li className={body}>使いたいメニューは、☆でお気に入りに入れておきます。</li>
        </ol>
      </section>

      <section className={`mt-4 ${card}`}>
        <h2 className="text-lg font-bold">ご利用にあたって</h2>
        <ul className="mt-2 list-disc pl-5">
          <li className={body}>
            掲載している練習メニューや指導のコツは、一般的な指導の目安です。参加者の年齢・体力・体調に合わせて、指導者の方の判断で調整してください。
          </li>
          <li className={body}>
            練習前にはウォームアップを行い、水分補給と休憩をとって、安全に配慮してください。
          </li>
          <li className={body}>
            用品の情報は、変わることがあります。購入前に、販売元の最新の情報を確認してください。
          </li>
        </ul>
      </section>
    </main>
  );
}
