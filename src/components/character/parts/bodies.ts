import type { BodyId } from "@/lib/character/catalog";

export type BodyShape = {
  path: string;
  /** 머리 꼭대기 y */
  top: number;
  /** 눈높이 y */
  faceY: number;
  /** 이마 높이의 몸 절반 너비: 머리카락과 모자의 가로 비율 기준(50이 원본) */
  headHalf: number;
  /** 팔이 붙는 높이의 몸 절반 너비 */
  armHalf: number;
};

export const BODY_SHAPES: Record<BodyId, BodyShape> = {
  potato: {
    path: "M120 60C158 58 180 88 180 130C180 150 186 172 180 198C174 226 150 240 120 240C88 240 64 228 60 196C56 168 62 150 62 124C62 86 84 62 120 60Z",
    top: 60, faceY: 122, headHalf: 56, armHalf: 62,
  },
  bean: {
    path: "M120 48C150 46 164 70 164 104C164 134 168 168 164 200C160 228 144 240 120 240C96 240 80 230 76 200C72 170 76 132 76 102C76 70 90 50 120 48Z",
    top: 48, faceY: 106, headHalf: 44, armHalf: 45,
  },
  tofu: {
    path: "M84 72C108 68 134 70 158 72C176 74 184 84 184 104C186 140 186 176 184 210C182 230 172 238 154 240C130 242 108 242 86 240C68 238 58 230 56 210C54 176 54 138 56 104C56 86 66 74 84 72Z",
    top: 71, faceY: 128, headHalf: 65, armHalf: 65,
  },
  pear: {
    path: "M120 66C146 64 160 84 162 110C164 132 182 150 188 184C194 222 160 242 120 242C80 242 46 222 52 184C58 150 76 132 78 110C80 84 94 66 120 66Z",
    top: 66, faceY: 112, headHalf: 42, armHalf: 62,
  },
};
