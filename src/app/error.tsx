"use client";

import { ErrorNote } from "@/components/ui/StateNotes";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return <ErrorNote message="화면을 그리다가 문제가 생겼습니다. 다시 시도해 주세요." onRetry={reset} />;
}
