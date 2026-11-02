import type { CaseRecord } from "@/lib/citizen/types";
import { CATEGORIES, ENERGY_LEVELS } from "@/lib/complaint/content";
import { GENTLE_RULE } from "@/lib/complaint/rules";

export const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"] as const;

const DAY_MS = 86400000;
/** 한국 시간 날짜를 UTC 자정 값으로 바꿔 날짜 계산을 단순하게 한다. */
function kstDay(date: Date): number {
  const [year, month, day] = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" })
    .format(date)
    .split("-")
    .map(Number);
  return Date.UTC(year, month - 1, day);
}

function mondayOf(dayValue: number): number {
  const weekday = (new Date(dayValue).getUTCDay() + 6) % 7;
  return dayValue - weekday * DAY_MS;
}

export type WeeklyReport = {
  /** 0이면 이번 주, 1이면 지난주 */
  weeksAgo: number;
  rangeLabel: string;
  total: number;
  /** 월요일부터 일요일까지 날짜별 사건 수 */
  perDay: number[];
  activeDays: number;
  topType: string | null;
  energyLabel: string | null;
  titles: string[];
  verdict: string;
  disposition: string;
};

function weeklyVerdict(total: number, week: string): string {
  if (total === 0) return `${week} 접수 0건. 네, 그렇군요.`;
  if (total <= 2) return `${week} ${total}건 접수했습니다. 아 그러세요.`;
  if (total <= 6) return `${week} ${total}건이나 있었군요. 네, 다 읽었습니다.`;
  return `${week} ${total}건. 공단보다 바쁘셨습니다.`;
}

function weeklyDisposition(total: number, averageEnergy: number | null, week: string): string {
  if (total === 0) return `${week} 인생은 무사고로 처리합니다.`;
  if (averageEnergy !== null && averageEnergy < 1.5) return `${week} 못 한 일들은 전부 뒤 창고에서 태웠습니다. 다음 주는 빈 서류로 시작합니다.`;
  if (averageEnergy !== null && averageEnergy >= 3) return "남은 에너지는 이월합니다. 다 안 쓰셔도 됩니다.";
  return `${week} 서류는 여기서 닫습니다. 다음 주 일은 다음 주의 귀하 소관입니다.`;
}

export function buildWeeklyReport(cases: readonly CaseRecord[], now: Date, weeksAgo = 0): WeeklyReport {
  const monday = mondayOf(kstDay(now)) - weeksAgo * 7 * DAY_MS;
  const perDay = [0, 0, 0, 0, 0, 0, 0];
  const inWeek = cases.filter((item) => {
    const index = (kstDay(new Date(item.createdAt)) - monday) / DAY_MS;
    if (index < 0 || index > 6) return false;
    perDay[index] += 1;
    return true;
  });

  // 힘든 일을 적은 사건은 날짜 칸에만 세고, 유형 순위와 에너지 농담에는 쓰지 않는다.
  const playful = inWeek.filter((item) => item.title !== GENTLE_RULE.titles[0]);
  const counts = new Map<string, number>();
  for (const item of playful) counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
  const topId = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  const averageEnergy = playful.length ? playful.reduce((sum, item) => sum + item.energy, 0) / playful.length : null;

  const end = monday + 6 * DAY_MS;
  const label = (value: number) => {
    const date = new Date(value);
    return `${date.getUTCMonth() + 1}월 ${date.getUTCDate()}일`;
  };

  const week = weeksAgo === 0 ? "이번 주" : "그 주";
  return {
    weeksAgo,
    rangeLabel: `${label(monday)} ~ ${label(end)}`,
    total: inWeek.length,
    perDay,
    activeDays: perDay.filter(Boolean).length,
    topType: CATEGORIES.find((item) => item.id === topId)?.label ?? null,
    energyLabel: averageEnergy === null ? null : ENERGY_LEVELS[Math.round(averageEnergy)]?.label ?? null,
    titles: [...new Set(inWeek.map((item) => item.awardedTitle).filter((title): title is string => Boolean(title)))],
    verdict: weeklyVerdict(inWeek.length, week),
    disposition: weeklyDisposition(inWeek.length, averageEnergy, week),
  };
}
