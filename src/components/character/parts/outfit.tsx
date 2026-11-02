import type { ReactNode } from "react";
import type { OutfitId } from "@/lib/character/catalog";
import { INK } from "./ink";

const X0 = 30;
const W = 180;
const H = 240;

/** 몸 윤곽으로 잘리므로 어떤 몸 형태에도 맞는다. y는 옷깃 높이, c는 의상 색상. */
const panel = (y: number, fill: string, extra?: string) => (
  <path d={`M${X0} ${y + 8}C80 ${y - 6} 160 ${y - 6} ${X0 + W} ${y + 8}V${H + 20}H${X0}Z`} fill={fill} {...(extra ? { stroke: extra } : {})} />
);

export const OUTFIT_ART: Record<OutfitId, (y: number, c: string) => ReactNode> = {
  none: () => null,
  suit: (y, c) => (
    <g>
      {panel(y, c)}
      <path d={`M98 ${y - 2}L120 ${y + 40}L142 ${y - 2}Z`} fill="#FFFBF2" />
      <path d={`M120 ${y + 8}L113 ${y + 16}L117 ${y + 44}L120 ${y + 50}L123 ${y + 44}L127 ${y + 16}Z`} fill="#A94C40" strokeWidth={3} />
      <path d={`M98 ${y - 2}L82 ${y + 18}L118 ${y + 58}V260M142 ${y - 2}L158 ${y + 18}L122 ${y + 58}`} fill="none" strokeWidth={3.5} />
    </g>
  ),
  hoodie: (y, c) => (
    <g>
      {panel(y, c)}
      <path d={`M80 ${y - 4}C96 ${y + 22} 144 ${y + 22} 160 ${y - 4}C150 ${y - 12} 90 ${y - 12} 80 ${y - 4}Z`} fill={c} />
      <path d={`M108 ${y + 16}V${y + 40}M132 ${y + 16}V${y + 34}`} fill="none" strokeWidth={3} />
      <path d={`M88 ${y + 62}H152L160 ${y + 92}H80Z`} fill="none" strokeWidth={3.5} />
    </g>
  ),
  stripes: (y, c) => (
    <g>
      {panel(y, "#FFFBF2")}
      {[16, 36, 56, 76, 96].map((d) => (
        <path key={d} d={`M${X0} ${y + d}C80 ${y + d - 5} 160 ${y + d - 5} ${X0 + W} ${y + d}`} fill="none" stroke={c} strokeWidth={9} />
      ))}
      <path d={`M100 ${y - 2}C108 ${y + 12} 132 ${y + 12} 140 ${y - 2}`} fill="none" />
    </g>
  ),
  pajamas: (y, c) => (
    <g>
      {panel(y, c)}
      <path d={`M120 ${y + 4}V260`} fill="none" strokeWidth={3} />
      {[22, 48, 74].map((d) => (
        <circle key={d} cx={127} cy={y + d} r={3} fill="#FFFBF2" strokeWidth={2} />
      ))}
      {[[86, 22], [156, 18], [92, 62], [152, 66], [84, 100], [158, 100]].map(([x, d]) => (
        <path key={`${x}${d}`} d={`M${x} ${y + d - 6}a7 7 0 1 0 6 11a6 6 0 1 1-6-11Z`} fill="#E7C85C" strokeWidth={2} />
      ))}
    </g>
  ),
  apron: (y, c) => (
    <g>
      {panel(y, "#FFFBF2")}
      <path d={`M88 ${y + 14}H152L164 260H76Z`} fill={c} />
      <path d={`M92 ${y + 14}L100 ${y - 4}M148 ${y + 14}L140 ${y - 4}`} fill="none" />
      <rect x={100} y={y + 44} width={40} height={24} rx={5} fill="none" strokeWidth={3} />
    </g>
  ),
  varsity: (y, c) => (
    <g>
      {panel(y, c)}
      <path d={`M92 ${y - 3}C102 ${y + 14} 138 ${y + 14} 148 ${y - 3}L156 ${y + 4}C142 ${y + 28} 98 ${y + 28} 84 ${y + 4}Z`} fill="#F6F0E5" />
      <path d={`M120 ${y + 20}V260`} fill="none" strokeWidth={3} />
      {[36, 60, 84].map((d) => (
        <circle key={d} cx={120} cy={y + d} r={3.5} fill="#F6F0E5" strokeWidth={2} />
      ))}
      <path d={`M${X0} ${y + 16}H74V260H${X0}ZM166 ${y + 16}H${X0 + W}V260H166Z`} fill="#F6F0E5" />
      <text x={88} y={y + 56} fontSize={17} fontWeight={700} fill="#F6F0E5" stroke="none" textAnchor="middle">공</text>
    </g>
  ),
  vest: (y, c) => (
    <g>
      {panel(y, "#FFFBF2")}
      <path d={`M88 ${y - 2}L120 ${y + 40}L152 ${y - 2}L170 260H70Z`} fill={c} />
      <path d={`M120 ${y + 42}L92 ${y + 64}M120 ${y + 42}L148 ${y + 64}M104 ${y + 64}L120 ${y + 78}L136 ${y + 64}`} fill="none" strokeWidth={3} stroke="#FFFBF2" />
    </g>
  ),
  overalls: (y, c) => (
    <g>
      {panel(y, "#F3E6CF")}
      <path d={`M92 ${y + 36}H148L172 260H68Z`} fill={c} />
      <path d={`M98 ${y + 38}L94 ${y - 6}M142 ${y + 38}L146 ${y - 6}`} fill="none" strokeWidth={9} stroke={INK} />
      <path d={`M98 ${y + 36}L94 ${y - 4}M142 ${y + 36}L146 ${y - 4}`} fill="none" strokeWidth={4} stroke={c} />
      <rect x={104} y={y + 50} width={32} height={22} rx={4} fill="none" strokeWidth={3} />
    </g>
  ),
  flannel: (y, c) => (
    <g>
      {panel(y, "#F3E6CF")}
      {[44, 68, 92, 116, 140, 164, 188].map((x) => (
        <path key={x} d={`M${x} ${y - 8}V260`} fill="none" stroke={c} strokeWidth={7} strokeOpacity={0.75} />
      ))}
      {[10, 34, 58, 82, 106].map((d) => (
        <path key={d} d={`M${X0} ${y + d}H${X0 + W}`} fill="none" stroke={c} strokeWidth={7} strokeOpacity={0.75} />
      ))}
      <path d={`M100 ${y - 3}L120 ${y + 22}L140 ${y - 3}M120 ${y + 22}V260`} fill="none" strokeWidth={3.5} />
    </g>
  ),
  blanket: (y, c) => (
    <g>
      <path d={`M${X0} ${y - 12}C70 ${y - 26} 170 ${y - 26} ${X0 + W} ${y - 12}V260H${X0}Z`} fill={c} />
      {[[80, 18], [120, 8], [160, 22], [96, 54], [144, 58], [78, 88], [120, 92], [162, 86]].map(([x, d]) => (
        <path key={`${x}${d}`} d={`M${x} ${y + d - 6}l2 4l5 1l-4 3l1 5l-4-3l-4 3l1-5l-4-3l5-1Z`} fill="#FFFBF2" strokeWidth={1.5} />
      ))}
      <path d={`M96 ${y - 18}C106 ${y + 6} 120 ${y + 8} 126 ${y + 30}`} fill="none" strokeWidth={3} />
    </g>
  ),
};
