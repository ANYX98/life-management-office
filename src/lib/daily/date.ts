/** 서버와 클라이언트 양쪽에서 쓰는 한국 시간 계산 */
export function isKstMonday(date: Date): boolean {
  return new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Seoul", weekday: "short" }).format(date) === "Mon";
}

export function formatKstDate(iso: string): string {
  const [year, month, day] = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" })
    .format(new Date(iso))
    .split("-")
    .map(Number);
  return `${year}년 ${month}월 ${day}일`;
}
