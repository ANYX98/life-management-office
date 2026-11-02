import type { CaseRecord } from "@/lib/citizen/types";
import { NO_TITLE_NOTE } from "@/lib/complaint/content";
import { GENTLE_RULE } from "@/lib/complaint/rules";
import { formatKstDate } from "@/lib/daily/date";
import { CaseBody } from "./CaseBody";

/** 공단 처분서 한 장. 결과 화면과 기록실이 함께 쓴다. */
export function CaseSheet({ record, fresh = false }: { record: CaseRecord; fresh?: boolean }) {
  const gentle = record.title === GENTLE_RULE.titles[0];
  return (
    <article className={`paper p-5 sm:p-7 ${fresh ? "sheet-flip" : ""}`}>
      <p className="text-sm text-ink-soft">{record.caseNo} / {formatKstDate(record.createdAt)} / {record.visibility === "public" ? "공개 요청" : "비공개"}</p>
      <h2 className="mt-1 text-[26px]">{record.title}</h2>
      <CaseBody report={record.report} verdict={record.verdict} disposition={record.disposition} />
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-sm font-normal text-ink-soft">획득 칭호</h3>
          {record.awardedTitle ? <p className="font-display text-xl text-brick">{record.awardedTitle}</p> : <p>{gentle ? "칭호 없음" : NO_TITLE_NOTE}</p>}
        </div>
        {!gentle && <span className={`stamp text-lg ${fresh ? "thud" : ""}`}>처리 완료</span>}
      </div>
    </article>
  );
}
