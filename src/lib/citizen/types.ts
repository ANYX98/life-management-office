import type { CharacterConfig } from "@/lib/character/catalog";
import type { ArchiveSort, ReactionCounts, ReactionKind, ReportReason } from "@/lib/archive/reactions";
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

/** 다른 시민에게 보이는 사건. 본인 식별자는 담지 않는다. */
export type PublicCase = {
  id: string;
  title: string;
  report: string;
  verdict: string;
  disposition: string;
  awardedTitle: string | null;
  createdAt: string;
  nickname: string;
  character: CharacterConfig;
  counts: ReactionCounts;
  mine: ReactionKind[];
  isMine: boolean;
};

export interface CitizenRepository {
  /** false면 서버가 없는 게스트 모드라 다른 시민의 사건을 볼 수 없다. */
  readonly socialEnabled: boolean;
  readonly mode: "guest" | "account";
  load(): Promise<Citizen | null>;
  register(input: { nickname: string; character: CharacterConfig; captchaToken?: string | null }): Promise<Citizen>;
  updateCharacter(character: CharacterConfig): Promise<Citizen>;
  stats(): Promise<PlazaStats | null>;
  listCases(): Promise<CaseRecord[]>;
  submitCase(input: NewCaseInput): Promise<{ record: CaseRecord; citizen: Citizen }>;
  setCaseVisibility(caseId: string, visibility: CaseVisibility): Promise<void>;
  reactionCounts(caseIds: string[]): Promise<Record<string, ReactionCounts>>;
  listPublicCases(sort: ArchiveSort, offset: number): Promise<PublicCase[]>;
  setReaction(caseId: string, kind: ReactionKind, on: boolean): Promise<void>;
  reportCase(caseId: string, reason: ReportReason): Promise<void>;
  /** 이 시민증에 연결된 이메일. 본인 화면에만 보여 준다. 없으면 null */
  linkedEmail(): Promise<string | null>;
  /** 지금 시민증에 이메일을 연결한다. 메일의 확인 링크를 눌러야 완료된다. */
  linkEmail(email: string): Promise<void>;
  /** 다른 기기에서 내 시민증을 찾는 로그인 링크를 보낸다. */
  sendLoginLink(email: string, captchaToken?: string | null): Promise<void>;
  /** 이메일이 연결된 뒤 비밀번호를 정하거나 바꾼다. */
  setPassword(password: string): Promise<void>;
  loginWithPassword(email: string, password: string, captchaToken?: string | null): Promise<void>;
  deleteMyAccount(): Promise<void>;
  getPublicCase(id: string): Promise<PublicCase | null>;
  recordShareEvent(kind: "visit" | "signup", caseId: string): Promise<void>;
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
