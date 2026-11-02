import type { CaseRecord, NewCaseInput } from "@/lib/citizen/types";
import { CATEGORIES, ENERGY_LEVELS, MILESTONE_AT, MILESTONE_TITLE, MONDAY_TITLE, type CategoryId } from "./content";

export type GeneratedCase = Pick<CaseRecord, "title" | "report" | "verdict" | "disposition" | "awardedTitle">;

const pick = <T,>(list: readonly T[], random: () => number): T => list[Math.floor(random() * list.length)];

/** 같은 사건명이 연달아 나오지 않도록 직전 사건과 다른 후보를 먼저 고른다. */
function pickFresh(list: readonly string[], recent: string[], random: () => number): string {
  const fresh = list.filter((item) => !recent.includes(item));
  return pick(fresh.length ? fresh : list, random);
}

/** 칭호 규칙. 같은 칭호는 다시 주지 않는다. 우선순위: 월요일 > 누적 5건 > 유형별 1단계 > 같은 유형 3건째 2단계 */
export function chooseAwardedTitle(categoryId: CategoryId, history: readonly CaseRecord[], isMonday: boolean): string | null {
  const owned = new Set(history.map((item) => item.awardedTitle).filter(Boolean));
  const category = CATEGORIES.find((item) => item.id === categoryId)!;
  const sameCategoryCount = history.filter((item) => item.category === categoryId).length + 1;
  const candidates = [
    isMonday ? MONDAY_TITLE : null,
    history.length + 1 >= MILESTONE_AT ? MILESTONE_TITLE : null,
    category.rank1,
    sameCategoryCount >= 3 ? category.rank2 : null,
  ];
  return candidates.find((title): title is string => Boolean(title) && !owned.has(title!)) ?? null;
}

export function generateCase(
  input: NewCaseInput,
  history: readonly CaseRecord[],
  options: { isMonday: boolean; random?: () => number },
): GeneratedCase {
  const random = options.random ?? Math.random;
  const category = CATEGORIES.find((item) => item.id === input.category)!;
  const recent = history.slice(0, 3);
  const energy = ENERGY_LEVELS.find((item) => item.value === input.energy) ?? ENERGY_LEVELS[2];

  const report: string[] = [];
  if (input.uselessAct) report.push(`조사 결과, 귀하는 오늘 '${input.uselessAct}'이라는 행위를 한 것으로 확인되었습니다. 공단은 이를 업무로 인정합니다.`);
  if (input.socialState) report.push(`사회생활 창구 상태는 '${input.socialState}'으로 접수되었습니다.`);
  if (input.statement.trim()) report.push(`귀하의 진술: "${input.statement.trim()}" 공단은 이 진술을 일단 믿기로 했습니다. 확인하기 귀찮습니다.`);
  if (report.length === 0) report.push("귀하는 별다른 진술을 하지 않았습니다. 공단도 더 묻지 않았습니다.");

  return {
    title: pickFresh(category.titles, recent.map((item) => item.title), random),
    report: report.join(" "),
    verdict: pickFresh(category.verdicts, recent.map((item) => item.verdict), random),
    disposition: `${pickFresh(category.dispositions, recent.map((item) => item.disposition), random)} ${energy.note}`,
    awardedTitle: chooseAwardedTitle(input.category, history, options.isMonday),
  };
}

/** migrations의 grade_for_case_count와 같은 기준을 유지한다. */
export function gradeFor(caseCount: number): string {
  if (caseCount >= 30) return "공단 단골";
  if (caseCount >= 10) return "상습 민원인";
  if (caseCount >= 3) return "일반 시민";
  return "수습 시민";
}

/**
 * 진지한 위험 신호가 보이는 글은 농담으로 처리하지 않는다. 띄어쓰기를 무시하고 검사한다.
 * "배고파 죽겠다" 같은 일상 표현은 걸리지 않게 좁게 잡았고, 잘못 걸려도 사용자가 돌아갈 수 있다.
 */
const RISK_PATTERNS = [
  "죽고싶", "죽고시", "죽을까", "죽어버리", "죽어야", "자살", "자해", "손목을긋", "뛰어내리", "목숨을끊",
  "사라지고싶", "없어지고싶", "살기싫", "살고싶지않", "그만살", "끝내고싶", "안깨어나", "깨어나고싶지",
];

export function looksLikeSeriousDistress(text: string): boolean {
  const compact = text.replace(/\s+/g, "");
  return RISK_PATTERNS.some((pattern) => compact.includes(pattern));
}

/** 진술에 연락처가 들어가면 접수하지 않는다. 공개 전환 여부와 상관없이 애초에 남기지 않는다. */
export function validateStatement(text: string): string | null {
  if (text.includes("@")) return "이메일 주소는 빼고 적어 주세요. 공단은 받아도 곤란합니다.";
  if ((text.match(/\d/g) ?? []).length >= 7) return "전화번호처럼 보이는 숫자는 빼고 적어 주세요.";
  return null;
}
