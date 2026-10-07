import type { Metadata } from "next";
import Link from "next/link";
import { SITE, hasContact } from "@/lib/site";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "メニューの誤りのご指摘、追加してほしい練習のご要望など。",
  alternates: { canonical: "/contact" },
};

const card = "rounded-xl border-2 border-slate-300 bg-white p-4 dark:border-slate-600 dark:bg-slate-900";
const body = "text-base leading-relaxed text-slate-700 dark:text-slate-300";

export default function ContactPage() {
  const external = /^https?:/i.test(SITE.contact.href);
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5">
      <h1 className="text-xl font-bold">お問い合わせ</h1>
      <p className={`mt-2 ${body}`}>
        メニューやルールの誤りのご指摘、追加してほしい練習のご要望、ご意見・ご感想など、お気軽にお寄せください。
      </p>

      <section className={`mt-4 ${card}`}>
        <h2 className="text-lg font-bold">お問い合わせ先</h2>
        {hasContact() ? (
          <>
            <a
              href={SITE.contact.href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="mt-3 flex min-h-14 items-center justify-center rounded-xl bg-emerald-700 px-6 text-base font-bold text-white dark:bg-emerald-400 dark:text-slate-950"
            >
              {SITE.contact.label || "お問い合わせフォームを開く"}
            </a>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              すべてのご連絡に返信できない場合があります。あらかじめご了承ください。
            </p>
          </>
        ) : (
          <p className={`mt-2 ${body}`}>お問い合わせの窓口は、準備中です。</p>
        )}
      </section>

      <section className={`mt-4 ${card}`}>
        <h2 className="text-lg font-bold">ご連絡いただくときのお願い</h2>
        <ul className="mt-2 flex list-disc flex-col gap-2 pl-5">
          <li className={body}>誤りのご指摘は、該当するページ（メニュー名やURL）を、あわせてお知らせください。</li>
          <li className={body}>
            お預かりした情報の扱いは、
            <Link href="/privacy" className="font-bold underline underline-offset-4">
              プライバシーポリシー
            </Link>
            をご覧ください。
          </li>
        </ul>
      </section>
    </main>
  );
}
