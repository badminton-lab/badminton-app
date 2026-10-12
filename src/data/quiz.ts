import { content } from "./content";

/** クイズの形式。tf: ○×クイズ（選択肢は ○ と ×）／ choice: 3択クイズ */
export type QuizKind = "tf" | "choice";
export type QuizCategory = "records" | "japan" | "history" | "gear" | "rules";
/** 対象の目安。elementary: 小学生から／junior: 中学生向け（少し難しい） */
export type QuizLevel = "elementary" | "junior";

export const QUIZ_KIND_LABELS: Record<QuizKind, string> = { tf: "○×クイズ", choice: "3択クイズ" };
export const QUIZ_CATEGORY_LABELS: Record<QuizCategory, string> = {
  records: "記録・スピード",
  japan: "日本の活躍",
  history: "歴史",
  gear: "シャトル・ラケット",
  rules: "コートとルール",
};
export const QUIZ_CATEGORY_ORDER: QuizCategory[] = ["records", "japan", "history", "gear", "rules"];
export const QUIZ_LEVEL_LABELS: Record<QuizLevel, string> = { elementary: "小学生から", junior: "中学生向け" };

export type QuizLink = { label: string; href: string; external?: boolean };

export type Quiz = {
  id: string;
  kind: QuizKind;
  category: QuizCategory;
  level: QuizLevel;
  question: string;
  /**
   * 選択肢。1行目が、正解。
   * ○×クイズは「○」「×」の2行（正解を1行目に）。3択クイズは、3行（正解を1行目に）。
   * 画面では、○×クイズは ○ → × の順、3択クイズは問題ごとに決まった順に並べ替えて表示する。
   */
  choices: string[];
  explanation: string;
  /** 出典（公式の資料など） */
  sources?: QuizLink[];
  /** 確認時期（例：2026年10月） */
  checkedAt?: string;
  /** ファクトチェックの記録（運営者向け。公開ページには出さない） */
  factCheck?: string;
};

/** 出典（確認に使った資料）。クイズごとに、ここから選ぶ */
const SRC = {
  laws: {
    label: "BWF Laws of Badminton（2025年4月26日 Version 5.0）",
    href: "https://extranet.bwf.sport/docs/document-system/81/1466/1470/Section%204.1%20-%20Laws%20of%20Badminton%20-%2026%20April%202025%20V5.0%20(2)%20.pdf",
    external: true,
  },
  bwf15: {
    label: "BWF Members Approve 3×15 Scoring System（2026年4月25日）",
    href: "https://bwfbadminton.com/news-single/2026/04/25/bwf-members-approve-3x15-scoring-system",
    external: true,
  },
  xinhua15: {
    label: "BWF approves 3x15 scoring system for badminton from 2027（Xinhua）",
    href: "https://english.news.cn/20260426/972c66898961489bbdd5b070aba373c8/c.html",
    external: true,
  },
  guinness: {
    label: "Indian shuttler Satwiksairaj Rankireddy sets Guinness world record for fastest badminton shot（All India Radio）",
    href: "https://newsonair.gov.in/indian-shuttler-satwiksairaj-rankireddy-sets-guinness-world-record-for-fastest-badminton-shot",
    external: true,
  },
  cheetah: {
    label: "時速100km超え?! 地球上で最も速い生物とは（中央動物専門学校）",
    href: "https://www.chuo-a.ac.jp/anilab/learn/420/",
    external: true,
  },
  shinkansen: {
    label: "N700S 車両のご案内（JR東海）",
    href: "https://railway.jr-central.co.jp/train/shinkansen/n700s/",
    external: true,
  },
  joc: {
    label: "バドミントン｜競技｜日本オリンピック委員会（JOC）",
    href: "https://www.joc.or.jp/sports/badminton/index.html",
    external: true,
  },
  wikiBadminton: {
    label: "Badminton（Wikipedia）",
    href: "https://en.wikipedia.org/wiki/Badminton",
    external: true,
  },
  wikiWorlds: {
    label: "BWF World Championships（Wikipedia）",
    href: "https://en.wikipedia.org/wiki/BWF_World_Championships",
    external: true,
  },
  thomasUber: {
    label: "トマス杯＆ユーバー杯2018（バドスピ）",
    href: "https://www.badspi.jp/thomasuber2018/",
    external: true,
  },
  thomas2014: {
    label: "日本男子がトマス杯初優勝、マレーシアに競り勝つ（AFP）",
    href: "https://www.afpbb.com/articles/-/3015859",
    external: true,
  },
  okuhara: {
    label: "奥原希望選手が世界選手権女子シングルスで激闘の末、優勝！",
    href: "https://terasu.biprogy.com/article/badminton-no29/",
    external: true,
  },
} satisfies Record<string, QuizLink>;

