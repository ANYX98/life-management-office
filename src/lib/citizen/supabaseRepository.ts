import { sanitizeCharacter } from "@/lib/character/catalog";
import { getSupabase } from "@/lib/supabase/client";
import type { ReactionCounts, ReactionKind } from "@/lib/archive/reactions";
import type { CategoryId } from "@/lib/complaint/content";
import { generateCase } from "@/lib/complaint/generate";
import { isKstMonday } from "@/lib/daily/date";
import type { CaseRecord, CaseVisibility, Citizen, CitizenRepository, PublicCase } from "./types";

type Row = {
  id: string;
  citizen_no: number;
  nickname: string;
  character: unknown;
  citizen_type: string;
  grade: string;
  title: string;
  case_count: number;
  created_at: string;
};

const COLUMNS = "id,citizen_no,nickname,character,citizen_type,grade,title,case_count,created_at";

function toCitizen(row: Row): Citizen {
  return {
    id: row.id,
    citizenNo: `제 ${String(row.citizen_no).padStart(6, "0")} 호`,
    nickname: row.nickname,
    character: sanitizeCharacter(row.character),
    citizenType: row.citizen_type,
    grade: row.grade,
    title: row.title,
    caseCount: row.case_count,
    issuedAt: row.created_at,
    storage: "account",
  };
}

type CaseRow = {
  id: string;
  case_no: number;
  created_at: string;
  category: CategoryId;
  energy: number;
  statement: string;
  visibility: CaseVisibility;
  title: string;
  report: string;
  verdict: string;
  disposition: string;
  awarded_title: string | null;
};

const CASE_COLUMNS = "id,case_no,created_at,category,energy,statement,visibility,title,report,verdict,disposition,awarded_title";

function toCase(row: CaseRow): CaseRecord {
  return {
    id: row.id,
    caseNo: `민원 제 ${String(row.case_no).padStart(6, "0")} 호`,
    createdAt: row.created_at,
    category: row.category,
    energy: row.energy,
    statement: row.statement,
    visibility: row.visibility,
    title: row.title,
    report: row.report,
    verdict: row.verdict,
    disposition: row.disposition,
    awardedTitle: row.awarded_title,
  };
}

type PublicCaseRow = {
  id: string;
  title: string;
  report: string;
  verdict: string;
  disposition: string;
  awarded_title: string | null;
  created_at: string;
  nickname: string;
  character: unknown;
  counts: ReactionCounts;
  mine: ReactionKind[];
  is_mine: boolean;
};

function toPublicCase(row: PublicCaseRow): PublicCase {
  return {
    id: row.id,
    title: row.title,
    report: row.report,
    verdict: row.verdict,
    disposition: row.disposition,
    awardedTitle: row.awarded_title,
    createdAt: row.created_at,
    nickname: row.nickname,
    character: sanitizeCharacter(row.character),
    counts: row.counts ?? {},
    mine: row.mine ?? [],
    isMine: row.is_mine,
  };
}

const UNIQUE_VIOLATION = "23505";

async function requireUserId(): Promise<string> {
  const userId = await currentUserId();
  if (!userId) throw new Error("시민 등록을 먼저 해 주세요.");
  return userId;
}

async function currentUserId(): Promise<string | null> {
  const { data, error } = await getSupabase().auth.getSession();
  if (error) throw new Error("로그인 상태를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.");
  return data.session?.user.id ?? null;
}

function mailError(message: string, action: string): string {
  if (/rate limit/i.test(message)) return "메일 발송 한도를 넘었습니다. 한 시간쯤 뒤 다시 시도해 주세요.";
  if (/already/i.test(message)) return "이미 다른 시민증에 연결된 이메일입니다. 다른 기기에서 내 시민증 찾기를 이용해 주세요.";
  if (/signups not allowed|not found/i.test(message)) return "이 이메일로 연결된 시민증이 없습니다. 주소를 확인해 주세요.";
  return `${action}에 실패했습니다. 이메일 주소를 확인하고 다시 시도해 주세요.`;
}

