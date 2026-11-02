import type { Metadata } from "next";
import { RegisterFlow } from "@/features/register/RegisterFlow";

export const metadata: Metadata = { title: "시민 등록실 | 인생관리공단" };

export default function Page() {
  return <RegisterFlow />;
}
