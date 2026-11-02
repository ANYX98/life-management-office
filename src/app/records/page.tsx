import type { Metadata } from "next";
import { RecordsScreen } from "@/features/records/RecordsScreen";

export const metadata: Metadata = { title: "나의 인생 기록실 | 인생관리공단" };

export default function Page() {
  return <RecordsScreen />;
}
