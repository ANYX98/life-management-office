"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Character } from "@/components/character/Character";
import { Mascot } from "@/components/mascot/Mascot";
import { useCitizen } from "@/lib/citizen/useCitizen";
import { COUNTER_OPENERS, COUNTER_SCRIPT, COUNTER_START } from "@/lib/counter/script";

type Entry = { who: "mascot"; text: string; nodeId: string } | { who: "citizen"; text: string };

const pickOpener = () => COUNTER_OPENERS[Math.floor(Math.random() * COUNTER_OPENERS.length)];

export function CounterScreen() {
  const { state } = useCitizen();
  const [log, setLog] = useState<Entry[]>(() => [{ who: "mascot", text: pickOpener(), nodeId: COUNTER_START }]);
  const [nodeId, setNodeId] = useState(COUNTER_START);
  const endRef = useRef<HTMLDivElement>(null);
  const node = COUNTER_SCRIPT[nodeId];
  const citizen = state.status === "ready" ? state.citizen : null;

  useEffect(() => {
    if (log.length > 1) endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [log.length]);

  const answer = (label: string, next: string) => {
    setLog((entries) => [...entries, { who: "citizen", text: label }, { who: "mascot", text: COUNTER_SCRIPT[next].line, nodeId: next }]);
    setNodeId(next);
  };

  const restart = () => {
    setLog([{ who: "mascot", text: pickOpener(), nodeId: COUNTER_START }]);
    setNodeId(COUNTER_START);
    window.scrollTo(0, 0);
  };

  return (
    <div className="mx-auto grid max-w-xl gap-4 pt-2">
      <h1 className="text-[28px]">민원 3번 창구</h1>

      <div className="grid gap-4" aria-live="polite">
        {log.map((entry, index) =>
          entry.who === "mascot" ? (
            <motion.div key={index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="flex items-end gap-2">
              <span className="shrink-0">
                {index === log.length - 1 ? (
                  <Mascot size={82} expression={COUNTER_SCRIPT[entry.nodeId].expression} pose={COUNTER_SCRIPT[entry.nodeId].pose ?? "stand"} />
                ) : (
                  <span className="block w-[82px]" />
                )}
              </span>
              <p className={`bubble flex-1 ${COUNTER_SCRIPT[entry.nodeId].serious ? "!font-official !text-base !font-normal !leading-relaxed" : ""}`} style={{ ["--tail-x" as string]: "-4px" }}>
                {entry.text}
              </p>
            </motion.div>
          ) : (
            <motion.div key={index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="flex items-center justify-end gap-2">
              <p className="rounded-[18px_18px_4px_18px] border-[2.5px] border-ink bg-mustard px-4 py-2 font-official">{entry.text}</p>
              {citizen && (
                <span className="size-11 shrink-0 overflow-hidden rounded-full border-[2.5px] border-ink bg-sage">
                  <Character config={citizen.character} size={40} crop="face" rough={false} title="내 캐릭터" />
                </span>
              )}
            </motion.div>
          ),
        )}
      </div>

      {node.options.length > 0 ? (
        <div className="mt-1 grid gap-2">
          {node.options.map((option) => (
            <button key={option.next} type="button" className="btn justify-start text-left" onClick={() => answer(option.label, option.next)}>
              {option.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-1 grid gap-3">
          {nodeId === "serious_yes" ? (
            <a href="tel:109" className="paper block p-4 text-center text-ink no-underline">
              <span className="block font-display text-3xl">109</span>
              <span className="block">자살예방 상담전화, 24시간. 휴대폰에서 누르면 전화가 걸립니다.</span>
            </a>
          ) : !node.serious ? (
            <p className="text-center text-sm text-ink-soft">창구 대화가 끝났습니다.</p>
          ) : null}
          <div className="flex flex-wrap justify-center gap-3">
            {node.exit === "complaint" && citizen && <Link href="/complaint" className="btn btn-primary">민원으로 접수하기</Link>}
            <Link href="/" className={`btn ${node.exit === "complaint" && citizen ? "" : "btn-primary"}`}>광장으로</Link>
            {!node.serious && <button type="button" className="btn" onClick={restart}>번호표 다시 뽑기</button>}
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
