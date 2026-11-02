import { WEEKDAYS, type WeeklyReport } from "@/lib/weekly/report";

/** 요일별 접수 도장. 칸이 비어도 벌점이 아니라 그냥 빈칸이다. */
export function WeekStamps({ report, large = false }: { report: WeeklyReport; large?: boolean }) {
  const size = large ? 46 : 40;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 4 }}>
      {WEEKDAYS.map((day, index) => (
        <div key={day} style={{ display: "grid", justifyItems: "center", gap: 4, fontSize: large ? 20 : 14 }}>
          <span>{day}</span>
          <span
            className="font-display"
            style={{
              width: size,
              height: size,
              maxWidth: "100%",
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              border: report.perDay[index] ? "3px solid #A94C40" : "2px dashed rgb(52 49 46 / 0.3)",
              color: "#A94C40",
              rotate: index % 2 ? "6deg" : "-6deg",
              fontSize: large ? 24 : 16,
            }}
          >
            {report.perDay[index] || ""}
          </span>
        </div>
      ))}
    </div>
  );
}
