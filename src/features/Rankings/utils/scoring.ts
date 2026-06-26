import { EVENT_INDEX } from "../../../constants/week";
import { EventKey } from "../../../types/week";
import { getWeekIndex } from "./week";

export function getRequirement(
  event: EventKey,
  START_BY_DAY: (number | null)[],
  END_BY_DAY: (number | null)[],
  TOTAL_WEEKS: number | null,
  weekName?: string,
) {
  const weekIndex = weekName ? getWeekIndex(weekName) : 1;
  const startWeekIndex = getWeekIndex("W1");
  const index = EVENT_INDEX[event];
  console.log(event, EVENT_INDEX, index);

  if (TOTAL_WEEKS === null) {
    return START_BY_DAY[index];
  }

  const clampedWeek = Math.min(weekIndex, startWeekIndex + TOTAL_WEEKS);

  const progress = (clampedWeek - startWeekIndex) / TOTAL_WEEKS;

  const start = START_BY_DAY[6 - index];
  const end = END_BY_DAY[6 - index];

  if (!start || !end) {
    return null;
  }

  const value = start + (end - start) * progress;

  return Math.round(value / 10_000) * 10_000;
}
