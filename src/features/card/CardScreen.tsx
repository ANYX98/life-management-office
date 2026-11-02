"use client";

import Link from "next/link";
import { ErrorNote, LoadingNote, NeedRegistration } from "@/components/ui/StateNotes";
import { useCitizen } from "@/lib/citizen/useCitizen";
import { CitizenCard } from "./CitizenCard";

export function CardScreen() {
  const { state, reload } = useCitizen();
  if (state.status === "loading") return <LoadingNote label="시민증을 찾는 중입니다" />;
  if (state.status === "error") return <ErrorNote message={state.message} onRetry={reload} />;
  if (state.status === "none") return <NeedRegistration />;

  const { citizen } = state;
  return (
    <div className="grid gap-6 pt-2">
      <h1 className="text-center text-3xl">내 시민증</h1>
      <CitizenCard citizen={citizen} />
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/studio" className="btn btn-primary">증명사진 다시 찍기</Link>
        <Link href="/records" className="btn">내 기록</Link>
        <Link href="/" className="btn">광장으로</Link>
      </div>
      <p className="mx-auto max-w-md text-center text-sm text-ink-soft">
        {citizen.storage === "guest"
          ? "이 시민증은 지금 쓰는 브라우저에만 보관됩니다. 브라우저 기록을 지우면 함께 사라집니다."
          : "이 시민증은 임시 계정에 저장되어 있습니다. 계정 연결 기능은 다음 단계에서 열립니다."}
        {" "}이미지 저장과 공유는 5단계에서 열립니다.
      </p>
    </div>
  );
}
