import Link from "next/link";
import { Mascot } from "@/components/mascot/Mascot";

export default function NotFound() {
  return (
    <div className="grid justify-items-center gap-3 py-12 text-center">
      <Mascot expression="worried" size={140} />
      <h1 className="text-2xl">해당 창구를 찾을 수 없습니다</h1>
      <p>주소가 틀렸거나 아직 짓지 않은 창구입니다.</p>
      <Link href="/" className="btn btn-primary">광장으로 돌아가기</Link>
    </div>
  );
}
