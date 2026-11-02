"use client";

import { GENTLE_RULE } from "@/lib/complaint/rules";
import type { CaseRecord, Citizen } from "@/lib/citizen/types";
import { citizenRepository } from "@/lib/citizen/repository";
import { CopyLinkButton, SaveImageButton } from "./ShareButtons";
import { CaseShareCard } from "./ShareCards";

/** 처분서 저장과 공유. 공개 사건만 링크를 만들 수 있고, 힘든 일을 적은 사건에는 공유를 권하지 않는다. */
export function CaseShareActions({ record, citizen }: { record: CaseRecord; citizen: Citizen }) {
  if (record.title === GENTLE_RULE.titles[0]) return null;
  return (
    <div className="grid justify-items-center gap-2">
      <div className="flex flex-wrap justify-center gap-2">
        <SaveImageButton
          card={<CaseShareCard data={{ ...record, nickname: citizen.nickname, character: citizen.character }} />}
          filename="인생관리공단-처분서.png"
          label="처분서 이미지 저장"
        />
        {record.visibility === "public" && citizenRepository.socialEnabled && <CopyLinkButton path={`/s/${record.id}`} />}
      </div>
      <p className="text-center text-xs text-ink-soft">
        이미지에는 적은 글이 그대로 들어갑니다.{record.visibility !== "public" && citizenRepository.socialEnabled ? " 공유 링크는 익명 공개 사건만 만들 수 있습니다." : ""}
      </p>
    </div>
  );
}
