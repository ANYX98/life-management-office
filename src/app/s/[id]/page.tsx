import type { Metadata } from "next";
import { SharedCaseScreen } from "@/features/share/SharedCaseScreen";

export const metadata: Metadata = {
  title: "공식 행정 처분서 | 인생관리공단",
  description: "다른 시민의 황당한 사건을 구경하고, 나도 시민증을 발급받으세요.",
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SharedCaseScreen id={id} />;
}
