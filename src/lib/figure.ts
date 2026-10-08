import type {
  ColorName,
  Illustration,
  IllustrationPart,
  PersonPart,
  PersonPose,
  RacketPart,
} from "@/data/types";

/** イメージ図の大きさ（座標の範囲） */
export const ILLUSTRATION_SIZE = { width: 320, height: 200 } as const;
/** 床の線の高さ */
export const GROUND_Y = 172;

/** 人の体の各部分の長さ（scale = 1 のとき）。全身で、約100 */
export const BODY = {
  headR: 7,
  neckGap: 2,
  torso: 34,
  upperArm: 19,
  foreArm: 17,
  thigh: 25,
  shin: 25,
  foot: 8,
  /** 肩の位置（腰から首までの何割か） */
  shoulderAt: 0.88,
} as const;

/** ラケットの長さ（グリップの端から、ヘッドの先まで） */
export const RACKET = { handle: 12, shaft: 10, headRx: 6.5, headRy: 9.5 } as const;

export const COLORS: Record<ColorName, string> = {
  blue: "#2563eb",
  orange: "#f97316",
  gray: "#64748b",
  green: "#059669",
  red: "#e11d48",
  yellow: "#eab308",
  dark: "#0f172a",
};

export const COLOR_LABELS: Record<ColorName, string> = {
  blue: "青",
  orange: "オレンジ",
  gray: "グレー",
  green: "緑",
  red: "赤",
  yellow: "黄",
  dark: "黒",
};

export type Pt = { x: number; y: number };

const rad = (deg: number) => (deg * Math.PI) / 180;

/** 向き（度。0=下、90=右、180=上）の、単位ベクトル */
export const dirOf = (deg: number): Pt => ({ x: Math.sin(rad(deg)), y: Math.cos(rad(deg)) });

/** 向きの単位ベクトルから、角度（度）へ。dirOf の逆 */
export const angleOf = (dx: number, dy: number): number => (Math.atan2(dx, dy) * 180) / Math.PI;

export type Joints = {
  hip: Pt;
  neck: Pt;
  head: Pt;
  shoulder: Pt;
  elbowL: Pt;
  wristL: Pt;
  elbowR: Pt;
  wristR: Pt;
  kneeL: Pt;
  ankleL: Pt;
  kneeR: Pt;
  ankleR: Pt;
};

/** 人の、各関節の位置（イメージ図の座標）を求める */
export function figureJoints(p: PersonPart): Joints {
  const s = p.scale ?? 1;
  const f = p.flip ? -1 : 1;
  const pose = p.pose;
  // 反転していない向きで、腰を原点に計算し、あとで、拡大・反転・移動する
  const step = (from: Pt, deg: number, len: number): Pt => {
    const d = dirOf(deg);
    return { x: from.x + d.x * len, y: from.y + d.y * len };
  };
  const hip = { x: 0, y: 0 };
  const neck = step(hip, pose.torso, BODY.torso);
  const head = step(neck, pose.head, BODY.headR + BODY.neckGap);
  const shoulder = step(hip, pose.torso, BODY.torso * BODY.shoulderAt);
  const elbowL = step(shoulder, pose.armL[0], BODY.upperArm);
  const wristL = step(elbowL, pose.armL[1], BODY.foreArm);
  const elbowR = step(shoulder, pose.armR[0], BODY.upperArm);
  const wristR = step(elbowR, pose.armR[1], BODY.foreArm);
  const kneeL = step(hip, pose.legL[0], BODY.thigh);
  const ankleL = step(kneeL, pose.legL[1], BODY.shin);
  const kneeR = step(hip, pose.legR[0], BODY.thigh);
  const ankleR = step(kneeR, pose.legR[1], BODY.shin);
  const to = (q: Pt): Pt => ({ x: p.x + f * q.x * s, y: p.y + q.y * s });
  return {
    hip: to(hip),
    neck: to(neck),
    head: to(head),
    shoulder: to(shoulder),
    elbowL: to(elbowL),
    wristL: to(wristL),
    elbowR: to(elbowR),
    wristR: to(wristR),
    kneeL: to(kneeL),
    ankleL: to(ankleL),
    kneeR: to(kneeR),
    ankleR: to(ankleR),
  };
}

