import type { ReactNode } from "react";
import { Character } from "@/components/character/Character";
import { Mascot } from "@/components/mascot/Mascot";
import { splitDisposition, splitReport } from "@/features/complaint/CaseBody";
import type { CharacterConfig } from "@/lib/character/catalog";
import type { Citizen } from "@/lib/citizen/types";
import { SITE_HOST } from "@/lib/share/image";

const WIDTH = 540;
const HEIGHT = 960;

function Frame({ children, background = "#F6F0E5" }: { children: ReactNode; background?: string }) {
  return (
    <div style={{ width: WIDTH, height: HEIGHT, background, color: "#34312E", display: "flex", flexDirection: "column", padding: 36, boxSizing: "border-box", wordBreak: "keep-all", overflowWrap: "anywhere" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 46, height: 46, borderRadius: "50%", border: "3px solid #34312E", background: "#D9A36B", display: "grid", placeItems: "center", fontSize: 15 }} className="font-display">공단</span>
        <span className="font-display" style={{ fontSize: 26 }}>인생관리공단</span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 0 }}>{children}</div>
      <div style={{ textAlign: "center" }}>
        <p className="font-display" style={{ fontSize: 20, margin: 0 }}>나도 시민증 발급받기</p>
        <p style={{ fontSize: 16, margin: "2px 0 0" }}>{SITE_HOST}</p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, borderBottom: "2px dashed rgb(52 49 46 / 0.4)", padding: "6px 0", fontSize: 20 }}>
      <span style={{ color: "#625C54" }}>{label}</span>
      <span className="font-display" style={{ textAlign: "right" }}>{value}</span>
    </div>
  );
}

export function CitizenShareCard({ citizen }: { citizen: Citizen }) {
  return (
    <Frame background="#EEDDB8">
      <div style={{ background: "#F6F0E5", border: "4px solid #34312E", borderRadius: 22, overflow: "hidden" }}>
        <div className="font-display" style={{ background: "#A94C40", color: "#FFFBF2", padding: "12px 22px", fontSize: 28 }}>인생관리공단 시민증</div>
        <div style={{ padding: 22, position: "relative" }}>
          <div className="photo-backdrop" style={{ width: 250, height: 280, margin: "0 auto", border: "4px solid #34312E", borderRadius: 10, display: "grid", placeItems: "center" }}>
            <Character config={citizen.character} size={232} title="" />
          </div>
          <h2 className="font-display" style={{ fontSize: 40, textAlign: "center", margin: "12px 0 0" }}>{citizen.nickname}</h2>
          <p style={{ textAlign: "center", margin: "0 0 10px", fontSize: 19 }}>{citizen.citizenNo}</p>
          <Row label="시민 유형" value={citizen.citizenType} />
          <Row label="시민 등급" value={citizen.grade} />
          <Row label="대표 칭호" value={citizen.title} />
          <Row label="누적 사건" value={`${citizen.caseCount}건`} />
          <div className="stamp-round" style={{ position: "absolute", right: 20, top: 232, width: 100, height: 100, fontSize: 17 }}>인생<br />관리공단</div>
        </div>
      </div>
    </Frame>
  );
}

export type CaseCardData = {
  title: string;
  report: string;
  verdict: string;
  disposition: string;
  awardedTitle: string | null;
  nickname: string;
  character: CharacterConfig;
};

export function CaseShareCard({ data }: { data: CaseCardData }) {
  const { statement } = splitReport(data.report);
  const { main } = splitDisposition(data.disposition);
  const long = (statement?.length ?? 0) > 90;
  return (
    <Frame>
      <div style={{ background: "#FFFBF2", border: "4px solid #34312E", borderRadius: 22, padding: 28, position: "relative" }}>
        <p style={{ margin: 0, fontSize: 18, color: "#625C54" }}>공식 행정 처분서 / {data.nickname} 시민</p>
        <h2 className="font-display" style={{ fontSize: 38, lineHeight: 1.25, margin: "4px 0 16px" }}>{data.title}</h2>
        {statement && (
          <div style={{ background: "#EEDDB8", border: "2px dashed #625C54", borderRadius: 8, padding: "12px 16px", marginBottom: 18 }}>
            <p className="font-hand" style={{ margin: 0, fontWeight: 700, lineHeight: 1.3, fontSize: long ? 22 : 28 }}>{statement}</p>
          </div>
        )}
        <p style={{ margin: 0, fontSize: 18, color: "#625C54" }}>공단 판정</p>
        <p className="font-display" style={{ margin: "0 0 14px", fontSize: 28, lineHeight: 1.3 }}>{data.verdict}</p>
        <p style={{ margin: 0, fontSize: 18, color: "#625C54" }}>행정 처분</p>
        <p className="font-display" style={{ margin: 0, fontSize: 30, lineHeight: 1.3, color: "#A94C40" }}>{main}</p>
        {data.awardedTitle && <p style={{ margin: "14px 0 0", fontSize: 20 }}>획득 칭호: <span className="font-display" style={{ color: "#A94C40" }}>{data.awardedTitle}</span></p>}
        <span className="stamp" style={{ position: "absolute", right: 22, bottom: 16, fontSize: 24 }}>처리 완료</span>
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 8, marginTop: 14 }}>
        <Character config={data.character} size={long ? 110 : 150} title="" />
        <Mascot size={long ? 100 : 130} pose="stamp" />
      </div>
    </Frame>
  );
}
