import type { Metadata } from "next";
import { ComplaintScreen } from "@/features/complaint/ComplaintScreen";

export const metadata: Metadata = { title: "민원 접수실 | 인생관리공단" };

export default function Page() {
  return <ComplaintScreen />;
}
