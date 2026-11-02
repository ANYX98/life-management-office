import Link from "next/link";
import { Mascot } from "@/components/mascot/Mascot";

export function LoadingNote({ label = "서류를 찾는 중입니다" }: { label?: string }) {
  return (
    <div role="status" className="grid place-items-center gap-3 py-16 text-center">
      <Mascot expression="blink" size={110} />
      <p className="font-hand text-xl font-bold">{label}…</p>
    </div>
  );
}

export function ErrorNote({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="paper mx-auto my-8 grid max-w-md place-items-center gap-3 p-6 text-center">
      <Mascot expression="worried" size={110} />
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry}>
          다시 시도
        </button>
      )}
    </div>
  );
}

export function NeedRegistration() {
  return (
    <div className="paper mx-auto my-8 grid max-w-md place-items-center gap-3 p-6 text-center">
      <Mascot expression="surprised" size={110} />
      <p>아직 등록된 시민이 아닙니다. 등록부에서 귀하를 찾지 못했습니다.</p>
      <Link href="/register" className="btn btn-primary">
        시민 등록하기
      </Link>
    </div>
  );
}
