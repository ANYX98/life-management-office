import type { Metadata } from "next";
import { AccountScreen } from "@/features/account/AccountScreen";

export const metadata: Metadata = { title: "계정과 내 정보 | 인생관리공단" };

export default function Page() {
  return <AccountScreen />;
}
