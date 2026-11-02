"use client";

import Link from "next/link";
import { useState } from "react";
import { Character } from "@/components/character/Character";
import { REPORT_REASONS, type ReportReason } from "@/lib/archive/reactions";
import { citizenRepository } from "@/lib/citizen/repository";
import type { CaseComment } from "@/lib/citizen/types";
import { looksLikeSeriousDistress, validateStatement } from "@/lib/complaint/generate";

/** 사건에 달린 댓글. 펼칠 때만 불러온다. */
export function CommentSection({ caseId, canAct }: { caseId: string; canAct: boolean }) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<CaseComment[] | "loading" | "error">("loading");
  const [body, setBody] = useState("");
  const [problem, setProblem] = useState<string | null>(null);
  const [distress, setDistress] = useState(false);
  const [busy, setBusy] = useState(false);
  const [reporting, setReporting] = useState<string | null>(null);
  const [reported, setReported] = useState<string[]>([]);

  const load = async () => {
    setComments("loading");
    try {
      setComments(await citizenRepository.listComments(caseId));
    } catch {
      setComments("error");
    }
  };

  const toggle = () => {
    if (!open) void load();
    setOpen(!open);
  };

  const submit = async () => {
    const text = body.trim();
    if (!text) return;
    if (looksLikeSeriousDistress(text)) {
      setDistress(true);
      return;
    }
    const issue = validateStatement(text);
    if (issue) {
      setProblem(issue);
      return;
    }
    setBusy(true);
    setProblem(null);
    try {
      await citizenRepository.addComment(caseId, text);
      setBody("");
      await load();
    } catch (cause) {
      setProblem(cause instanceof Error ? cause.message : "댓글을 남기지 못했습니다.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await citizenRepository.deleteComment(id);
      await load();
    } catch (cause) {
      setProblem(cause instanceof Error ? cause.message : "삭제하지 못했습니다.");
    }
  };

  const report = async (id: string, reason: ReportReason) => {
    try {
      await citizenRepository.reportComment(id, reason);
      setReported([...reported, id]);
      setReporting(null);
    } catch (cause) {
      setProblem(cause instanceof Error ? cause.message : "신고하지 못했습니다.");
    }
  };

  return (
    <div className="mt-3 border-t-2 border-dashed border-ink/25 pt-2">
      <button type="button" aria-expanded={open} className="min-h-10 cursor-pointer border-0 bg-transparent p-1 font-display text-ink underline" onClick={toggle}>
        {open ? "댓글 접기" : "댓글 보기"}
      </button>
      {open && (
        <div className="mt-1 grid gap-3">
          {comments === "loading" && <div className="skeleton h-12" />}
          {comments === "error" && <p className="text-sm">댓글을 가져오지 못했습니다. <button type="button" className="cursor-pointer border-0 bg-transparent p-0 underline" onClick={load}>다시 시도</button></p>}
          {Array.isArray(comments) && comments.length === 0 && <p className="text-sm text-ink-soft">아직 댓글이 없습니다.</p>}
          {Array.isArray(comments) && comments.map((comment) => (
            <div key={comment.id} className="flex gap-2">
              <span className="size-9 shrink-0 overflow-hidden rounded-full border-2 border-ink bg-sage">
                <Character config={comment.character} size={32} crop="face" rough={false} title={`${comment.nickname} 시민`} />
              </span>
              <div className="min-w-0 flex-1 text-[15px]">
                <p className="font-display text-sm">{comment.nickname}</p>
                <p className="whitespace-pre-line">{comment.body}</p>
                <div className="flex gap-3 text-xs text-ink-soft">
                  {comment.canDelete && <button type="button" className="cursor-pointer border-0 bg-transparent p-1 underline" onClick={() => remove(comment.id)}>삭제</button>}
                  {!comment.isMine && canAct && (reported.includes(comment.id)
                    ? <span className="p-1">신고 접수됨</span>
                    : <button type="button" className="cursor-pointer border-0 bg-transparent p-1 underline" onClick={() => setReporting(reporting === comment.id ? null : comment.id)}>신고</button>)}
                </div>
                {reporting === comment.id && (
                  <div className="mt-1 grid gap-1">
                    {REPORT_REASONS.map((reason) => (
                      <button key={reason.id} type="button" className="cursor-pointer rounded-md border-2 border-ink bg-sheet px-2 py-1 text-left text-sm" onClick={() => report(comment.id, reason.id)}>{reason.label}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {distress ? (
            <div role="alert" className="rounded-md border-2 border-ink p-3 text-sm">
              <p>많이 힘든 마음이 보이는 것 같아 댓글을 올리지 않았습니다. 정말 그런 마음이 드신다면 <strong>자살예방 상담전화 109</strong>(24시간)에 전화해 보세요. 지금 위험하다면 <strong>119</strong>에 연락해 주세요.</p>
              <button type="button" className="mt-1 cursor-pointer border-0 bg-transparent p-0 underline" onClick={() => setDistress(false)}>그런 뜻이 아니었어요</button>
            </div>
          ) : canAct ? (
            <form className="grid gap-2" onSubmit={(event) => { event.preventDefault(); void submit(); }}>
              <label htmlFor={`comment-${caseId}`} className="sr-only">댓글</label>
              <textarea id={`comment-${caseId}`} maxLength={100} rows={2} className="w-full rounded-md border-2 border-ink bg-sheet p-2 text-[15px]" placeholder="다른 시민에게 한마디. 사람을 공격하는 글은 신고되면 숨겨집니다." value={body} onChange={(event) => { setBody(event.target.value); setProblem(null); }} />
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-ink-soft">{body.length} / 100자</span>
                <button type="submit" className="btn min-h-10 px-3 text-[15px]" disabled={busy || !body.trim()}>{busy ? "남기는 중…" : "댓글 남기기"}</button>
              </div>
            </form>
          ) : (
            <p className="text-sm">댓글은 시민만 쓸 수 있습니다. <Link href="/register" className="text-brick">시민 등록</Link></p>
          )}
          {problem && <p role="alert" className="text-sm font-bold text-brick">{problem}</p>}
        </div>
      )}
    </div>
  );
}
