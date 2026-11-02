"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Character } from "@/components/character/Character";
import { Mascot, type MascotExpression } from "@/components/mascot/Mascot";
import { citizenRepository } from "@/lib/citizen/repository";
import type { Citizen, PlazaStats, PublicCase } from "@/lib/citizen/types";
import { useCitizen } from "@/lib/citizen/useCitizen";
import { MASCOT_LINES_CITIZEN, MASCOT_LINES_GUEST, MASCOT_POKE_LINES, NOTICES } from "@/lib/daily/content";
import { dailyIndex, formatKoreanDate, useToday } from "@/lib/daily/today";
import { DailyIncident } from "./DailyIncident";
import { JointEventCard } from "./JointEventCard";

const POKE_EXPRESSIONS: MascotExpression[] = ["deadpan", "worried", "surprised", "blink"];

export function PlazaScreen() {
  const { state } = useCitizen();
  const today = useToday();
  const citizen = state.status === "ready" ? state.citizen : null;

  return (
    <div className="grid gap-12">
      <CounterHero citizen={citizen} isLoading={state.status === "loading"} />
      <div className="grid gap-x-8 gap-y-14 md:grid-cols-[1fr_1.15fr]">
        <Notice today={today} />
        {today ? <DailyIncident today={today} seed={citizen?.id ?? "guest"} /> : <div className="skeleton h-72" />}
      </div>
      {citizenRepository.socialEnabled && <JointEventCard canVote={Boolean(citizen)} />}
      <div className="grid items-start gap-8 md:grid-cols-[1.15fr_1fr]">
        <RecordsPreview />
        <StatsSheet />
      </div>
      <FacilityMap />
    </div>
  );
}

function CounterHero({ citizen, isLoading }: { citizen: Citizen | null; isLoading: boolean }) {
  const lines = citizen ? MASCOT_LINES_CITIZEN : MASCOT_LINES_GUEST;
  const [line, setLine] = useState(0);
  const [pokes, setPokes] = useState(0);

  const poke = () => {
    setPokes((count) => count + 1);
    setLine((index) => index + 1);
  };
  const text = pokes > 0 && pokes % 4 === 0 ? MASCOT_POKE_LINES[(pokes / 4 - 1) % MASCOT_POKE_LINES.length] : lines[line % lines.length];

  return (
    <section className="grid items-stretch gap-6 md:grid-cols-[1.5fr_1fr]">
      <div className="relative overflow-hidden rounded-[22px_28px_20px_30px] border-[2.5px] border-ink bg-sage">
        <div className="px-5 pt-5 md:px-7 md:pt-7">
          <h1 className="max-w-[17em] text-[28px] md:text-[38px]">시민님, 오늘도 인생을 운영하시느라 수고 많으셨습니다.</h1>
          <p className="mt-1 text-[15px]">당신의 인생, 저희가 대신 이해해 드립니다.</p>
        </div>
        <div className="relative mt-3 flex min-h-[250px] items-end justify-center md:min-h-[290px]">
          <div className="absolute top-2 right-4 left-4 z-10 md:right-auto md:left-6 md:max-w-[58%]" aria-live="polite">
            <p className="bubble" style={{ ["--tail-x" as string]: "62%" }}>{text}</p>
          </div>
          <button
            type="button"
            onClick={poke}
            aria-label="감자 과장님에게 말 걸기"
            className="relative z-0 mt-24 translate-y-6 cursor-pointer border-0 bg-transparent p-0 transition-transform active:rotate-2"
          >
            <Mascot size={190} expression={POKE_EXPRESSIONS[pokes % POKE_EXPRESSIONS.length]} pose={pokes % 4 === 3 ? "stamp" : "document"} />
          </button>
          <div className="absolute right-4 bottom-18 hidden rotate-2 border-[2.5px] border-ink bg-sheet px-3 py-1 text-center font-display sm:block">
            민원 3번 창구
            <span className="block font-official text-xs">담당: 감자 과장</span>
          </div>
        </div>
        <div className="relative z-10 h-12 border-t-[2.5px] border-ink bg-potato" aria-hidden />
      </div>

      <aside className="flex flex-col justify-center gap-5">
        {isLoading ? <div className="skeleton h-52" /> : citizen ? <CitizenSlip citizen={citizen} /> : <RegisterTicket />}
        {!isLoading && !citizen && <Link href="/account" className="btn">이미 시민증이 있어요 (로그인)</Link>}
        <Link href="/counter" className="btn">감자 과장님 창구에 앉기</Link>
      </aside>
    </section>
  );
}

function RegisterTicket() {
  return (
    <Link href="/register" className="ticket -rotate-1 px-6 py-9 text-center">
      <span className="block text-[15px]">처음 오셨다면 여기부터</span>
      <span className="my-1 block font-display text-[64px] leading-none text-brick">001</span>
      <span className="block font-display text-2xl">번호표 뽑고 시민 등록</span>
      <span className="mt-2 block text-sm text-ink-soft">닉네임과 캐릭터만 정하면 됩니다. 로그인은 필요 없어요.</span>
    </Link>
  );
}

