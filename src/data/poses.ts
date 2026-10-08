import type { PersonPose } from "./types";

/**
 * ポーズのひな型。角度は、絶対角度（度）。0 = 真下、90 = 右、180 = 真上、-90 = 左。
 * 腕は [上腕, 前腕]、脚は [太もも, すね]。R は手前側、L は奥側。右向きの人を基準に作ってある（左向きは「反転」）。
 */
export type PoseDef = { label: string; pose: PersonPose; /** 正面向きの図 */ front?: boolean };

export const POSES: Record<string, PoseDef> = {
  // ───── 立つ・構える ─────
  stand: {
    label: "直立（横向き）",
    pose: { torso: 180, head: 180, armL: [-6, -4], armR: [6, 4], legL: [-4, -2], legR: [4, 2] },
  },
  standFront: {
    label: "直立（正面）",
    front: true,
    pose: { torso: 180, head: 180, armL: [-12, -8], armR: [12, 8], legL: [-8, -4], legR: [8, 4] },
  },
  ready: {
    label: "構え（ラケットを前に）",
    pose: { torso: 172, head: 176, armL: [40, 105], armR: [58, 128], legL: [-20, -38], legR: [28, -6] },
  },
  swingBack: {
    label: "オーバーヘッド：振りかぶり",
    pose: { torso: 188, head: 184, armL: [105, 150], armR: [125, -155], legL: [-12, -4], legR: [14, 4] },
  },
  hit: {
    label: "オーバーヘッド：打つ瞬間",
    pose: { torso: 176, head: 178, armL: [-70, -25], armR: [168, 176], legL: [-14, -8], legR: [8, 4] },
  },
  forehand: {
    label: "フォアハンド（横から）",
    pose: { torso: 176, head: 178, armL: [-50, -80], armR: [92, 98], legL: [-24, -30], legR: [30, 2] },
  },
  lunge: {
    label: "ランジ（踏み込み）",
    pose: { torso: 158, head: 160, armL: [-65, -75], armR: [100, 118], legL: [-52, -68], legR: [78, 8] },
  },
  squat: {
    label: "低い構え（しゃがむ）",
    pose: { torso: 160, head: 164, armL: [70, 110], armR: [80, 120], legL: [66, -14], legR: [78, -10] },
  },
  // ───── 動く ─────
  run: {
    label: "走る",
    pose: { torso: 168, head: 172, armL: [-40, 40], armR: [60, 130], legL: [-42, -78], legR: [48, 10] },
  },
  kneeUp: {
    label: "もも上げ",
    pose: { torso: 178, head: 180, armL: [-50, 45], armR: [50, 130], legL: [-4, -2], legR: [88, 4] },
  },
  jump: {
    label: "ジャンプ",
    pose: { torso: 180, head: 180, armL: [-150, -170], armR: [150, 170], legL: [-12, -34], legR: [18, -24] },
  },
  // ───── ストレッチ ─────
  armsUp: {
    label: "両腕を上げる（正面）",
    front: true,
    pose: { torso: 180, head: 180, armL: [-168, -176], armR: [168, 176], legL: [-6, -2], legR: [6, 2] },
  },
  sideBend: {
    label: "体を横に倒す（正面）",
    front: true,
    pose: { torso: 160, head: 156, armL: [-158, -150], armR: [-150, -146], legL: [-6, -2], legR: [6, 2] },
  },
  armCross: {
    label: "腕を胸の前で引き寄せる（正面）",
    front: true,
    pose: { torso: 180, head: 180, armL: [-60, -168], armR: [-85, -85], legL: [-6, -2], legR: [6, 2] },
  },
  triceps: {
    label: "頭の後ろで肘を押す（横向き）",
    pose: { torso: 180, head: 180, armL: [150, 176], armR: [174, -12], legL: [-5, -2], legR: [5, 2] },
  },
  neckTilt: {
    label: "首を横に倒す（正面）",
    front: true,
    pose: { torso: 180, head: 158, armL: [-12, -8], armR: [-160, -118], legL: [-8, -4], legR: [8, 4] },
  },
  forwardFold: {
    label: "前屈（ぶら下がる）",
    pose: { torso: 68, head: 62, armL: [8, 4], armR: [12, 6], legL: [-2, 0], legR: [4, 2] },
  },
  sitLegs: {
    label: "座って前屈（脚を伸ばす）",
    pose: { torso: 128, head: 122, armL: [112, 98], armR: [116, 100], legL: [90, 90], legR: [90, 92] },
  },
  sitWide: {
    label: "開脚して座る（正面）",
    front: true,
    pose: { torso: 180, head: 180, armL: [20, 10], armR: [-20, -10], legL: [-72, -76], legR: [72, 76] },
  },
  lying: {
    label: "仰向け（膝を抱える）",
    pose: { torso: -90, head: -90, armL: [150, 140], armR: [146, 136], legL: [-150, 35], legR: [-146, 40] },
  },
  quadruped: {
    label: "四つ這い",
    pose: { torso: 112, head: 110, armL: [2, 0], armR: [-2, 0], legL: [0, -90], legR: [4, -86] },
  },
  kneel: {
    label: "片膝立ち（股関節を伸ばす）",
    pose: { torso: 180, head: 180, armL: [-10, -6], armR: [8, 6], legL: [-4, -90], legR: [80, 4] },
  },
  standQuad: {
    label: "立って太ももの前を伸ばす",
    pose: { torso: 180, head: 180, armL: [-30, -60], armR: [-30, -130], legL: [-4, -2], legR: [-8, -158] },
  },
  wallPush: {
    label: "壁を押す（ふくらはぎ）",
    pose: { torso: 152, head: 154, armL: [104, 98], armR: [102, 96], legL: [-26, -26], legR: [66, -6] },
  },
  plank: {
    label: "プランク",
    pose: { torso: 94, head: 96, armL: [0, 88], armR: [0, 90], legL: [-66, -66], legR: [-64, -64] },
  },
  downDog: {
    label: "ダウンドッグ（お尻を高く）",
    pose: { torso: 40, head: 42, armL: [2, 2], armR: [-2, -2], legL: [-40, -36], legR: [-38, -34] },
  },
  childPose: {
    label: "チャイルドポーズ",
    pose: { torso: 70, head: 66, armL: [86, 88], armR: [90, 90], legL: [80, -96], legR: [78, -98] },
  },
  // ───── ストレッチ（つづき） ─────
  shoulderRoll: {
    label: "肘を曲げて肩を回す（正面）",
    front: true,
    pose: { torso: 180, head: 180, armL: [-92, 180], armR: [92, 180], legL: [-6, -2], legR: [6, 2] },
  },
  forearmStretch: {
    label: "腕を前に伸ばし、反対の手で指を引く",
    pose: { torso: 180, head: 180, armL: [66, 112], armR: [90, 90], legL: [-5, -2], legR: [5, 2] },
  },
  wristStretch: {
    label: "腕を前に伸ばし、反対の手で手の甲を押す",
    pose: { torso: 180, head: 180, armL: [66, 112], armR: [90, 90], legL: [-5, -2], legR: [5, 2] },
  },
  wallChest: {
    label: "壁に手をついて胸を開く（正面）",
    front: true,
    pose: { torso: 180, head: 180, armL: [-90, -90], armR: [14, 8], legL: [-8, -4], legR: [8, 4] },
  },
  sitTwist: {
    label: "座ってひねる",
    pose: { torso: 180, head: 168, armL: [50, 128], armR: [-24, -8], legL: [90, 90], legR: [90, 92] },
  },
  figureFour: {
    label: "仰向けで足首を反対の膝に乗せる（4の字）",
    pose: { torso: -90, head: -90, armL: [140, 100], armR: [140, 100], legL: [130, 40], legR: [199, 62] },
  },
  hamstringLying: {
    label: "仰向けで片脚を持ち上げる",
    pose: { torso: -90, head: -90, armL: [150, 130], armR: [150, 130], legL: [90, 90], legR: [160, 160] },
  },
  lungeStretch: {
    label: "股関節を伸ばすランジ姿勢",
    pose: { torso: 180, head: 180, armL: [-12, -6], armR: [12, 6], legL: [-42, -38], legR: [52, 2] },
  },
  heelRaise: {
    label: "アキレス腱を伸ばす（後ろ脚を伸ばす）",
    pose: { torso: 172, head: 174, armL: [100, 100], armR: [100, 100], legL: [-34, -34], legR: [50, -10] },
  },
  legSwing: {
    label: "脚を前に振り上げる",
    pose: { torso: 180, head: 180, armL: [-60, -90], armR: [60, 90], legL: [-4, -2], legR: [64, 62] },
  },
  ankleCircle: {
    label: "片足を浮かせて足首を回す",
    pose: { torso: 180, head: 180, armL: [-14, -8], armR: [14, 8], legL: [-4, -2], legR: [30, -30] },
  },
  seiza: {
    label: "かかとに座る（正座）",
    pose: { torso: 180, head: 180, armL: [30, 70], armR: [34, 74], legL: [86, -92], legR: [84, -94] },
  },
  towerBack: {
    label: "背中合わせ（ペアで使う）",
    pose: { torso: 180, head: 180, armL: [-30, -150], armR: [-30, -150], legL: [-4, -2], legR: [4, 2] },
  },
};


export const POSE_ORDER = Object.keys(POSES);
