"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Character } from "@/components/character/Character";
import { useCitizen } from "@/lib/citizen/useCitizen";
import { Logo } from "./Logo";

export function AppShell({ children }: { children: ReactNode }) {
  const { state } = useCitizen();
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Logo />
        {state.status === "ready" && (
          <Link href="/card" className="flex min-h-11 items-center gap-2 rounded-full border-[2.5px] border-ink bg-sheet py-0.5 pr-4 pl-1 font-display text-ink no-underline">
            <span className="size-9 overflow-hidden rounded-full bg-sage">
              <Character config={state.citizen.character} size={36} crop="face" rough={false} title="내 캐릭터" />
            </span>
            <span className="max-w-24 truncate">{state.citizen.nickname}</span>
          </Link>
        )}
        {state.status === "none" && (
          <Link href="/register" className="btn btn-primary">
            시민 등록
          </Link>
        )}
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-12">{children}</main>
      <footer className="px-4 py-6 text-center text-sm text-ink-soft">
        인생관리공단은 실제 행정기관이 아닙니다. 당신의 인생에 대한 어떤 권한도 없습니다.
      </footer>
    </div>
  );
}
