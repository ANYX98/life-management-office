"use client";

import { useEffect, useState } from "react";
import { INCIDENTS } from "@/lib/daily/content";
import { dailyIndex } from "@/lib/daily/today";
import { readJson, writeJson } from "@/lib/storage";

/** 오늘의 랜덤 사건. 선택은 하루 동안 유지된다. 기록실 영구 보관은 3단계에서 붙인다. */
export function DailyIncident({ today, seed }: { today: string; seed: string }) {
  const incident = INCIDENTS[dailyIndex(today, seed, INCIDENTS.length)];
  const key = `lmo.incident.${today}.${seed}`;
  const [picked, setPicked] = useState<number | null>(null);
  const [justPicked, setJustPicked] = useState(false);

  useEffect(() => {
    const saved = readJson<number>(key);
    setPicked(typeof saved === "number" && incident.choices[saved] ? saved : null);
  }, [key, incident]);

  const choose = (index: number) => {
    writeJson(key, index);
    setPicked(index);
    setJustPicked(true);
  };

  const result = picked === null ? null : incident.choices[picked];

  return (
    <section className="folder p-6 pt-5">
      <span className="folder-tab">오늘의 랜덤 사건</span>
      <h3 className="text-[26px]">{incident.title}</h3>
      {!result ? (
        <>
          <p className="mt-2">{incident.report}</p>
          <div className="mt-4 grid gap-3">
            {incident.choices.map((choice, index) => (
              <button key={choice.label} type="button" className="btn justify-start text-left" onClick={() => choose(index)}>
                {choice.label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className={`paper mt-3 p-5 ${justPicked ? "sheet-flip" : ""}`}>
          <p className="text-sm text-ink-soft">귀하의 선택: {result.label}</p>
          <h4 className="mt-3 font-display text-lg">공단 판정</h4>
          <p>{result.verdict}</p>
          <h4 className="mt-3 font-display text-lg">행정 처분</h4>
          <p>{result.disposition}</p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-ink-soft">내일 자정에 새 사건이 도착합니다.</span>
            <span className={`stamp ${justPicked ? "thud" : ""}`}>처리 완료</span>
          </div>
        </div>
      )}
    </section>
  );
}
