import type { Week } from "../../../types/week";
import { getWeekSheetName } from "./getWeekSheetName";

export function getExemptStatus(
  memberId: string,
  selectedDate: Date | null,
  weeks: Week[],
): boolean {
  if (!selectedDate) return false;

  const weekName = getWeekSheetName(selectedDate);

  if (!weekName) return false;

  const week = weeks.find((w) => w.week === weekName);
  if (!week) return false;

  const member = week.members.find((m) => m.id === memberId);

  return member?.exception || false;
}