function failure(action: string): Error {
  return new Error(`${action}에 실패했습니다. 잠시 후 다시 시도해 주세요.`);
}

/** 로그인 없이 체험할 수 있도록 Supabase 익명 로그인을 쓴다. 영구 계정 연결은 같은 user id를 유지한 채 진행한다. */
export const supabaseRepository: CitizenRepository = {
  mode: "account",
  socialEnabled: true,
  async load() {
    const userId = await currentUserId();
    if (!userId) return null;
    const { data, error } = await getSupabase().from("citizens").select(COLUMNS).eq("id", userId).maybeSingle();
    if (error) throw failure("시민 정보 불러오기");
    return data ? toCitizen(data as Row) : null;
  },
  async register({ nickname, character, captchaToken }) {
    const supabase = getSupabase();
    let userId = await currentUserId();
    if (!userId) {
      const { data, error } = await supabase.auth.signInAnonymously(captchaToken ? { options: { captchaToken } } : undefined);
      if (error || !data.user) throw failure("임시 시민 계정 만들기");
      userId = data.user.id;
    }
    const { data, error } = await supabase
      .from("citizens")
      .insert({ id: userId, nickname: nickname.trim(), character: sanitizeCharacter(character) })
      .select(COLUMNS)
      .single();
    if (error) throw failure("시민 등록");
    return toCitizen(data as Row);
  },
  async updateCharacter(character) {
    const userId = await currentUserId();
    if (!userId) throw new Error("로그인 정보가 없습니다. 시민 등록을 먼저 해 주세요.");
    const { data, error } = await getSupabase()
      .from("citizens")
      .update({ character: sanitizeCharacter(character) })
      .eq("id", userId)
      .select(COLUMNS)
      .single();
    if (error) throw failure("증명사진 저장");
    return toCitizen(data as Row);
  },
  async listCases() {
    const userId = await currentUserId();
    if (!userId) return [];
    const { data, error } = await getSupabase()
      .from("cases")
      .select(CASE_COLUMNS)
      .eq("citizen_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw failure("사건 기록 불러오기");
    return (data as CaseRow[]).map(toCase);
  },
  async submitCase(input) {
    const userId = await currentUserId();
    if (!userId) throw new Error("로그인 정보가 없습니다. 시민 등록을 먼저 해 주세요.");
    const history = await this.listCases();
    const generated = generateCase(input, history, { isMonday: isKstMonday(new Date()) });
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("cases")
      .insert({
        citizen_id: userId,
        category: input.category,
        energy: input.energy,
        statement: input.statement.trim(),
        visibility: input.visibility,
        title: generated.title,
        report: generated.report,
        verdict: generated.verdict,
        disposition: generated.disposition,
        awarded_title: generated.awardedTitle,
      })
      .select(CASE_COLUMNS)
      .single();
    if (error) throw failure("민원 접수");
    const citizen = await this.load();
    if (!citizen) throw failure("시민증 갱신");
    return { record: toCase(data as CaseRow), citizen };
  },
  async setCaseVisibility(caseId, visibility) {
    const { error } = await getSupabase().from("cases").update({ visibility }).eq("id", caseId);
    if (error) throw failure("공개 범위 변경");
  },
  async reactionCounts(caseIds) {
    if (caseIds.length === 0) return {};
    const { data, error } = await getSupabase().rpc("case_reaction_counts", { p_ids: caseIds });
    if (error) throw failure("반응 불러오기");
    const result: Record<string, ReactionCounts> = {};
    for (const row of data as { case_id: string; kind: ReactionKind; n: number }[]) {
      result[row.case_id] = { ...result[row.case_id], [row.kind]: Number(row.n) };
    }
    return result;
  },
  async listPublicCases(sort, offset) {
    const { data, error } = await getSupabase().rpc("public_cases", { p_sort: sort, p_limit: 20, p_offset: offset });
    if (error) throw failure("사건 불러오기");
    return (data as PublicCaseRow[]).map(toPublicCase);
  },
  async setReaction(caseId, kind, on) {
    const userId = await requireUserId();
    const reactions = getSupabase().from("reactions");
    const { error } = on
      ? await reactions.insert({ case_id: caseId, citizen_id: userId, kind })
      : await reactions.delete().match({ case_id: caseId, citizen_id: userId, kind });
    if (error && error.code !== UNIQUE_VIOLATION) throw failure("반응 남기기");
  },
  async reportCase(caseId, reason) {
    const userId = await requireUserId();
    const { error } = await getSupabase().from("reports").insert({ case_id: caseId, reporter_id: userId, reason });
    if (error && error.code !== UNIQUE_VIOLATION) throw failure("신고");
  },
  async linkedEmail() {
    const { data } = await getSupabase().auth.getSession();
    return data.session?.user.email ?? null;
  },
  async linkEmail(email) {
    await requireUserId();
    const { error } = await getSupabase().auth.updateUser({ email: email.trim() }, { emailRedirectTo: `${window.location.origin}/account` });
    if (error) throw new Error(mailError(error.message, "이메일 연결"));
  },
  async sendLoginLink(email, captchaToken) {
    const { error } = await getSupabase().auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/account`, ...(captchaToken ? { captchaToken } : {}) },
    });
    if (error) throw new Error(mailError(error.message, "로그인 링크 보내기"));
  },
  async setPassword(password) {
    await requireUserId();
    const { error } = await getSupabase().auth.updateUser({ password });
    if (error) {
      if (/different/i.test(error.message)) throw new Error("지금 쓰는 비밀번호와 다른 비밀번호를 적어 주세요.");
      if (/weak|at least|characters/i.test(error.message)) throw new Error("더 길고 어려운 비밀번호를 적어 주세요.");
      throw failure("비밀번호 저장");
    }
  },
  async loginWithPassword(email, password, captchaToken) {
    const { error } = await getSupabase().auth.signInWithPassword({
      email: email.trim(),
      password,
      ...(captchaToken ? { options: { captchaToken } } : {}),
    });
    if (error) {
      if (/invalid/i.test(error.message)) throw new Error("이메일이나 비밀번호가 맞지 않습니다. 비밀번호를 정한 적이 없다면 아래 메일 링크로 들어가 먼저 정해 주세요.");
      if (/rate limit|too many/i.test(error.message)) throw new Error("시도가 너무 많았습니다. 잠시 후 다시 해 주세요.");
      throw failure("로그인");
    }
  },
  async getPublicCase(id) {
    if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
    const { data, error } = await getSupabase().rpc("public_case", { p_id: id });
    if (error) throw failure("사건 불러오기");
    const row = (data as PublicCaseRow[])[0];
    return row ? toPublicCase(row) : null;
  },
  async recordShareEvent(kind, caseId) {
    // 집계 실패가 화면을 막지 않게 오류는 무시한다.
    await getSupabase().rpc("record_share_event", { p_kind: kind, p_case_id: caseId });
  },
  async setTitle(title) {
    const { error } = await getSupabase().rpc("set_my_title", { p_title: title });
    if (error) throw failure("대표 칭호 변경");
  },
  async deleteMyAccount() {
    const supabase = getSupabase();
    const { error } = await supabase.rpc("delete_my_account");
    if (error) throw failure("삭제");
    await supabase.auth.signOut({ scope: "local" });
  },
  async stats() {
    const { data, error } = await getSupabase().rpc("plaza_stats");
    if (error || !data) return null;
    const row = data as { total_citizens: number; registered_today: number };
    return { totalCitizens: row.total_citizens, registeredToday: row.registered_today };
  },
};
