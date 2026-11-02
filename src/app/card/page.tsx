import type { Metadata } from "next";
import { CardScreen } from "@/features/card/CardScreen";

export const metadata: Metadata = { title: "내 시민증 | 인생관리공단" };

export default function Page() {
  return <CardScreen />;
}
