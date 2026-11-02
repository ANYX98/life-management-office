import { useId, type ReactNode } from "react";
import type { CharacterConfig } from "@/lib/character/catalog";
import { ACCESSORY_ART, type AccessoryAnchor } from "./parts/accessory";
import { BODY_SHAPES } from "./parts/bodies";
import { EYE_ART, GLASSES_ART, MOUTH_ART } from "./parts/face";
import { HAIR_BACK, HAIR_FRONT, HAIR_HIDDEN_BY_HAT } from "./parts/hair";
import { HAT_ART } from "./parts/hat";
import { INK } from "./parts/ink";
import { OUTFIT_ART } from "./parts/outfit";
import { PROP_ART } from "./parts/prop";

type Props = {
  config: CharacterConfig;
  /** 픽셀 너비. 높이는 비율에 맞춰 정해진다. */
  size?: number;
  /** 손그림 흔들림 필터. 작은 썸네일이 많은 화면에서는 끈다. */
  rough?: boolean;
  /** face는 머리만 보여 주는 댓글·칩용 프레이밍 */
  crop?: "full" | "face";
  title?: string;
  className?: string;
};

const VIEW_FULL = "-14 4 268 288";

/**
 * 시민 캐릭터 렌더러. 모든 화면이 이 컴포넌트 하나를 공유한다.
 *
 * 레이어 순서(뒤 → 앞):
 *  1 등 뒤 액세서리 → 2 뒷머리 → 3 다리 → 4 왼팔 → 5 몸 채색 → 6 의상(몸 윤곽으로 클립)
 *  → 7 몸 외곽선 → 8 목 액세서리 → 9 눈·입 → 10 얼굴 액세서리 → 11 안경
 *  → 12 앞머리 → 13 모자 → 14 머리 액세서리 → 15 오른팔과 소품
 */
export function Character({ config, size = 200, rough = true, crop = "full", title, className }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const clipId = `body-${uid}`;
  const filterId = `rough-${uid}`;

  const shape = BODY_SHAPES[config.body];
  const { faceY, top, headHalf, armHalf } = shape;
  const headScale = headHalf / 50;
  const faceScale = Math.min(Math.max(headHalf / 52, 0.86), 1.12);
  const collarY = faceY + 52;
  const armY = faceY + 70;
  const limbColor = config.outfit === "none" ? config.bodyColor : config.outfitColor;
  const hasProp = config.prop !== "none";

  const head = (node: ReactNode) => <g transform={`translate(120 ${top}) scale(${headScale} 1)`}>{node}</g>;
  const face = (node: ReactNode) => <g transform={`translate(120 ${faceY}) scale(${faceScale})`}>{node}</g>;

  const accessory = ACCESSORY_ART[config.accessory];
  const accessoryAt = (anchor: AccessoryAnchor) => (accessory?.at === anchor ? accessory.art : null);
  const showHair = !(config.hat !== "none" && HAIR_HIDDEN_BY_HAT.includes(config.hair));

  const handX = 120 + armHalf + 22;
  const handY = armY - (hasProp ? 10 : -22);

  const viewBox = crop === "face" ? `${120 - 80} ${top - 26} 160 160` : VIEW_FULL;
  const height = crop === "face" ? size : Math.round((size * 288) / 268);

  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={height}
      role="img"
      aria-label={title ?? "시민 캐릭터"}
      className={className}
      style={{ overflow: "visible", maxWidth: "100%" }}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={shape.path} />
        </clipPath>
        {rough && (
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves={2} seed={7} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={2.4} />
          </filter>
        )}
      </defs>

      <g
        stroke={INK}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={rough ? `url(#${filterId})` : undefined}
      >
        {/* 1 등 뒤 액세서리 */}
        <g transform={`translate(120 ${collarY})`}>{accessoryAt("back")}</g>

        {/* 2 뒷머리 */}
        {showHair && HAIR_BACK[config.hair] && <g fill={config.hairColor}>{head(HAIR_BACK[config.hair])}</g>}

        {/* 3 다리 */}
        <g>
          <path d="M96 232V264" fill="none" strokeWidth={15} />
          <path d="M144 232V264" fill="none" strokeWidth={15} />
          <path d="M96 232V264" fill="none" strokeWidth={8} stroke={limbColor} />
          <path d="M144 232V264" fill="none" strokeWidth={8} stroke={limbColor} />
          <path d="M84 276C82 264 104 260 106 276Z" fill="#FFFBF2" />
          <path d="M134 276C136 260 158 264 156 276Z" fill="#FFFBF2" />
        </g>

        {/* 4 왼팔 */}
        <path d={`M${120 - armHalf + 3} ${armY - 6}C${120 - armHalf - 12} ${armY + 2} ${120 - armHalf - 16} ${armY + 16} ${120 - armHalf - 14} ${armY + 26}`} fill="none" strokeWidth={17} />
        <path d={`M${120 - armHalf + 3} ${armY - 6}C${120 - armHalf - 12} ${armY + 2} ${120 - armHalf - 16} ${armY + 16} ${120 - armHalf - 14} ${armY + 26}`} fill="none" strokeWidth={9.5} stroke={limbColor} />

        {/* 5 몸 채색 */}
        <path d={shape.path} fill={config.bodyColor} stroke="none" />

        {/* 6 의상 */}
        <g clipPath={`url(#${clipId})`}>{OUTFIT_ART[config.outfit](collarY, config.outfitColor)}</g>

        {/* 7 몸 외곽선 */}
        <path d={shape.path} fill="none" strokeWidth={5} />

        {/* 8 목 액세서리 */}
        <g transform={`translate(120 ${collarY})`}>{accessoryAt("neck")}</g>

        {/* 9 눈, 입, 볼터치 */}
        {face(
          <>
            <ellipse cx={-33} cy={15} rx={7} ry={4} fill="#A94C40" fillOpacity={0.28} stroke="none" />
            <ellipse cx={33} cy={15} rx={7} ry={4} fill="#A94C40" fillOpacity={0.28} stroke="none" />
            {EYE_ART[config.eyes]}
            {MOUTH_ART[config.mouth]}
          </>,
        )}

        {/* 10 얼굴 액세서리 */}
        {face(accessoryAt("face"))}

        {/* 11 안경 */}
        {face(GLASSES_ART[config.glasses])}

        {/* 12 앞머리 */}
        {showHair && <g fill={config.hairColor}>{head(HAIR_FRONT[config.hair])}</g>}

        {/* 13 모자 */}
        {head(HAT_ART[config.hat])}

        {/* 14 머리 액세서리 */}
        {head(accessoryAt("head"))}

        {/* 15 오른팔과 소품 */}
        {hasProp && <g transform={`translate(${handX} ${handY})`}>{PROP_ART[config.prop]}</g>}
        <path d={`M${120 + armHalf - 3} ${armY - 6}C${120 + armHalf + 8} ${armY - 2} ${handX - 6} ${handY + 12} ${handX} ${handY + 4}`} fill="none" strokeWidth={17} />
        <path d={`M${120 + armHalf - 3} ${armY - 6}C${120 + armHalf + 8} ${armY - 2} ${handX - 6} ${handY + 12} ${handX} ${handY + 4}`} fill="none" strokeWidth={9.5} stroke={limbColor} />
      </g>
    </svg>
  );
}
