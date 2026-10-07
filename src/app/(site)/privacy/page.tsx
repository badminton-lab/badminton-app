import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "当サイトで取り扱う情報と、その扱い方について説明します。",
  alternates: { canonical: "/privacy" },
};

const card = "rounded-xl border-2 border-slate-300 bg-white p-4 dark:border-slate-600 dark:bg-slate-900";
const body = "text-base leading-relaxed text-slate-700 dark:text-slate-300";

export default function PrivacyPage() {
  const operator = SITE.operator.name.trim() || "個人";
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5">
      <h1 className="text-xl font-bold">プライバシーポリシー</h1>
      <p className={`mt-2 ${body}`}>
        「{SITE.fullName}」（以下「当サイト」）で取り扱う情報について、次のとおり定めます。
      </p>

      <div className="mt-4 flex flex-col gap-4">
        <section className={card}>
          <h2 className="text-lg font-bold">1. 運営者</h2>
          <p className={`mt-2 ${body}`}>
            当サイトは、{operator}が運営しています。お問い合わせは、
            <Link href="/contact" className="font-bold underline underline-offset-4">
              お問い合わせのページ
            </Link>
            をご覧ください。
          </p>
        </section>

        <section className={card}>
          <h2 className="text-lg font-bold">2. 取得する情報</h2>
          <p className={`mt-2 ${body}`}>
            当サイトは、氏名やメールアドレスなど、利用者を特定できる個人情報を、閲覧や利用の際に取得しません。会員登録やログインの機能はありません。
          </p>
          <p className={`mt-3 ${body}`}>
            ただし、便利に使っていただくため、ブラウザの機能（ローカルストレージ）を使って、次の情報を、利用者の端末の中にだけ保存します。
          </p>
          <ul className="mt-2 flex list-disc flex-col gap-1 pl-5">
            <li className={body}>お気に入りに入れた練習メニュー</li>
            <li className={body}>練習プラン（選んだメニュー、時間、プランの名前、メモ）</li>
            <li className={body}>表示の設定（ライト・ダーク）</li>
          </ul>
          <p className={`mt-3 ${body}`}>
            これらの情報は、当サイトのサーバーには送信されません。ブラウザの設定で、サイトデータを削除すると、消去されます。
          </p>
        </section>

        <section className={card}>
          <h2 className="text-lg font-bold">3. アクセス解析・広告について</h2>
          <p className={`mt-2 ${body}`}>
            現在、当サイトは、アクセス解析のツールも、広告配信のサービスも、利用していません。そのため、閲覧者の情報を、外部のサービスへ送信することはありません。
          </p>
          <p className={`mt-3 ${body}`}>
            今後、これらを導入する場合は、事前に本ページを改定して、利用するサービスの名前、取得する情報、利用の目的、情報の送信先、停止（オプトアウト）の方法を公表します。
          </p>
        </section>

        <section className={card}>
          <h2 className="text-lg font-bold">4. Cookie（クッキー）について</h2>
          <p className={`mt-2 ${body}`}>
            当サイト自身は、Cookieを設定しません。上記のとおり、ブラウザのローカルストレージを使っています。
          </p>
        </section>

        <section className={card}>
          <h2 className="text-lg font-bold">5. アクセスログについて</h2>
          <p className={`mt-2 ${body}`}>
            当サイトは、ホスティング事業者のサーバーで公開されています。運用や安全の確保のため、事業者により、アクセスの記録（IPアドレス、閲覧日時、ブラウザの種類など）が取得される場合があります。これらは、個人を特定する目的では利用しません。
          </p>
        </section>

        <section className={card}>
          <h2 className="text-lg font-bold">6. お問い合わせでお預かりする情報</h2>
          <p className={`mt-2 ${body}`}>
            お問い合わせの際にお知らせいただいた情報（メールアドレスなど）は、返信と、内容の確認のためだけに利用します。法令に基づく場合を除き、本人の同意なく、第三者に提供することはありません。
          </p>
        </section>

        <section className={card}>
          <h2 className="text-lg font-bold">7. 外部サイトへのリンクについて</h2>
          <p className={`mt-2 ${body}`}>
            当サイトには、競技団体の資料や、商品の販売ページなど、外部サイトへのリンクがあります。リンク先での情報の扱いは、各サイトのポリシーに従います。商品紹介のリンクには、広告（アフィリエイトリンク）が含まれる場合があり、その場合は「PR」と表示します。リンク先では、各事業者が Cookie 等を利用することがあります。
          </p>
        </section>

        <section className={card}>
          <h2 className="text-lg font-bold">8. ポリシーの改定</h2>
          <p className={`mt-2 ${body}`}>
            必要に応じて、本ポリシーを改定します。改定後の内容は、本ページに掲載した時点から効力を持ちます。
          </p>
          <p className={`mt-3 text-sm text-slate-600 dark:text-slate-400`}>制定日：2026年10月</p>
        </section>
      </div>
    </main>
  );
}