const CHECKED = "2026年10月";

type Seed = Omit<Quiz, "id" | "checkedAt" | "sources"> & { sources: (keyof typeof SRC)[] };

const seeds: Seed[] = [
  // ───────────── 記録・スピード ─────────────
  {
    kind: "tf", category: "records", level: "elementary",
    question: "バドミントンのスマッシュの世界記録は、陸上でいちばん速い動物のチーターより速い。",
    choices: ["○", "×"],
    explanation: "ギネス世界記録に認定されたスマッシュの最高速度は、時速565km（2023年）。チーターの最高速度は、時速100〜120kmほどといわれます。シャトルは、チーターの約5倍の速さで飛んだことになります。ただし、この記録は、試合ではなく、測定のために打たれたものです。",
    sources: ["guinness", "cheetah"],
    factCheck: "565km/h・2023年4月14日・埼玉県草加市のヨネックス工場で計測は、All India Radio と Olympics.com の検索結果で確認（Olympics.com 本文は取得できず）。チーターは資料により時速100〜120km台と幅があるため「100〜120kmほど」と表記。",
  },
  {
    kind: "choice", category: "records", level: "elementary",
    question: "ギネス世界記録に認定された、スマッシュのシャトルの最高速度は、時速およそ何km？",
    choices: ["約565km", "約265km", "約865km"],
    explanation: "2023年に、インドのサトウィクサイラージ・ランキレディ選手が、時速565kmを記録しました。それまでの記録は、2013年にマレーシアのタン・ブンヒョン選手が出した、時速493kmでした。",
    sources: ["guinness"],
    factCheck: "565km/h（2023年）、前記録493km/h（2013年5月、タン・ブンヒョン）。All India Radio で確認。",
  },
  {
    kind: "tf", category: "records", level: "elementary",
    question: "スマッシュの世界記録（時速565km）は、東海道新幹線の営業運転の最高速度の、約5倍にあたる。",
    choices: ["×", "○"],
    explanation: "東海道新幹線のN700Sの最高速度は、時速285km。565 ÷ 285 ＝ 約1.98なので、約5倍ではなく、およそ2倍です。",
    sources: ["guinness", "shinkansen"],
    factCheck: "N700S 東海道区間の最高速度285km/h をJR東海のページで確認。565÷285≒1.98。",
  },
  {
    kind: "choice", category: "records", level: "junior",
    question: "ギネス世界記録に認定された、女子のスマッシュの最高速度は、時速およそ何km？",
    choices: ["約438km", "約238km", "約638km"],
    explanation: "マレーシアのパーリー・タン選手が、時速438kmを記録しています。男子（時速565km）と同じ日に、ヨネックスの工場の体育館で、測定されました。",
    sources: ["guinness"],
    factCheck: "女子 438km/h（Tan Pearly）、2023年4月14日の測定。All India Radio で確認。",
  },
  // ───────────── 日本の活躍 ─────────────
  {
    kind: "choice", category: "japan", level: "elementary",
    question: "バドミントンが、オリンピックの正式な競技になったのは、いつ？",
    choices: ["1992年（バルセロナ大会）", "1964年（東京大会）", "2008年（北京大会）"],
    explanation: "バドミントンは、1992年のバルセロナ大会から、正式競技になりました。その前の1972年のミュンヘン大会と1988年のソウル大会では、公開競技として行われました。",
    sources: ["joc", "wikiBadminton"],
    factCheck: "正式競技は1992年（JOCのページ、Wikipediaで一致）。公開競技は1972・1988年（Wikipedia）。",
  },
  {
    kind: "choice", category: "japan", level: "elementary",
    question: "オリンピックのバドミントンで、日本がこれまでにとったメダルは、全部で何個？（2024年パリ大会まで）",
    choices: ["6個", "3個", "10個"],
    explanation: "金メダル1個、銀メダル1個、銅メダル4個の、合わせて6個です（2024年パリ大会まで）。",
    sources: ["joc"],
    factCheck: "JOCの日本のメダル一覧（2012銀・2016金銅・2020銅・2024銅2）とWikipedia（ja）のメダリスト一覧で一致。Sports Data Museum のページは2024年分が反映されておらず不採用。",
  },
  {
    kind: "choice", category: "japan", level: "elementary",
    question: "オリンピックのバドミントンで、日本が初めてとったメダルは、2012年ロンドン大会の女子ダブルス。その色は？",
    choices: ["銀メダル", "金メダル", "銅メダル"],
    explanation: "藤井瑞希選手と垣岩令佳選手のペアが、銀メダルをとりました。これが、日本のバドミントンで、初めてのオリンピックのメダルです。",
    sources: ["joc"],
    factCheck: "2012年ロンドン・女子ダブルス・銀（藤井瑞希・垣岩令佳）。JOCとWikipedia（ja）で一致。",
  },
  {
    kind: "choice", category: "japan", level: "elementary",
    question: "日本のバドミントンが、オリンピックで初めて金メダルをとったのは、2016年リオ大会。どの種目？",
    choices: ["女子ダブルス（髙橋礼華・松友美佐紀）", "男子シングルス", "混合ダブルス"],
    explanation: "髙橋礼華選手と松友美佐紀選手のペアが、女子ダブルスで金メダルをとりました。日本のバドミントンで、今のところ唯一の金メダルです（2024年パリ大会まで）。",
    sources: ["joc"],
    factCheck: "2016年リオ・女子ダブルス・金。JOCで確認。金メダルは1個のみ（2024年まで）。",
  },
  {
    kind: "tf", category: "japan", level: "elementary",
    question: "混合ダブルスの渡辺勇大選手と東野有紗選手のペアは、東京2020大会とパリ2024大会で、2大会続けて金メダルをとった。",
    choices: ["×", "○"],
    explanation: "2人は、東京大会（2020大会）とパリ大会の、どちらでも、混合ダブルスで銅メダルをとりました。金メダルではなく、銅メダルです。",
    sources: ["joc"],
    factCheck: "JOC・Wikipedia（ja）で、2020・2024ともに混合ダブルス銅（渡辺勇大・東野有紗）を確認。",
  },
  {
    kind: "choice", category: "japan", level: "junior",
    question: "2024年パリ大会の女子ダブルスで、銅メダルをとった日本のペアは？",
    choices: ["志田千陽・松山奈未", "髙橋礼華・松友美佐紀", "松本麻佑・永原和可那"],
    explanation: "志田千陽選手と松山奈未選手のペアが、銅メダルをとりました。パリ大会では、混合ダブルス（渡辺勇大・東野有紗）も銅メダルで、日本は、バドミントンで2個のメダルをとっています。",
    sources: ["joc"],
    factCheck: "2024パリ・女子ダブルス銅（志田千陽・松山奈未）。JOCとWikipedia（ja）で一致。",
  },
  {
    kind: "tf", category: "japan", level: "elementary",
    question: "奥原希望選手は、2016年リオ大会の女子シングルスで、金メダルをとった。",
    choices: ["×", "○"],
    explanation: "奥原希望選手がとったのは、金メダルではなく、銅メダルです。日本の女子シングルスで、オリンピックのメダルは、これが初めてです。",
    sources: ["joc"],
    factCheck: "2016年リオ・女子シングルス・銅（奥原希望）。JOCで確認。「日本の女子シングルス初」は、JOCの一覧に女子シングルスのメダルが他にないことから。",
  },
  {
    kind: "tf", category: "japan", level: "junior",
    question: "桃田賢斗選手は、2018年と2019年の世界選手権の男子シングルスで、2年続けて優勝した。",
    choices: ["○", "×"],
    explanation: "桃田賢斗選手は、2018年（南京）と2019年（バーゼル）の世界選手権で、男子シングルスを連覇しました。",
    sources: ["wikiWorlds"],
    factCheck: "世界選手権の男子シングルスは2018・2019年とも日本人が優勝（Wikipedia）。選手名は、検索結果（桃田賢斗の公式・自治体・Wikipedia（ja）ページ）で一致。",
  },
  {
    kind: "tf", category: "japan", level: "junior",
    question: "奥原希望選手は、2017年の世界選手権の女子シングルスで、日本の選手として初めて優勝した。",
    choices: ["○", "×"],
    explanation: "2017年のグラスゴー大会で、奥原希望選手が優勝しました。世界選手権の女子シングルスでは、日本人初の優勝でした。",
    sources: ["okuhara", "wikiWorlds"],
    factCheck: "2017年の女子シングルスは日本が優勝（Wikipedia）。「日本人初」は、検索結果（奥原希望のWikipedia（ja）・解説記事）で一致。",
  },
  {
    kind: "tf", category: "japan", level: "junior",
    question: "山口茜選手は、2021年と2022年の世界選手権の女子シングルスで、2年続けて優勝した。",
    choices: ["○", "×"],
    explanation: "山口茜選手は、2021年と2022年の世界選手権で、女子シングルスを連覇しました。",
    sources: ["wikiWorlds"],
    factCheck: "2021・2022年の女子シングルスは日本が優勝（Wikipedia）。選手名は検索結果（解説記事・Wikipedia（ja））で一致。",
  },
  {
    kind: "tf", category: "japan", level: "junior",
    question: "日本の男子チームは、2014年のトマス杯（男子の国別対抗戦）の決勝で、マレーシアに負けて、準優勝だった。",
    choices: ["×", "○"],
    explanation: "2014年のトマス杯で、日本は、決勝でマレーシアを3対2で破り、初優勝しました。準優勝ではなく、優勝です。",
    sources: ["thomas2014"],
    factCheck: "AFPの記事見出し・検索結果で、2014年、マレーシアに競り勝ち、日本男子が初優勝と確認。",
  },
  {
    kind: "tf", category: "japan", level: "junior",
    question: "2018年のユーバー杯（女子の国別対抗戦）で、日本は優勝した。",
    choices: ["○", "×"],
    explanation: "2018年のユーバー杯で、日本の女子チームは優勝しました。",
    sources: ["thomasUber"],
    factCheck: "バドスピの大会ページと検索結果で、2018年ユーバー杯は日本が優勝・準優勝はタイと確認。同ページの要約はトマス杯も日本優勝と読める記述だったが、別の検索結果では2018年トマス杯は中国優勝・日本準優勝のため、トマス杯2018の問題は作らなかった。",
  },
  {
    kind: "choice", category: "japan", level: "elementary",
    question: "「トマス杯」は、どんな大会？",
    choices: ["男子の国別対抗の団体戦", "女子の国別対抗の団体戦", "小学生の全国大会"],
    explanation: "トマス杯は、男子の国別対抗の団体戦です。女子の国別対抗の団体戦は、「ユーバー杯」といいます。",
    sources: ["thomasUber"],
    factCheck: "トマス杯＝男子団体、ユーバー杯＝女子団体。バドスピの大会ページで確認。",
  },
  {
    kind: "choice", category: "japan", level: "elementary",
    question: "「ユーバー杯」は、どんな大会？",
    choices: ["女子の国別対抗の団体戦", "男子の国別対抗の団体戦", "ダブルスだけの大会"],
    explanation: "ユーバー杯は、女子の国別対抗の団体戦です。男子の国別対抗の団体戦は、「トマス杯」といいます。",
    sources: ["thomasUber"],
    factCheck: "同上。",
  },
  // ───────────── 歴史 ─────────────
  {
    kind: "choice", category: "history", level: "junior",
    question: "世界のバドミントンをまとめる国際組織（今の世界バドミントン連盟）が、「国際バドミントン連盟」として作られたのは、いつ？",
    choices: ["1934年", "1892年", "1964年"],
    explanation: "1934年に、イギリスのロンドンで、9つの国と地域の協会が集まって作られました。今は「世界バドミントン連盟（BWF）」といいます。",
    sources: ["wikiBadminton"],
    factCheck: "1934年設立（Wikipedia）。複数の解説サイトの検索結果でも、1934年7月5日・ロンドン・9協会で一致。",
  },
  {
    kind: "tf", category: "history", level: "elementary",
    question: "「バドミントン」という名前は、イギリスの貴族の屋敷「バドミントン・ハウス」に由来するといわれている。",
    choices: ["○", "×"],
    explanation: "グロスターシャーにある、ボーフォート公爵の屋敷「バドミントン・ハウス」の名前に由来するといわれています。いつ名前が付いたかは、はっきりしていません。",
    sources: ["wikiBadminton"],
    factCheck: "Wikipediaに「名前はバドミントン・ハウスに由来。時期ははっきりしない」とあるため、「といわれている」と表記。",
  },
  {
    kind: "choice", category: "history", level: "junior",
    question: "世界でいちばん古い、バドミントンの大きな大会「全英オープン」が始まったのは、いつ？",
    choices: ["1899年", "1949年", "1999年"],
    explanation: "全英オープンは、1899年に始まった、バドミントンの世界で最も歴史のある大会のひとつです。",
    sources: ["wikiBadminton"],
    factCheck: "1899年に開始（Wikipedia）。解説記事の検索結果でも一致。",
  },
  {
    kind: "choice", category: "history", level: "junior",
    question: "今のような、ラリーに勝った側が必ず得点する「ラリーポイント制」が、国際大会で正式に採用されたのは、いつ？",
    choices: ["2006年", "1996年", "2016年"],
    explanation: "2006年に採用されました。それより前は、サービス権を持つ側だけが得点できる方式でした。",
    sources: ["wikiBadminton"],
    factCheck: "2006年にラリーポイント制へ（Wikipedia）。解説記事の検索結果でも2006年で一致。",
  },
  {
    kind: "tf", category: "history", level: "junior",
    question: "バドミントンは、オリンピックの正式競技になる前に、「公開競技」として行われたことがある。",
    choices: ["○", "×"],
    explanation: "1972年のミュンヘン大会と、1988年のソウル大会で、公開競技として行われました。正式競技になったのは、1992年のバルセロナ大会からです。",
    sources: ["wikiBadminton", "joc"],
    factCheck: "公開競技は1972・1988年（Wikipedia）、正式競技は1992年（JOC）。",
  },
  {
    kind: "tf", category: "history", level: "junior",
    question: "バドミントンの元になった遊びは、インドの町「プーナ」で、イギリスの軍人たちが楽しんでいたといわれている。",
    choices: ["○", "×"],
    explanation: "インドの町プーナで、イギリスの軍人たちが遊んでいた「プーナ」という遊びが元で、のちにイギリスに伝わったといわれています。",
    sources: ["wikiBadminton"],
    factCheck: "Wikipediaに、Poona（インドの駐屯地の町）と、そこで最初のルールが作られた旨の記述。年代は資料で差があるため、問題文では年を書かなかった。",
  },
  // ───────────── シャトル・ラケット ─────────────
  {
    kind: "tf", category: "gear", level: "elementary",
    question: "羽根のシャトルには、羽根が12枚ついている。",
    choices: ["×", "○"],
    explanation: "競技規則で、シャトルの羽根は、12枚ではなく、16枚と決まっています。",
    sources: ["laws"],
    factCheck: "BWF Laws 2.2.1「16 feathers fixed in the base」で確認。",
  },
  {
    kind: "choice", category: "gear", level: "elementary",
    question: "試合で使うシャトル1個の重さは、およそどれくらい？",
    choices: ["約5g", "約0.5g", "約50g"],
    explanation: "競技規則で、4.74g〜5.50gと決まっています。10円玉1枚（4.5g）より、少し重いくらいです。",
    sources: ["laws"],
    factCheck: "BWF Laws 2.2.6「4.74 to 5.50 grams」で確認。10円玉の重さ4.5gは、造幣局の公表値として一般に知られる値。",
  },
  {
    kind: "tf", category: "gear", level: "junior",
    question: "天然の羽根のシャトルの台（先の丸い部分）は、コルクに、薄い革をかぶせて作られている。",
    choices: ["○", "×"],
    explanation: "競技規則に、「コルクの台に、薄い革をかぶせた、天然の羽根のシャトル」の飛び方が基準として書かれています。",
    sources: ["laws"],
    factCheck: "BWF Laws 2.1 に「cork base covered by a thin layer of leather」と確認。",
  },
  {
    kind: "choice", category: "gear", level: "junior",
    question: "シャトルの羽根の長さは、決まっている。およそ何cm？",
    choices: ["6.2〜7cm", "2〜3cm", "10〜12cm"],
    explanation: "羽根の長さは、62mm〜70mmの、そろった長さと決まっています。",
    sources: ["laws"],
    factCheck: "BWF Laws 2.2.2「62 mm to 70 mm」で確認。",
  },
  {
    kind: "choice", category: "gear", level: "elementary",
    question: "バドミントンのラケットには、長さの上限がある。全体の長さは、何cmまで？",
    choices: ["68cm", "60cm", "80cm"],
    explanation: "ラケットは、全体の長さが680mm（68cm）まで、幅が230mm（23cm）までと決まっています。",
    sources: ["laws"],
    factCheck: "BWF Laws 4「not exceeding 680 mm in overall length and 230 mm in overall width」で確認。",
  },
  {
    kind: "tf", category: "gear", level: "junior",
    question: "ラケットの、ガットを張る部分（ストリング面）にも、大きさの上限がある。",
    choices: ["○", "×"],
    explanation: "ストリング面は、長さ280mm、幅220mmまでと決まっています。",
    sources: ["laws"],
    factCheck: "BWF Laws 4.2.2「shall not exceed 280 mm in overall length and 220 mm in overall width」で確認（ただし例外の定めあり）。",
  },
  {
    kind: "choice", category: "gear", level: "junior",
    question: "シャトルが正しい速さかどうかを調べるテストでは、下から思いきり打ったシャトルは、反対側のバックラインの、どのあたりに落ちる？",
    choices: ["バックラインの53〜99cm手前", "バックラインの10〜20cm手前", "バックラインの2〜3m手前"],
    explanation: "バックラインの上から、下から上へ打ち、コートの反対側のバックラインより、530mm〜990mm（53〜99cm）手前に落ちれば、正しい速さです。",
    sources: ["laws"],
    factCheck: "BWF Laws 3「not less than 530 mm and not more than 990 mm short of the other back boundary line」で確認。",
  },
  // ───────────── コートとルール ─────────────
  {
    kind: "choice", category: "rules", level: "elementary",
    question: "バドミントンのコートの長さ（ネットに対して縦方向）は、何m？",
    choices: ["13.4m", "10m", "15m"],
    explanation: "コートの長さは13.4m。幅は、ダブルスが6.1m、シングルスが5.18mです。",
    sources: ["wikiBadminton"],
    factCheck: "BWF Laws の寸法は図のみのため、Wikipedia（13.4m・6.1m・5.18m）と日本語の解説記事の検索結果で確認。",
  },
  {
    kind: "tf", category: "rules", level: "elementary",
    question: "シングルスのコートは、ダブルスのコートより、幅がせまい。",
    choices: ["○", "×"],
    explanation: "ダブルスの幅は6.1m、シングルスの幅は5.18mです。シングルスは、両側のサイドが、46cmずつ内側になります。",
    sources: ["wikiBadminton"],
    factCheck: "Wikipedia（ダブルス6.1m、シングルス5.18m）。差は(6.1−5.18)÷2＝0.46m。",
  },
  {
    kind: "choice", category: "rules", level: "elementary",
    question: "ネットの高さは、真ん中で、何m？",
    choices: ["1.524m", "1.2m", "1.8m"],
    explanation: "ネットの上のふちは、コートの真ん中で1.524m、ネットの支柱の位置で1.55mです。",
    sources: ["laws"],
    factCheck: "BWF Laws 1「1.524 metres at the centre … 1.55 metres over the side lines for doubles」で確認。",
  },
  {
    kind: "tf", category: "rules", level: "junior",
    question: "ネットは、真ん中のほうが、支柱のところよりも、少し高い。",
    choices: ["×", "○"],
    explanation: "ネットの高さは、真ん中が1.524m、支柱のところが1.55mです。真ん中のほうが、2.6cm低くなっています。",
    sources: ["laws"],
    factCheck: "同上（1.55−1.524＝0.026m）。",
  },
  {
    kind: "tf", category: "rules", level: "elementary",
    question: "ラインの上に落ちたシャトルは、「アウト」になる。",
    choices: ["×", "○"],
    explanation: "ラインは、ラインが囲む場所の一部です。ラインの上に落ちたシャトルは、「イン」です。ラインの外側に落ちたときだけが、アウトです。",
    sources: ["laws"],
    factCheck: "BWF Laws 1「All the lines shall form part of the area which they define」、13.3.1「not on or within the boundary lines」で確認。",
  },
  {
    kind: "tf", category: "rules", level: "junior",
    question: "試合中、シャトルが体育館の天井に当たると、フォルト（失点）になる。",
    choices: ["○", "×"],
    explanation: "競技規則では、天井に当たると、フォルトです。ただし、天井の低い会場などでは、その大会のきまりで、別の扱いをすることがあります。大会の要項を、確認しましょう。",
    sources: ["laws"],
    factCheck: "BWF Laws 13.3.3「touches the ceiling or side walls」。会場事情による地方規則の注記あり（Laws 13.3.5 の後）。",
  },
  {
    kind: "tf", category: "rules", level: "junior",
    question: "サービスは、打つ瞬間のシャトル全体が、床から1.15mより低い位置になければならない。",
    choices: ["○", "×"],
    explanation: "競技規則では、サービスを打つ瞬間のシャトルは、全体が床から1.15m未満の位置にある必要があります。大会によっては、「腰より下」など別の基準を使うことがあるので、要項を確認しましょう。",
    sources: ["laws"],
    factCheck: "BWF Laws 9.1.6「the whole shuttle shall be below 1.15 metres from the surface of the court」で確認。",
  },
  {
    kind: "tf", category: "rules", level: "junior",
    question: "サービスを打つとき、シャトルに回転（スピン）をかけて落としてから打ってもよい。",
    choices: ["×", "○"],
    explanation: "サーバーは、シャトルを、回転をかけずに放して、打たなければなりません。",
    sources: ["laws"],
    factCheck: "BWF Laws 9.1.5「the server shall release the shuttle without adding spin」で確認。",
  },
  {
    kind: "choice", category: "rules", level: "elementary",
    question: "2027年1月4日から、国際大会では、1ゲームを何点先取で行う予定？",
    choices: ["15点", "21点", "11点"],
    explanation: "2026年4月に、世界バドミントン連盟が、1ゲーム15点の「3ゲーム×15点制」を承認しました。2027年1月4日から、国際大会で始まります。日本でも、2026年から主要な大会で、段階的に導入されています。",
    sources: ["bwf15", "xinhua15"],
    factCheck: "BWFの2026年4月25日の総会で承認、2027年1月4日から。Xinhua と BWF 公式ニュースの検索結果で確認（BWF公式ページの本文は取得できず）。日本の導入は rules.ts に記載のBAJ発表（2026年5月1日）に依拠（今回は未再確認）。",
  },
  {
    kind: "tf", category: "rules", level: "junior",
    question: "21点制で、29対29になったら、さらに2点差がつくまで、いつまでも続く。",
    choices: ["×", "○"],
    explanation: "20対20になったら、2点差がつくまで続けます。ただし、29対29になったら、30点目をとった側が勝ちです。2点差は、必要ありません。",
    sources: ["laws"],
    factCheck: "BWF Laws 7.4・7.5「If the score becomes 29-all, the side scoring the 30th point shall win」で確認。",
  },
  {
    kind: "tf", category: "rules", level: "junior",
    question: "3ゲーム目では、どちらかが先に11点になったとき（21点制）に、コートを交代する。",
    choices: ["○", "×"],
    explanation: "第3ゲームでは、どちらかが最初に11点になったときに、コートを交代します。（15点制では8点）",
    sources: ["laws"],
    factCheck: "BWF Laws 8.1.3 で確認。15点制は rules.ts 記載のBAJルールブック2026付録3に依拠。",
  },
  {
    kind: "choice", category: "rules", level: "junior",
    question: "ゲームの途中、どちらかが11点になったとき（21点制）の、インターバル（休み）は、何秒以内？",
    choices: ["60秒以内", "30秒以内", "5分以内"],
    explanation: "11点になったときのインターバルは、60秒を超えない長さです。",
    sources: ["laws"],
    factCheck: "BWF Laws 16.2.1「not exceeding 60 seconds during each game when the leading score reaches 11」で確認。",
  },
  {
    kind: "choice", category: "rules", level: "junior",
    question: "ゲームとゲームの間の、インターバル（休み）は、何秒以内？",
    choices: ["120秒以内", "30秒以内", "10分以内"],
    explanation: "第1ゲームと第2ゲームの間、第2ゲームと第3ゲームの間は、120秒（2分）を超えない長さです。",
    sources: ["laws"],
    factCheck: "BWF Laws 16.2.2「not exceeding 120 seconds between the first and second game」で確認。",
  },
  {
    kind: "tf", category: "rules", level: "junior",
    question: "ダブルスで、サーブをしている側が得点したら、サーブを打つ人が、パートナーと交代する。",
    choices: ["×", "○"],
    explanation: "サーブ側が得点したときは、同じ人が、反対側のサービスコートから、続けてサーブを打ちます。サーブが相手に移ったときに、サーブを打つ人が変わります。",
    sources: ["laws"],
    factCheck: "BWF Laws 11.3.1「the server shall then serve again from the alternate service court」で確認。",
  },
  {
    kind: "choice", category: "rules", level: "elementary",
    question: "サーブをする側の得点が「0点」や「偶数」のとき、どちら側のサービスコートから打つ？",
    choices: ["右側", "左側", "どちらでもよい"],
    explanation: "サーブをする側の得点が、0点や偶数のときは右側、奇数のときは左側のサービスコートから打ちます。",
    sources: ["laws"],
    factCheck: "BWF Laws 10.1.1・11.1.1 で確認。",
  },
  {
    kind: "tf", category: "rules", level: "elementary",
    question: "1つの試合は、特に決めがなければ、3ゲームのうち、先に2ゲームをとった側が勝ちになる。",
    choices: ["○", "×"],
    explanation: "試合は、3ゲームのうち、2ゲームを先にとった側の勝ちです。",
    sources: ["laws"],
    factCheck: "BWF Laws 7.1「the best of three games」で確認。",
  },
  {
    kind: "tf", category: "rules", level: "elementary",
    question: "1人の選手が、続けて2回、シャトルを打っても、フォルトにはならない。",
    choices: ["×", "○"],
    explanation: "同じ人が、続けて2回打つのは、フォルトです。ただし、1回のスイングで、ラケットの枠とガットの面の両方に当たった場合は、フォルトではありません。",
    sources: ["laws"],
    factCheck: "BWF Laws 13.3.7「hit twice in succession by the same player. However, a shuttle hitting the head and the stringed area of the racket in one stroke shall not be a fault」で確認。",
  },
  {
    kind: "tf", category: "rules", level: "elementary",
    question: "コートの白いライン（線）の太さは、約10cmと決まっている。",
    choices: ["×", "○"],
    explanation: "ラインの太さは、40mm（4cm）と決まっています。色は、白か黄色など、見分けやすい色が望ましいとされています。",
    sources: ["laws"],
    factCheck: "BWF Laws 1「lines 40 mm wide」、「preferably coloured white or yellow」で確認。",
  },
  {
    kind: "tf", category: "rules", level: "elementary",
    question: "第1ゲームが終わったら、2つの側は、コート（陣地）を交代する。",
    choices: ["○", "×"],
    explanation: "第1ゲームが終わったときと、第2ゲームが終わったあと（第3ゲームがあるとき）に、コートを交代します。",
    sources: ["laws"],
    factCheck: "BWF Laws 8.1.1・8.1.2 で確認。",
  },
];

/** 元データ。id は q01〜（並べた順） */
export const baseQuiz: Quiz[] = seeds.map(({ sources, ...q }, i) => ({
  id: `q${String(i + 1).padStart(2, "0")}`,
  ...q,
  sources: sources.map((k) => SRC[k]),
  checkedAt: CHECKED,
}));

/** 公開される内容。エディタで保存した内容があれば、そちらを使う */
export const quiz: Quiz[] = content.quiz ?? baseQuiz;

/** ○×クイズの選択肢は、○ → × の順。3択は、問題の id から決まる並びにする（読み込みのたびに変わらないように） */
export function displayChoices(q: Quiz): string[] {
  if (q.kind === "tf") return ["○", "×"];
  const key = (s: string) => {
    let h = 7;
    for (const ch of q.id + s) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return h;
  };
  return [...q.choices].sort((a, b) => key(a) - key(b));
}

export const correctChoice = (q: Quiz): string => q.choices[0];
