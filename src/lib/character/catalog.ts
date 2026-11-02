/** 캐릭터 파츠 카탈로그. 파츠 추가 시 여기에 ID를 넣으면 parts/*의 Record 타입이 그림 누락을 컴파일 오류로 알려 준다. */
export const BODIES = [
  { id: "potato", label: "감자형" },
  { id: "bean", label: "콩나물형" },
  { id: "tofu", label: "두부형" },
  { id: "pear", label: "하체 안정형" },
] as const;

export const EYES = [
  { id: "dot", label: "점 눈" },
  { id: "round", label: "초롱 눈" },
  { id: "sleepy", label: "퇴근 눈" },
  { id: "closed", label: "수면 눈" },
  { id: "stare", label: "멍한 눈" },
  { id: "dazed", label: "넋 나간 눈" },
  { id: "sparkle", label: "반짝 눈" },
  { id: "wink", label: "윙크" },
  { id: "smiling", label: "눈웃음" },
  { id: "lashes", label: "속눈썹" },
  { id: "cat", label: "고양이 눈" },
  { id: "heart", label: "하트 눈" },
] as const;

export const MOUTHS = [
  { id: "flat", label: "무표정" },
  { id: "smile", label: "사회적 미소" },
  { id: "frown", label: "시무룩" },
  { id: "open", label: "어이없음" },
  { id: "wobbly", label: "참는 중" },
  { id: "teeth", label: "억지웃음" },
  { id: "cat", label: "고양이 입" },
  { id: "tongue", label: "메롱" },
  { id: "pout", label: "뾰로통" },
  { id: "lips", label: "립스틱" },
  { id: "tiny", label: "쪼그만 입" },
] as const;

export const HAIRS = [
  { id: "none", label: "없음" },
  { id: "bob", label: "단발" },
  { id: "long", label: "긴 머리" },
  { id: "curly", label: "곱슬" },
  { id: "bowl", label: "바가지" },
  { id: "slick", label: "면접 머리" },
  { id: "pigtails", label: "양갈래" },
  { id: "messy", label: "기상 직후" },
  { id: "sprout", label: "새싹" },
  { id: "ponytail", label: "포니테일" },
  { id: "bangs", label: "일자 앞머리" },
  { id: "bun", label: "똥머리" },
  { id: "wave", label: "웨이브" },
  { id: "short", label: "숏컷" },
  { id: "sidepart", label: "가르마" },
  { id: "twinbun", label: "쌍똥머리" },
  { id: "mullet", label: "울프컷" },
] as const;

export const HATS = [
  { id: "none", label: "없음" },
  { id: "beanie", label: "비니" },
  { id: "cap", label: "야구모자" },
  { id: "grad", label: "학사모" },
  { id: "helmet", label: "안전모" },
  { id: "crown", label: "종이 왕관" },
  { id: "straw", label: "밀짚모자" },
  { id: "bucket", label: "버킷햇" },
  { id: "beret", label: "베레모" },
  { id: "headband", label: "헤어밴드" },
  { id: "catears", label: "고양이 귀" },
  { id: "bunny", label: "토끼 귀" },
  { id: "ribbon", label: "큰 리본" },
  { id: "paperbag", label: "종이봉투" },
  { id: "potatohat", label: "감자 모자" },
] as const;

export const OUTFITS = [
  { id: "none", label: "없음" },
  { id: "suit", label: "면접 정장" },
  { id: "hoodie", label: "후드티" },
  { id: "stripes", label: "줄무늬 티" },
  { id: "pajamas", label: "잠옷" },
  { id: "apron", label: "알바 앞치마" },
  { id: "varsity", label: "과잠" },
  { id: "vest", label: "니트 조끼" },
  { id: "overalls", label: "멜빵바지" },
  { id: "flannel", label: "체크 셔츠" },
  { id: "blanket", label: "이불 외투" },
  { id: "cardigan", label: "카디건" },
  { id: "dress", label: "원피스" },
  { id: "sweatshirt", label: "맨투맨" },
  { id: "uniform", label: "교복" },
  { id: "tracksuit", label: "트레이닝복" },
  { id: "hanbok", label: "생활 한복" },
  { id: "officer", label: "공단 정복" },
] as const;

export const GLASSES = [
  { id: "none", label: "없음" },
  { id: "round", label: "동글 안경" },
  { id: "square", label: "뿔테" },
  { id: "shades", label: "선글라스" },
  { id: "half", label: "반달 안경" },
  { id: "heart", label: "하트 안경" },
  { id: "star", label: "별 안경" },
  { id: "rimless", label: "무테" },
] as const;

