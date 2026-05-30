import type { DayKey } from "../../../types/week";
import { getWeekIndex } from "./week";
import {
  START_DAILY,
  END_DAILY,
  START_WEEKLY,
  END_WEEKLY,
  END_BY_DAY,
  TOTAL_WEEKS,
} from "../constants/limits";

const LEGACY_WEEK_CUTOFF = 6;

export function getRequirement(day: DayKey, weekName?: string) {
  const isWeekly = day === "Weekly";
  const weekIndex = weekName ? getWeekIndex(weekName) : 1;
  const startWeekIndex = getWeekIndex("W4");

  // LEGACY SYSTEM (W1–W6)
  if (weekIndex <= LEGACY_WEEK_CUTOFF) {
    if (weekIndex < startWeekIndex) {
      return isWeekly ? START_WEEKLY : START_DAILY;
    }

    const clampedWeek = Math.min(weekIndex, startWeekIndex + TOTAL_WEEKS);
    const progress = (clampedWeek - startWeekIndex) / TOTAL_WEEKS;

    const start = isWeekly ? START_WEEKLY : START_DAILY;
    const end = isWeekly ? END_WEEKLY : END_DAILY;

    const value = start + (end - start) * progress;

    return Math.round(value / 10_000) * 10_000;
  }

  // NEW SYSTEM (W7+)
  const clampedWeek = Math.min(weekIndex, startWeekIndex + TOTAL_WEEKS);

  const progress = (clampedWeek - startWeekIndex) / TOTAL_WEEKS;

  const start = isWeekly ? START_WEEKLY : START_DAILY;

  const end = END_BY_DAY[day];

  const value = start + (end - start) * progress;

  return Math.round(value / 10_000) * 10_000;
}
