import { sanitizeCharacter } from "@/lib/character/catalog";
import { getSupabase } from "@/lib/supabase/client";
import type { CategoryId } from "@/lib/complaint/content";
import { generateCase } from "@/lib/complaint/generate";
import { isKstMonday } from "@/lib/daily/date";
import type { CaseRecord, CaseVisibility, Citizen, CitizenRepository } from "./types";

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

async function currentUserId(): Promise<string | null> {
  const { data, error } = await getSupabase().auth.getSession();
  if (error) throw new Error("로그인 상태를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.");
  return data.session?.user.id ?? null;
}

function failure(action: string): Error {
  return new Error(`${action}에 실패했습니다. 잠시 후 다시 시도해 주세요.`);
}

/** 로그인 없이 체험할 수 있도록 Supabase 익명 로그인을 쓴다. 영구 계정 연결은 같은 user id를 유지한 채 진행한다. */
export const supabaseRepository: CitizenRepository = {
  mode: "account",
  async load() {
    const userId = await currentUserId();
    if (!userId) return null;
    const { data, error } = await getSupabase().from("citizens").select(COLUMNS).eq("id", userId).maybeSingle();
    if (error) throw failure("시민 정보 불러오기");
    return data ? toCitizen(data as Row) : null;
  },
  async register({ nickname, character }) {
    const supabase = getSupabase();
    let userId = await currentUserId();
    if (!userId) {
      const { data, error } = await supabase.auth.signInAnonymously();
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
  async stats() {
    const { data, error } = await getSupabase().rpc("plaza_stats");
    if (error || !data) return null;
    const row = data as { total_citizens: number; registered_today: number };
    return { totalCitizens: row.total_citizens, registeredToday: row.registered_today };
  },
};
