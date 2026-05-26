import type { Week } from "../../../types/week";
import type { DayKey } from "../../../types/week";
import { getDayKey } from "./getDayKey";
import { getWeekSheetName } from "./getWeekSheetName";

export function getMemberDayPoints(
  memberId: string,
  selectedDate: Date | null,
  weeks: Week[],
): number | null {
  if (!selectedDate) return null;

  const dayKey: DayKey = getDayKey(selectedDate);
  const weekName = getWeekSheetName(selectedDate);

  if (!weekName) return null;

  const week = weeks.find((w) => w.week === weekName);
  if (!week) return null;

  const member = week.members.find((m) => m.id === memberId);

  return member?.values?.[dayKey] ?? null;
}
