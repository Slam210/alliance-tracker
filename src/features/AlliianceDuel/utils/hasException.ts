import type { Week } from "../../../types/week";
import { getWeekSheetName } from "./getWeekSheetName";

export function hasException(
  memberId: string,
  selectedDate: Date | null,
  weeks: Week[],
) {
  if (!selectedDate) return false;

  const weekName = getWeekSheetName(selectedDate);

  const week = weeks.find((w) => w.week === weekName);

  if (!week) return false;

  const member = week.members.find((m) => m.id === memberId);

  return member?.exception === true;
}
