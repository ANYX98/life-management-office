import type { ReactNode } from "react";
import type { PropId } from "@/lib/character/catalog";

/** 좌표 원점: 오른손 위치 */
export const PROP_ART: Record<PropId, ReactNode> = {
  none: null,
  document: (
    <g transform="rotate(8)">
      <path d="M-14 -36H12L20 -28V10H-14Z" fill="#FFFBF2" />
      <path d="M12 -36V-28H20M-7 -20H12M-7 -12H12M-7 -4H6" fill="none" strokeWidth={2.5} />
      <circle cx={10} cy={2} r={4.5} fill="none" stroke="#A94C40" strokeWidth={2.5} />
    </g>
  ),
  coffee: (
    <g>
      <path d="M-13 -30H13L9 10H-9Z" fill="#E9DCC6" />
      <path d="M-12 -16H12L9 10H-9Z" fill="#7A5236" />
      <path d="M-16 -34H16V-29H-16Z" fill="#FFFBF2" strokeWidth={3} />
      <path d="M3 -34L8 -52" fill="none" stroke="#A94C40" strokeWidth={4} />
    </g>
  ),
  phone: (
    <g transform="rotate(10)">
      <rect x={-12} y={-34} width={24} height={44} rx={5} fill="#34312E" />
      <rect x={-8.5} y={-29} width={17} height={33} rx={2} fill="#A8C6CB" strokeWidth={0} stroke="none" />
    </g>
  ),
  pillow: (
    <g transform="rotate(-8)">
      <path d="M-26 -28C-10 -22 10 -22 26 -28C22 -12 22 2 26 16C10 10 -10 10 -26 16C-22 2 -22 -12 -26 -28Z" fill="#FFFBF2" />
      <path d="M-13 -9c3 3 6 3 9 0M4 -9c3 3 6 3 9 0" fill="none" strokeWidth={2.5} />
    </g>
  ),
  ramen: (
    <g>
      <path d="M-18 -26H18L12 12H-12Z" fill="#FFFBF2" />
      <path d="M-16.5 -14H16.5L15 -4H-15Z" fill="#A94C40" strokeWidth={0} stroke="none" />
      <path d="M-21 -30H21V-25H-21Z" fill="#E7C85C" strokeWidth={3} />
      <path d="M-6 -36C-10 -42 -2 -46 -6 -52M6 -36C2 -42 10 -46 6 -52" fill="none" strokeWidth={2.5} strokeOpacity={0.6} />
    </g>
  ),
  flag: (
    <g>
      <path d="M0 14V-62" fill="none" strokeWidth={4.5} />
      <path d="M0 -62C10 -66 18 -56 32 -60V-34C18 -30 10 -40 0 -36Z" fill="#FFFBF2" />
    </g>
  ),
  bouquet: (
    <g>
      <path d="M-14 -12L14 -12L4 14H-4Z" fill="#FFFBF2" />
      {[[-12, -24, "#E9A9B8"], [12, -24, "#E7C85C"], [0, -34, "#A94C40"], [-2, -18, "#FFFBF2"]].map(([x, y, c]) => (
        <circle key={`${x}${y}`} cx={x as number} cy={y as number} r={10} fill={c as string} strokeWidth={3} />
      ))}
    </g>
  ),
  balloon: (
    <g>
      <path d="M0 10C-4 -20 6 -30 2 -44" fill="none" strokeWidth={2.5} />
      <path d="M2 -44C-22 -46 -26 -88 2 -92C30 -88 26 -46 2 -44Z" fill="#E9A9B8" />
      <path d="M-8 -78C-6 -82 -2 -84 2 -84" fill="none" stroke="#FFFBF2" strokeWidth={3} />
    </g>
  ),
  laptop: (
    <g>
      <rect x={-24} y={-30} width={46} height={32} rx={3} fill="#A39C8E" />
      <rect x={-20} y={-26} width={38} height={24} fill="#A8C6CB" strokeWidth={0} stroke="none" />
      <path d="M-30 2H28L32 10H-34Z" fill="#D8D2C4" />
    </g>
  ),
  book: (
    <g transform="rotate(6)">
      <rect x={-18} y={-30} width={34} height={42} rx={3} fill="#5E7F8C" />
      <path d="M-11 -30V12" fill="none" strokeWidth={3} />
      <path d="M-4 -20H10M-4 -13H6" fill="none" stroke="#FFFBF2" strokeWidth={2.5} />
    </g>
  ),
  bubbletea: (
    <g>
      <path d="M-13 -28H13L9 10H-9Z" fill="#E9CFA8" />
      <path d="M-16 -33H16V-28H-16Z" fill="#FFFBF2" strokeWidth={3} />
      <path d="M3 -33L8 -54" fill="none" stroke="#34312E" strokeWidth={5} />
      {[[-6, 4], [0, 6], [6, 4], [-4, -2], [4, -2]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r={2.8} fill="#34312E" stroke="none" />)}
    </g>
  ),
  plush: (
    <g>
      <circle cx={-14} cy={-32} r={7} fill="#C98A4B" />
      <circle cx={14} cy={-32} r={7} fill="#C98A4B" />
      <circle cx={0} cy={-20} r={17} fill="#C98A4B" />
      <path d="M-14 -4C-22 16 22 16 14 -4Z" fill="#C98A4B" />
      <circle cx={-6} cy={-22} r={2} fill="#34312E" stroke="none" />
      <circle cx={6} cy={-22} r={2} fill="#34312E" stroke="none" />
      <path d="M-3 -15C-1 -13 1 -13 3 -15" fill="none" strokeWidth={2} />
    </g>
  ),
  stampitem: (
    <g>
      <path d="M-7 8V-10C-14 -14 -14 -30 0 -30C14 -30 14 -14 7 -10V8Z" fill="#6B4A32" />
      <rect x={-17} y={6} width={34} height={11} rx={2} fill="#A94C40" />
    </g>
  ),
  burning: (
    <g transform="rotate(6)">
      <path d="M-15 -22H17V14H-15Z" fill="#FFFBF2" />
      <path d="M-8 -12H10M-8 -4H10M-8 4H4" fill="none" strokeWidth={2.5} />
      <path d="M-14 -22C-20 -38 -8 -40 -8 -54C4 -46 2 -38 6 -42C8 -48 10 -50 12 -52C20 -42 24 -34 16 -22Z" fill="#E98A3C" />
      <path d="M-4 -22C-8 -30 0 -32 0 -40C8 -34 10 -28 6 -22Z" fill="#E7C85C" strokeWidth={2} />
    </g>
  ),
};
