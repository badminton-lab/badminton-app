# バドミントン練習メニュー

バドミントン指導者のための、練習メニュー集のサイトです。人数・レベル・区分から、コート図つきの練習メニューを探せます。

- 練習メニュー：区分・レベル・人数・キーワードで絞り込み。1メニュー1ページ（`/menu/○○`）
- 練習プラン：メニューを並べて時間を決め、印刷（PDF保存）・LINE共有（`/plan`）
- ルール（`/rules`）／雑学（`/trivia`）／用品の選び方（`/gear`）／運営者・プライバシー・免責・お問い合わせ

Next.js（App Router）・React・Tailwind CSS で作っています。データベースやサーバー処理はなく、内容はすべてソースコード（`src/data`）に入っています。

## 開発

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 本番ビルド
npm run lint
```

> このプロジェクトの Next.js は、一般的なバージョンと違う点があります。`AGENTS.md` と、`node_modules/next/dist/docs/` のドキュメントを参照してください。

## 公開前に設定すること

| 項目 | 場所 | 内容 |
|---|---|---|
| 公開URL | 環境変数 `NEXT_PUBLIC_SITE_URL` | 例：`https://example.com`。sitemap・canonical・SNS共有画像のURLに使われます |
| 運営者名 | `src/lib/site.ts` の `operator.name` | 空のままなら「個人」と表示されます |
| お問い合わせ | 編集ページ（サイト設定） | フォームの送信先URL（Formspree など）を入れると、`/contact` にフォームが出ます。フォームURL／`mailto:` のリンクだけも使えます。空のままなら「準備中」と表示されます |
| 商品紹介 | `src/data/products.ts` | 商品を追加すると、`/gear` に表示されます（アフィリエイトなら `affiliate: true`） |

## 内容の編集

| 内容 | ファイル |
|---|---|
| 練習メニュー | `src/data/menus/*.ts`（区分ごと）。`base.ts` は最初の30件 |
| ルール | `src/data/rules.ts`（改正があれば更新し、`RULES_CHECKED_AT` も直す） |
| 雑学・用品ガイド | `src/data/trivia.ts`、`src/data/gear.ts` |
| 指導の深掘り（ねらい・準備物・手順など） | `src/data/enrichments.ts` |

メニューの id（`d01`、`hf01` など）は、お気に入り・プランの保存に使われます。変更・並べ替えをしないでください。メニューを足すときは、各ファイルの**末尾**に追記します。

### 開発用の編集ページ（`/editor`）

`npm run dev` で起動した状態で、`http://localhost:3000/editor` を開くと、メニューの文面とコート図を、画面上で編集できます。

- 編集内容は、元データとの差分だけが `src/data/overrides.json` に保存されます。
- 「運営者確認済み」のチェックを入れて保存したメニューだけが、公開サイトに表示されます（チェックのないメニューは、サイトに出ません）。
- 確認前のメニューも含めて、サイトの見た目を確かめたいときは、`NEXT_PUBLIC_SHOW_UNREVIEWED=1 npm run dev` で起動します（開発中のみ有効）。編集ページから、確認前のメニューのページも、プレビューできます。
- コート図のないメニューには、「イメージ図」（人の体・ラケット・コーン・ボール・矢印・文字などの部品の組み合わせ）を付けられます。初期の図は `src/data/illustrations.ts` にあり、編集ページで、部品の追加・ドラッグ・ポーズの変更ができます（人は、関節の丸をドラッグしてポーズを作る／ひな型は `src/data/poses.ts`）。
- 本番ビルドでは、このページと保存 API は存在しません（404）。

### メニュー以外の編集（`/editor/content`）

ルール（Q&A）・雑学・シャトルの番号表・用品の選び方ガイド・おすすめ商品（追加・削除可）・サイト設定（運営者名・プロフィール・お問い合わせ先）を、画面上で編集できます。保存すると `src/data/content.json` に、その一覧がまるごと保存され、元のデータ（`rules.ts` など）の代わりに使われます。「元の内容に戻す」で、保存した内容を消せます。開発サーバーでのみ動きます。

## 構成

```
src/
  app/
    (site)/        公開ページ（共通のヘッダー・下部ナビ・フッター）
    editor/        開発用の編集ページ（本番では404）
    api/dev/       編集ページ用の保存API（本番では404）
    sitemap.ts, robots.ts, manifest.ts   検索エンジン・ホーム画面向けの設定
  components/      画面の部品（CourtDiagram: コート図の描画）
  data/            練習メニュー・ルール・雑学などの内容
  lib/             お気に入り・プラン・サイト設定などの共通処理
```

アイコン（`src/app/icon.svg`、`apple-icon.png`、`favicon.ico`、`public/icon-*.png`）と、SNS共有画像（`src/app/opengraph-image.png`）は、画像ファイルとして置いてあります。差し替えるときは、同じ名前・同じサイズで置き換えてください。
