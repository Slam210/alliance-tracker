import type { Week } from "../../../types/week";
import type { EventKey } from "../../../types/week";
import { getEventKey } from "../../../constants/week";
import { getWeekSheetName } from "./getWeekSheetName";

export function getMemberEventPoints(
  memberId: string,
  selectedDate: Date | null,
  weeks: Week[],
): number | null {
  if (!selectedDate) return null;

  const eventKey: EventKey = getEventKey(selectedDate);
  const weekName = getWeekSheetName(selectedDate);

  if (!weekName) return null;

  const week = weeks.find((w) => w.week === weekName);
  if (!week) return null;

  const member = week.members.find((m) => m.id === memberId);

  return member?.values?.[eventKey] ?? null;
}