export const ACCESSORIES = [
  { id: "none", label: "없음" },
  { id: "tie", label: "넥타이" },
  { id: "bow", label: "나비 리본" },
  { id: "nametag", label: "명찰" },
  { id: "lanyard", label: "사원증" },
  { id: "scarf", label: "목도리" },
  { id: "earring", label: "귀걸이" },
  { id: "bandage", label: "볼 반창고" },
  { id: "mustache", label: "콧수염" },
  { id: "headset", label: "헤드셋" },
  { id: "flower", label: "머리 꽃" },
  { id: "backpack", label: "책가방" },
  { id: "cape", label: "망토" },
  { id: "medal", label: "개근 메달" },
  { id: "mask", label: "마스크" },
  { id: "darkcircle", label: "다크서클" },
  { id: "necklace", label: "목걸이" },
  { id: "choker", label: "초커" },
  { id: "hairpin", label: "머리핀" },
  { id: "earbuds", label: "무선 이어폰" },
  { id: "freckles", label: "주근깨" },
  { id: "blush", label: "진한 볼터치" },
  { id: "starsticker", label: "별 스티커" },
  { id: "officerbadge", label: "공단 배지" },
] as const;

export const PROPS = [
  { id: "none", label: "없음" },
  { id: "document", label: "서류" },
  { id: "coffee", label: "아이스 커피" },
  { id: "phone", label: "휴대폰" },
  { id: "pillow", label: "베개" },
  { id: "ramen", label: "컵라면" },
  { id: "flag", label: "백기" },
  { id: "bouquet", label: "꽃다발" },
  { id: "balloon", label: "풍선" },
  { id: "laptop", label: "노트북" },
  { id: "book", label: "책" },
  { id: "bubbletea", label: "버블티" },
  { id: "plush", label: "곰 인형" },
  { id: "stampitem", label: "공단 도장" },
  { id: "burning", label: "불타는 할 일" },
] as const;

export const BODY_COLORS = [
  { id: "#D9A36B", label: "감자" },
  { id: "#F3E6CF", label: "두부" },
  { id: "#E7C85C", label: "단호박" },
  { id: "#A9B99B", label: "완두" },
  { id: "#C9796A", label: "구운 고구마" },
  { id: "#A8C6CB", label: "소다" },
  { id: "#C7A6B8", label: "자색 고구마" },
  { id: "#A39C8E", label: "구운 김" },
  { id: "#F7C9B6", label: "복숭아" },
  { id: "#FBE3D6", label: "우유" },
  { id: "#E9A9B8", label: "딸기" },
  { id: "#C4B5E3", label: "라벤더" },
  { id: "#BFE3C8", label: "민트" },
  { id: "#F2A65A", label: "당근" },
] as const;

export const HAIR_COLORS = [
  { id: "#34312E", label: "먹색" },
  { id: "#6B4A32", label: "밤색" },
  { id: "#A94C40", label: "벽돌" },
  { id: "#E7C85C", label: "머스터드" },
  { id: "#7F9470", label: "이끼" },
  { id: "#EDE3D0", label: "새치 만렙" },
  { id: "#E9A9B8", label: "분홍" },
  { id: "#8E7CC3", label: "보라" },
  { id: "#5E8FB0", label: "하늘" },
  { id: "#C98A4B", label: "캐러멜" },
  { id: "#F4E3A1", label: "금발" },
  { id: "#FFFBF2", label: "백발" },
] as const;

export const OUTFIT_COLORS = [
  { id: "#4A4641", label: "먹색" },
  { id: "#A94C40", label: "벽돌" },
  { id: "#E7C85C", label: "머스터드" },
  { id: "#7F9470", label: "세이지" },
  { id: "#5E7F8C", label: "교복 남색" },
  { id: "#EFE6D6", label: "미색" },
  { id: "#E9A9B8", label: "분홍" },
  { id: "#C4B5E3", label: "라벤더" },
  { id: "#BFE3C8", label: "민트" },
  { id: "#34312E", label: "검정" },
  { id: "#FFFBF2", label: "흰색" },
  { id: "#D9A36B", label: "베이지" },
] as const;

type Ids<T extends readonly { id: string }[]> = T[number]["id"];
export type BodyId = Ids<typeof BODIES>;
export type EyesId = Ids<typeof EYES>;
export type MouthId = Ids<typeof MOUTHS>;
export type HairId = Ids<typeof HAIRS>;
export type HatId = Ids<typeof HATS>;
export type OutfitId = Ids<typeof OUTFITS>;
export type GlassesId = Ids<typeof GLASSES>;
export type AccessoryId = Ids<typeof ACCESSORIES>;
export type PropId = Ids<typeof PROPS>;

/** DB의 citizens.character(jsonb)에 그대로 저장되는 형태 */
export type CharacterConfig = {
  version: 1;
  body: BodyId;
  bodyColor: string;
  eyes: EyesId;
  mouth: MouthId;
  hair: HairId;
  hairColor: string;
  hat: HatId;
  outfit: OutfitId;
  outfitColor: string;
  glasses: GlassesId;
  accessory: AccessoryId;
  accessory2: AccessoryId;
  prop: PropId;
};

export const DEFAULT_CHARACTER: CharacterConfig = {
  version: 1,
  body: "potato",
  bodyColor: "#F3E6CF",
  eyes: "dot",
  mouth: "flat",
  hair: "bob",
  hairColor: "#34312E",
  hat: "none",
  outfit: "hoodie",
  outfitColor: "#7F9470",
  glasses: "none",
  accessory: "none",
  accessory2: "none",
  prop: "none",
};

