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
};
