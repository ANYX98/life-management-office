"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Character } from "@/components/character/Character";
import { Mascot } from "@/components/mascot/Mascot";
import { ErrorNote, LoadingNote } from "@/components/ui/StateNotes";
import { Turnstile, TURNSTILE_SITE_KEY } from "@/components/ui/Turnstile";
import { CitizenCard } from "@/features/card/CitizenCard";
import { CharacterEditor } from "@/features/editor/CharacterEditor";
import { DEFAULT_CHARACTER, type CharacterConfig } from "@/lib/character/catalog";
import { citizenRepository } from "@/lib/citizen/repository";
import { validateNickname, type Citizen } from "@/lib/citizen/types";
import { notifyCitizenChanged, useCitizen } from "@/lib/citizen/useCitizen";
import { PHOTO_REMARKS } from "@/lib/daily/content";

const STEPS = ["닉네임", "캐릭터", "확인", "시민증", "입장"] as const;

export function RegisterFlow() {
  const { state, reload } = useCitizen();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [character, setCharacter] = useState<CharacterConfig>(DEFAULT_CHARACTER);
  const [agreed, setAgreed] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [issued, setIssued] = useState<Citizen | null>(null);
  const [issuing, setIssuing] = useState(false);
  const [issueError, setIssueError] = useState<string | null>(null);
  const [remark] = useState(() => PHOTO_REMARKS[Math.floor(Math.random() * PHOTO_REMARKS.length)]);

  const alreadyRegistered = state.status === "ready" && !issued;
  useEffect(() => {
    if (alreadyRegistered) router.replace("/card");
  }, [alreadyRegistered, router]);

  if (state.status === "loading" || alreadyRegistered) return <LoadingNote label="등록부를 확인하는 중입니다" />;
  if (state.status === "error") return <ErrorNote message={state.message} onRetry={reload} />;

  // 이미 시민인 경우 등록 화면으로 돌아오지 않게 위에서 처리한다.
  const submitNickname = () => {
    const problem = validateNickname(nickname) ?? (agreed ? null : "안내문을 확인하고 체크해 주세요.");
    setNicknameError(problem);
    if (!problem) setStep(1);
  };

  const issue = async () => {
    setIssuing(true);
    setIssueError(null);
    try {
      setIssued(await citizenRepository.register({ nickname, character, captchaToken }));
      setStep(3);
      notifyCitizenChanged();
    } catch (cause) {
      setIssueError(cause instanceof Error ? cause.message : "발급하지 못했습니다. 다시 시도해 주세요.");
    } finally {
      setIssuing(false);
    }
  };

  return (
    <div className="grid gap-5 pt-1">
      <ol aria-label="등록 단계" className="m-0 flex list-none justify-center gap-1.5 p-0 sm:gap-3">
        {STEPS.map((label, index) => (
          <li key={label} aria-current={index === step ? "step" : undefined} className="grid justify-items-center text-xs">
            <span className={`grid size-8 place-items-center rounded-full border-[2.5px] border-ink font-display ${index < step ? "bg-sage" : index === step ? "bg-mustard" : "bg-sheet"}`}>
              {index + 1}
            </span>
            <span className="mt-0.5 font-display">{label}</span>
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, rotateX: -10, y: -8 }} animate={{ opacity: 1, rotateX: 0, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.22 }}>
          {step === 0 && (
            <form
              className="paper tape mx-auto mt-3 grid max-w-md gap-4 p-6"
              onSubmit={(event) => {
                event.preventDefault();
                submitNickname();
              }}
            >
              <div className="flex items-end gap-2">
                <Mascot size={92} expression="deadpan" pose="document" />
                <p className="bubble flex-1 text-[17px]" style={{ ["--tail-x" as string]: "-4px" }}>
                  공단에서 부를 이름을 적어 주세요. 실명은 받지 않습니다.
                </p>
              </div>
              <h1 className="mt-2 text-2xl">시민 등록 신청서</h1>
              <div>
                <label htmlFor="nickname">닉네임 (2~12자)</label>
                <input
                  id="nickname"
                  className="field"
                  value={nickname}
                  maxLength={12}
                  autoComplete="off"
                  aria-invalid={Boolean(nicknameError)}
                  aria-describedby={nicknameError ? "nickname-error" : undefined}
                  onChange={(event) => {
                    setNickname(event.target.value);
                    setNicknameError(null);
                  }}
                  placeholder="예: 내일부터갓생"
                />
                {nicknameError && <p id="nickname-error" role="alert" className="mt-1 text-sm font-bold text-brick">{nicknameError}</p>}
              </div>
              <div className="rounded-md border-2 border-dashed border-ink/40 p-3 text-sm">
                <p className="font-bold">시작 전에 확인해 주세요</p>
                <ul className="m-0 mt-1 grid gap-1 pl-4">
                  <li>쓴 글은 서버에 저장되고, '나만 보기' 글도 운영자는 볼 수 있습니다.</li>
                  <li>'익명 공개'로 낸 글은 다른 시민이 봅니다. 실명과 연락처는 적지 마세요.</li>
                  <li>이 서비스는 게임이며 상담이나 치료를 대신하지 않습니다. 많이 힘들 때는 109(24시간)에 전화하세요.</li>
                  <li>내 기록은 언제든 직접 삭제할 수 있습니다.</li>
                </ul>
              </div>
              <label className="flex items-start gap-2 text-sm">
                <input id="agree" type="checkbox" className="mt-1.5" checked={agreed} onChange={(event) => { setAgreed(event.target.checked); setNicknameError(null); }} />
                <span>만 14세 이상이며, 위 내용과 <Link href="/privacy" target="_blank" className="text-brick">개인정보 안내</Link>에 동의합니다.</span>
              </label>
              <button type="submit" className="btn btn-primary">다음: 캐릭터 만들기</button>
            </form>
          )}

          {step === 1 && (
            <CharacterEditor
              value={character}
              onChange={setCharacter}
              primaryAction={<button type="button" className="btn btn-primary" onClick={() => setStep(2)}>다음: 사진 확인</button>}
            />
          )}

          {step === 2 && (
            <div className="paper mx-auto grid max-w-md justify-items-center gap-3 p-6 text-center">
              <h1 className="text-2xl">이 사진으로 제출하시겠습니까?</h1>
              <div className="photo-backdrop grid h-72 w-56 place-items-center rounded-md border-[2.5px] border-ink">
                <Character config={character} size={210} title={`${nickname} 시민 캐릭터`} />
              </div>
              <p className="font-display text-xl">{nickname.trim()}</p>
              <p className="font-hand text-lg font-bold">감자 과장님: “{remark}”</p>
              <Turnstile onToken={setCaptchaToken} />
              {issueError && <p role="alert" className="font-bold text-brick">{issueError}</p>}
              <div className="flex flex-wrap justify-center gap-3">
                <button type="button" className="btn" disabled={issuing} onClick={() => setStep(1)}>다시 꾸미기</button>
                <button type="button" className="btn btn-primary" disabled={issuing || (Boolean(TURNSTILE_SITE_KEY) && citizenRepository.socialEnabled && !captchaToken)} onClick={issue}>
                  {issuing ? "도장 찾는 중…" : "시민증 발급받기"}
                </button>
              </div>
            </div>
          )}

          {step === 3 && issued && (
            <div className="grid gap-5 text-center">
              <h1 className="text-[28px]">시민증이 발급되었습니다</h1>
              <CitizenCard citizen={issued} stampAnimated />
              <div>
                <button type="button" className="btn btn-primary" onClick={() => setStep(4)}>공단에 입장하기</button>
              </div>
            </div>
          )}

          {step === 4 && issued && (
            <div className="grid justify-items-center gap-4 py-6 text-center">
              <Mascot size={170} expression="proud" pose="stamp" />
              <h1 className="max-w-md text-[28px]">{issued.nickname} 시민님, 등록되었습니다. 앞으로 잘 안 풀려도 서류는 저희가 씁니다.</h1>
              <button type="button" className="btn btn-primary" onClick={() => router.push("/")}>광장으로 입장</button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
