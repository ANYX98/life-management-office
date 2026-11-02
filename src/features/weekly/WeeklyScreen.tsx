"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ErrorNote, LoadingNote, NeedRegistration } from "@/components/ui/StateNotes";
import { SaveImageButton } from "@/features/share/ShareButtons";
import { WeeklyShareCard } from "@/features/share/ShareCards";
import { citizenRepository } from "@/lib/citizen/repository";
import type { CaseRecord } from "@/lib/citizen/types";
import { useCitizen } from "@/lib/citizen/useCitizen";
import { buildWeeklyReport } from "@/lib/weekly/report";
import { WeekStamps } from "./WeeklyParts";

export function WeeklyScreen() {
  const { state, reload } = useCitizen();
  const [cases, setCases] = useState<CaseRecord[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [weeksAgo, setWeeksAgo] = useState(0);
  const ready = state.status === "ready";

  const load = () => {
    setFailed(false);
    citizenRepository.listCases().then(setCases).catch(() => setFailed(true));
  };
  useEffect(() => {
    if (ready) load();
  }, [ready]);

  const report = useMemo(() => (cases ? buildWeeklyReport(cases, new Date(), weeksAgo) : null), [cases, weeksAgo]);

  if (state.status === "loading") return <LoadingNote label="한 주를 정리하는 중입니다" />;
  if (state.status === "error") return <ErrorNote message={state.message} onRetry={reload} />;
  if (state.status === "none") return <NeedRegistration />;
  if (failed) return <ErrorNote message="기록을 불러오지 못했습니다." onRetry={load} />;
  if (!report) return <LoadingNote label="한 주를 정리하는 중입니다" />;

  const { citizen } = state;
  return (
    <div className="mx-auto grid max-w-xl gap-5 pt-2">
      <h1 className="text-[28px]">주간 인생 보고서</h1>
      <div className="flex items-center justify-between gap-2">
        <button type="button" className="btn" onClick={() => setWeeksAgo(weeksAgo + 1)}>이전 주</button>
        <span className="text-center font-display">{report.rangeLabel}</span>
        <button type="button" className="btn" disabled={weeksAgo === 0} onClick={() => setWeeksAgo(weeksAgo - 1)}>다음 주</button>
      </div>

      <article className="paper grid gap-4 p-5">
        <WeekStamps report={report} />
        <div>
          <h2 className="text-sm font-normal text-ink-soft font-official">공단 판정</h2>
          <p className="font-display text-xl leading-snug">{report.verdict}</p>
        </div>
        <div>
          <h2 className="text-sm font-normal text-ink-soft font-official">행정 처분</h2>
          <p className="font-display text-xl leading-snug text-brick">{report.disposition}</p>
        </div>
        {report.total > 0 && (
          <dl className="m-0 grid gap-1 border-t-2 border-dashed border-ink/25 pt-3 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-ink-soft">접수한 날</dt><dd className="m-0">{report.activeDays}일</dd></div>
            {report.topType && <div className="flex justify-between gap-3"><dt className="text-ink-soft">제일 많은 민원</dt><dd className="m-0 text-right">{report.topType}</dd></div>}
            {report.energyLabel && <div className="flex justify-between gap-3"><dt className="text-ink-soft">평균 에너지</dt><dd className="m-0">{report.energyLabel}</dd></div>}
            {report.titles.length > 0 && <div className="flex justify-between gap-3"><dt className="shrink-0 text-ink-soft">받은 칭호</dt><dd className="m-0 text-right">{report.titles.join(", ")}</dd></div>}
          </dl>
        )}
      </article>

      <div className="flex flex-wrap justify-center gap-3">
        {report.total > 0 ? (
          <SaveImageButton card={<WeeklyShareCard report={report} citizen={citizen} />} filename="인생관리공단-주간보고서.png" label="보고서 이미지 저장" />
        ) : weeksAgo === 0 ? (
          <Link href="/complaint" className="btn btn-primary">민원 접수</Link>
        ) : null}
        <Link href="/records" className="btn">내 기록</Link>
      </div>
      <p className="text-center text-xs text-ink-soft">빈칸이 있어도 벌점은 없습니다. 공단은 출석을 안 부릅니다. 이미지에 적은 글은 들어가지 않습니다.</p>
    </div>
  );
}
