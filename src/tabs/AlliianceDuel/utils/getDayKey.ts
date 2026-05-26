import type { DayKey } from "../../../types/week";

export function getDayKey(date: Date): DayKey {
  const map: Record<number, DayKey> = {
    0: "Weekly",
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
  };

  return map[date.getDay()];
}
