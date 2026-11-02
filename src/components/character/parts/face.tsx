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
};
