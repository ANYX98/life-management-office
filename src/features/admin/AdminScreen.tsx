"use client";

import { useCallback, useEffect, useState } from "react";
import { ErrorNote, LoadingNote } from "@/components/ui/StateNotes";
import { REPORT_REASONS } from "@/lib/archive/reactions";
import { citizenRepository } from "@/lib/citizen/repository";
import type { AdminOverview, AdminReport } from "@/lib/citizen/types";
import { formatKstDate } from "@/lib/daily/date";

const STATS: { key: keyof AdminOverview; label: string }[] = [
  { key: "citizens", label: "시민" },
  { key: "cases", label: "사건" },
  { key: "public_cases", label: "공개 사건" },
  { key: "hidden_cases", label: "숨겨진 사건" },
  { key: "comments", label: "댓글" },
  { key: "reactions", label: "반응" },
  { key: "share_visits", label: "공유 링크 방문" },
  { key: "share_signups", label: "공유 후 등록" },
  { key: "joint_votes_this_week", label: "이번 주 투표" },
];

const reasonLabel = (id: string) => REPORT_REASONS.find((reason) => reason.id === id)?.label ?? id;

/** 운영자 전용. 권한은 화면이 아니라 DB 함수가 확인한다. */
export function AdminScreen() {
  const [status, setStatus] = useState<"loading" | "denied" | "error" | "ready">("loading");
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      if (!(await citizenRepository.isAdmin())) {
        setStatus("denied");
        return;
      }
      const [nextOverview, nextReports] = await Promise.all([citizenRepository.adminOverview(), citizenRepository.adminReports()]);
      setOverview(nextOverview);
      setReports(nextReports);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (status === "loading") return <LoadingNote label="운영자 서랍을 여는 중입니다" />;
  if (status === "error") return <ErrorNote message="운영 정보를 불러오지 못했습니다." onRetry={load} />;
  if (status === "denied") return <div className="paper mx-auto mt-4 max-w-md p-6 text-center">운영자만 들어올 수 있는 창구입니다.</div>;

  const act = async (item: AdminReport, hidden: boolean) => {
    setBusy(true);
    setProblem(null);
    try {
      await citizenRepository.adminSetHidden(item.kind, item.targetId, hidden);
      await load();
    } catch (cause) {
      setProblem(cause instanceof Error ? cause.message : "처리하지 못했습니다.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-2xl gap-6 pt-2">
      <h1 className="text-[28px]">운영자 창구</h1>
      {overview && (
        <dl className="paper m-0 grid grid-cols-3 gap-3 p-4">
          {STATS.map((stat) => (
            <div key={stat.key} className="text-center">
              <dd className="m-0 font-display text-2xl">{overview[stat.key]}</dd>
              <dt className="text-xs text-ink-soft">{stat.label}</dt>
            </div>
          ))}
        </dl>
      )}
      <section className="grid gap-3">
        <h2 className="text-xl">신고된 글 {reports.length}건</h2>
        {problem && <p role="alert" className="font-bold text-brick">{problem}</p>}
        {reports.length === 0 && <div className="paper p-5">처리할 신고가 없습니다. 네, 다행입니다.</div>}
        {reports.map((item) => (
          <article key={`${item.kind}${item.targetId}`} className="paper grid gap-2 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg">{item.label}</h3>
              <span className={`rounded-md border-2 px-2 text-sm ${item.hidden ? "border-brick text-brick" : "border-ink"}`}>{item.hidden ? "숨김" : "공개 중"}</span>
            </div>
            <p className="text-sm text-ink-soft">{item.nickname} 시민 / 신고 {item.reports}건 / {formatKstDate(item.lastAt)}</p>
            <p className="whitespace-pre-line">{item.body}</p>
            <p className="text-sm">사유: {item.reasons.map(reasonLabel).join(", ")}</p>
            <div className="flex flex-wrap gap-2">
              {!item.hidden && <button type="button" className="btn btn-danger min-h-10" disabled={busy} onClick={() => act(item, true)}>숨기기</button>}
              <button type="button" className="btn min-h-10" disabled={busy} onClick={() => act(item, false)}>{item.hidden ? "복구하고 신고 지우기" : "문제없음, 신고 지우기"}</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
