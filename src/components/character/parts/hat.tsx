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
};
