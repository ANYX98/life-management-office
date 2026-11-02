import type { ReactNode } from "react";

export type MascotExpression = "deadpan" | "blink" | "worried" | "surprised" | "proud";
export type MascotPose = "stand" | "stamp" | "document";

const INK = "#34312E";

const EYES: Record<MascotExpression, ReactNode> = {
  deadpan: (
    <>
      <circle cx={102} cy={100} r={4.5} fill={INK} stroke="none" />
      <circle cx={138} cy={100} r={4.5} fill={INK} stroke="none" />
    </>
  ),
  blink: <path d="M95 100H109M131 100H145" fill="none" />,
  worried: (
    <>
      <circle cx={102} cy={101} r={4.5} fill={INK} stroke="none" />
      <circle cx={138} cy={101} r={4.5} fill={INK} stroke="none" />
      <path d="M92 83L108 79M148 83L132 79" fill="none" strokeWidth={3} />
    </>
  ),
  surprised: (
    <>
      <circle cx={102} cy={100} r={7} fill={INK} stroke="none" />
      <circle cx={138} cy={100} r={7} fill={INK} stroke="none" />
    </>
  ),
  proud: <path d="M94 103C97 95 107 95 110 103M130 103C133 95 143 95 146 103" fill="none" />,
};

const MOUTH: Record<MascotExpression, ReactNode> = {
  deadpan: <path d="M112 127H128" fill="none" />,
  blink: <path d="M112 127H128" fill="none" />,
  worried: <path d="M111 130C115 123 125 123 129 130" fill="none" />,
  surprised: <ellipse cx={120} cy={128} rx={6} ry={8} fill="#7C3B33" />,
  proud: <path d="M110 125C114 132 126 132 130 125" fill="none" />,
};

/** 감자 과장님. 표정과 포즈를 prop으로 조합하며, 새 표정은 EYES/MOUTH에 추가하면 된다. */
export function Mascot({
  expression = "deadpan",
  pose = "stand",
  size = 200,
  className,
}: {
  expression?: MascotExpression;
  pose?: MascotPose;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="10 20 220 270"
      width={size}
      height={Math.round((size * 270) / 220)}
      role="img"
      aria-label="감자 과장님"
      className={className}
      style={{ overflow: "visible" }}
    >
      <defs>
        <filter id="mascot-rough" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves={2} seed={3} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={3} />
        </filter>
        <clipPath id="mascot-body">
          <path d="M116 42C160 36 184 72 186 118C188 142 196 170 188 202C180 234 150 248 116 246C80 244 54 228 50 192C46 164 56 142 56 112C58 72 78 46 116 42Z" />
        </clipPath>
      </defs>
      <g stroke={INK} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" filter="url(#mascot-rough)">
        {/* 다리 */}
        <path d="M94 238V270M146 238V270" fill="none" strokeWidth={15} />
        <path d="M94 238V270M146 238V270" fill="none" strokeWidth={8} stroke="#4A4641" />
        <path d="M80 282C78 268 104 264 106 282ZM134 282C136 264 162 268 160 282Z" fill={INK} />

        {/* 왼팔 */}
        <path d="M58 176C40 182 34 200 38 214" fill="none" strokeWidth={18} />
        <path d="M58 176C40 182 34 200 38 214" fill="none" strokeWidth={10} stroke="#4A4641" />
        <circle cx={38} cy={218} r={8} fill="#D9A36B" />

        {/* 몸 */}
        <path d="M116 42C160 36 184 72 186 118C188 142 196 170 188 202C180 234 150 248 116 246C80 244 54 228 50 192C46 164 56 142 56 112C58 72 78 46 116 42Z" fill="#D9A36B" stroke="none" />
        <g fill="#B98450" stroke="none">
          <circle cx={78} cy={78} r={3} />
          <circle cx={164} cy={72} r={2.5} />
          <circle cx={172} cy={126} r={3} />
          <circle cx={66} cy={132} r={2.5} />
        </g>

        {/* 검은 정장과 넥타이 */}
        <g clipPath="url(#mascot-body)">
          <path d="M30 170C70 150 170 150 210 170V260H30Z" fill="#4A4641" />
          <path d="M96 156L120 200L144 156Z" fill="#FFFBF2" />
          <path d="M120 166L112 174L116 202L120 208L124 202L128 174Z" fill="#A94C40" strokeWidth={3} />
          <path d="M96 156L82 176L118 216V260M144 156L158 176L122 216" fill="none" strokeWidth={3.5} stroke="#2A2825" />
          <rect x={146} y={196} width={22} height={14} rx={2} fill="#FFFBF2" strokeWidth={2.5} />
        </g>
        <path d="M116 42C160 36 184 72 186 118C188 142 196 170 188 202C180 234 150 248 116 246C80 244 54 228 50 192C46 164 56 142 56 112C58 72 78 46 116 42Z" fill="none" strokeWidth={5} />

        {/* 대머리를 가리려는 머리카락 세 가닥 */}
        <path d="M110 44C104 34 112 28 116 36M122 44C122 32 132 30 132 38M100 48C92 42 94 34 102 38" fill="none" strokeWidth={3.5} />

        {EYES[expression]}
        {MOUTH[expression]}

        {/* 동그란 안경 */}
        <circle cx={102} cy={100} r={17} fill="#FFFBF2" fillOpacity={0.28} strokeWidth={4} />
        <circle cx={138} cy={100} r={17} fill="#FFFBF2" fillOpacity={0.28} strokeWidth={4} />
        <path d="M119 99H121M85 98L66 92M155 98L176 92" fill="none" strokeWidth={4} />

        {expression === "worried" && <path d="M170 74C164 82 164 90 170 90C176 90 176 82 170 74Z" fill="#A8C6CB" strokeWidth={3} />}

        {/* 오른팔과 포즈별 소품 */}
        {pose === "stamp" && (
          <g>
            <path d="M186 172C204 164 210 140 206 120" fill="none" strokeWidth={18} />
            <path d="M186 172C204 164 210 140 206 120" fill="none" strokeWidth={10} stroke="#4A4641" />
            <circle cx={206} cy={116} r={8} fill="#D9A36B" />
            <g transform="translate(206 92)">
              <path d="M-7 12V-4C-13 -8 -13 -22 0 -22C13 -22 13 -8 7 -4V12Z" fill="#6B4A32" />
              <rect x={-16} y={10} width={32} height={10} rx={2} fill="#A94C40" />
            </g>
          </g>
        )}
        {pose === "document" && (
          <g>
            <g transform="translate(206 186) rotate(6)">
              <path d="M-18 -32H12L20 -24V24H-18Z" fill="#FFFBF2" />
              <path d="M-10 -14H12M-10 -5H12M-10 4H4" fill="none" strokeWidth={2.5} />
              <circle cx={8} cy={14} r={6} fill="none" stroke="#A94C40" strokeWidth={2.5} />
            </g>
            <path d="M186 178C196 180 198 188 200 196" fill="none" strokeWidth={18} />
            <path d="M186 178C196 180 198 188 200 196" fill="none" strokeWidth={10} stroke="#4A4641" />
            <circle cx={201} cy={200} r={8} fill="#D9A36B" />
          </g>
        )}
        {pose === "stand" && (
          <g>
            <path d="M184 176C202 182 206 200 202 214" fill="none" strokeWidth={18} />
            <path d="M184 176C202 182 206 200 202 214" fill="none" strokeWidth={10} stroke="#4A4641" />
            <circle cx={202} cy={218} r={8} fill="#D9A36B" />
          </g>
        )}
      </g>
    </svg>
  );
}
