import type { Metadata } from "next";
import { LockerScreen } from "@/features/locker/LockerScreen";

export const metadata: Metadata = { title: "공단 사물함 | 인생관리공단" };

export default function Page() {
  return <LockerScreen />;
}
