import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "免責事項・著作権",
  description: "当サイトの情報の利用にあたっての注意、免責事項、著作権、リンクについて。",
  alternates: { canonical: "/terms" },
};

const card = "rounded-xl border-2 border-slate-300 bg-white p-4 dark:border-slate-600 dark:bg-slate-900";
const body = "text-base leading-relaxed text-slate-700 dark:text-slate-300";

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5">
      <h1 className="text-xl font-bold">免責事項・著作権</h1>

      <div className="mt-4 flex flex-col gap-4">
        <section className={card}>
          <h2 className="text-lg font-bold">練習メニューの利用について</h2>
          <ul className="mt-2 flex list-disc flex-col gap-2 pl-5">
            <li className={body}>
              掲載している練習メニューや指導のコツは、一般的な指導の目安です。参加者の年齢、体力、体調、技術レベル、環境に合わせて、指導者の判断で調整してください。
            </li>
            <li className={body}>
              練習の前には、ウォームアップを行い、水分補給と休憩をとって、安全に配慮してください。体調に不安がある場合や、痛みがある場合は、無理をせず、中止してください。
            </li>
            <li className={body}>
              当サイトの情報を利用して生じた、ケガ、事故、損害などについて、運営者は責任を負いません。ご自身の判断と責任で、ご利用ください。
            </li>
            <li className={body}>
              掲載しているメニューは、運営者が、内容を確認したものです。
            </li>
          </ul>
        </section>

        <section className={card}>
          <h2 className="text-lg font-bold">ルール・用品などの情報について</h2>
          <ul className="mt-2 flex list-disc flex-col gap-2 pl-5">
            <li className={body}>
              ルールのページは、日本バドミントン協会やBWFの公開資料をもとに要約したものです。ルールは改正されます。実際の試合では、最新の競技規則、大会要項、審判の判定が優先されます。
            </li>
            <li className={body}>
              用品の価格・仕様・在庫などは、変わることがあります。購入の前に、販売元の最新の情報を確認してください。
            </li>
            <li className={body}>
              できる限り正確な情報を掲載するよう努めますが、その完全性や正確性を保証するものではありません。誤りに気づかれた場合は、
              <Link href="/contact" className="font-bold underline underline-offset-4">
                お問い合わせ
              </Link>
              からお知らせください。
            </li>
          </ul>
        </section>

        <section className={card}>
          <h2 className="text-lg font-bold">著作権について</h2>
          <ul className="mt-2 flex list-disc flex-col gap-2 pl-5">
            <li className={body}>
              当サイトの文章、コート図、デザインなどの著作権は、運営者に帰属します。
            </li>
            <li className={body}>
              指導や練習の現場で、ご自身のチームや教室のために、印刷して使うことは、ご自由にどうぞ。
            </li>
            <li className={body}>
              当サイトの内容を、無断で転載、複製、再配布したり、商用で利用したりすることは、禁止します。
            </li>
            <li className={body}>
              引用する場合は、出典として、当サイトの名前とURLを明記してください。
            </li>
          </ul>
        </section>

        <section className={card}>
          <h2 className="text-lg font-bold">リンクについて</h2>
          <p className={`mt-2 ${body}`}>
            当サイトへのリンクは、自由です。連絡も不要です。ただし、当サイトの内容を誤解させるような形でのリンクや、違法なサイトからのリンクは、お断りします。
          </p>
        </section>

        <section className={card}>
          <h2 className="text-lg font-bold">広告・アフィリエイトについて</h2>
          <p className={`mt-2 ${body}`}>
            当サイトでは、商品紹介のリンクに、アフィリエイトリンク（広告）を使う場合があります。その場合は、該当する商品に「PR」と表示します。広告の有無によって、紹介する内容を変えることはありません。
          </p>
        </section>

        <p className="text-sm text-slate-600 dark:text-slate-400">
          個人情報の取り扱いについては、
          <Link href="/privacy" className="font-bold underline underline-offset-4">
            プライバシーポリシー
          </Link>
          をご覧ください。
        </p>
      </div>
    </main>
  );
}
