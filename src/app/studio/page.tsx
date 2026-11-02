import type { Metadata } from "next";
import { StudioScreen } from "@/features/editor/StudioScreen";

export const metadata: Metadata = { title: "증명사진 촬영실 | 인생관리공단" };

export default function Page() {
  return <StudioScreen />;
}
