import { figureJoints, groundedY } from "@/lib/figure";
import type { ColorName, Illustration, IllustrationPart, PersonPart, PersonPose } from "./types";
import { POSES } from "./poses";

/**
 * コート図のないメニューに付ける、イメージ図（人の体・ラケット・道具の部品の組み合わせ）。
 * ここは「初期の図」で、エディタ（/editor）で、メニューごとに自由に直せる。
 * 人のポーズは poses.ts のひな型を使い、足が床に着くように高さをそろえている。
 */

type PersonOpts = {
  x?: number;
  scale?: number;
  flip?: boolean;
  color?: ColorName;
  label?: string;
  /** ひな型の一部の角度だけ変える */
  tweak?: Partial<PersonPose>;
  /** ラケットを手前の手に持たせる（向き）。true なら 15° */
  racket?: number | boolean;
  /** 床からの高さ（ジャンプなど） */
  lift?: number;
  feet?: boolean;
};

/** 腕を上げるポーズは、図からはみ出さないように、小さめに */
const DEFAULT_SCALE: Record<string, number> = { jump: 1.0, armsUp: 1.15, swingBack: 0.9, hit: 0.9, triceps: 1.15, sideBend: 1.15, neckTilt: 1.2 };

let seq = 0;
const nid = (p: string) => `${p}${(seq += 1)}`;

/** 人（と、持たせたラケット）の部品を作る */
export function person(pose: string, o: PersonOpts = {}): IllustrationPart[] {
  const def = POSES[pose];
  if (!def) throw new Error(`unknown pose: ${pose}`);
  const id = nid("p");
  const base: PersonPart = {
    id,
    type: "person",
    x: o.x ?? 160,
    y: 0,
    scale: o.scale ?? DEFAULT_SCALE[pose] ?? 1.3,
    color: o.color ?? "blue",
    ...(o.flip ? { flip: true } : {}),
    ...(o.label ? { label: o.label } : {}),
    ...(o.feet === false || (o.feet === undefined && def.front) ? { feet: false } : {}),
    pose: { ...def.pose, ...o.tweak },
  };
  const placed: PersonPart = { ...base, y: Math.round((groundedY(base) - (o.lift ?? 0)) * 10) / 10 };
  const parts: IllustrationPart[] = [placed];
  if (o.racket) {
    parts.push({ id: nid("k"), type: "racket", x: 0, y: 0, rotation: o.racket === true ? 15 : o.racket, attach: { to: id, hand: "R" } });
  }
  return parts;
}

export const arrow = (x1: number, y1: number, x2: number, y2: number, o: { bend?: number; dashed?: boolean; color?: ColorName } = {}): IllustrationPart => ({
  id: nid("a"),
  type: "arrow",
  x1,
  y1,
  x2,
  y2,
  ...(o.bend ? { bend: o.bend } : {}),
  ...(o.dashed ? { dashed: true } : {}),
  color: o.color ?? "orange",
});

export const text = (x: number, y: number, t: string, o: { size?: number; color?: ColorName } = {}): IllustrationPart => ({
  id: nid("t"),
  type: "text",
  x,
  y,
  text: t,
  size: o.size ?? 11,
  color: o.color ?? "dark",
});

export const rect = (x: number, y: number, w: number, h: number, color: ColorName = "gray"): IllustrationPart => ({ id: nid("r"), type: "rect", x, y, w, h, color });
export const cone = (x: number, y: number, color: ColorName = "orange"): IllustrationPart => ({ id: nid("c"), type: "cone", x, y, color });
export const ball = (x: number, y: number, color: ColorName = "yellow", scale = 1): IllustrationPart => ({ id: nid("b"), type: "ball", x, y, color, scale });
export const ring = (x: number, y: number, scale = 1, color: ColorName = "red"): IllustrationPart => ({ id: nid("g"), type: "ring", x, y, scale, color });
export const shuttle = (x: number, y: number, rotation = 0): IllustrationPart => ({ id: nid("s"), type: "shuttle", x, y, rotation });
export const line = (x1: number, y1: number, x2: number, y2: number, o: { color?: ColorName; width?: number; dashed?: boolean } = {}): IllustrationPart => ({
  id: nid("l"),
  type: "line",
  x1,
  y1,
  x2,
  y2,
  color: o.color ?? "gray",
  width: o.width ?? 2,
  ...(o.dashed ? { dashed: true } : {}),
});

/** person() で作った部品の、関節の位置（手首・肘など）を取り出す */
export function joint(parts: IllustrationPart[], name: keyof ReturnType<typeof figureJoints>): { x: number; y: number } {
  const p = parts.find((q): q is PersonPart => q.type === "person");
  if (!p) throw new Error("person not found");
  return figureJoints(p)[name];
}

/** ネット（床から立つ、細い壁） */
export const net = (x: number): IllustrationPart[] => [rect(x - 1.5, 76, 3, 96, "gray"), rect(x - 3.5, 74, 7, 3, "dark")];

const scene = (...parts: (IllustrationPart | IllustrationPart[])[]): Illustration => ({ parts: parts.flat(), ground: true });

const W = 260; // 壁の位置（右側）


type RoleItem = {
  pose: string;
  x: number;
  role: string;
  color?: ColorName;
  label?: string;
  racket?: number | boolean;
  flip?: boolean;
  scale?: number;
  tweak?: Partial<PersonPose>;
};

/**
 * 役割を順番に回すドリルの図。人を横に並べ、役割の名前を下に書き、回る順番を矢印で示す。
 * cycle が true なら、左から右へ矢印をつなぎ、最後の人から最初の人へ戻る矢印をつける。
 */
