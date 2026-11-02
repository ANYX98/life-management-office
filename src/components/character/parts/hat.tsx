import type { ReactNode } from "react";
import type { HatId } from "@/lib/character/catalog";

/** 좌표 원점: 머리 꼭대기 중앙 */
export const HAT_ART: Record<HatId, ReactNode> = {
  none: null,
  beanie: (
    <g>
      <path d="M-54 26C-58 -22 58 -22 54 26Z" fill="#A94C40" />
      <path d="M-58 16C-30 10 30 10 58 16L58 34C30 28 -30 28 -58 34Z" fill="#E7C85C" />
      <path d="M-34 14V30M-12 12V28M12 12V28M34 14V30" fill="none" strokeWidth={3} />
      <circle cx={0} cy={-16} r={9} fill="#F6F0E5" />
    </g>
  ),
  cap: (
    <g>
      <path d="M-52 26C-56 -24 54 -24 52 26Z" fill="#5E7F8C" />
      <path d="M-52 26C-20 18 26 18 52 26C74 26 88 32 84 38C60 36 -30 32 -52 34Z" fill="#E7C85C" />
      <circle cx={0} cy={-12} r={3.5} fill="#34312E" stroke="none" />
    </g>
  ),
  grad: (
    <g>
      <path d="M-38 6V22C-20 30 20 30 38 22V6Z" fill="#34312E" />
      <path d="M0 -24L68 2L0 26L-68 2Z" fill="#4A4641" />
      <path d="M0 2C24 6 44 8 50 8V34" fill="none" stroke="#E7C85C" strokeWidth={3.5} />
      <circle cx={50} cy={38} r={5} fill="#E7C85C" />
    </g>
  ),
  helmet: (
    <g>
      <path d="M-54 24C-56 -28 56 -28 54 24Z" fill="#E7C85C" />
      <path d="M-12 -16C-12 -24 12 -24 12 -16V14H-12Z" fill="#F0D97F" />
      <path d="M-68 24C-30 18 30 18 68 24C70 30 66 34 62 34C20 28 -20 28 -62 34C-66 34 -70 30 -68 24Z" fill="#E7C85C" />
    </g>
  ),
  crown: (
    <g>
      <path d="M-44 26L-52 -20L-24 2L0 -30L24 2L52 -20L44 26C20 20 -20 20 -44 26Z" fill="#E7C85C" />
      <circle cx={0} cy={8} r={5} fill="#A94C40" />
      <path d="M-30 12L-22 16M22 16L30 12" fill="none" strokeWidth={3} />
    </g>
  ),
  straw: (
    <g>
      <path d="M-84 28C-50 14 50 14 84 28C70 40 -70 40 -84 28Z" fill="#E9D49A" />
      <path d="M-44 22C-48 -24 48 -24 44 22C20 16 -20 16 -44 22Z" fill="#E9D49A" />
      <path d="M-44 12C-20 6 20 6 44 12L44 22C20 16 -20 16 -44 22Z" fill="#A94C40" />
    </g>
  ),
  bucket: (
    <g>
      <path d="M-44 22C-46 -22 46 -22 44 22Z" fill="#E7C85C" />
      <path d="M-44 14C-60 24 -68 34 -66 36C-30 28 30 28 66 36C68 34 60 24 44 14C20 22 -20 22 -44 14Z" fill="#E7C85C" />
      <path d="M-42 8C-20 14 20 14 42 8" fill="none" strokeWidth={2.5} />
    </g>
  ),
  beret: (
    <g>
      <path d="M-60 20C-72 -10 -30 -26 8 -24C46 -22 72 -6 58 18C20 8 -24 8 -60 20Z" fill="#A94C40" />
      <path d="M8 -24V-32" fill="none" strokeWidth={5} />
    </g>
  ),
  headband: (
    <g>
      <path d="M-54 22C-30 4 30 4 54 22L54 32C30 14 -30 14 -54 32Z" fill="#E9A9B8" />
    </g>
  ),
  catears: (
    <g>
      <path d="M-50 18L-46 -28L-14 0Z" fill="#34312E" />
      <path d="M50 18L46 -28L14 0Z" fill="#34312E" />
      <path d="M-41 8L-40 -14L-24 0Z" fill="#E9A9B8" stroke="none" />
      <path d="M41 8L40 -14L24 0Z" fill="#E9A9B8" stroke="none" />
    </g>
  ),
  bunny: (
    <g>
      <path d="M-30 6C-46 -40 -40 -70 -26 -70C-12 -70 -8 -36 -12 4Z" fill="#FFFBF2" />
      <path d="M30 6C46 -40 40 -70 26 -70C12 -70 8 -36 12 4Z" fill="#FFFBF2" />
      <path d="M-26 -8C-32 -30 -30 -54 -26 -56C-20 -52 -18 -28 -20 -8Z" fill="#E9A9B8" stroke="none" />
      <path d="M26 -8C32 -30 30 -54 26 -56C20 -52 18 -28 20 -8Z" fill="#E9A9B8" stroke="none" />
    </g>
  ),
  ribbon: (
    <g transform="translate(0 -6)">
      <path d="M0 2C-20 -24 -48 -20 -44 2C-48 22 -20 24 0 2Z" fill="#A94C40" />
      <path d="M0 2C20 -24 48 -20 44 2C48 22 20 24 0 2Z" fill="#A94C40" />
      <circle cx={0} cy={2} r={8} fill="#E7C85C" />
    </g>
  ),
  paperbag: (
    <g>
      <path d="M-62 92L-58 -18L58 -22L62 92Z" fill="#C9A06B" />
      <path d="M-58 -8L-46 -4L-34 -8L-22 -4L-10 -8L2 -4L14 -8L26 -4L38 -8L58 -6" fill="none" strokeWidth={2.5} />
      <ellipse cx={-22} cy={42} rx={9} ry={11} fill="#34312E" />
      <ellipse cx={22} cy={42} rx={9} ry={11} fill="#34312E" />
      <path d="M-14 72H14" fill="none" />
    </g>
  ),
  potatohat: (
    <g>
      <path d="M-46 22C-52 -22 -22 -36 4 -34C36 -34 54 -14 46 22C20 16 -20 16 -46 22Z" fill="#D9A36B" />
      <circle cx={-18} cy={-12} r={2.5} fill="#B98450" stroke="none" />
      <circle cx={14} cy={-20} r={2.5} fill="#B98450" stroke="none" />
      <circle cx={26} cy={2} r={2.5} fill="#B98450" stroke="none" />
      <path d="M2 -34C0 -44 8 -50 14 -52M2 -36C-6 -42 -14 -42 -18 -48" fill="none" stroke="#7F9470" strokeWidth={4} />
    </g>
  ),
};
