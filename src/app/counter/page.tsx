import type { Metadata } from "next";
import { CounterScreen } from "@/features/counter/CounterScreen";

export const metadata: Metadata = { title: "민원 3번 창구 | 인생관리공단" };

export default function Page() {
  return <CounterScreen />;
}
