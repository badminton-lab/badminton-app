/**
 * 練習プラン例。既存のメニュー（id）を、時間配分つきで並べたもの。
 * 公開サイトでは、確認済みのメニューだけがリンクになる（ほかは、名前だけ表示する）。
 * 時間配分は目安。人数・体育館・生徒の様子に合わせて、調整する前提の例。
 */
export type PlanStep = {
  /** 練習の段階（準備運動・ノックなど）。同じ名前が続くと、1つのまとまりとして表示する */
  section: string;
  /** メニューの id */
  id: string;
  minutes: number;
  /** この場面での使い方（任意） */
  note?: string;
};

export type SamplePlan = {
  id: string;
  title: string;
  /** 一言の説明 */
  summary: string;
  audience: string;
  people: string;
  courts: string;
  level: string;
  goal: string;
  steps: PlanStep[];
  /** 運営のコツ・注意 */
  tips: string[];
};

export const samplePlans: SamplePlan[] = [
  {
    id: "elementary-club-90",
    title: "小学生クラブ（初心者）90分",
    summary: "遊びで体を動かしてから、ラケットに慣れ、最後はゲームで楽しむ。「バドミントンが好き」になることを、いちばんの目標にした流れ。",
    audience: "小学生（初心者中心）",
    people: "10〜20人",
    courts: "コート2〜3面",
    level: "初級",
    goal: "ラケットに慣れる。シャトルを打つ楽しさを知る。",
    steps: [
      { section: "準備運動", id: "wu07", minutes: 5, note: "スキップで体を温める。" },
      { section: "準備運動", id: "wu24", minutes: 5 },
      { section: "運動遊び", id: "pl03", minutes: 5, note: "ルールを短く説明して、すぐ始める。" },
      { section: "運動遊び", id: "pl01", minutes: 5 },
      { section: "ラケットに慣れる", id: "d01", minutes: 10, note: "握り方を、全員で確認する。" },
      { section: "ラケットで遊ぶ", id: "wx03", minutes: 8 },
      { section: "ラケットで遊ぶ", id: "pl06", minutes: 7, note: "回数を記録して、前回と比べる。" },
      { section: "打つ練習", id: "wx05", minutes: 10, note: "ひとりで、シャトルを投げ上げて打つ。" },
      { section: "打つ練習", id: "d02", minutes: 10, note: "2人1組で、打ち合う。" },
      { section: "ゲーム", id: "d26", minutes: 15, note: "ハーフコートで、小さなゲームをする。勝ち負けより、ラリーが続くことをほめる。" },
      { section: "整理運動", id: "st29", minutes: 5 },
      { section: "整理運動", id: "st23", minutes: 5, note: "ペアで、声をかけ合って伸ばす。" },
    ],
    tips: [
      "説明は短く（1メニュー30秒）。見本を見せてから、すぐ動く。",
      "待ち時間を作らない。人数が多いときは、コートを増やすか、ペアで動く。",
      "うまくいったことを、1人ずつ、具体的にほめる。",
      "水分補給の時間を、途中で、必ず入れる。",
    ],
  },
  {
    id: "junior-high-120",
    title: "中学部活（基礎づくり）120分",
    summary: "フットワーク→ノック→パターン→ゲームの、部活の基本の流れ。基礎のショットを、くり返し打つ。",
    audience: "中学生（初級〜中級）",
    people: "12〜20人",
    courts: "コート3面",
    level: "初級〜中級",
    goal: "基本のショット（クリア・ドロップ・スマッシュ・ヘアピン）と、基本のフットワークを安定させる。",
    steps: [
      { section: "準備運動", id: "wu01", minutes: 5 },
      { section: "準備運動", id: "wu06", minutes: 5 },
      { section: "準備運動", id: "wh02", minutes: 5, note: "股関節を、動かしてほぐす。" },
      { section: "フォーム", id: "wx01", minutes: 10, note: "動きを3つに分けて、確認する。" },
      { section: "フットワーク", id: "fw02", minutes: 5 },
      { section: "フットワーク", id: "fw05", minutes: 10 },
      { section: "ノック", id: "hf05", minutes: 10, note: "3人1組。ノッカー・打つ人・待つ人で、交代する。" },
      { section: "ノック", id: "hf07", minutes: 10 },
      { section: "ノック", id: "hf08", minutes: 10 },
      { section: "パターン", id: "d14", minutes: 10 },
      { section: "パターン", id: "d12", minutes: 10 },
      { section: "ゲーム", id: "d10", minutes: 20, note: "ハンデをつけて、力の差があっても楽しめるようにする。" },
      { section: "整理運動", id: "st29", minutes: 5 },
      { section: "整理運動", id: "st15", minutes: 5 },
    ],
    tips: [
      "ノックは、球数より、フォームを見る。1球ごとに、1つだけ声をかける。",
      "3面で回すとき、待ち時間に、素振りやフットワークを入れる。",
      "ゲームの前に、その日の練習で意識することを、1つ決める。",
      "最後の5分で、今日のできたことを、全員で振り返る。",
    ],
  },
  {
    id: "doubles-4-90",
    title: "少人数（4人）ダブルス強化 90分",
    summary: "コート1面・4人で、ダブルスの陣形と連係を練習する。2人1組のペアで動き、ノックは、休んでいる人が担当する。",
    audience: "ダブルスの練習をしたい中学生以上（中級）",
    people: "4人（2組）",
    courts: "コート1面",
    level: "中級",
    goal: "トップ＆バックとサイドバイサイドの切り替え、ペアの声かけ、サーブ後の展開。",
    steps: [
      { section: "準備運動", id: "wu01", minutes: 5 },
      { section: "準備運動", id: "wh04", minutes: 5 },
      { section: "準備運動", id: "wh11", minutes: 5, note: "股関節から、1歩目を出す感覚をつかむ。" },
      { section: "フットワーク", id: "fd05", minutes: 5, note: "ペアで、声を出して切り替える。" },
      { section: "フットワーク", id: "fd07", minutes: 5 },
      { section: "ノック", id: "hd05", minutes: 10, note: "1組がノックを受け、もう1組が交代でノッカーをする。" },
      { section: "ノック", id: "hd10", minutes: 10 },
      { section: "ノック", id: "hd11", minutes: 5 },
      { section: "パターン", id: "pd04", minutes: 10 },
      { section: "パターン", id: "pd08", minutes: 10 },
      { section: "パターン", id: "pd10", minutes: 5 },
      { section: "ゲーム", id: "pd30", minutes: 10, note: "練習した動きを、1つだけ意識して試す。" },
      { section: "整理運動", id: "st29", minutes: 5 },
    ],
    tips: [
      "4人なので、ノッカーは、休んでいる組が担当する。ノックは、組ごとに交代する。",
      "「誰が打つか」の約束（真ん中の球は、フォア側など）を、練習の最初に決める。",
      "ミスしたときは、責めずに、「次はどうする？」と、ペアで話す。",
    ],
  },
  {
    id: "circle-12-120",
    title: "コート1面に12人（サークル・初級〜中級）120分",
    summary: "コートが足りない日の回し方。コートを使う組と、待つ組を決めて、時間で交代する。待っている間も、動く。",
    audience: "社会人サークル・クラブ（初級〜中級）",
    people: "12人前後",
    courts: "コート1面",
    level: "初級〜中級",
    goal: "待ち時間を減らして、全員が、たくさん打つ・動く。",
    steps: [
      { section: "準備運動", id: "wu24", minutes: 5 },
      { section: "準備運動", id: "wu06", minutes: 5 },
      { section: "準備運動", id: "wh01", minutes: 5 },
      { section: "フォーム", id: "wx05", minutes: 10, note: "全員で、同時にできる。コートの外でも行える。" },
      { section: "ノック", id: "rf27", minutes: 15, note: "3人1組を4組つくる。コートは半面ずつ使い、残りの組は、壁際でシャドー。" },
      { section: "ノック", id: "hf17", minutes: 15, note: "組を入れ替えて、もう一度。" },
      { section: "ゲーム回し", id: "d29", minutes: 20, note: "5分ごとに、入れ替える。" },
      { section: "ゲーム回し", id: "d28", minutes: 20, note: "ペアを変えながら、15点などの短いゲームをする。" },
      { section: "ゲーム回し", id: "d10", minutes: 15 },
      { section: "整理運動", id: "st29", minutes: 5 },
      { section: "整理運動", id: "st10", minutes: 5 },
    ],
    tips: [
      "コートに入る組・待つ組・審判（得点係）の3役を回すと、待ち時間が、役目になる。",
      "待っている人は、素振り・フットワーク・ストレッチのどれかを、決めておく。",
      "ゲームの時間は、タイマーで区切る。点数で区切ると、長引いて、全員が回らない。",
    ],
  },
  {
    id: "pre-match-90",
    title: "試合前の調整 90分（中級〜上級）",
    summary: "試合の1〜3日前に、疲れを残さず、動きと感覚を整える。球数は、増やしすぎない。",
    audience: "大会・試合を控えた選手（中級〜上級）",
    people: "4〜8人",
    courts: "コート1〜2面",
    level: "中級〜上級",
    goal: "体を温めて、反応と1歩目を整える。試合の流れを確認する。",
    steps: [
      { section: "準備運動", id: "wu06", minutes: 5 },
      { section: "準備運動", id: "wh02", minutes: 5 },
      { section: "準備運動", id: "wh13", minutes: 5 },
      { section: "フットワーク", id: "fw17", minutes: 5 },
      { section: "フットワーク", id: "fw21", minutes: 5 },
      { section: "フットワーク", id: "fw02", minutes: 5 },
      { section: "ノック", id: "hf24", minutes: 10, note: "球数は少なめ。1球ごとに、質を確認する。" },
      { section: "ノック", id: "rf16", minutes: 15 },
      { section: "パターン", id: "d25", minutes: 15, note: "試合で、よく使うコースだけを選ぶ。" },
      { section: "ゲーム", id: "d27", minutes: 15, note: "出る大会の点数方式（21点制または15点制）で、1ゲームだけ行う。" },
      { section: "整理運動", id: "st29", minutes: 5 },
    ],
    tips: [
      "試合の直前に、新しいことは、増やさない。いつもの動きを、確認する。",
      "疲れを残さないよう、全力のダッシュは、少なめにする。",
      "出る大会の点数方式（21点制・15点制）を、事前に確認して、練習も合わせる。",
      "終わりに、「試合で、1つだけ意識すること」を、決めて帰る。",
    ],
  },
];

export const planMinutes = (p: SamplePlan) => p.steps.reduce((sum, s) => sum + s.minutes, 0);
