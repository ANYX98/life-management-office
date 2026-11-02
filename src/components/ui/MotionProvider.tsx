"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** 사용자가 OS에서 움직임 줄이기를 켜면 Framer Motion 애니메이션도 따른다. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
