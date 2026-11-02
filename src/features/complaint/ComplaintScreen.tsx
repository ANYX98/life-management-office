"use client";

import Link from "next/link";
import { useState } from "react";
import { Character } from "@/components/character/Character";
import { Mascot } from "@/components/mascot/Mascot";
import { ErrorNote, LoadingNote, NeedRegistration } from "@/components/ui/StateNotes";
import { citizenRepository } from "@/lib/citizen/repository";
import type { CaseRecord, CaseVisibility, Citizen } from "@/lib/citizen/types";
import { notifyCitizenChanged, useCitizen } from "@/lib/citizen/useCitizen";
import { CATEGORIES, ENERGY_LEVELS, SOCIAL_STATES, STATEMENT_PROMPTS, USELESS_ACTS, type CategoryId } from "@/lib/complaint/content";
import { dailyIndex, useToday } from "@/lib/daily/today";
import { GENTLE_RULE, matchStatement } from "@/lib/complaint/rules";
import { looksLikeSeriousDistress, validateStatement } from "@/lib/complaint/generate";
import { CaseShareActions } from "@/features/share/CaseShareActions";
import { CaseSheet } from "./CaseSheet";

export function ComplaintScreen() {
  const { state, reload } = useCitizen();
  const today = useToday();
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [energy, setEnergy] = useState(2);
  const [uselessAct, setUselessAct] = useState<string | null>(null);
  const [socialState, setSocialState] = useState<string | null>(null);
  const [statement, setStatement] = useState("");
  const [visibility, setVisibility] = useState<CaseVisibility>("private");
  const [problem, setProblem] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [distress, setDistress] = useState(false);
  const [result, setResult] = useState<{ record: CaseRecord; citizen: Citizen; previousCount: number } | null>(null);

  if (state.status === "loading") return <LoadingNote label="접수 창구를 여는 중입니다" />;
  if (state.status === "error") return <ErrorNote message={state.message} onRetry={reload} />;
  if (state.status === "none") return <NeedRegistration />;

  const reset = () => {
    setCategory(null);
    setEnergy(2);
    setUselessAct(null);
    setSocialState(null);
    setStatement("");
    setVisibility("private");
    setResult(null);
    window.scrollTo(0, 0);
  };

  if (distress) {
    return (
      <div role="alert" className="paper mx-auto mt-4 grid max-w-lg gap-3 p-6 sm:p-8">
        <h1 className="text-2xl">이 내용은 공단이 농담으로 처리하지 않겠습니다</h1>
        <p>적어 주신 글에 많이 힘든 마음이 보이는 것 같아, 접수하지 않았고 저장하지도 않았습니다.</p>
        <p>정말 그런 마음이 드신다면 지금 사람과 이야기해 보면 좋겠습니다. <strong>자살예방 상담전화 109</strong>는 24시간 받습니다. 전화가 어렵다면 곁에 있는 사람에게 "오늘 좀 힘들어"라고만 말해도 됩니다.</p>
        <p>지금 바로 위험하다면 <strong>119</strong>에 연락해 주세요.</p>
        <button type="button" className="btn justify-self-start" onClick={() => setDistress(false)}>
          그런 뜻이 아니었어요. 다시 적을게요
        </button>
      </div>
    );
  }

  if (result) return <ResultView result={result} onAgain={reset} />;

  const submit = async () => {
    const resolvedCategory: CategoryId | null = category ?? (statement.trim() ? (matchStatement(statement)?.rule.category ?? "free") : null);
    if (!resolvedCategory) {
      setProblem("진술을 적거나 민원 유형을 하나만 골라 주십시오. 나머지는 대충 넘겨도 됩니다.");
      return;
    }
    if (looksLikeSeriousDistress(statement)) {
      setDistress(true);
      window.scrollTo(0, 0);
      return;
    }
    const statementProblem = validateStatement(statement);
    if (statementProblem) {
      setProblem(statementProblem);
      return;
    }
    setProblem(null);
    setSubmitting(true);
    try {
      const previousCount = state.citizen.caseCount;
      const { record, citizen } = await citizenRepository.submitCase({ category: resolvedCategory, energy, uselessAct, socialState, statement, visibility });
      setResult({ record, citizen, previousCount });
      notifyCitizenChanged();
      window.scrollTo(0, 0);
    } catch (cause) {
      setProblem(cause instanceof Error ? cause.message : "접수하지 못했습니다. 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="mx-auto grid max-w-2xl gap-5 pt-2"
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <div className="flex items-end gap-2">
        <Mascot size={88} pose="document" />
        <p className="bubble flex-1 text-[17px]" style={{ ["--tail-x" as string]: "-4px" }}>
          대충 적으십시오. 대충 처리합니다.
        </p>
      </div>
      <h1 className="text-[28px]">민원 접수실</h1>

      <div>
        <label htmlFor="statement" className="font-display text-lg">{today ? STATEMENT_PROMPTS[dailyIndex(today, "prompt", STATEMENT_PROMPTS.length)] : "오늘 무슨 일 있으셨습니까?"}</label>
        <textarea
          id="statement"
          className="paper mt-2 block min-h-32 w-full p-3 text-base"
          maxLength={200}
          value={statement}
          placeholder="진술란입니다. 길어도, 짧아도, 황당한 일이 아니어도 접수합니다."
          onChange={(event) => { setStatement(event.target.value); setProblem(null); }}
        />
        <p className="mt-1 text-right text-sm text-ink-soft">{statement.length} / 200자. 실명과 연락처는 받지 않습니다.</p>
      </div>

      <p className="font-display text-ink-soft">적기 귀찮으시면 아래 칸에 표시만 하십시오. 안 하셔도 공단은 모릅니다.</p>
      <ChipGroup legend="민원 유형 (담당자도 잘 모릅니다)" options={CATEGORIES.filter((item) => item.id !== "free").map((item) => ({ value: item.id, label: item.label }))} value={category} onChange={(value) => { setCategory(value as CategoryId | null); setProblem(null); }} columns allowClear />
      <ChipGroup legend="잔여 에너지 신고" options={ENERGY_LEVELS.map((item) => ({ value: String(item.value), label: item.label }))} value={String(energy)} onChange={(value) => setEnergy(Number(value))} />
      <ChipGroup legend="금일 비생산 활동 내역 (선택)" options={USELESS_ACTS.map((item) => ({ value: item, label: item }))} value={uselessAct} onChange={setUselessAct} allowClear />
      <ChipGroup legend="사회생활 창구 운영 현황 (선택)" options={SOCIAL_STATES.map((item) => ({ value: item, label: item }))} value={socialState} onChange={setSocialState} allowClear />

      <fieldset className="m-0 border-0 p-0">
        <legend className="p-0 font-display text-lg">이 서류는 어디에 둘까요?</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <label className={`paper flex cursor-pointer gap-2 p-3 ${visibility === "private" ? "bg-mustard" : ""}`}>
            <input type="radio" name="visibility" checked={visibility === "private"} onChange={() => setVisibility("private")} />
            <span><span className="block font-display">나만 보기: 공단 서랍에 보관</span><span className="text-sm">다른 시민에게 보이지 않습니다. 공단은 금방 잊습니다.</span></span>
          </label>
          <label className={`paper flex cursor-pointer gap-2 p-3 ${visibility === "public" ? "bg-mustard" : ""}`}>
            <input type="radio" name="visibility" checked={visibility === "public"} onChange={() => setVisibility("public")} />
            <span><span className="block font-display">익명 공개: 사건기록실 게시판에 부착</span><span className="text-sm">사건기록실에 닉네임과 캐릭터로 표시되고, 적은 내용도 함께 보입니다. 나중에 내 기록에서 비공개로 바꿀 수 있어요.</span></span>
          </label>
        </div>
      </fieldset>

      {problem && <p role="alert" className="font-bold text-brick">{problem}</p>}
      <button type="submit" className="btn btn-primary text-xl" disabled={submitting}>
        {submitting ? "도장 찾는 중…" : "민원 제출"}
      </button>
    </form>
  );
}

function ChipGroup({
  legend, options, value, onChange, columns = false, allowClear = false,
}: {
  legend: string;
  options: { value: string; label: string }[];
  value: string | null;
  onChange: (value: string | null) => void;
  columns?: boolean;
  allowClear?: boolean;
}) {
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="p-0 font-display text-lg">{legend}</legend>
      <div className={columns ? "mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4" : "mt-2 flex flex-wrap gap-2"}>
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(allowClear && selected ? null : option.value)}
              className={`min-h-11 rounded-[12px_15px_11px_16px] border-[2.5px] border-ink px-3 py-1 text-[15px] leading-tight ${selected ? "bg-mustard" : "bg-sheet"}`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function ResultView({ result, onAgain }: { result: { record: CaseRecord; citizen: Citizen; previousCount: number }; onAgain: () => void }) {
  const { record, citizen, previousCount } = result;
  const gentle = record.title === GENTLE_RULE.titles[0];
  return (
    <div className="mx-auto grid max-w-2xl gap-5 pt-2">
      <div className="flex items-end justify-center gap-1">
        <Character config={citizen.character} size={130} title={`${citizen.nickname} 시민 캐릭터`} />
        <Mascot size={118} expression={gentle ? "worried" : "deadpan"} pose={gentle ? "stand" : "stamp"} />
      </div>
      <CaseSheet record={record} fresh />
      {!gentle && <div className="paper p-4">
        <h2 className="text-lg">시민증이 갱신되었습니다</h2>
        <p>누적 사건 {previousCount}건에서 {citizen.caseCount}건으로, 등급은 {citizen.grade}, 대표 칭호는 {citizen.title}입니다.</p>
      </div>}
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/records" className="btn btn-primary">내 기록 보기</Link>
        <Link href="/locker" className="btn">사물함 열기</Link>
        <button type="button" className="btn" onClick={onAgain}>민원 하나 더</button>
      </div>
      {!gentle && <CaseShareActions record={record} citizen={citizen} />}
    </div>
  );
}