function rolesScene(title: string, items: RoleItem[], o: { cycle?: boolean; extra?: IllustrationPart[]; note?: string } = {}): Illustration {
  const parts: IllustrationPart[] = [...(o.extra ?? [])];
  for (const it of items) {
    parts.push(...person(it.pose, { x: it.x, color: it.color, label: it.label, racket: it.racket, flip: it.flip, scale: it.scale ?? (it.pose === "hit" ? 0.9 : 1.05), tweak: it.tweak }));
    parts.push(text(it.x, 186, it.role, { size: 10 }));
  }
  if (o.cycle) {
    const xs = items.map((it) => it.x);
    for (let k = 0; k < xs.length - 1; k++) parts.push(arrow(xs[k] + 16, 52, xs[k + 1] - 16, 52, { color: "red", bend: -14 }));
    parts.push(arrow(xs[xs.length - 1], 40, xs[0], 40, { color: "red", bend: 22, dashed: true }));
  }
  if (o.note) parts.push(text(160, 30, o.note, { size: 10, color: "red" }));
  parts.push(text(160, 14, title));
  return scene(parts);
}

const WAIT = "gray" as ColorName;

export const illustrations: Record<string, Illustration> = {
  // ───── ストレッチ ─────
  st01: scene(person("shoulderRoll"), arrow(104, 70, 104, 36, { bend: 18 }), arrow(216, 70, 216, 36, { bend: -18 }), text(160, 14, "ひじで大きく円をかく")),
  st02: scene(person("armCross"), arrow(150, 70, 190, 70, { color: "red" }), text(160, 14, "腕を胸に引き寄せる")),
  st03: scene(person("triceps", { scale: 1.15 }), arrow(170, 38, 150, 50, { color: "red" }), text(160, 14, "ひじを頭の後ろで押す")),
  st04: scene(person("forearmStretch"), arrow(228, 76, 214, 98, { color: "red" }), text(160, 14, "指先を手前に引く（手のひら側）")),
  st05: scene(person("wristStretch"), arrow(222, 62, 222, 88, { color: "red" }), text(160, 14, "手の甲側を伸ばす")),
  st06: scene(person("neckTilt"), arrow(200, 36, 224, 56, { color: "red" }), text(160, 14, "首を横に倒す")),
  st07: scene(rect(W - 12, 30, 12, 142, "gray"), person("wallChest", { x: 190 }), arrow(160, 60, 140, 80, { color: "red", bend: 10 }), text(150, 22, "壁に手をつき、体を反対へ回す")),
  st08: scene(person("sideBend", { scale: 1.15 }), arrow(150, 40, 110, 56, { color: "red", bend: -12 }), text(160, 14, "わき腹を伸ばす")),
  st09: scene(person("sitTwist"), arrow(130, 60, 190, 60, { color: "red", bend: -22 }), text(160, 14, "座ってゆっくりひねる")),
  st10: scene(person("lying", { x: 120, scale: 1.7 }), text(160, 14, "仰向けで、両ひざを抱える")),
  st11: scene(person("figureFour", { x: 100, scale: 1.7 }), text(160, 14, "足首を反対のひざに乗せる（4の字）")),
  st12: scene(person("standQuad"), arrow(190, 110, 210, 140, { color: "red" }), text(160, 14, "かかとをお尻に近づける")),
  st13: scene(person("sitLegs", { x: 120 }), arrow(180, 90, 214, 90, { color: "red" }), text(160, 14, "背すじを伸ばして前に倒す")),
  st14: scene(person("sitWide"), arrow(160, 60, 160, 90, { color: "red" }), text(160, 14, "脚を開き、体を前に倒す")),
  st15: scene(rect(W - 12, 30, 12, 142, "gray"), person("wallPush", { x: 130 }), text(150, 22, "かかとを床につけて壁を押す")),
  st16: scene(person("heelRaise", { x: 120 }), text(160, 14, "後ろ脚のかかとを床につける")),
  st17: scene(person("kneel", { scale: 1.4 }), arrow(165, 110, 200, 110, { color: "red" }), text(160, 14, "後ろひざを床につけ、腰を前に")),
  st18: scene(person("kneel", { scale: 1.4 }), arrow(165, 110, 200, 110, { color: "red" }), text(160, 14, "片ひざ立ちで、背すじを伸ばして腰を前に")),
  st19: scene(person("ankleCircle"), arrow(210, 140, 234, 140, { color: "red", bend: 14 }), text(160, 14, "足首をゆっくり回す")),
  st20: scene(person("seiza", { x: 150, scale: 1.5 }), text(160, 14, "足の指を反らして足裏を伸ばす")),
  st21: scene(person("quadruped"), arrow(130, 60, 130, 40, { color: "red" }), text(160, 14, "背中を丸める・反らす")),
  st22: scene(person("forwardFold", { x: 130 }), arrow(200, 90, 200, 130, { color: "red" }), text(160, 14, "力を抜いてぶら下がる")),
  st23: scene(person("towerBack", { x: 130 }), person("towerBack", { x: 190, flip: true, color: "orange" }), text(160, 14, "背中合わせで、腕を組む")),
  st24: scene(person("armCross", { x: 110 }), person("armCross", { x: 210, color: "orange" }), text(160, 14, "ペアで肩まわりを伸ばす")),
  st25: scene(person("hamstringLying", { x: 90, scale: 1.5 }), person("stand", { x: 150, flip: true, scale: 1.5, color: "orange", tweak: { armR: [18, 22], armL: [14, 18] } }), text(160, 14, "ペアが脚を支えて、ゆっくり押す")),
  st26: (() => {
    const a = person("armsUp");
    const l = joint(a, "wristL");
    const r = joint(a, "wristR");
    return scene(a, line(l.x - 30, l.y, r.x + 30, r.y, { color: "dark", width: 3 }), text(160, 14, "ラケットを両手で持ち、頭の上へ"));
  })(),
  st27: scene(person("legSwing"), arrow(200, 120, 230, 100, { color: "red", bend: 10 }), text(160, 14, "脚を前後に大きく振る")),
  st28: scene(person("lungeStretch"), arrow(130, 60, 190, 60, { color: "red", bend: -18 }), text(160, 14, "ランジで上体をひねる")),
  st29: scene(person("armsUp", { scale: 1.15 }), arrow(110, 60, 110, 40, { color: "red" }), arrow(210, 60, 210, 40, { color: "red" }), text(160, 14, "息をはきながら、ゆっくり伸びる")),
  st30: scene(person("sideBend", { scale: 1.15 }), text(160, 14, "全身を、順番にゆっくり伸ばす")),
  st31: scene(person("childPose", { x: 110, scale: 1.6 }), text(160, 14, "お尻をかかとに近づけ、腕を前へ")),
  st32: scene(person("downDog", { x: 120, scale: 1.4 }), text(160, 14, "お尻を高く、背中とふくらはぎを伸ばす")),

  // ───── ウォームアップ・フォームづくり ─────
  wu01: scene(cone(40, 172), cone(280, 172), person("run", { x: 150 }), arrow(110, 120, 40, 120, { color: "gray", dashed: true }), text(160, 14, "コートのまわりを、軽く走る")),
  wu02: scene(person("standFront", { tweak: { legL: [-34, -10], legR: [14, 4] } }), arrow(120, 150, 70, 150, { color: "red" }), arrow(200, 150, 250, 150, { color: "red" }), text(160, 14, "足をそろえず、横にステップ")),
  wu03: scene(person("run", { x: 150 }), arrow(130, 100, 60, 100, { color: "red" }), text(160, 14, "後ろ向きに走る（進む向き）")),
  wu04: (() => {
    const a = person("kneeUp", { x: 100 });
    return scene(a, person("standQuad", { x: 220 }), arrow(140, 90, 140, 60, { color: "red" }), text(100, 190, "もも上げ", { size: 10 }), text(220, 190, "かかと上げ", { size: 10 }), text(160, 14, "もも上げ・かかと上げ"));
  })(),
  wu05: scene(person("swingBack", { racket: 10 }), arrow(120, 60, 190, 40, { color: "red", bend: -20 }), text(160, 14, "腕を大きく回してから、素振り")),
  wu06: scene(person("legSwing", { x: 90 }), person("lungeStretch", { x: 220, color: "orange" }), arrow(130, 40, 190, 40, { color: "gray" }), text(160, 14, "歩きながら、動くストレッチ")),
  wu07: scene(person("kneeUp", { lift: 10 }), arrow(110, 110, 70, 110, { color: "gray", dashed: true }), text(160, 14, "リズムよく、跳ねながら進む")),
  wu08: (() => {
    const rungs = [60, 100, 140, 180, 220, 260].map((x) => line(x, 176, x, 196, { color: "gray", width: 2 }));
    return scene(line(60, 176, 260, 176, { color: "gray", width: 2 }), line(60, 196, 260, 196, { color: "gray", width: 2 }), rungs, person("kneeUp", { x: 120, scale: 1.2 }), arrow(180, 186, 250, 186, { color: "red" }), text(160, 14, "ラダーのマスを、すばやく踏む"));
  })(),
  wu09: scene(person("jump", { lift: 10 }), arrow(118, 100, 118, 160, { color: "gray", bend: 26 }), arrow(202, 100, 202, 160, { color: "gray", bend: -26 }), text(160, 14, "縄跳び（ひざをやわらかく）")),
  wu10: scene(person("shoulderRoll"), arrow(112, 78, 150, 78, { color: "red" }), arrow(208, 78, 170, 78, { color: "red" }), text(160, 14, "肩甲骨を、背中の真ん中に寄せる")),
  wu11: scene(person("plank", { x: 150, scale: 1.4 }), text(160, 14, "頭からかかとまで、一直線")),
  wu12: scene(person("swingBack", { x: 70, racket: 10, scale: 1.15 }), person("hit", { x: 250, flip: true, racket: 10, scale: 1.15, color: "orange" }), arrow(100, 60, 220, 60, { color: "yellow", dashed: true, bend: -40 }), text(160, 14, "ゆっくり、大きく打ち合う")),
  wu13: scene(...net(160), person("forehand", { x: 70, racket: 20, scale: 1.2 }), person("forehand", { x: 250, flip: true, racket: 20, scale: 1.2, color: "orange" }), arrow(130, 108, 190, 108, { color: "yellow", dashed: true }), text(160, 14, "ネットをはさんで、短く打ち合う")),
  wu14: scene(person("hit", { x: 110, racket: 8 }), arrow(140, 50, 260, 70, { color: "yellow", dashed: true, bend: -50 }), text(160, 14, "高く、遠くへ打って、肩をほぐす")),
  wu15: scene(person("ankleCircle"), arrow(210, 140, 234, 140, { color: "red", bend: 14 }), text(160, 14, "足首を、大きく回す")),
  wu16: scene(person("wristStretch"), arrow(214, 80, 238, 80, { color: "red", bend: 14 }), text(160, 14, "手首・指を、ゆっくり回す")),
  wu17: scene(person("jump", { lift: 6 }), arrow(160, 20, 160, 50, { color: "gray" }), text(160, 190, "かるく、その場で跳ぶ", { size: 10 })),
  wu18: scene(person("jump", { lift: 6 }), arrow(130, 150, 80, 150, { color: "red" }), arrow(190, 150, 240, 150, { color: "red" }), text(160, 14, "前後・左右に、両足で跳ぶ")),
  wu19: scene(person("kneeUp", { tweak: { armL: [-70, -70], armR: [70, 70] } }), text(160, 14, "片脚で立って、ぐらつかない")),
  wu20: scene(cone(40, 172), cone(280, 172), person("run", { x: 150 }), arrow(60, 80, 260, 80, { color: "red" }), arrow(260, 96, 60, 96, { color: "red" }), text(160, 14, "コートの幅を、ダッシュで往復")),
  wu21: (() => {
    const coach = person("armsUp", { x: 250, color: "orange", scale: 1.15 });
    return scene(person("ready", { x: 100, racket: 15 }), coach, text(250, 190, "合図", { size: 10 }), arrow(130, 100, 200, 100, { color: "red" }), text(160, 14, "合図が出たら、すぐダッシュ"));
  })(),
  wu22: scene(person("ready", { racket: 15, lift: 5 }), arrow(110, 100, 110, 120, { color: "red" }), arrow(210, 100, 210, 120, { color: "red" }), text(160, 14, "足をリズムよく、軽く弾ませる")),
  wu23: scene(person("hit", { x: 80, scale: 1.2 }), person("standFront", { x: 250, scale: 1.2, color: "orange", tweak: { armL: [-150, -170], armR: [150, 170] } }), ball(130, 40, "yellow", 1.6), arrow(120, 40, 215, 40, { color: "gray", dashed: true, bend: -16 }), text(160, 14, "ラケットなしで、ボールを投げ合う")),
  wu24: scene(person("armsUp", { x: 60, scale: 1.05 }), person("sideBend", { x: 160, scale: 1.05 }), person("squat", { x: 260, scale: 1.05 }), text(160, 14, "全身を、順番に動かす体操")),
  wu25: scene(cone(280, 172), cone(40, 172), person("run", { x: 150 }), arrow(110, 100, 60, 100, { color: "red" }), arrow(60, 116, 250, 116, { color: "red", dashed: true }), text(160, 14, "前へダッシュ、うしろへ戻る")),
  wu26: scene(person("ready", { x: 100, racket: 10 }), person("ready", { x: 220, flip: true, racket: 10, color: "orange" }), line(160, 50, 160, 172, { color: "gray", dashed: true, width: 1.5 }), text(160, 14, "向かい合い、相手の動きを鏡のように")),
  wu27: scene(person("kneeUp", { x: 110 }), person("stand", { x: 230, color: "orange" }), text(110, 190, "もも上げ", { size: 10 }), text(230, 190, "ストップ！", { size: 10 }), text(160, 14, "合図で、ぴたっと止まる")),
  wu28: scene(person("wallPush", { x: 118, tweak: { legR: [64, -6] } }), person("wallPush", { x: 204, flip: true, color: "orange" }), text(160, 14, "てのひらで押し合う（足は動かさない）")),
  wu29: scene(person("plank", { x: 70, scale: 0.9 }), person("squat", { x: 160, scale: 1.0 }), person("jump", { x: 250, scale: 1.0, lift: 6 }), arrow(110, 40, 130, 40, { color: "gray" }), arrow(196, 40, 216, 40, { color: "gray" }), text(160, 14, "いくつかの運動を、順番にまわる")),

  wx01: scene(person("ready", { x: 60, racket: 15, scale: 1.0 }), person("swingBack", { x: 160, racket: 10, scale: 1.0 }), person("hit", { x: 262, racket: 8, scale: 1.0 }), arrow(90, 120, 128, 120, { color: "gray" }), arrow(190, 120, 228, 120, { color: "gray" }), text(60, 190, "構え", { size: 10 }), text(160, 190, "振りかぶり", { size: 10 }), text(262, 190, "打つ", { size: 10 }), text(160, 14, "オーバーヘッドを、3つに分けて練習")),
  wx02: scene(person("forehand", { x: 100, racket: 20 }), person("forehand", { x: 220, flip: true, racket: 20, color: "orange" }), text(100, 190, "フォア", { size: 10 }), text(220, 190, "バック", { size: 10 }), text(160, 14, "握りを、持ちかえる")),
  wx03: scene(person("forehand", { x: 130, racket: 0 }), arrow(180, 90, 240, 90, { color: "red", bend: 14 }), text(160, 14, "ラケット面を、ねらう向きにそろえる")),
  wx04: (() => {
    const a = person("hit", { x: 120 });
    const w = joint(a, "wristR");
    return scene(a, line(w.x, w.y, w.x + 6, w.y + 36, { color: "dark", width: 3 }), arrow(160, 50, 240, 90, { color: "red", bend: -30 }), text(160, 14, "タオルを、ヒュッと鳴らして振る"));
  })(),
  wx05: (() => {
    const a = person("hit", { x: 130, racket: 8 });
    return scene(a, shuttle(176, 48, 0), arrow(215, 110, 215, 56, { color: "gray", dashed: true }), text(160, 14, "自分でトスして、いちばん高い所で打つ"));
  })(),
  wx06: scene(person("forehand", { x: 150, racket: 20 }), arrow(100, 178, 220, 178, { color: "red" }), text(160, 14, "体重を、後ろ足から前足へ")),
  wx07: scene(...net(230), person("lunge", { x: 150, racket: -10, scale: 1.2 }), shuttle(205, 100, 20), arrow(150, 70, 210, 96, { color: "yellow", dashed: true, bend: -16 }), text(160, 14, "自分で落として、ネット前へ小さく")),
  wx08: scene(person("hit", { x: 120, racket: 8, flip: false }), arrow(120, 40, 140, 28, { color: "red", bend: 10 }), text(160, 14, "ひじが先に上がり、あとからラケット")),
  fx01: scene(person("jump", { x: 130, lift: 4, racket: 8 }), arrow(240, 100, 240, 160, { color: "red" }), text(240, 180, "静かに着地", { size: 10 }), text(160, 14, "跳んで打ったあと、両足でやわらかく着地")),
  hx03: scene(person("hit", { x: 80, racket: 8 }), arrow(110, 30, 250, 100, { color: "yellow", dashed: true, bend: -50 }), ring(270, 172, 1.4, "red"), text(160, 14, "バックラインの近くまで届かせる")),
  px01: scene(...net(160), person("ready", { x: 70, racket: 40, scale: 1.2 }), person("ready", { x: 250, flip: true, racket: 40, scale: 1.2, color: "orange" }), shuttle(160, 90, 90), text(160, 14, "ネット前で、押し込んで連続で")),
  px04: scene(...net(160), person("forehand", { x: 70, racket: 20, scale: 1.2 }), person("forehand", { x: 250, flip: true, racket: 20, scale: 1.2, color: "orange" }), arrow(135, 100, 185, 100, { color: "yellow", dashed: true }), text(160, 14, "ネットすれすれの、低く速い軌道")),
  yx01: scene(rect(270, 30, 12, 142, "gray"), person("hit", { x: 120, scale: 1.2 }), ball(180, 90, "yellow", 1.4), arrow(150, 80, 262, 82, { color: "gray", dashed: true }), text(160, 14, "壁にボールを投げて、はね返りを受ける")),
  yx02: scene(person("ready", { x: 90, racket: 15 }), person("armsUp", { x: 240, color: "orange", scale: 1.15, tweak: { armL: [-20, -20], armR: [140, 170] } }), shuttle(215, 70, 0), arrow(215, 80, 215, 150, { color: "red" }), text(160, 14, "落ちたシャトルに、すばやく反応")),
  yx03: scene(person("standFront", { x: 100, tweak: { armL: [-60, -60], armR: [60, 60] } }), person("standFront", { x: 220, color: "orange", tweak: { armL: [-60, -60], armR: [60, 60] } }), ball(160, 106, "yellow", 1.5), arrow(120, 80, 150, 100, { color: "gray", bend: -10 }), text(160, 14, "ボールを、手から手へ受け渡す")),

  fw23: scene(person("jump", { lift: 8 }), arrow(200, 120, 250, 120, { color: "red" }), arrow(120, 140, 70, 140, { color: "red" }), text(160, 14, "跳ねながら、前へ・後ろへ")),
  fw24: scene(line(60, 176, 260, 176, { color: "gray", width: 2 }), line(100, 172, 100, 196, { color: "gray", width: 2 }), line(160, 172, 160, 196, { color: "gray", width: 2 }), line(220, 172, 220, 196, { color: "gray", width: 2 }), person("kneeUp", { x: 130 }), text(160, 14, "ラインをまたぎながら、もも上げ")),
  fw25: scene(rect(100, 150, 4, 22, "orange"), rect(140, 150, 4, 22, "orange"), rect(180, 150, 4, 22, "orange"), rect(220, 150, 4, 22, "orange"), person("kneeUp", { x: 120, scale: 1.15, lift: 12 }), arrow(160, 100, 240, 100, { color: "red" }), text(160, 14, "ミニハードルを、またいで進む")),
  fw26: scene(person("run", { x: 150, flip: true }), arrow(110, 60, 200, 60, { color: "red", bend: -22 }), text(160, 14, "後ろ向きに下がり、すばやく切り返す")),

  d01: scene(person("ready", { x: 120, racket: 15 }), text(230, 90, "握手するように", { size: 10 }), text(230, 106, "軽く握る", { size: 10 }), text(160, 14, "ラケットの握り方と、素振り")),
  d10: scene(...net(160), person("ready", { x: 70, racket: 30, scale: 1.2 }), person("ready", { x: 250, flip: true, racket: 30, scale: 1.2, color: "orange" }), text(100, 190, "ハンデあり", { size: 10 }), text(220, 190, "ハンデなし", { size: 10 }), text(160, 14, "実力差を、点数や条件で調整")),
  d27: scene(...net(160), person("ready", { x: 70, racket: 30, scale: 1.2 }), person("ready", { x: 250, flip: true, racket: 30, scale: 1.2, color: "orange" }), arrow(130, 90, 190, 90, { color: "yellow", dashed: true, bend: -14 }), text(160, 14, "使うショットを、決めて試合する")),
  d28: scene(...net(160), person("ready", { x: 70, racket: 30, scale: 1.05 }), person("ready", { x: 120, racket: 30, scale: 1.05, color: "green" }), person("ready", { x: 200, flip: true, racket: 30, scale: 1.05, color: "orange" }), person("ready", { x: 250, flip: true, racket: 30, scale: 1.05, color: "red" }), text(160, 14, "2対2で、サーブから始める")),
  d29: scene(...net(160), person("ready", { x: 70, racket: 30, scale: 1.2 }), person("ready", { x: 250, flip: true, racket: 30, scale: 1.2, color: "orange" }), arrow(110, 70, 210, 70, { color: "red", bend: -20 }), arrow(210, 56, 110, 56, { color: "red", bend: 20 }), text(160, 14, "攻める人と守る人を、入れかえる")),

  // ───── ローテーション（順番に入れ替わる）ドリル ─────
  dr04: rolesScene("1人1球ずつ打って、列のうしろへ走る", [
    { pose: "forehand", x: 55, role: "ノッカー", color: "orange", racket: 20, scale: 1.0 },
    { pose: "hit", x: 130, role: "練習者（1球だけ）", color: "blue", racket: 8 },
    { pose: "stand", x: 240, role: "待つ列", color: WAIT, scale: 0.95 },
    { pose: "stand", x: 285, role: "", color: WAIT, scale: 0.95 },
  ], { extra: [arrow(150, 120, 262, 130, { color: "red", bend: 24 })], note: "打ったら、すぐ列の最後へ" }),
  dr07: rolesScene("ネット前でヘアピンだけ。負けたら列のうしろへ", [
    { pose: "lunge", x: 110, role: "勝ち残り", color: "blue", racket: -10, scale: 1.0 },
    { pose: "lunge", x: 210, role: "挑戦者", color: "orange", racket: -10, flip: true, scale: 1.0 },
    { pose: "stand", x: 280, role: "待つ列", color: WAIT, scale: 0.9 },
  ], { extra: net(160), note: "負けた人が、列の最後へ" }),
  dr08: scene(...net(160), person("ready", { x: 28, racket: 20, scale: 0.9 }), person("ready", { x: 70, racket: 20, scale: 0.9, color: "green" }), person("ready", { x: 112, racket: 20, scale: 0.9, color: "blue" }), person("ready", { x: 208, flip: true, racket: 20, scale: 0.9, color: "orange" }), person("ready", { x: 250, flip: true, racket: 20, scale: 0.9, color: "red" }), person("ready", { x: 292, flip: true, racket: 20, scale: 0.9, color: "gray" }), arrow(292, 62, 250, 62, { color: "red", bend: 14 }), arrow(250, 62, 208, 62, { color: "red", bend: 14 }), text(160, 30, "片方の列だけ、1人ずつ横へずれる", { size: 10, color: "red" }), text(70, 186, "動かない列", { size: 10 }), text(250, 186, "ずれる列", { size: 10 }), text(160, 14, "向かい合う2列で、1分ごとに相手を替える")),
  dr09: rolesScene("ノッカー・打つ人・拾う人を、10球ごとに回す", [
    { pose: "forehand", x: 55, role: "ノッカー", color: "orange", racket: 20 },
    { pose: "hit", x: 160, role: "打つ人", color: "blue", racket: 8 },
    { pose: "squat", x: 265, role: "拾う人", color: "green" },
  ], { cycle: true }),
  dr10: rolesScene("上げる人・打つ人・受ける人を、5球ごとに回す", [
    { pose: "forehand", x: 55, role: "上げる人", color: "orange", racket: 20 },
    { pose: "hit", x: 140, role: "打つ人（スマッシュ）", color: "blue", racket: 8 },
    { pose: "ready", x: 260, role: "受ける人", color: "green", racket: 30, flip: true },
  ], { cycle: true, extra: net(205) }),
  dr11: rolesScene("前衛はプッシュ、後衛はスマッシュ。位置を回す", [
    { pose: "ready", x: 70, role: "前衛（プッシュ）", color: "blue", racket: 40 },
    { pose: "hit", x: 165, role: "後衛（スマッシュ）", color: "green", racket: 8 },
    { pose: "stand", x: 255, role: "待つ人", color: WAIT, scale: 0.95 },
  ], { cycle: true }),
  dr12: rolesScene("サーバー・レシーバー・待機を、数本ごとに回す", [
    { pose: "ready", x: 70, role: "サーバー", color: "blue", racket: 30 },
    { pose: "ready", x: 190, role: "レシーバー", color: "orange", racket: 30, flip: true },
    { pose: "stand", x: 275, role: "待機", color: WAIT, scale: 0.95 },
  ], { cycle: true, extra: net(130) }),
  dr13: rolesScene("ロブ→スマッシュ→ブロック。1往復ごとに役割を回す", [
    { pose: "forehand", x: 55, role: "ロブ", color: "blue", racket: 20 },
    { pose: "hit", x: 140, role: "スマッシュ", color: "green", racket: 8 },
    { pose: "ready", x: 265, role: "ブロック", color: "orange", racket: 30, flip: true },
  ], { cycle: true, extra: net(205) }),
  dr15: rolesScene("2列で向かい合い、打ったら自分の列のうしろへ", [
    { pose: "lunge", x: 105, role: "先頭A", color: "blue", racket: -10, scale: 1.0 },
    { pose: "lunge", x: 215, role: "先頭B", color: "orange", racket: -10, flip: true, scale: 1.0 },
    { pose: "stand", x: 40, role: "Aの列", color: WAIT, scale: 0.9 },
    { pose: "stand", x: 285, role: "Bの列", color: WAIT, flip: true, scale: 0.9 },
  ], { extra: [...net(160), arrow(100, 44, 48, 44, { color: "red", bend: 12 }), arrow(220, 44, 278, 44, { color: "red", bend: -12 })], note: "" }),
  dr16: scene(person("plank", { x: 62, scale: 0.8, label: "1" }), person("squat", { x: 258, scale: 0.9, color: "green", label: "3" }), person("ready", { x: 160, scale: 0.9, racket: 20, color: "orange", label: "2" }), arrow(95, 64, 140, 64, { color: "red", bend: -10 }), arrow(180, 64, 230, 64, { color: "red", bend: -10 }), arrow(258, 150, 62, 150, { color: "red", bend: 18, dashed: true }), text(62, 186, "ステーション1", { size: 10 }), text(160, 186, "ステーション2", { size: 10 }), text(258, 186, "ステーション3（ほか1か所）", { size: 10 }), text(160, 14, "4か所を、合図で順に回る")),
  dr17: scene(...net(60), ...net(160), ...net(260), person("ready", { x: 28, racket: 20, scale: 0.8 }), person("ready", { x: 92, flip: true, racket: 20, scale: 0.8, color: "orange" }), person("ready", { x: 128, racket: 20, scale: 0.8, color: "green" }), person("ready", { x: 192, flip: true, racket: 20, scale: 0.8, color: "red" }), person("ready", { x: 228, racket: 20, scale: 0.8, color: "gray" }), person("ready", { x: 292, flip: true, racket: 20, scale: 0.8, color: "blue" }), arrow(100, 64, 150, 64, { color: "red", bend: -10 }), arrow(200, 64, 250, 64, { color: "red", bend: -10 }), text(60, 186, "コート1", { size: 10 }), text(160, 186, "コート2", { size: 10 }), text(260, 186, "コート3", { size: 10 }), text(160, 14, "ペアごと、次のコートへ移る")),
  dr18: rolesScene("2組が同時にラリー。時間で入れ替える", [
    { pose: "ready", x: 55, role: "ラリー中の組", color: "blue", racket: 30, scale: 0.95 },
    { pose: "ready", x: 130, role: "", color: "green", racket: 30, scale: 0.95 },
    { pose: "ready", x: 190, role: "ラリー中の組", color: "orange", racket: 30, flip: true, scale: 0.95 },
    { pose: "stand", x: 270, role: "待つ組", color: WAIT, scale: 0.95 },
  ], { extra: [arrow(150, 56, 258, 56, { color: "red", bend: -18 }), arrow(260, 38, 160, 38, { color: "red", bend: 18, dashed: true })], note: "" }),
  dr19: scene(person("forehand", { x: 55, color: "orange", racket: 20, scale: 1.0 }), person("lunge", { x: 150, racket: -10, scale: 1.0 }), person("stand", { x: 255, color: "gray", scale: 0.9 }), text(55, 186, "ノッカー", { size: 10 }), text(150, 186, "練習者", { size: 10 }), text(255, 186, "待つ列", { size: 10 }), text(215, 56, "① ヘアピン", { size: 10, color: "red" }), text(215, 70, "② ロブ", { size: 10, color: "red" }), text(215, 84, "③ クリア", { size: 10, color: "red" }), arrow(165, 120, 250, 140, { color: "red", bend: 20 }), text(160, 14, "3球を続けて打ち、列のうしろへ")),
  dr20: rolesScene("返し続ける。ミスしたら列のうしろへ", [
    { pose: "forehand", x: 55, role: "ノッカー", color: "orange", racket: 20, scale: 1.0 },
    { pose: "ready", x: 150, role: "練習者（連続で返す）", color: "blue", racket: 30 },
    { pose: "stand", x: 250, role: "待つ列", color: WAIT, scale: 0.95 },
    { pose: "stand", x: 292, role: "", color: WAIT, scale: 0.95 },
  ], { extra: [arrow(170, 110, 250, 126, { color: "red", bend: 20 })], note: "ミスしたら列の最後へ" }),
  dr21: rolesScene("サーブ→3球目。1ラリーごとに役割を回す", [
    { pose: "ready", x: 60, role: "サーバー（3球目で攻める）", color: "blue", racket: 30 },
    { pose: "ready", x: 190, role: "レシーバー", color: "orange", racket: 30, flip: true },
    { pose: "stand", x: 275, role: "待機", color: WAIT, scale: 0.95 },
  ], { cycle: true, extra: [...net(130), shuttle(130, 90, 70)] }),
  dr22: rolesScene("前・後ろ・相手側を、ラリーごとに回す", [
    { pose: "ready", x: 55, role: "前", color: "blue", racket: 40, scale: 0.95 },
    { pose: "hit", x: 120, role: "後ろ", color: "green", racket: 8, scale: 0.95 },
    { pose: "ready", x: 255, role: "相手側（1人で守る）", color: "orange", racket: 30, flip: true },
  ], { cycle: true, extra: net(190) }),

  // ───── 運動遊び ─────
  pl01: scene(line(20, 172, 300, 172, { color: "red", width: 3 }), person("run", { x: 90, color: "red", label: "鬼", scale: 1.2 }), person("run", { x: 220, color: "blue", flip: false, scale: 1.2 }), arrow(125, 70, 180, 70, { color: "red" }), text(160, 14, "鬼にタッチされたら交代（ライン上だけを走る）"), text(160, 190, "赤い線がライン", { size: 10 })),
  pl02: (() => {
    const a = person("run", { x: 90, scale: 1.2 });
    const b = person("run", { x: 210, color: "orange", scale: 1.2 });
    const hip = joint(b, "hip");
    return scene(a, b, line(hip.x, hip.y, hip.x - 30, hip.y + 22, { color: "yellow", width: 4 }), arrow(125, 70, 175, 70, { color: "red" }), text(hip.x - 34, hip.y + 36, "しっぽ", { size: 10 }), text(160, 14, "腰のしっぽを、取り合う"));
  })(),
  pl03: scene(rect(250, 24, 40, 28, "red"), text(270, 38, "赤！", { size: 14, color: "dark" }), person("armsUp", { x: 270, color: "orange", scale: 0.9 }), line(20, 172, 150, 172, { color: "red", width: 4 }), line(150, 172, 300, 172, { color: "blue", width: 4 }), person("run", { x: 120, scale: 1.2 }), arrow(100, 90, 40, 140, { color: "red" }), text(160, 14, "指定された色のラインへ、すばやくタッチ"), text(85, 190, "赤", { size: 10 }), text(225, 190, "青", { size: 10 })),
  pl04: scene(ring(110, 172, 1.6, "gray"), person("run", { x: 140, scale: 1.2 }), person("run", { x: 60, color: "orange", scale: 1.2 }), arrow(100, 70, 130, 70, { color: "red" }), text(110, 190, "影", { size: 10 }), text(160, 14, "追う人が、逃げる人の影をふむ")),
  pl05: scene(person("ready", { x: 90, racket: 20, scale: 1.2 }), person("stand", { x: 250, color: "orange", flip: true, scale: 1.2, label: "鬼" }), arrow(130, 70, 200, 70, { color: "red" }), text(250, 40, "だるまさんが…", { size: 10 }), text(90, 190, "止まって、構えで静止", { size: 10 }), text(160, 14, "鬼が振り向いたら、構えの姿勢で止まる")),
  pl06: scene(person("forehand", { racket: 175, x: 150 }), shuttle(172, 40, 0), arrow(160, 70, 172, 56, { color: "gray", dashed: true }), text(160, 14, "シャトルを、落とさずに打ち上げ続ける")),
  pl07: scene(person("forehand", { x: 110, racket: 175 }), ball(180, 50, "red", 3), person("forehand", { x: 240, flip: true, racket: 175, color: "orange" }), text(160, 14, "風船を、ラケットでつなぐ")),
  pl08: scene(person("jump", { x: 80, lift: 4 }), ball(150, 40, "red", 3), person("jump", { x: 240, lift: 4, color: "orange" }), text(160, 14, "風船を落とさず、リレーする")),
  pl09: scene(person("hit", { x: 90 }), ring(240, 172, 1.6, "red"), arrow(120, 60, 232, 160, { color: "gray", dashed: true, bend: -30 }), text(160, 14, "的をねらって、当てる")),
  pl10: scene(line(160, 40, 160, 172, { color: "gray", dashed: true }), person("run", { x: 90 }), person("run", { x: 230, flip: true, color: "orange" }), text(160, 14, "コートを4つに分けて、陣地を取り合う")),
  pl11: scene(cone(40, 172), cone(280, 172), person("run", { x: 150 }), shuttle(180, 108, 0), arrow(110, 80, 60, 80, { color: "red" }), text(160, 14, "シャトルを運んで、早く往復")),
  pl12: scene(person("stand", { x: 150, racket: 180, tweak: { armR: [60, 170] } }), ball(150, 70, "yellow", 1), text(160, 14, "ラケットにボールをのせて、落とさず運ぶ")),
  pl13: scene(person("hit", { x: 100 }), ball(190, 60, "gray", 2), person("standFront", { x: 250, color: "orange" }), arrow(130, 60, 230, 60, { color: "gray", dashed: true, bend: -14 }), text(160, 14, "丸めた新聞紙を、遠くへ投げる")),
  pl14: scene(person("squat", { x: 100 }), shuttle(180, 168, 0), shuttle(230, 168, 30), shuttle(270, 168, -20), text(160, 14, "コートにかくれたシャトルを探す")),
  pl15: scene(person("standFront", { x: 100, tweak: { armL: [-90, -90], armR: [90, 90] } }), person("standFront", { x: 220, color: "orange", tweak: { armL: [-90, -90], armR: [90, 90] } }), text(160, 14, "合図で、じゃんけん → すぐに動く")),
  pl16: scene(line(40, 172, 280, 172, { color: "red", width: 3 }), person("run", { x: 120 }), person("run", { x: 220, color: "orange" }), text(160, 14, "ラインの上だけを走って、逃げる・追う")),
  pl17: scene(text(70, 100, "1", { size: 22, color: "red" }), text(160, 100, "2", { size: 22, color: "red" }), text(250, 100, "3", { size: 22, color: "red" }), person("run", { x: 130 }), text(160, 14, "呼ばれた数字の所へ、ダッシュ")),
  pl18: scene(ring(110, 172, 1.8, "red"), ring(210, 172, 1.8, "orange"), person("hit", { x: 60 }), arrow(90, 60, 200, 160, { color: "gray", dashed: true, bend: -30 }), text(160, 14, "フープに、シャトルを入れる")),
  pl19: scene(person("jump", { x: 90, lift: 4 }), ball(160, 40, "red", 3), person("jump", { x: 230, lift: 4, color: "orange" }), text(160, 14, "ペアで、風船にタッチして遊ぶ")),
  pl20: scene(rect(70, 140, 60, 32, "gray"), rect(130, 156, 60, 16, "gray"), person("stand", { x: 100, scale: 1.0 }), text(160, 14, "高い所を、取り合う")),
  pl21: scene(person("squat", { x: 70 }), ring(160, 172, 1.8, "red"), ring(230, 172, 1.8, "blue"), ring(290, 172, 1.8, "green"), text(160, 14, "色を呼ばれて、その色へ移動")),
  pl22: scene(person("standFront", { x: 100, tweak: { legL: [-30, -10], legR: [30, 10] } }), person("standFront", { x: 220, color: "orange", tweak: { legL: [-8, -4], legR: [8, 4] } }), text(100, 190, "グー・チョキ・パー", { size: 10 }), text(160, 14, "足でじゃんけん")),
  pl23: scene(person("ready", { x: 100, racket: 10 }), person("ready", { x: 220, flip: true, racket: 10, color: "orange" }), line(160, 50, 160, 172, { color: "gray", dashed: true }), text(160, 14, "リーダーの動きを、まねする")),
  pl24: scene(person("lunge", { x: 90, racket: -20, scale: 1.2 }), shuttle(160, 164, 0), rect(240, 120, 8, 52, "gray"), arrow(125, 150, 230, 150, { color: "gray" }), text(160, 14, "シャトルを、ホッケーのように打つ")),
  pl25: scene(person("run", { x: 110 }), ball(160, 100, "red", 2), cone(250, 172), arrow(170, 90, 240, 120, { color: "gray", dashed: true }), text(160, 14, "ボールを運んで、早さを競う")),
  pl26: scene(person("stand", { x: 150, racket: 180, tweak: { armR: [60, 150] } }), ball(160, 40, "yellow", 1), arrow(160, 76, 160, 50, { color: "gray", dashed: true }), text(160, 14, "ラケットで、ボールを落とさない")),
  pl27: scene(person("run", { x: 100 }), person("run", { x: 150, color: "orange" }), line(124, 100, 152, 100, { color: "red", width: 2 }), text(160, 14, "ふたりでしっぽを持って走る")),
  pl28: scene(...net(160), person("squat", { x: 70, scale: 1.1 }), person("squat", { x: 250, flip: true, scale: 1.1, color: "orange" }), ball(160, 60, "red", 2.4), text(160, 14, "ラケットなしで、手でバドミントン")),
  pl29: scene(ring(60, 172, 1.8, "red"), shuttle(60, 150, 0), person("run", { x: 200 }), person("run", { x: 260, color: "orange" }), text(160, 14, "自分のシャトルを守り、相手のを取る")),
};
