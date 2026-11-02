"use client";

import { useCallback, useEffect, useState } from "react";
import { citizenRepository } from "./repository";
import type { Citizen } from "./types";

export type CitizenState =
  | { status: "loading" }
  | { status: "none" }
  | { status: "error"; message: string }
  | { status: "ready"; citizen: Citizen };

const CHANGED = "lmo:citizen-changed";

/** 등록이나 저장 뒤 호출하면 상단 칩처럼 이미 떠 있는 화면도 새 값으로 갱신된다. */
export function notifyCitizenChanged() {
  window.dispatchEvent(new Event(CHANGED));
}

export function useCitizen() {
  const [state, setState] = useState<CitizenState>({ status: "loading" });

  const reload = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const citizen = await citizenRepository.load();
      setState(citizen ? { status: "ready", citizen } : { status: "none" });
    } catch (error) {
      setState({ status: "error", message: error instanceof Error ? error.message : "시민 정보를 불러오지 못했습니다." });
    }
  }, []);

  useEffect(() => {
    void reload();
    const refresh = () => {
      citizenRepository
        .load()
        .then((citizen) => setState(citizen ? { status: "ready", citizen } : { status: "none" }))
        .catch(() => {
          /* 조용한 갱신 실패는 현재 화면을 유지한다. */
        });
    };
    window.addEventListener(CHANGED, refresh);
    return () => window.removeEventListener(CHANGED, refresh);
  }, [reload]);

  return { state, reload };
}
