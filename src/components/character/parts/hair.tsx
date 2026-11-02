import type { ReactNode } from "react";
import type { HairId } from "@/lib/character/catalog";

/** 좌표 원점: 머리 꼭대기 중앙. x=±50이 이마 너비이며 몸 형태에 맞춰 가로로 늘어난다. */
export const HAIR_BACK: Partial<Record<HairId, ReactNode>> = {
  bob: <path d="M-58 26C-68 66 -66 106 -48 110C-20 116 20 116 48 110C66 106 68 66 58 26C44 -8 -44 -8 -58 26Z" />,
  long: <path d="M-58 26C-72 80 -74 150 -60 168C-30 176 30 176 60 168C74 150 72 80 58 26C44 -8 -44 -8 -58 26Z" />,
  pigtails: (
    <g>
      <path d="M-46 28C-78 20 -92 56 -84 86C-80 104 -66 108 -60 92C-54 74 -50 56 -46 28Z" />
      <path d="M46 28C78 20 92 56 84 86C80 104 66 108 60 92C54 74 50 56 46 28Z" />
    </g>
  ),
  curly: (
    <g>
      <circle cx={-56} cy={52} r={18} />
      <circle cx={56} cy={52} r={18} />
    </g>
  ),
  get ponytail() { return BACK_MORE.ponytail; },
  get bun() { return BACK_MORE.bun; },
  get wave() { return BACK_MORE.wave; },
  get twinbun() { return BACK_MORE.twinbun; },
  get mullet() { return BACK_MORE.mullet; },
};

const BACK_MORE: Partial<Record<HairId, ReactNode>> = {
  ponytail: <path d="M46 16C84 8 96 44 86 80C80 100 66 108 62 96C60 74 64 50 44 34Z" />,
  bun: <circle cx={0} cy={-20} r={20} />,
  wave: <path d="M-58 26C-76 56 -62 76 -74 100C-80 124 -60 138 -44 128C-20 134 20 134 44 128C60 138 80 124 74 100C62 76 76 56 58 26C44 -8 -44 -8 -58 26Z" />,
  twinbun: (
    <g>
      <circle cx={-44} cy={-10} r={18} />
      <circle cx={44} cy={-10} r={18} />
    </g>
  ),
  mullet: <path d="M-56 30C-62 62 -74 92 -60 118C-48 106 -44 112 -36 120C-20 124 20 124 36 120C44 112 48 106 60 118C74 92 62 62 56 30C44 -6 -44 -6 -56 30Z" />,
};

export const HAIR_FRONT: Record<HairId, ReactNode> = {
  none: null,
  bob: <path d="M-56 48C-60 8 -30 -9 0 -9C30 -9 60 8 56 48C44 32 30 24 12 22C-8 28 -36 28 -56 48Z" />,
  long: <path d="M-56 54C-60 8 -30 -9 0 -9C30 -9 60 8 56 54C48 34 28 18 0 10C-28 18 -48 34 -56 54Z" />,
  curly: <path d="M-58 46C-74 30 -62 8 -48 10C-50 -8 -26 -16 -18 -7C-12 -19 12 -19 18 -7C26 -16 50 -8 48 10C62 8 74 30 58 46C48 30 32 30 20 35C8 27 -8 27 -20 35C-32 30 -48 30 -58 46Z" />,
  bowl: <path d="M-58 50C-62 6 -30 -9 0 -9C30 -9 62 6 58 50C46 46 34 52 20 48C8 52 -8 52 -20 48C-34 52 -46 46 -58 50Z" />,
  slick: (
    <g>
      <path d="M-54 36C-54 2 -20 -10 6 -9C36 -8 56 8 54 36C36 14 -10 12 -54 36Z" />
      <path d="M-22 12C-8 4 12 4 30 12" fill="none" stroke="#FFFBF2" strokeOpacity={0.55} strokeWidth={3} />
    </g>
  ),
  pigtails: (
    <g>
      <path d="M-54 44C-58 6 -28 -9 0 -9C28 -9 58 6 54 44C42 26 18 18 0 8C-18 18 -42 26 -54 44Z" />
      <circle cx={-52} cy={26} r={5} fill="#A94C40" />
      <circle cx={52} cy={26} r={5} fill="#A94C40" />
    </g>
  ),
  messy: <path d="M-54 42L-64 16L-44 18L-46 -8L-22 6L-12 -18L6 2L24 -16L30 6L52 -6L46 18L66 16L54 44C36 26 20 36 6 26C-10 36 -32 24 -54 42Z" />,
  sprout: (
    <g>
      <path d="M0 4C0 -6 0 -14 0 -20" fill="none" />
      <path d="M0 -18C-6 -34 -26 -36 -30 -30C-26 -18 -10 -12 0 -18Z" />
      <path d="M0 -20C6 -32 22 -34 28 -28C24 -18 10 -14 0 -20Z" />
    </g>
  ),
  ponytail: <path d="M-54 44C-58 6 -28 -9 0 -9C28 -9 58 6 54 40C36 30 14 20 -6 12C-26 22 -44 30 -54 44Z" />,
  bangs: <path d="M-56 44C-60 4 -30 -9 0 -9C30 -9 60 4 56 44C48 40 40 42 28 40C14 44 -14 44 -28 40C-40 42 -48 40 -56 44Z" />,
  bun: <path d="M-54 40C-58 4 -28 -9 0 -9C28 -9 58 4 54 40C40 22 18 14 0 12C-18 14 -40 22 -54 40Z" />,
  wave: <path d="M-58 48C-62 8 -30 -9 0 -9C30 -9 62 8 58 48C50 30 38 26 26 16C8 26 -20 22 -34 26C-44 30 -52 38 -58 48Z" />,
  short: <path d="M-56 38C-60 2 -30 -10 0 -10C30 -10 60 2 56 38C52 30 48 26 40 24C20 18 -12 18 -34 24C-44 26 -52 30 -56 38Z" />,
  sidepart: <path d="M-54 44C-60 8 -34 -9 -6 -9C28 -10 58 6 54 44C48 26 30 14 -18 10C-30 18 -46 28 -54 44Z" />,
  twinbun: <path d="M-54 40C-58 4 -28 -9 0 -9C28 -9 58 4 54 40C42 26 16 18 0 8C-16 18 -42 26 -54 40Z" />,
  mullet: <path d="M-56 44L-60 22C-58 -2 -30 -12 0 -10C30 -12 58 -2 60 22L56 44L46 28L36 36L24 26L10 34L-4 24L-18 34L-32 26L-44 36Z" />,
};

/** 모자를 쓰면 머리 윗부분이 모자 안에 들어가므로, 뾰족한 머리는 가린다. */
export const HAIR_HIDDEN_BY_HAT: readonly HairId[] = ["sprout", "bun", "twinbun"];
