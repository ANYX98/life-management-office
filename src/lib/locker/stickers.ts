import type { CaseRecord } from "@/lib/citizen/types";
import type { CategoryId } from "@/lib/complaint/content";
import { GENTLE_RULE } from "@/lib/complaint/rules";

/** 스티커는 사건 기록에서 계산하므로 잃어버리지 않는다. 접속을 안 해도 사라지지 않는다. */
export type Sticker = { id: string; label: string; hint: string; color: string; earned: (cases: readonly CaseRecord[]) => boolean };

const counted = (cases: readonly CaseRecord[]) => cases.filter((item) => item.title !== GENTLE_RULE.titles[0]);
const inCategory = (category: CategoryId, need: number) => (cases: readonly CaseRecord[]) => counted(cases).filter((item) => item.category === category).length >= need;
const kstHour = (iso: string) => Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Seoul", hour: "2-digit", hour12: false }).format(new Date(iso)));
const kstWeekday = (iso: string) => new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Seoul", weekday: "short" }).format(new Date(iso));

export const STICKERS: readonly Sticker[] = [
  { id: "first", label: "첫 민원", hint: "민원 1건 접수", color: "#E7C85C", earned: (cases) => cases.length >= 1 },
  { id: "regular", label: "단골 입문", hint: "민원 5건 접수", color: "#D9A36B", earned: (cases) => cases.length >= 5 },
  { id: "veteran", label: "서류 더미", hint: "민원 20건 접수", color: "#A94C40", earned: (cases) => cases.length >= 20 },
  { id: "bed", label: "이불 밖 위험", hint: "침대 민원 3건", color: "#C4B5E3", earned: inCategory("bed", 3) },
  { id: "delay", label: "내일의 나", hint: "미룬 일 민원 3건", color: "#A8C6CB", earned: inCategory("delay", 3) },
  { id: "phone", label: "엄지 근육", hint: "휴대폰 민원 3건", color: "#BFE3C8", earned: inCategory("phone", 3) },
  { id: "food", label: "오늘 뭐 먹지", hint: "밥 민원 3건", color: "#F2A65A", earned: inCategory("food", 3) },
  { id: "job", label: "자소서 생존", hint: "취업·시험 민원 3건", color: "#E9A9B8", earned: inCategory("job", 3) },
  { id: "free", label: "분류 불가", hint: "자유 진술 민원 3건", color: "#F7C9B6", earned: inCategory("free", 3) },
  { id: "dawn", label: "새벽 민원인", hint: "새벽 0~5시에 접수", color: "#8E7CC3", earned: (cases) => counted(cases).some((item) => kstHour(item.createdAt) < 5) },
  { id: "monday", label: "월요일 통과", hint: "월요일에 접수", color: "#A9B99B", earned: (cases) => counted(cases).some((item) => kstWeekday(item.createdAt) === "Mon") },
  { id: "public", label: "게시판 부착", hint: "사건을 익명 공개", color: "#FFFBF2", earned: (cases) => counted(cases).some((item) => item.visibility === "public") },
];
