"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ErrorNote, LoadingNote } from "@/components/ui/StateNotes";
import { Turnstile, TURNSTILE_SITE_KEY } from "@/components/ui/Turnstile";
import { citizenRepository } from "@/lib/citizen/repository";
import { notifyCitizenChanged, useCitizen } from "@/lib/citizen/useCitizen";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AccountScreen() {
  const { state, reload } = useCitizen();
  const [linked, setLinked] = useState<string | null>(null);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    if (state.status === "ready") citizenRepository.linkedEmail().then(setLinked).catch(() => setLinked(null));
  }, [state]);

  // 삭제 직후 시민 상태가 바뀌어도 완료 안내가 사라지지 않게 먼저 처리한다.
  if (deleted) {
    return (
      <section className="paper mx-auto mt-4 max-w-lg p-6" role="status">
        <p className="font-display text-xl">시민증과 모든 기록을 삭제했습니다.</p>
        <Link href="/" className="btn mt-3">광장으로</Link>
      </section>
    );
  }
  if (state.status === "loading") return <LoadingNote label="등록부를 확인하는 중입니다" />;
  if (state.status === "error") return <ErrorNote message={state.message} onRetry={reload} />;

  return (
    <div className="mx-auto grid max-w-lg gap-6 pt-2">
      <h1 className="text-[28px]">계정과 내 정보</h1>
      {!citizenRepository.socialEnabled && <div className="paper p-5">서버가 연결되지 않아 이 브라우저에만 저장됩니다. 계정 연결은 쓸 수 없습니다.</div>}

      {citizenRepository.socialEnabled && state.status === "ready" && (
        linked ? (
          <section className="paper p-5">
            <h2 className="text-xl">이메일 연결됨</h2>
            <p className="mt-1">{linked}</p>
            <p className="mt-1 text-sm text-ink-soft">다른 시민에게는 보이지 않습니다. 다른 기기에서는 아래 주소로 시민증을 찾을 수 있습니다.</p>
          </section>
        ) : (
          <EmailForm
            title="이메일 연결하기"
            description="연결해 두면 브라우저 기록을 지워도, 기기를 바꿔도 이 시민증을 찾을 수 있습니다. 이메일은 다른 시민에게 보이지 않습니다."
            action="확인 메일 보내기"
            done="확인 메일을 보냈습니다. 메일의 링크를 누르면 연결이 끝납니다. 메일함에 없으면 스팸함도 봐 주세요."
            submit={(email) => citizenRepository.linkEmail(email)}
          />
        )
      )}

      {citizenRepository.socialEnabled && (state.status === "none" || (state.status === "ready" && !linked)) && (
        <EmailForm
          title={state.status === "none" ? "내 시민증 찾기" : "다른 시민증 찾기"}
          description={state.status === "none" ? "전에 이메일을 연결했다면 로그인 링크를 보내 드립니다." : "다른 기기에서 쓰던 시민증이 있다면 찾을 수 있습니다. 다만 지금 이 기기의 시민증은 이메일을 연결하지 않으면 다시 찾을 수 없습니다."}
          action="로그인 링크 보내기"
          done="이메일을 연결한 시민증이 있으면 로그인 링크가 갑니다. 메일함을 확인해 주세요."
          withCaptcha
          submit={(email, token) => citizenRepository.sendLoginLink(email, token)}
        />
      )}

      {state.status === "none" && (
        <p className="text-center">처음이시면 <Link href="/register" className="text-brick">시민 등록</Link>부터 하시면 됩니다.</p>
      )}

      {state.status === "ready" && <DeleteSection onDeleted={() => { setDeleted(true); notifyCitizenChanged(); }} />}

      <p className="text-center text-sm"><Link href="/privacy" className="text-ink-soft">개인정보 안내 보기</Link></p>
    </div>
  );
}

function EmailForm({
  title, description, action, done, submit, withCaptcha = false,
}: {
  title: string;
  description: string;
  action: string;
  done: string;
  submit: (email: string, captchaToken?: string | null) => Promise<void>;
  withCaptcha?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [problem, setProblem] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [token, setToken] = useState<string | null>(null);
  const inputId = `email-${action.length}`;

  const send = async () => {
    if (!EMAIL.test(email.trim())) {
      setProblem("이메일 주소를 확인해 주세요.");
      return;
    }
    setProblem(null);
    setStatus("sending");
    try {
      await submit(email, token);
      setStatus("sent");
    } catch (cause) {
      setProblem(cause instanceof Error ? cause.message : "보내지 못했습니다. 다시 시도해 주세요.");
      setStatus("idle");
    }
  };

  return (
    <section className="paper grid gap-3 p-5">
      <h2 className="text-xl">{title}</h2>
      <p className="text-sm">{description}</p>
      {status === "sent" ? (
        <p role="status" className="font-display">{done}</p>
      ) : (
        <form noValidate className="grid gap-3" onSubmit={(event) => { event.preventDefault(); void send(); }}>
          <label htmlFor={inputId} className="text-sm">이메일</label>
          <input id={inputId} type="email" autoComplete="email" className="field" value={email} onChange={(event) => setEmail(event.target.value)} />
          {withCaptcha && <Turnstile onToken={setToken} />}
          {problem && <p role="alert" className="text-sm font-bold text-brick">{problem}</p>}
          <button type="submit" className="btn btn-primary" disabled={status === "sending" || (withCaptcha && Boolean(TURNSTILE_SITE_KEY) && !token)}>
            {status === "sending" ? "보내는 중…" : action}
          </button>
        </form>
      )}
    </section>
  );
}

function DeleteSection({ onDeleted }: { onDeleted: () => void }) {
  const [step, setStep] = useState<"closed" | "confirm" | "working">("closed");
  const [problem, setProblem] = useState<string | null>(null);

  const remove = async () => {
    setStep("working");
    setProblem(null);
    try {
      await citizenRepository.deleteMyAccount();
      onDeleted();
    } catch (cause) {
      setProblem(cause instanceof Error ? cause.message : "삭제하지 못했습니다.");
      setStep("confirm");
    }
  };

  return (
    <section className="grid gap-2">
      {step === "closed" ? (
        <button type="button" className="cursor-pointer justify-self-center border-0 bg-transparent p-2 text-sm text-ink-soft underline" onClick={() => setStep("confirm")}>
          내 시민증과 기록 전부 삭제
        </button>
      ) : (
        <div className="paper grid gap-3 p-5">
          <h2 className="text-xl">정말 삭제할까요?</h2>
          <p className="text-sm">시민증, 사건, 반응, 연결한 이메일이 모두 지워지고 되돌릴 수 없습니다.</p>
          {problem && <p role="alert" className="text-sm font-bold text-brick">{problem}</p>}
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn" disabled={step === "working"} onClick={() => setStep("closed")}>그만두기</button>
            <button type="button" className="btn btn-danger" disabled={step === "working"} onClick={remove}>{step === "working" ? "삭제 중…" : "전부 삭제"}</button>
          </div>
        </div>
      )}
    </section>
  );
}
