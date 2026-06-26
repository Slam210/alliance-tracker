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

const relativeWeek = weekIndex - startWeekIndex + 1;

  if (TOTAL_WEEKS === null) {
    return START_BY_DAY[index];
  }

const progress =
  TOTAL_WEEKS <= 1
    ? 1
    : (Math.min(relativeWeek, TOTAL_WEEKS) - 1) / (TOTAL_WEEKS - 1);

const start = START_BY_DAY[index];
const end = END_BY_DAY[index];

  if (!start || !end) {
    return null;
  }

const value = start + (end - start) * progress;

return Math.round(value / 10_000) * 10_000;
}
