import type { StateRulerWeek } from "../../../types/stateRuler";

type EntryType = "progress" | "clash" | "both";

export function updateWeekRow(
  weeks: StateRulerWeek[],
  selectedWeekIndex: number,
  memberId: string,
  selectedRow: StateRulerWeek["rows"][number],
  entryType: EntryType,
): StateRulerWeek[] {
  return weeks.map((week, weekIndex) => {
    if (weekIndex !== selectedWeekIndex) return week;

    return {
      ...week,
      rows: week.rows.map((row) =>
        row.id === memberId
          ? {
              ...row,
              progressRank:
                entryType === "progress" || entryType === "both"
                  ? selectedRow.progressRank
                  : row.progressRank,
              progressScore:
                entryType === "progress" || entryType === "both"
                  ? selectedRow.progressScore
                  : row.progressScore,
              clashRank:
                entryType === "clash" || entryType === "both"
                  ? selectedRow.clashRank
                  : row.clashRank,
              clashScore:
                entryType === "clash" || entryType === "both"
                  ? selectedRow.clashScore
                  : row.clashScore,
              lastUpdated: new Date().toISOString(),
            }
          : row,
      ),
    };
  });
}
