import { sanitizeCharacter } from "@/lib/character/catalog";
import { readJson, writeJson } from "@/lib/storage";
import { CITIZEN_TYPES, INITIAL_GRADE, INITIAL_TITLE, type CaseRecord, type Citizen, type CitizenRepository } from "./types";
import { generateCase, gradeFor } from "@/lib/complaint/generate";
import { isKstMonday } from "@/lib/daily/date";

const KEY = "lmo.citizen.v1";
const CASES_KEY = "lmo.cases.v1";

function readCases(): CaseRecord[] {
  const saved = readJson<CaseRecord[]>(CASES_KEY);
  return Array.isArray(saved) ? saved.filter((item) => item && typeof item.id === "string" && typeof item.title === "string") : [];
}

function read(): Citizen | null {
  const saved = readJson<Partial<Citizen>>(KEY);
  if (!saved || typeof saved.id !== "string" || typeof saved.nickname !== "string") return null;
  return {
    id: saved.id,
    citizenNo: saved.citizenNo ?? "임시-0000",
    nickname: saved.nickname,
    character: sanitizeCharacter(saved.character),
    citizenType: saved.citizenType ?? CITIZEN_TYPES[0],
    grade: saved.grade ?? INITIAL_GRADE,
    title: saved.title ?? INITIAL_TITLE,
    caseCount: saved.caseCount ?? 0,
    issuedAt: saved.issuedAt ?? new Date().toISOString(),
    storage: "guest",
  };
}

function save(citizen: Citizen): Citizen {
  if (!writeJson(KEY, citizen)) {
    throw new Error("이 브라우저에 저장할 수 없습니다. 사생활 보호 모드인지 확인해 주세요.");
  }
  return citizen;
}

export const guestRepository: CitizenRepository = {
  mode: "guest",
  async load() {
    return read();
  },
  async register({ nickname, character }) {
    const digits = () => Math.floor(1000 + Math.random() * 9000);
    return save({
      id: crypto.randomUUID(),
      citizenNo: `임시-${digits()}-${digits()}`,
      nickname: nickname.trim(),
      character: sanitizeCharacter(character),
      citizenType: CITIZEN_TYPES[Math.floor(Math.random() * CITIZEN_TYPES.length)],
      grade: INITIAL_GRADE,
      title: INITIAL_TITLE,
      caseCount: 0,
      issuedAt: new Date().toISOString(),
      storage: "guest",
    });
  },
  async updateCharacter(character) {
    const current = read();
    if (!current) throw new Error("등록된 시민 정보를 찾지 못했습니다. 시민 등록을 먼저 해 주세요.");
    return save({ ...current, character: sanitizeCharacter(character) });
  },
  async listCases() {
    return readCases();
  },
  async submitCase(input) {
    const current = read();
    if (!current) throw new Error("등록된 시민 정보를 찾지 못했습니다. 시민 등록을 먼저 해 주세요.");
    const history = readCases();
    const now = new Date();
    const record: CaseRecord = {
      id: crypto.randomUUID(),
      caseNo: `임시 민원 ${String(history.length + 1).padStart(4, "0")}호`,
      createdAt: now.toISOString(),
      category: input.category,
      energy: input.energy,
      statement: input.statement.trim(),
      visibility: input.visibility,
      ...generateCase(input, history, { isMonday: isKstMonday(now) }),
    };
    if (!writeJson(CASES_KEY, [record, ...history])) {
      throw new Error("이 브라우저에 저장할 수 없습니다. 저장 공간이나 사생활 보호 모드를 확인해 주세요.");
    }
    const caseCount = history.length + 1;
    const citizen = save({ ...current, caseCount, grade: gradeFor(caseCount), title: record.awardedTitle ?? current.title });
    return { record, citizen };
  },
  async stats() {
    return null; // 게스트 모드에는 집계할 전체 시민 데이터가 없다.
  },
};
