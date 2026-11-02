"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Character } from "@/components/character/Character";
import { ErrorNote, LoadingNote } from "@/components/ui/StateNotes";
import { CommentSection } from "@/features/comments/CommentSection";
import { CaseBody } from "@/features/complaint/CaseBody";
import { REACTIONS, REPORT_REASONS, type ArchiveSort, type ReactionKind, type ReportReason } from "@/lib/archive/reactions";
import { citizenRepository } from "@/lib/citizen/repository";
import type { PublicCase } from "@/lib/citizen/types";
import { useCitizen } from "@/lib/citizen/useCitizen";
import { formatKstDate } from "@/lib/daily/date";
import { readJson, writeJson } from "@/lib/storage";

const SORTS: { id: ArchiveSort; label: string }[] = [
  { id: "latest", label: "최신 사건" },
  { id: "most_reacted", label: "반응 많은 사건" },
  { id: "random", label: "아무 사건" },
];
const HIDDEN_KEY = "lmo.hiddenCases.v1";
const PAGE = 20;

export function ArchiveScreen() {
  const { state } = useCitizen();
  const [sort, setSort] = useState<ArchiveSort>("latest");
  const [cases, setCases] = useState<PublicCase[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);

  const load = useCallback(async (nextSort: ArchiveSort) => {
    setStatus("loading");
    try {
      const rows = await citizenRepository.listPublicCases(nextSort, 0);
      setCases(rows);
      setHasMore(rows.length === PAGE);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    setHiddenIds(readJson<string[]>(HIDDEN_KEY) ?? []);
    void load("latest");
  }, [load]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const rows = await citizenRepository.listPublicCases(sort, cases.length);
      setCases((current) => [...current, ...rows.filter((row) => !current.some((item) => item.id === row.id))]);
      setHasMore(rows.length === PAGE);
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const hide = (id: string) => {
    const next = [...hiddenIds, id];
    setHiddenIds(next);
    writeJson(HIDDEN_KEY, next);
  };

  const canAct = state.status === "ready";
  const visible = cases.filter((item) => !hiddenIds.includes(item.id));

  return (
    <div className="mx-auto grid max-w-2xl gap-5 pt-2">
      <div>
        <h1 className="text-[28px]">시민 사건기록실</h1>
        <p>다른 시민이 공개한 사건입니다. 실명과 연락처는 받지 않습니다.</p>
      </div>

      {!citizenRepository.socialEnabled ? (
        <div className="paper p-6">서버가 연결되지 않아 다른 시민의 사건을 볼 수 없습니다.</div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="사건 정렬">
            {SORTS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={sort === item.id}
                onClick={() => {
                  setSort(item.id);
                  void load(item.id);
                }}
                className={`min-h-11 rounded-[12px_14px_4px_4px] border-[2.5px] border-ink px-3.5 font-display ${sort === item.id ? "bg-mustard" : "bg-sheet"}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {status === "loading" && <LoadingNote label="기록실 서류를 꺼내는 중입니다" />}
          {status === "error" && <ErrorNote message="기록실 서류를 가져오지 못했습니다." onRetry={() => load(sort)} />}
          {status === "ready" && visible.length === 0 && (
            <div className="paper grid justify-items-start gap-3 p-6">
              <p>공개된 사건이 없습니다. 첫 사건은 진짜 시민의 것이어야 합니다. 귀하일 수도 있습니다.</p>
              <Link href={canAct ? "/complaint" : "/register"} className="btn btn-primary">{canAct ? "민원 내러 가기" : "시민 등록하기"}</Link>
            </div>
          )}

          {status === "ready" && visible.map((item) => (
            <PublicCaseCard key={item.id} item={item} canAct={canAct} onHide={() => hide(item.id)} />
          ))}

          {status === "ready" && sort === "random" && visible.length > 0 && (
            <button type="button" className="btn justify-self-center" onClick={() => load("random")}>다른 사건 뽑기</button>
          )}
          {status === "ready" && sort !== "random" && hasMore && (
            <button type="button" className="btn justify-self-center" disabled={loadingMore} onClick={loadMore}>
              {loadingMore ? "서류 꺼내는 중…" : "더 보기"}
            </button>
          )}
        </>
      )}
    </div>
  );
}

function PublicCaseCard({ item, canAct, onHide }: { item: PublicCase; canAct: boolean; onHide: () => void }) {
  const [counts, setCounts] = useState(item.counts);
  const [mine, setMine] = useState<ReactionKind[]>(item.mine);
  const [problem, setProblem] = useState<string | null>(null);
  const [panel, setPanel] = useState<"none" | "report" | "reported">("none");

  const toggle = async (kind: ReactionKind) => {
    if (!canAct) {
      setProblem("반응을 남기려면 시민 등록이 필요합니다.");
      return;
    }
    const on = !mine.includes(kind);
    const before = { counts, mine };
    setProblem(null);
    setMine(on ? [...mine, kind] : mine.filter((value) => value !== kind));
    setCounts({ ...counts, [kind]: Math.max((counts[kind] ?? 0) + (on ? 1 : -1), 0) });
    try {
      await citizenRepository.setReaction(item.id, kind, on);
    } catch (cause) {
      setCounts(before.counts);
      setMine(before.mine);
      setProblem(cause instanceof Error ? cause.message : "반응을 남기지 못했습니다.");
    }
  };

  const report = async (reason: ReportReason) => {
    try {
      await citizenRepository.reportCase(item.id, reason);
      setPanel("reported");
    } catch (cause) {
      setProblem(cause instanceof Error ? cause.message : "신고하지 못했습니다.");
    }
  };

  return (
    <article className="paper p-5">
      <header className="flex items-center gap-3">
        <span className="size-12 shrink-0 overflow-hidden rounded-full border-[2.5px] border-ink bg-sage">
          <Character config={item.character} size={44} crop="face" rough={false} title={`${item.nickname} 시민 캐릭터`} />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-display text-lg">{item.nickname} 시민{item.isMine ? " (내 사건)" : ""}</span>
          <span className="block text-sm text-ink-soft">{formatKstDate(item.createdAt)}</span>
        </span>
      </header>
      <h2 className="mt-3 text-[23px]">{item.title}</h2>
      <CaseBody report={item.report} verdict={item.verdict} disposition={item.disposition} />
      {item.awardedTitle && <p className="mt-2">획득 칭호: <span className="font-display text-brick">{item.awardedTitle}</span></p>}

      <div className="mt-4 flex flex-wrap gap-2">
        {REACTIONS.map((reaction) => {
          const pressed = mine.includes(reaction.id);
          return (
            <button
              key={reaction.id}
              type="button"
              aria-pressed={pressed}
              onClick={() => toggle(reaction.id)}
              className={`min-h-10 rounded-full border-[2.5px] border-ink px-3 text-[14px] ${pressed ? "bg-mustard" : "bg-sheet"}`}
            >
              {reaction.label}
              {counts[reaction.id] ? <span className="ml-1 font-display">{counts[reaction.id]}</span> : null}
            </button>
          );
        })}
      </div>
      {problem && (
        <p role="alert" className="mt-2 text-sm font-bold text-brick">
          {problem} {!canAct && <Link href="/register" className="text-brick">등록하러 가기</Link>}
        </p>
      )}

      <CommentSection caseId={item.id} canAct={canAct} />

      {!item.isMine && (
        <div className="mt-3 flex flex-wrap items-center justify-end gap-3 text-sm">
          {panel === "reported" ? (
            <span>신고가 접수되었습니다. 이 사건은 내 화면에서 숨길 수 있어요.</span>
          ) : (
            <button type="button" className="cursor-pointer border-0 bg-transparent p-1 text-ink-soft underline" onClick={() => (canAct ? setPanel(panel === "report" ? "none" : "report") : setProblem("신고하려면 시민 등록이 필요합니다."))}>
              신고
            </button>
          )}
          <button type="button" className="cursor-pointer border-0 bg-transparent p-1 text-ink-soft underline" onClick={onHide}>이 사건 숨기기</button>
        </div>
      )}
      {panel === "report" && (
        <div className="mt-2 grid gap-2 border-t-2 border-dashed border-ink/30 pt-3">
          <p className="font-display">어떤 문제가 있나요?</p>
          {REPORT_REASONS.map((reason) => (
            <button key={reason.id} type="button" className="btn justify-start text-left text-[15px]" onClick={() => report(reason.id)}>{reason.label}</button>
          ))}
        </div>
      )}
    </article>
  );
}
