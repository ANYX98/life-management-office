import type { Metadata } from "next";
import { AdminScreen } from "@/features/admin/AdminScreen";

export const metadata: Metadata = { title: "운영자 창구 | 인생관리공단", robots: { index: false, follow: false } };

export default function Page() {
  return <AdminScreen />;
}
