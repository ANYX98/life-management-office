"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Character } from "@/components/character/Character";
import { ErrorNote, LoadingNote, NeedRegistration } from "@/components/ui/StateNotes";
import { isUnlocked, SPECIAL_ITEMS, type CharacterConfig } from "@/lib/character/catalog";
import { citizenRepository } from "@/lib/citizen/repository";
import { INITIAL_TITLE, type CaseRecord, type Citizen } from "@/lib/citizen/types";
import { notifyCitizenChanged, useCitizen } from "@/lib/citizen/useCitizen";
import { STICKERS } from "@/lib/locker/stickers";

export function LockerScreen() {
  const { state, reload } = useCitizen();
  const [cases, setCases] = useState<CaseRecord[] | null>(null);
  const [failed, setFailed] = useState(false);
  const ready = state.status === "ready";

  const load = () => {
    setFailed(false);
    citizenRepository.listCases().then(setCases).catch(() => setFailed(true));
  };
  useEffect(() => {
    if (ready) load();
  }, [ready]);

  if (state.status === "loading") return <LoadingNote label="사물함을 여는 중입니다" />;
  if (state.status === "error") return <ErrorNote message={state.message} onRetry={reload} />;
  if (state.status === "none") return <NeedRegistration />;
  if (failed) return <ErrorNote message="사물함을 열지 못했습니다." onRetry={load} />;
  if (!cases) return <LoadingNote label="사물함을 여는 중입니다" />;

  return <Locker citizen={state.citizen} cases={cases} />;
}

function Locker({ citizen, cases }: { citizen: Citizen; cases: CaseRecord[] }) {
  const [character, setCharacter] = useState(citizen.character);
  const [title, setTitle] = useState(citizen.title);
  const [problem, setProblem] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const count = cases.length;
  const earnedStickers = STICKERS.filter((sticker) => sticker.earned(cases)).length;
  const titles = [...new Set([INITIAL_TITLE, ...cases.map((item) => item.awardedTitle).filter((value): value is string => Boolean(value))])];

  const run = async (work: () => Promise<void>) => {
    setBusy(true);
    setProblem(null);
    try {
      await work();
      notifyCitizenChanged();
    } catch (cause) {
      setProblem(cause instanceof Error ? cause.message : "저장하지 못했습니다.");
    } finally {
      setBusy(false);
    }
  };

  const toggleItem = (part: string, id: string) =>
    run(async () => {
      const current = (character as unknown as Record<string, string>)[part];
      const next = { ...character, [part]: current === id ? "none" : id } as CharacterConfig;
      await citizenRepository.updateCharacter(next);
      setCharacter(next);
    });

  const chooseTitle = (value: string) =>
    run(async () => {
      await citizenRepository.setTitle(value);
      setTitle(value);
    });

  return (
    <div className="mx-auto grid max-w-2xl gap-7 pt-2">
      <div className="flex items-center gap-3">
        <span className="photo-backdrop shrink-0 rounded-md border-[2.5px] border-ink p-1"><Character config={character} size={92} title="내 캐릭터" /></span>
        <div className="min-w-0">
          <h1 className="text-[28px]">공단 사물함</h1>
          <p className="text-sm">누적 민원 {count}건. 접속을 안 해도 사라지는 물건은 없습니다.</p>
        </div>
      </div>
      {problem && <p role="alert" className="font-bold text-brick">{problem}</p>}

      <section>
        <h2 className="text-xl">특별 아이템</h2>
        <p className="mb-2 text-sm text-ink-soft">민원을 내면 열립니다. 일반 파츠는 <Link href="/studio" className="text-brick">증명사진 촬영실</Link>에서 전부 무료입니다.</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SPECIAL_ITEMS.map((item) => {
            const open = isUnlocked(item.part, item.id, count);
            const worn = (character as unknown as Record<string, string>)[item.part] === item.id;
            const preview = { ...character, [item.part]: item.id } as CharacterConfig;
            return (
              <div key={item.id} className={`rounded-[12px_15px_11px_16px] border-[2.5px] border-ink p-2 text-center ${worn ? "bg-mustard" : "bg-sheet"}`}>
                <div className={open ? "" : "opacity-35 grayscale"}><Character config={preview} size={92} rough={false} className="mx-auto" title={item.label} /></div>
                <p className="font-display">{item.label}</p>
                {open ? (
                  <button type="button" className="btn mt-1 min-h-9 w-full px-2 text-[15px]" disabled={busy} onClick={() => toggleItem(item.part, item.id)}>{worn ? "벗기" : "장착"}</button>
                ) : (
                  <p className="mt-1 text-sm text-ink-soft">민원 {item.needCases - count}건 더</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-xl">대표 칭호</h2>
        <p className="mb-2 text-sm text-ink-soft">시민증에 올라갈 칭호를 고르십시오.</p>
        <div className="flex flex-wrap gap-2">
          {titles.map((value) => (
            <button key={value} type="button" aria-pressed={title === value} disabled={busy} onClick={() => chooseTitle(value)} className={`min-h-10 rounded-lg border-[2.5px] border-ink px-3 font-display ${title === value ? "bg-mustard" : "bg-sheet"}`}>
              {value}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl">스티커 {earnedStickers} / {STICKERS.length}</h2>
        <ul className="m-0 mt-2 grid list-none grid-cols-3 gap-3 p-0 sm:grid-cols-4">
          {STICKERS.map((sticker, index) => {
            const earned = sticker.earned(cases);
            return (
              <li key={sticker.id} className="grid justify-items-center gap-1 text-center">
                <span
                  className={`grid size-20 place-items-center rounded-full p-1 font-display text-[14px] leading-tight ${earned ? "border-[3px] border-ink shadow-[0_3px_0_var(--color-ink)]" : "border-2 border-dashed border-ink/35 text-ink-soft"}`}
                  style={{ background: earned ? sticker.color : "transparent", rotate: `${index % 2 ? 5 : -5}deg`, color: earned && sticker.color === "#A94C40" ? "#FFFBF2" : undefined }}
                >
                  {earned ? sticker.label : "?"}
                </span>
                <span className="text-xs text-ink-soft">{sticker.hint}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
