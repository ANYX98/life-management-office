"use client";

import { useRef, useState, type ReactNode } from "react";
import { captureCard, shareOrDownload } from "@/lib/share/image";

/** card는 화면 밖에 그려 두고, 누를 때 PNG로 찍는다. */
export function SaveImageButton({ card, filename, label = "이미지 저장" }: { card: ReactNode; filename: string; label?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "working" | "saved" | "error">("idle");

  const save = async () => {
    if (!box.current) return;
    setStatus("working");
    try {
      const result = await shareOrDownload(await captureCard(box.current), filename);
      setStatus(result === "saved" ? "saved" : "idle");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <button type="button" className="btn" disabled={status === "working"} onClick={save}>
        {status === "working" ? "찍는 중…" : status === "saved" ? "저장했습니다" : status === "error" ? "실패. 다시 저장" : label}
      </button>
      <div aria-hidden style={{ position: "fixed", left: -10000, top: 0, pointerEvents: "none" }}>
        <div ref={box} data-share-card>{card}</div>
      </div>
    </>
  );
}

export function CopyLinkButton({ path, label = "공유 링크 복사" }: { path: string; label?: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "manual">("idle");
  const url = typeof window === "undefined" ? path : `${window.location.origin}${path}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch {
      setStatus("manual");
    }
  };

  return (
    <>
      <button type="button" className="btn" onClick={copy}>{status === "copied" ? "복사했습니다" : label}</button>
      {status === "manual" && <input readOnly aria-label="공유 링크" className="field w-full text-sm" value={url} onFocus={(event) => event.target.select()} />}
    </>
  );
}