type OptionList = readonly { id: string; label: string }[];
type PartKey = Exclude<keyof CharacterConfig, "version">;

/** 편집기 메뉴. swatch 항목은 같은 탭 아래쪽에 색상표로 함께 나온다. */
export const CATEGORIES: readonly {
  key: PartKey;
  label: string;
  options: OptionList;
  kind: "part" | "color";
  swatch?: { key: PartKey; label: string; options: OptionList };
}[] = [
  { key: "body", label: "몸 형태", options: BODIES, kind: "part" },
  { key: "bodyColor", label: "몸 색상", options: BODY_COLORS, kind: "color" },
  { key: "eyes", label: "눈", options: EYES, kind: "part" },
  { key: "mouth", label: "입", options: MOUTHS, kind: "part" },
  { key: "hair", label: "헤어", options: HAIRS, kind: "part", swatch: { key: "hairColor", label: "머리 색", options: HAIR_COLORS } },
  { key: "hat", label: "모자", options: HATS, kind: "part" },
  { key: "outfit", label: "의상", options: OUTFITS, kind: "part", swatch: { key: "outfitColor", label: "의상 색", options: OUTFIT_COLORS } },
  { key: "glasses", label: "안경", options: GLASSES, kind: "part" },
  { key: "accessory", label: "액세서리", options: ACCESSORIES, kind: "part" },
  { key: "accessory2", label: "추가 장식", options: ACCESSORIES, kind: "part" },
  { key: "prop", label: "소품", options: PROPS, kind: "part" },
];

const ALLOWED: Record<PartKey, OptionList> = {
  body: BODIES,
  bodyColor: BODY_COLORS,
  eyes: EYES,
  mouth: MOUTHS,
  hair: HAIRS,
  hairColor: HAIR_COLORS,
  hat: HATS,
  outfit: OUTFITS,
  outfitColor: OUTFIT_COLORS,
  glasses: GLASSES,
  accessory: ACCESSORIES,
  accessory2: ACCESSORIES,
  prop: PROPS,
};

/** 저장된 값이 깨졌거나 삭제된 파츠를 가리켜도 렌더링이 깨지지 않도록 기본값으로 되돌린다. */
export function sanitizeCharacter(input: unknown): CharacterConfig {
  const source = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const result: Record<string, unknown> = { ...DEFAULT_CHARACTER };
  for (const key of Object.keys(ALLOWED) as PartKey[]) {
    if (ALLOWED[key].some((option) => option.id === source[key])) result[key] = source[key];
  }
  return result as CharacterConfig;
}

/** 민원을 내면 열리는 특별 아이템. 나머지 파츠는 처음부터 전부 무료다. */
export const SPECIAL_ITEMS: readonly { part: PartKey; id: string; label: string; needCases: number }[] = [
  { part: "prop", id: "stampitem", label: "공단 도장", needCases: 1 },
  { part: "outfit", id: "officer", label: "공단 정복", needCases: 3 },
  { part: "hat", id: "paperbag", label: "종이봉투", needCases: 5 },
  { part: "prop", id: "burning", label: "불타는 할 일", needCases: 7 },
  { part: "accessory", id: "officerbadge", label: "공단 배지", needCases: 10 },
  { part: "hat", id: "potatohat", label: "감자 모자", needCases: 15 },
];

export function specialFor(part: string, id: string) {
  const key = part === "accessory2" ? "accessory" : part;
  return SPECIAL_ITEMS.find((item) => item.part === key && item.id === id);
}

export function isUnlocked(part: string, id: string, caseCount: number): boolean {
  const special = specialFor(part, id);
  return !special || caseCount >= special.needCases;
}

export function randomCharacter(random: () => number = Math.random): CharacterConfig {
  // 특별 아이템은 랜덤에 나오지 않는다.
  const pick = <T extends { id: string }>(list: readonly T[]) => {
    const free = list.filter((item) => !SPECIAL_ITEMS.some((special) => special.id === item.id));
    return free[Math.floor(random() * free.length)].id;
  };
  /** 모든 파츠를 항상 착용하면 지저분해지므로 '없음' 비율을 높인다. */
  const sparse = <T extends { id: string }>(list: readonly T[], chance: number) => (random() < chance ? pick(list) : "none");
  return {
    version: 1,
    body: pick(BODIES),
    bodyColor: pick(BODY_COLORS),
    eyes: pick(EYES),
    mouth: pick(MOUTHS),
    hair: pick(HAIRS),
    hairColor: pick(HAIR_COLORS),
    hat: sparse(HATS, 0.35),
    outfit: pick(OUTFITS),
    outfitColor: pick(OUTFIT_COLORS),
    glasses: sparse(GLASSES, 0.35),
    accessory: sparse(ACCESSORIES, 0.5),
    accessory2: sparse(ACCESSORIES, 0.2),
    prop: sparse(PROPS, 0.5),
  } as CharacterConfig;
}
