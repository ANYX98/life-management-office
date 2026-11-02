import type { Metadata } from "next";
import { PrivacyScreen } from "@/features/privacy/PrivacyScreen";

export const metadata: Metadata = { title: "개인정보 안내 | 인생관리공단" };

export default function Page() {
  return <PrivacyScreen />;
}
