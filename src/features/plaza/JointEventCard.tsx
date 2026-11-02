"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { citizenRepository } from "@/lib/citizen/repository";
import type { JointEvent, JointResult } from "@/lib/citizen/types";

/** 이번 주 공동 사건. 숫자는 실제 표만 보여 준다. */
export function JointEventCard({ canVote }: { canVote: boolean }) {
  const [event, setEvent] = useState<JointEvent | null | "loading" | "error">("loading");
  const [last, setLast] = useState<JointResult | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    citizenRepository.currentJoint().then((value) => alive && setEvent(value)).catch(() => alive && setEvent("error"));
    citizenRepository.lastJointResult().then((value) => alive && setLast(value)).catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [canVote]);

  if (event === "loading") return <div className="skeleton h-48" />;
  if (event === "error" || !event) {
    return (
      <section className="paper p-6">
        <h2 className="text-2xl">이번 주 공동 사건</h2>
        <p className="mt-1">안건을 가져오지 못했습니다. 잠시 후 다시 열어 주세요.</p>
      </section>
    );
  }

  const total = event.options.reduce((sum, option) => sum + (event.counts[option.id] ?? 0), 0);

  const vote = async (optionId: string) => {
    setBusy(true);
    setProblem(null);
    try {
      await citizenRepository.voteJoint(optionId);
      setEvent({ ...event, myChoice: optionId, counts: { ...event.counts, [optionId]: (event.counts[optionId] ?? 0) + 1 } });
    } catch (cause) {
      setProblem(cause instanceof Error ? cause.message : "투표하지 못했습니다.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="paper p-6">
      <p className="text-sm text-ink-soft">이번 주 공동 사건</p>
      <h2 className="text-[26px]">{event.title}</h2>
      <p className="mt-1">{event.description}</p>

      {event.myChoice ? (
        <div className="mt-4 grid gap-2">
          {event.options.map((option) => {
            const count = event.counts[option.id] ?? 0;
            const percent = total ? Math.round((count / total) * 100) : 0;
            return (
              <div key={option.id} className="relative overflow-hidden rounded-[10px] border-[2.5px] border-ink bg-sheet px-3 py-2">
                <span className="absolute inset-y-0 left-0 bg-mustard/70" style={{ width: `${percent}%` }} aria-hidden />
                <span className="relative flex justify-between gap-3">
                  <span className={option.id === event.myChoice ? "font-display" : ""}>{option.label}{option.id === event.myChoice ? " (내 표)" : ""}</span>
                  <span className="shrink-0 font-display">{count}표</span>
                </span>
              </div>
            );
          })}
          <p className="text-sm">접수했습니다. 칭호 <span className="font-display text-brick">{event.rewardTitle}</span>은 사물함에 넣어 두었습니다. 결과는 다음 주 광장에 붙입니다.</p>
        </div>
      ) : canVote ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {event.options.map((option) => (
            <button key={option.id} type="button" className="btn" disabled={busy} onClick={() => vote(option.id)}>{option.label}</button>
          ))}
        </div>
      ) : (
        <div className="mt-3 grid justify-items-start gap-2">
          <p className="text-sm">지금까지 {total}표가 들어왔습니다. 투표는 시민만 할 수 있습니다.</p>
          <Link href="/register" className="btn btn-primary">시민 등록하고 투표하기</Link>
        </div>
      )}
      {problem && <p role="alert" className="mt-2 text-sm font-bold text-brick">{problem}</p>}

      {last && (
        <p className="mt-4 border-t-2 border-dashed border-ink/25 pt-3 text-sm">
          지난주 '{last.title}' 결과 ({last.total}표): {last.total > 0 && last.notice ? last.notice : "아무도 투표하지 않았습니다. 네, 그렇군요."}
        </p>
      )}
    </section>
  );
}
