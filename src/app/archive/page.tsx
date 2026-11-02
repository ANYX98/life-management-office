import type { Metadata } from "next";
import { ArchiveScreen } from "@/features/archive/ArchiveScreen";

export const metadata: Metadata = { title: "시민 사건기록실 | 인생관리공단" };

export default function Page() {
  return <ArchiveScreen />;
}
