"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ErrorNote, LoadingNote, NeedRegistration } from "@/components/ui/StateNotes";
import { CaseSheet } from "@/features/complaint/CaseSheet";
import { citizenRepository } from "@/lib/citizen/repository";
import type { CaseRecord } from "@/lib/citizen/types";
import { useCitizen } from "@/lib/citizen/useCitizen";
import { formatKstDate } from "@/lib/daily/date";

type Load = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; cases: CaseRecord[] };

export function RecordsScreen() {
  const { state, reload } = useCitizen();
  const [load, setLoad] = useState<Load>({ status: "loading" });
  const [openId, setOpenId] = useState<string | null>(null);
  const ready = state.status === "ready";

  const fetchCases = () => {
    setLoad({ status: "loading" });
    citizenRepository
      .listCases()
      .then((cases) => setLoad({ status: "ready", cases }))
      .catch((cause) => setLoad({ status: "error", message: cause instanceof Error ? cause.message : "기록을 불러오지 못했습니다." }));
  };

  useEffect(() => {
    if (ready) fetchCases();
  }, [ready]);

  if (state.status === "loading") return <LoadingNote label="기록 창고를 뒤지는 중입니다" />;
  if (state.status === "error") return <ErrorNote message={state.message} onRetry={reload} />;
  if (state.status === "none") return <NeedRegistration />;
  if (load.status === "loading") return <LoadingNote label="기록 창고를 뒤지는 중입니다" />;
  if (load.status === "error") return <ErrorNote message={load.message} onRetry={fetchCases} />;

  const { cases } = load;
  const titles = [...new Set(cases.map((item) => item.awardedTitle).filter((title): title is string => Boolean(title)))];
  const groups = new Map<string, CaseRecord[]>();
  for (const item of cases) {
    const day = formatKstDate(item.createdAt);
    groups.set(day, [...(groups.get(day) ?? []), item]);
  }

  return (
    <div className="mx-auto grid max-w-2xl gap-6 pt-2">
      <h1 className="text-[28px]">{state.citizen.nickname} 시민의 인생 기록실</h1>

      <section>
        <h2 className="text-xl">획득한 칭호 {titles.length}개</h2>
        {titles.length === 0 ? (
          <p className="mt-1">아직 칭호가 없습니다. 민원을 내면 공단이 뭐라도 줍니다.</p>
        ) : (
          <ul className="m-0 mt-2 flex list-none flex-wrap gap-2 p-0">
            {titles.map((title, index) => (
              <li key={title} className={`rounded-lg border-[2.5px] border-ink bg-mustard px-3 font-display ${index % 2 ? "rotate-1" : "-rotate-1"}`}>{title}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid gap-4">
        <h2 className="text-xl">전체 사건 {cases.length}건</h2>
        {cases.length === 0 && (
          <div className="paper grid justify-items-start gap-3 p-6">
            <p>기록이 비어 있습니다. 오늘 뭐 하나쯤은 있었을 겁니다. 없었으면 그것도 접수됩니다.</p>
            <Link href="/complaint" className="btn btn-primary">민원 접수하러 가기</Link>
          </div>
        )}
        {[...groups.entries()].map(([day, items]) => (
          <div key={day} className="grid gap-2">
            <h3 className="font-display text-lg text-ink-soft">{day}</h3>
            {items.map((item) =>
              openId === item.id ? (
                <div key={item.id} className="grid gap-2">
                  <CaseSheet record={item} />
                  <button type="button" className="btn justify-self-end" onClick={() => setOpenId(null)}>접기</button>
                </div>
              ) : (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setOpenId(item.id)}
                  className="flex min-h-14 items-center justify-between gap-3 rounded-[12px_15px_11px_16px] border-[2.5px] border-ink bg-sheet px-4 py-2 text-left"
                >
                  <span className="font-display text-lg">{item.title}</span>
                  <span className="shrink-0 text-sm text-ink-soft">{item.caseNo}</span>
                </button>
              ),
            )}
          </div>
        ))}
      </section>

      <p className="text-center text-sm text-ink-soft">스티커, 특별 처분서, 주간 인생 보고서는 아직 공사 중입니다.</p>
    </div>
  );
}
