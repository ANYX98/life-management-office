export const REACTIONS = [
  { id: "empathy", label: "공감함" },
  { id: "unfair", label: "억울함" },
  { id: "metoo", label: "나도 해당" },
  { id: "investigate", label: "공단 조사 필요" },
  { id: "legend", label: "전설이다" },
] as const;

export type ReactionKind = (typeof REACTIONS)[number]["id"];
export type ReactionCounts = Partial<Record<ReactionKind, number>>;

export const REPORT_REASONS = [
  { id: "personal_info", label: "실명이나 연락처가 있어요" },
  { id: "abuse", label: "누군가를 공격하는 글이에요" },
  { id: "sexual", label: "선정적인 내용이에요" },
  { id: "spam", label: "광고나 도배예요" },
  { id: "other", label: "그 밖의 문제예요" },
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number]["id"];
export type ArchiveSort = "latest" | "most_reacted" | "random";
