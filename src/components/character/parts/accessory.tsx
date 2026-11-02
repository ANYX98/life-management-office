import type { ReactNode } from "react";
import type { AccessoryId } from "@/lib/character/catalog";

export type AccessoryAnchor = "back" | "neck" | "face" | "head";

/**
 * back: 몸 뒤(원점: 몸 중앙 목 높이), neck: 옷 위(원점: 목 중앙),
 * face: 눈 위(원점: 눈 사이), head: 머리카락 위(원점: 머리 꼭대기 중앙)
 */
export const ACCESSORY_ART: Record<AccessoryId, { at: AccessoryAnchor; art: ReactNode } | null> = {
  none: null,
  tie: { at: "neck", art: <path d="M0 0L-8 8L-4 46L0 54L4 46L8 8Z" fill="#A94C40" /> },
  bow: {
    at: "neck",
    art: (
      <g>
        <path d="M0 2L-24 -10V16ZM0 2L24 -10V16Z" fill="#A94C40" />
        <circle cx={0} cy={2} r={5.5} fill="#E7C85C" />
      </g>
    ),
  },
  nametag: {
    at: "neck",
    art: (
      <g transform="translate(-40 22) rotate(-5)">
        <rect x={-15} y={-9} width={32} height={20} rx={3} fill="#FFFBF2" strokeWidth={3} />
        <path d="M-9 -2H11M-9 4H5" fill="none" strokeWidth={2.5} />
      </g>
    ),
  },
  lanyard: {
    at: "neck",
    art: (
      <g>
        <path d="M-26 -8L0 36L26 -8" fill="none" stroke="#5E7F8C" strokeWidth={4} />
        <rect x={-13} y={34} width={26} height={32} rx={3} fill="#FFFBF2" strokeWidth={3} />
        <circle cx={0} cy={45} r={5} fill="#D9A36B" strokeWidth={2.5} />
        <path d="M-7 58H7" fill="none" strokeWidth={2.5} />
      </g>
    ),
  },
  scarf: {
    at: "neck",
    art: (
      <g>
        <path d="M-48 -6C-20 -14 20 -14 48 -6C52 2 50 10 46 12C20 6 -20 6 -46 12C-50 10 -52 2 -48 -6Z" fill="#A94C40" />
        <path d="M18 8L14 46L34 48L38 6Z" fill="#A94C40" />
        <path d="M18 34L36 36" fill="none" stroke="#E7C85C" strokeWidth={3.5} />
      </g>
    ),
  },
  earring: {
    at: "face",
    art: (
      <g>
        <path d="M-37 14V22" fill="none" strokeWidth={2.5} />
        <circle cx={-37} cy={28} r={6} fill="#E7C85C" strokeWidth={3} />
        <path d="M37 14V22" fill="none" strokeWidth={2.5} />
        <circle cx={37} cy={28} r={6} fill="#E7C85C" strokeWidth={3} />
      </g>
    ),
  },
  bandage: {
    at: "face",
    art: (
      <g transform="translate(27 18) rotate(-22)">
        <rect x={-12} y={-5} width={24} height={10} rx={4} fill="#F6E2C4" strokeWidth={2.5} />
        <path d="M-3 -2V2M3 -2V2" fill="none" strokeWidth={2} />
      </g>
    ),
  },
  mustache: {
    at: "face",
    art: <path d="M0 13C-4 7 -14 7 -18 11C-22 15 -24 16 -28 14C-24 24 -8 24 0 18C8 24 24 24 28 14C24 16 22 15 18 11C14 7 4 7 0 13Z" fill="#34312E" strokeWidth={2} />,
  },
  headset: {
    at: "head",
    art: (
      <g>
        <path d="M-52 40C-58 -22 58 -22 52 40" fill="none" stroke="#34312E" strokeWidth={6} />
        <rect x={-60} y={32} width={15} height={30} rx={6} fill="#5E7F8C" />
        <rect x={45} y={32} width={15} height={30} rx={6} fill="#5E7F8C" />
        <path d="M-53 62C-52 80 -34 88 -18 84" fill="none" strokeWidth={3} />
        <circle cx={-16} cy={84} r={4} fill="#34312E" stroke="none" />
      </g>
    ),
  },
  flower: {
    at: "head",
    art: (
      <g transform="translate(34 8)">
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse key={r} cx={0} cy={-9} rx={6.5} ry={9} fill="#F6F0E5" strokeWidth={2.5} transform={`rotate(${r})`} />
        ))}
        <circle r={5} fill="#E7C85C" strokeWidth={2.5} />
      </g>
    ),
  },
  backpack: {
    at: "back",
    art: <rect x={-76} y={-14} width={152} height={98} rx={26} fill="#A94C40" />,
  },
  cape: {
    at: "back",
    art: <path d="M-44 -18C-60 30 -86 80 -92 112C-40 128 40 128 92 112C86 80 60 30 44 -18Z" fill="#A94C40" />,
  },
  medal: {
    at: "neck",
    art: (
      <g>
        <path d="M-12 -4L0 26L12 -4" fill="none" stroke="#A94C40" strokeWidth={5} />
        <circle cx={0} cy={36} r={13} fill="#E7C85C" strokeWidth={3.5} />
        <path d="M0 29l2 4.5l5 .5l-3.7 3.2l1.1 4.8l-4.4-2.5l-4.4 2.5l1.1-4.8l-3.7-3.2l5-.5Z" fill="#34312E" stroke="none" />
      </g>
    ),
  },
  mask: {
    at: "face",
    art: (
      <g>
        <path d="M-27 8C-14 4 14 4 27 8C31 20 26 36 14 39C4 42 -4 42 -14 39C-26 36 -31 20 -27 8Z" fill="#FFFBF2" />
        <path d="M-27 12L-46 2M27 12L46 2" fill="none" strokeWidth={2.5} />
        <path d="M-18 20H18M-16 29H16" fill="none" strokeWidth={2} strokeOpacity={0.45} />
      </g>
    ),
  },
  darkcircle: {
    at: "face",
    art: (
      <g fill="none" strokeWidth={3.5} stroke="#6E5A6B" strokeOpacity={0.75}>
        <path d="M-31 11C-26 18 -14 18 -9 11" />
        <path d="M9 11C14 18 26 18 31 11" />
      </g>
    ),
  },
  necklace: {
    at: "neck",
    art: (
      <g>
        <path d="M-24 -4C-16 16 16 16 24 -4" fill="none" stroke="#E7C85C" strokeWidth={3.5} />
        <circle cx={0} cy={14} r={5} fill="#A94C40" strokeWidth={2.5} />
      </g>
    ),
  },
  choker: { at: "neck", art: <path d="M-30 -6C-14 2 14 2 30 -6" fill="none" stroke="#34312E" strokeWidth={7} /> },
  hairpin: {
    at: "head",
    art: (
      <g transform="translate(-34 16) rotate(-20)">
        <rect x={-14} y={-4} width={28} height={8} rx={3} fill="#E7C85C" strokeWidth={2.5} />
        <circle cx={0} cy={0} r={2.5} fill="#A94C40" strokeWidth={0} stroke="none" />
      </g>
    ),
  },
  earbuds: {
    at: "face",
    art: (
      <g fill="#FFFBF2" strokeWidth={2.5}>
        <rect x={-42} y={4} width={8} height={18} rx={4} />
        <rect x={34} y={4} width={8} height={18} rx={4} />
      </g>
    ),
  },
  freckles: {
    at: "face",
    art: (
      <g fill="#8A5A3A" stroke="none">
        {[-34, -28, -22, 22, 28, 34].map((x, index) => <circle key={x} cx={x} cy={12 + (index % 2) * 4} r={1.6} />)}
      </g>
    ),
  },
  blush: {
    at: "face",
    art: (
      <g fill="#E98C8C" fillOpacity={0.65} stroke="none">
        <ellipse cx={-30} cy={15} rx={11} ry={6.5} />
        <ellipse cx={30} cy={15} rx={11} ry={6.5} />
      </g>
    ),
  },
  starsticker: {
    at: "face",
    art: <path d="M-31 8l3 6l7 1l-5 5l1 7l-6-3l-6 3l1-7l-5-5l7-1Z" fill="#E7C85C" strokeWidth={2.5} />,
  },
  officerbadge: {
    at: "neck",
    art: (
      <g transform="translate(-34 22)">
        <path d="M0 -13L12 -7V4C12 10 5 14 0 16C-5 14 -12 10 -12 4V-7Z" fill="#E7C85C" strokeWidth={3} />
        <text x={0} y={6} fontSize={13} fontWeight={700} textAnchor="middle" fill="#34312E" stroke="none">공</text>
      </g>
    ),
  },
};