function CitizenSlip({ citizen }: { citizen: Citizen }) {
  return (
    <div className="paper tape grid justify-items-center gap-2 p-5 text-center">
      <Character config={citizen.character} size={132} />
      <p className="font-display text-2xl">{citizen.nickname} 시민</p>
      <p className="text-sm text-ink-soft">{citizen.citizenType}, {citizen.title}</p>
      <div className="mt-1 flex flex-wrap justify-center gap-3">
        <Link href="/complaint" className="btn btn-primary">민원 접수</Link>
        <Link href="/records" className="btn">내 기록</Link>
        <Link href="/weekly" className="btn">주간 보고서</Link>
        <Link href="/locker" className="btn">사물함</Link>
        <Link href="/card" className="btn">시민증</Link>
        <Link href="/studio" className="btn">캐릭터 꾸미기</Link>
      </div>
    </div>
  );
}

function Notice({ today }: { today: string | null }) {
  const notice = today ? NOTICES[dailyIndex(today, "notice", NOTICES.length)] : null;
  return (
    <section className="paper tape -rotate-[0.6deg] self-start p-6">
      <h2 className="text-center text-xl">오늘의 공단 공지</h2>
      {notice && today ? (
        <>
          <p className="mt-1 text-center text-sm text-ink-soft">{formatKoreanDate(today)}</p>
          <h3 className="mt-4 text-[22px]">{notice.title}</h3>
          <p className="mt-2">{notice.body}</p>
          <p className="mt-4 text-right">인생관리공단 이사장 직인 생략</p>
        </>
      ) : (
        <div className="skeleton mt-4 h-32" />
      )}
    </section>
  );
}

function RecordsPreview() {
  const [cases, setCases] = useState<PublicCase[] | "loading" | "error">("loading");
  useEffect(() => {
    let alive = true;
    citizenRepository
      .listPublicCases("latest", 0)
      .then((rows) => alive && setCases(rows.slice(0, 3)))
      .catch(() => alive && setCases("error"));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section>
      <h2 className="text-2xl">시민 사건기록실</h2>
      <div className="paper mt-3 grid gap-3 p-6">
        {cases === "loading" && <div className="skeleton h-24" />}
        {cases === "error" && <p>기록실 서류를 가져오지 못했습니다. 잠시 후 다시 열어 주세요.</p>}
        {Array.isArray(cases) && cases.length === 0 && (
          <p>{citizenRepository.socialEnabled ? "공개된 사건이 아직 없습니다. 없는 사건을 지어내 진열하지는 않습니다. 민원을 낼 때 익명 공개를 고르면 이곳에 올라옵니다." : "서버가 연결되지 않아 다른 시민의 사건을 볼 수 없습니다."}</p>
        )}
        {Array.isArray(cases) && cases.map((item) => (
          <Link key={item.id} href="/archive" className="flex items-center gap-3 border-b-2 border-dashed border-ink/30 pb-2 text-ink no-underline">
            <span className="size-11 shrink-0 overflow-hidden rounded-full border-[2.5px] border-ink bg-sage">
              <Character config={item.character} size={40} crop="face" rough={false} title={`${item.nickname} 시민`} />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-lg">{item.title}</span>
              <span className="block truncate text-sm text-ink-soft">{item.nickname} 시민</span>
            </span>
          </Link>
        ))}
        <Link href="/archive" className="btn justify-self-start">사건기록실 구경하기</Link>
      </div>
    </section>
  );
}

function StatsSheet() {
  const [stats, setStats] = useState<PlazaStats | null | "loading">("loading");
  useEffect(() => {
    let alive = true;
    citizenRepository
      .stats()
      .then((value) => alive && setStats(value))
      .catch(() => alive && setStats(null));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section>
      <h2 className="text-2xl">오늘의 공단 통계</h2>
      <div className="paper mt-3 p-6">
        {stats === "loading" && <div className="skeleton h-20" />}
        {stats === null && (
          <p>집계 장부가 비어 있습니다. 공단은 숫자를 지어내지 않습니다. 시민 데이터베이스가 연결되면 실제 집계만 이곳에 적습니다.</p>
        )}
        {stats !== null && stats !== "loading" && (
          <dl className="grid gap-2">
            <div className="flex items-baseline justify-between gap-4 border-b-2 border-dashed border-ink/30 pb-2">
              <dt>오늘 새로 등록한 시민</dt>
              <dd className="font-display text-3xl">{stats.registeredToday}명</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt>전체 등록 시민</dt>
              <dd className="font-display text-3xl">{stats.totalCitizens}명</dd>
            </div>
          </dl>
        )}
      </div>
    </section>
  );
}

/** 아직 만들지 않은 시설은 링크를 걸지 않고 공사 중임을 그대로 보여 준다. */
const FACILITIES = [
  { name: "댓글과 공개 프로필", note: "시민끼리 나누는 이야기", stage: "4단계" },
  { name: "공단 통계청", note: "전체 시민 활동 집계", stage: "4단계" },
];

function FacilityMap() {
  return (
    <section>
      <h2 className="text-2xl">공단 청사 안내도</h2>
      <p className="mb-3">지금 이용할 수 있는 곳은 광장, 시민 등록실, 시민증, 증명사진 촬영실, 민원 접수실, 나의 인생 기록실, 민원 3번 창구, 시민 사건기록실, 주간 인생 보고서, 공단 사물함입니다.</p>
      <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {FACILITIES.map((facility) => (
          <li key={facility.name} className="flex items-center justify-between gap-3 border-b-2 border-dashed border-ink/30 py-2">
            <span>
              <span className="block font-display text-lg">{facility.name}</span>
              <span className="block text-sm text-ink-soft">{facility.note}</span>
            </span>
            <span className="hazard shrink-0 rounded-md px-2 text-sm">{facility.stage} 공사 중</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
