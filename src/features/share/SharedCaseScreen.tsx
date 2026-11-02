"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Character } from "@/components/character/Character";
import { LoadingNote } from "@/components/ui/StateNotes";
import { CaseBody } from "@/features/complaint/CaseBody";
import { REACTIONS } from "@/lib/archive/reactions";
import { citizenRepository } from "@/lib/citizen/repository";
import type { PublicCase } from "@/lib/citizen/types";
import { useCitizen } from "@/lib/citizen/useCitizen";
import { formatKstDate } from "@/lib/daily/date";
import { writeJson } from "@/lib/storage";
import { SHARE_REF_KEY } from "@/lib/share/ref";

/** 로그인 없이 볼 수 있는 공유 페이지. 공개를 취소한 사건은 보이지 않는다. */
export function SharedCaseScreen({ id }: { id: string }) {
  const { state } = useCitizen();
  const [item, setItem] = useState<PublicCase | null | "loading">("loading");

  useEffect(() => {
    let alive = true;
    citizenRepository
      .getPublicCase(id)
      .then((value) => {
        if (!alive) return;
        setItem(value);
        if (value) {
          writeJson(SHARE_REF_KEY, id);
          void citizenRepository.recordShareEvent("visit", id).catch(() => undefined);
        }
      })
      .catch(() => alive && setItem(null));
    return () => {
      alive = false;
    };
  }, [id]);

  if (item === "loading") return <LoadingNote label="서류를 꺼내는 중입니다" />;

  const cta = state.status === "ready"
    ? <Link href="/archive" className="btn btn-primary">사건기록실 구경하기</Link>
    : <Link href="/register" className="btn btn-primary text-xl">나도 시민증 발급받기</Link>;

  if (!item) {
    return (
      <div className="paper mx-auto mt-4 grid max-w-md justify-items-center gap-3 p-6 text-center">
        <p className="font-display text-xl">볼 수 없는 사건입니다.</p>
        <p>비공개로 바뀌었거나 삭제된 사건입니다.</p>
        {cta}
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-xl gap-5 pt-2">
      <article className="paper p-5">
        <header className="flex items-center gap-3">
          <Character config={item.character} size={72} rough={false} title={`${item.nickname} 시민 캐릭터`} />
          <span>
            <span className="block font-display text-lg">{item.nickname} 시민의 사건</span>
            <span className="block text-sm text-ink-soft">{formatKstDate(item.createdAt)}</span>
          </span>
        </header>
        <h1 className="mt-3 text-[26px]">{item.title}</h1>
        <CaseBody report={item.report} verdict={item.verdict} disposition={item.disposition} />
        {item.awardedTitle && <p className="mt-3">획득 칭호: <span className="font-display text-brick">{item.awardedTitle}</span></p>}
        {REACTIONS.some((reaction) => item.counts[reaction.id]) && (
          <p className="mt-3 text-sm">시민 반응: {REACTIONS.filter((reaction) => item.counts[reaction.id]).map((reaction) => `${reaction.label} ${item.counts[reaction.id]}`).join(", ")}</p>
        )}
      </article>
      <div className="grid justify-items-center gap-2 text-center">
        <p>당신의 인생, 저희가 대신 이해해 드립니다. 아마도요.</p>
        {cta}
      </div>
    </div>
  );
}
