"use client";

import { useSyncExternalStore } from "react";

/** 공단의 하루는 한국 시간 자정에 바뀐다. 예: "2026-11-02" */
export function kstDateKey(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

const noop = () => () => {};

/** 정적 빌드 날짜가 화면에 박히지 않도록 서버 렌더링에서는 null을 돌려준다. */
export function useToday(): string | null {
  return useSyncExternalStore(noop, () => kstDateKey(), () => null);
}

/** 날짜와 사용자 값으로 항상 같은 번호를 뽑는다. 하루 동안 내용이 유지되고 사람마다 달라진다. */
export function dailyIndex(dateKey: string, salt: string, length: number): number {
  let hash = 2166136261;
  for (const char of `${dateKey}:${salt}`) {
    hash ^= char.codePointAt(0)!;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % length;
}

export function formatKoreanDate(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  return `${year}년 ${month}월 ${day}일`;
}
