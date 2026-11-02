import { Character } from "@/components/character/Character";
import type { Citizen } from "@/lib/citizen/types";

function formatIssued(iso: string) {
  const date = new Date(iso);
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
}

/** 오래된 회원증 디자인의 시민증. stampAnimated면 발급 순간처럼 도장이 찍힌다. */
export function CitizenCard({ citizen, stampAnimated = false }: { citizen: Citizen; stampAnimated?: boolean }) {
  const rows: [string, string][] = [
    ["시민 유형", citizen.citizenType],
    ["시민 등급", citizen.grade],
    ["대표 칭호", citizen.title],
    ["누적 사건", `${citizen.caseCount}건`],
  ];
  return (
    <article className="paper mx-auto w-full max-w-[560px] overflow-hidden bg-manila" aria-label={`${citizen.nickname} 시민증`}>
      <header className="flex items-center justify-between gap-3 border-b-[2.5px] border-ink bg-brick px-4 py-2 text-sheet">
        <span className="font-display text-xl">인생관리공단 시민증</span>
        <span className="font-official text-xs whitespace-nowrap">{citizen.storage === "guest" ? "임시 발급" : "정식 등록"}</span>
      </header>
      <div className="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-4 p-4">
        <div className="photo-backdrop grid aspect-[4/5] place-items-center self-start overflow-hidden rounded-md border-[2.5px] border-ink">
          <Character config={citizen.character} size={190} className="h-[92%] w-auto" title={`${citizen.nickname} 시민 캐릭터`} />
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-[28px]">{citizen.nickname}</h2>
          <p className="text-sm">{citizen.citizenNo}</p>
          <dl className="m-0 mt-2 grid gap-0.5 text-sm">
            {rows.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-2 border-b border-dashed border-ink/50 py-1">
                <dt className="shrink-0 text-ink-soft">{label}</dt>
                <dd className="m-0 text-right font-display">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <footer className="relative flex min-h-20 items-end pr-24 justify-between gap-2 px-4 pb-3 text-xs">
        <span>발급일 {formatIssued(citizen.issuedAt)}<br />위 시민은 인생을 운영 중임을 증명합니다.</span>
        <span className={`stamp-round absolute right-3 bottom-2 ${stampAnimated ? "thud" : ""}`} aria-label="공단 공식 도장">
          인생
          <br />
          관리공단
        </span>
      </footer>
    </article>
  );
}
