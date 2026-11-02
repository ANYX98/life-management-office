import type { CharacterConfig } from "@/lib/character/catalog";
import type { CategoryId } from "@/lib/complaint/content";

export type Citizen = {
  id: string;
  citizenNo: string;
  nickname: string;
  character: CharacterConfig;
  citizenType: string;
  grade: string;
  title: string;
  caseCount: number;
  issuedAt: string;
  storage: "guest" | "account";
};

/** 실제 집계값만 담는다. 집계할 수 없으면 null이며 화면은 빈 상태를 보여 준다. */
export type PlazaStats = {
  totalCitizens: number;
  registeredToday: number;
};

export type CaseVisibility = "public" | "private";

/** 시민이 민원 접수실에서 낸 값 */
export type NewCaseInput = {
  category: CategoryId;
  energy: number;
  uselessAct: string | null;
  socialState: string | null;
  statement: string;
  visibility: CaseVisibility;
};

export type CaseRecord = {
  id: string;
  caseNo: string;
  createdAt: string;
  category: CategoryId;
  energy: number;
  statement: string;
  visibility: CaseVisibility;
  title: string;
  report: string;
  verdict: string;
  disposition: string;
  awardedTitle: string | null;
};

export interface CitizenRepository {
  readonly mode: "guest" | "account";
  load(): Promise<Citizen | null>;
  register(input: { nickname: string; character: CharacterConfig }): Promise<Citizen>;
  updateCharacter(character: CharacterConfig): Promise<Citizen>;
  stats(): Promise<PlazaStats | null>;
  listCases(): Promise<CaseRecord[]>;
  submitCase(input: NewCaseInput): Promise<{ record: CaseRecord; citizen: Citizen }>;
}

/** supabase/migrations의 random_citizen_type()과 같은 목록을 유지한다. */
export const CITIZEN_TYPES = [
  "침대 밀착형",
  "계획 과다형",
  "미래 위임형",
  "카페인 의존형",
  "갑자기 갓생형",
  "조용한 생존형",
  "점심 숙고형",
  "알람 협상형",
] as const;

export const INITIAL_GRADE = "수습 시민";
export const INITIAL_TITLE = "신규 등록 시민";

export function validateNickname(raw: string): string | null {
  const name = raw.trim();
  if (name.length < 2) return "닉네임은 2자 이상 적어 주세요.";
  if (name.length > 12) return "닉네임은 12자까지 쓸 수 있습니다.";
  if (name.includes("@")) return "이메일처럼 보이는 닉네임은 쓸 수 없습니다. 익명성을 지켜 드려야 합니다.";
  if ((name.match(/\d/g) ?? []).length >= 7) return "전화번호처럼 보이는 닉네임은 쓸 수 없습니다.";
  return null;
}