/**
 * 人が床に着くような、腰の高さ（y）を求める。足首・膝・手首・腰のうち、いちばん低い点が、床に着く。
 * ポーズを替えたとき、床から浮いたり、床に潜ったりしないように、使う。
 */
export function groundedY(p: PersonPart, ground = GROUND_Y): number {
  const j = figureJoints({ ...p, y: 0 });
  const lowest = Math.max(j.hip.y, j.kneeL.y, j.kneeR.y, j.ankleL.y, j.ankleR.y, j.wristL.y, j.wristR.y);
  // 線の太さの分だけ、床より少し上に
  return ground - lowest - 2.2 * (p.scale ?? 1);
}

/** 画面上の向き（度）を、人の向き（反転）を考慮して、人の座標系の角度へ（逆も同じ） */
export const mirrorAngle = (deg: number, flip: boolean | undefined) => (flip ? -deg : deg);

/**
 * ラケットの、グリップ位置と、向き（画面上の、度。0=下、90=右、180=上）を求める。
 * 人の手に持たせているときは、手首の位置と、前腕の向き＋rotation になる。
 */
export function racketPlacement(r: RacketPart, parts: IllustrationPart[]): { grip: Pt; angle: number; scale: number } {
  if (r.attach) {
    const person = parts.find((q): q is PersonPart => q.type === "person" && q.id === r.attach!.to);
    if (person) {
      const j = figureJoints(person);
      const wrist = r.attach.hand === "L" ? j.wristL : j.wristR;
      const foreAngle = r.attach.hand === "L" ? person.pose.armL[1] : person.pose.armR[1];
      return {
        grip: wrist,
        angle: mirrorAngle(foreAngle + r.rotation, person.flip),
        scale: (r.scale ?? 1) * (person.scale ?? 1),
      };
    }
  }
  return { grip: { x: r.x, y: r.y }, angle: r.rotation, scale: r.scale ?? 1 };
}

// ───────────── 部品の追加・既定値（エディタが使う） ─────────────

/** まっすぐ立った人 */
export const STAND_POSE: PersonPose = {
  torso: 180,
  head: 180,
  armL: [-6, -4],
  armR: [6, 4],
  legL: [-4, -2],
  legR: [4, 2],
};

let counter = 0;
/** 部品の id（図の中で重ならない、短い文字列） */
export function newPartId(parts: IllustrationPart[], prefix: string): string {
  const used = new Set(parts.map((p) => p.id));
  let id = "";
  do {
    counter += 1;
    id = `${prefix}${counter}`;
  } while (used.has(id));
  return id;
}

export type NewPartType = IllustrationPart["type"];

/** 種類ごとの、初期の部品（位置 x, y に置く） */
export function makePart(type: NewPartType, id: string, x: number, y: number): IllustrationPart {
  switch (type) {
    case "person":
      return { id, type, x, y, scale: 1, color: "blue", pose: STAND_POSE };
    case "racket":
      return { id, type, x, y, rotation: 20 };
    case "shuttle":
      return { id, type, x, y, rotation: 0 };
    case "ball":
      return { id, type, x, y, color: "yellow" };
    case "cone":
      return { id, type, x, y, color: "orange" };
    case "ring":
      return { id, type, x, y, color: "red" };
    case "arrow":
      return { id, type, x1: x - 30, y1: y, x2: x + 30, y2: y, color: "dark" };
    case "line":
      return { id, type, x1: x - 40, y1: y, x2: x + 40, y2: y, width: 2, color: "gray" };
    case "rect":
      return { id, type, x: x - 30, y: y - 6, w: 60, h: 12, color: "gray" };
    case "text":
      return { id, type, x, y, text: "文字", size: 12, color: "dark" };
  }
}

export const PART_LABELS: Record<NewPartType, string> = {
  person: "人",
  racket: "ラケット",
  shuttle: "シャトル",
  ball: "ボール",
  cone: "コーン",
  ring: "的・フープ",
  arrow: "矢印",
  line: "線",
  rect: "四角（マット・壁など）",
  text: "文字",
};

export const EMPTY_ILLUSTRATION: Illustration = { parts: [], ground: true };
