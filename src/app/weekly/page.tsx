import type { Metadata } from "next";
import { WeeklyScreen } from "@/features/weekly/WeeklyScreen";

export const metadata: Metadata = { title: "주간 인생 보고서 | 인생관리공단" };

export default function Page() {
  return <WeeklyScreen />;
}
