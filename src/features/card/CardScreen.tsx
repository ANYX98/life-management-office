"use client";

import Link from "next/link";
import { ErrorNote, LoadingNote, NeedRegistration } from "@/components/ui/StateNotes";
import { useCitizen } from "@/lib/citizen/useCitizen";
import { CitizenShareCard } from "@/features/share/ShareCards";
import { SaveImageButton } from "@/features/share/ShareButtons";
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
        <SaveImageButton card={<CitizenShareCard citizen={citizen} />} filename="인생관리공단-시민증.png" label="시민증 이미지 저장" />
        <Link href="/studio" className="btn btn-primary">증명사진 다시 찍기</Link>
        <Link href="/records" className="btn">내 기록</Link>
        <Link href="/account" className="btn">계정과 내 정보</Link>
        <Link href="/" className="btn">광장으로</Link>
      </div>
      <p className="mx-auto max-w-md text-center text-sm text-ink-soft">
        {citizen.storage === "guest"
          ? "이 시민증은 지금 쓰는 브라우저에만 보관됩니다. 브라우저 기록을 지우면 함께 사라집니다."
          : "이메일을 연결해 두면 다른 기기에서도 이 시민증을 찾을 수 있습니다."}
      </p>
    </div>
  );
}
