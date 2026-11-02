import type { ReactNode } from "react";
import type { EyesId, GlassesId, MouthId } from "@/lib/character/catalog";
import { INK } from "./ink";

/** 좌표 원점: 두 눈 사이의 중앙 */
const both = (draw: (x: number) => ReactNode) => (
  <>
    {draw(-20)}
    {draw(20)}
  </>
);

export const EYE_ART: Record<EyesId, ReactNode> = {
  dot: both((x) => <ellipse key={x} cx={x} cy={0} rx={4.5} ry={5.5} fill={INK} stroke="none" />),
  round: both((x) => (
    <g key={x}>
      <circle cx={x} cy={0} r={9} fill={INK} stroke="none" />
      <circle cx={x + 3} cy={-3} r={3} fill="#fff" stroke="none" />
    </g>
  )),
  sleepy: both((x) => (
    <g key={x}>
      <path d={`M${x - 10} -2H${x + 10}`} fill="none" />
      <path d={`M${x - 6} -1C${x - 6} 7 ${x + 6} 7 ${x + 6} -1Z`} fill={INK} stroke="none" />
    </g>
  )),
  closed: both((x) => <path key={x} d={`M${x - 9} -1C${x - 5} 6 ${x + 5} 6 ${x + 9} -1`} fill="none" />),
  stare: both((x) => (
    <g key={x}>
      <circle cx={x} cy={0} r={10} fill="#FFFBF2" />
      <circle cx={x} cy={0} r={2.5} fill={INK} stroke="none" />
    </g>
  )),
  dazed: both((x) => (
    <path key={x} d={`M${x} 0c2-3 6 0 4 4c-3 5-12 2-11-5c1-8 15-9 17 1`} fill="none" strokeWidth={3} />
  )),
  sparkle: both((x) => (
    <g key={x}>
      <circle cx={x} cy={0} r={9} fill={INK} stroke="none" />
      <circle cx={x + 3} cy={-3} r={3.2} fill="#fff" stroke="none" />
      <circle cx={x - 3} cy={3} r={1.8} fill="#fff" stroke="none" />
    </g>
  )),
  wink: (
    <>
      <ellipse cx={-20} cy={0} rx={4.5} ry={5.5} fill={INK} stroke="none" />
      <path d="M12 2L27 -3M12 2L27 7" fill="none" />
    </>
  ),
  smiling: both((x) => <path key={x} d={`M${x - 9} 3C${x - 5} -5 ${x + 5} -5 ${x + 9} 3`} fill="none" />),
  lashes: both((x) => (
    <g key={x}>
      <ellipse cx={x} cy={1} rx={5.5} ry={6.5} fill={INK} stroke="none" />
      <path d={`M${x - 8} -5C${x - 4} -9 ${x + 4} -9 ${x + 8} -5M${x + (x < 0 ? -8 : 8)} -5L${x + (x < 0 ? -12 : 12)} -9`} fill="none" strokeWidth={3} />
    </g>
  )),
  cat: both((x) => (
    <g key={x}>
      <path d={`M${x - 9} 1C${x - 4} -6 ${x + 4} -6 ${x + 9} 1C${x + 4} 6 ${x - 4} 6 ${x - 9} 1Z`} fill="#F4E3A1" strokeWidth={3} />
      <ellipse cx={x} cy={0} rx={1.8} ry={4.5} fill={INK} stroke="none" />
    </g>
  )),
  heart: both((x) => <path key={x} d={`M${x} 7C${x - 12} -1 ${x - 7} -9 ${x} -3C${x + 7} -9 ${x + 12} -1 ${x} 7Z`} fill="#A94C40" strokeWidth={2.5} />),
};

export const MOUTH_ART: Record<MouthId, ReactNode> = {
  flat: <path d="M-8 24H8" fill="none" />,
  smile: <path d="M-11 21C-6 31 6 31 11 21" fill="none" />,
  frown: <path d="M-10 29C-5 21 5 21 10 29" fill="none" />,
  open: <ellipse cx={0} cy={26} rx={7} ry={9} fill="#7C3B33" />,
  wobbly: <path d="M-14 26C-10 20 -7 20 -4 25C-1 30 2 30 5 25C8 20 11 21 14 26" fill="none" />,
  teeth: (
    <g>
      <rect x={-14} y={18} width={28} height={13} rx={5} fill="#FFFBF2" />
      <path d="M-5 18V31M4 18V31" fill="none" strokeWidth={2.5} />
    </g>
  ),
  cat: <path d="M-10 24C-7 30 -2 30 0 24C2 30 7 30 10 24" fill="none" />,
  tongue: (
    <g>
      <path d="M-9 23H9" fill="none" />
      <path d="M-3 24V30C-3 35 5 35 5 30V24Z" fill="#E98C8C" strokeWidth={3} />
    </g>
  ),
  pout: <path d="M-5 22C-1 25 -1 26 -4 28C0 30 1 31 -4 33" fill="none" strokeWidth={3.5} />,
  lips: <path d="M-10 25C-5 19 -2 21 0 22C2 21 5 19 10 25C5 32 -5 32 -10 25Z" fill="#A94C40" strokeWidth={3} />,
  tiny: <path d="M-3 24C-1 27 1 27 3 24" fill="none" strokeWidth={3.5} />,
};

const lensBoth = (draw: (x: number) => ReactNode, bridge: string) => (
  <g>
    {both(draw)}
    <path d={bridge} fill="none" />
  </g>
);

export const GLASSES_ART: Record<GlassesId, ReactNode> = {
  none: null,
  round: lensBoth((x) => <circle key={x} cx={x} cy={0} r={14} fill="#FFFBF2" fillOpacity={0.3} />, "M-6 0H6"),
  square: lensBoth(
    (x) => <rect key={x} x={x - 15} y={-11} width={30} height={23} rx={5} fill="#FFFBF2" fillOpacity={0.3} strokeWidth={5.5} />,
    "M-5 -2H5",
  ),
  shades: lensBoth(
    (x) => <path key={x} d={`M${x - 15} -9H${x + 15}C${x + 16} 6 ${x + 8} 12 ${x} 12C${x - 8} 12 ${x - 16} 6 ${x - 15} -9Z`} fill={INK} />,
    "M-5 -6H5",
  ),
  half: lensBoth(
    (x) => <path key={x} d={`M${x - 14} 0H${x + 14}C${x + 13} 15 ${x - 13} 15 ${x - 14} 0Z`} fill="#FFFBF2" fillOpacity={0.3} />,
    "M-6 1H6",
  ),
  heart: lensBoth(
    (x) => <path key={x} d={`M${x} 14C${x - 20} 1 ${x - 12} -13 ${x} -4C${x + 12} -13 ${x + 20} 1 ${x} 14Z`} fill="#E9A9B8" fillOpacity={0.55} />,
    "M-7 -3H7",
  ),
  star: lensBoth(
    (x) => <path key={x} d={`M${x} -15L${x + 5} -5L${x + 16} -3L${x + 8} 5L${x + 10} 15L${x} 10L${x - 10} 15L${x - 8} 5L${x - 16} -3L${x - 5} -5Z`} fill="#E7C85C" fillOpacity={0.6} />,
    "M-5 -2H5",
  ),
  rimless: lensBoth(
    (x) => <ellipse key={x} cx={x} cy={0} rx={14} ry={11} fill="#FFFBF2" fillOpacity={0.35} strokeWidth={2} />,
    "M-6 -1H6",
  ),
};
