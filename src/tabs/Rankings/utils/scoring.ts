import { getWeekIndex } from "./week";
import {
  START_DAILY,
  END_DAILY,
  START_WEEKLY,
  END_WEEKLY,
  TOTAL_WEEKS,
} from "../constants/limits";

export function getRequirement(day: string, weekName?: string) {
  const isWeekly = day === "Weekly";
  const weekIndex = weekName ? getWeekIndex(weekName) : 1;
  const startWeekIndex = getWeekIndex("W4");

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
