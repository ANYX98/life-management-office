/** 사건 내용을 진술, 조사 내용, 판정, 처분으로 나눠 보여 준다. 기록실과 처분서가 함께 쓴다. */
const STATEMENT = /귀하의 진술: "([\s\S]*)"( 공단은 이 진술을 일단 믿기로 했습니다\. 확인하기 귀찮습니다\.)?/;

export function splitReport(report: string): { statement: string | null; believed: boolean; findings: string[] } {
  const match = report.match(STATEMENT);
  const rest = match ? report.replace(STATEMENT, "") : report;
  const findings = rest.split(/(?<=습니다\.)\s+/).map((line) => line.trim()).filter(Boolean);
  return { statement: match ? match[1] : null, believed: Boolean(match?.[2]), findings };
}

/** 저장된 처분 문장에서 뒤에 붙은 에너지 안내를 떼어 낸다. */
export function splitDisposition(disposition: string): { main: string; energy: string | null } {
  const index = disposition.indexOf(" 에너지");
  return index < 0 ? { main: disposition, energy: null } : { main: disposition.slice(0, index), energy: disposition.slice(index + 1) };
}

export function CaseBody({ report, verdict, disposition }: { report: string; verdict: string; disposition: string }) {
  const { statement, believed, findings } = splitReport(report);
  const { main, energy } = splitDisposition(disposition);
  return (
    <div className="mt-3 grid gap-4">
      {statement && (
        <blockquote className="m-0 -rotate-[0.4deg] rounded-md border-2 border-dashed border-ink/40 bg-manila/50 px-4 py-3">
          <p className="text-sm text-ink-soft">귀하의 진술</p>
          <p className="font-hand text-[21px] leading-snug font-bold whitespace-pre-line">{statement}</p>
          {believed && <p className="mt-1 text-right text-xs text-ink-soft">일단 믿겠습니다.</p>}
        </blockquote>
      )}
      <div>
        <h3 className="text-sm font-normal text-ink-soft">공단 판정</h3>
        <p className="font-display text-[19px] leading-snug">{verdict}</p>
      </div>
      <div>
        <h3 className="text-sm font-normal text-ink-soft">행정 처분</h3>
        <p className="font-display text-[19px] leading-snug text-brick">{main}</p>
      </div>
      {(findings.length > 0 || energy) && (
        <ul className="m-0 grid list-none gap-1 border-t-2 border-dashed border-ink/25 p-0 pt-3 text-sm leading-relaxed text-ink-soft">
          {findings.map((line) => <li key={line}>{line}</li>)}
          {energy && <li>{energy}</li>}
        </ul>
      )}
    </div>
  );
}
