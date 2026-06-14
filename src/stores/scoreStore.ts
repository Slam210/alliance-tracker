import { DAYS } from "../tabs/Rankings/constants/days";
import type { DayKey, Week } from "../types/week";

type Top10Store = Record<string, Partial<Record<DayKey, Set<string>>>>;

let top10Store: Top10Store = {};

export function buildTop10Store(weeks: Week[]): void {
  const store: Top10Store = {};

  for (const week of weeks) {
    store[week.week] = {};

    for (const day of DAYS) {
      const limit = day === "Weekly" ? 30 : 10;
      const top10Ids = week.members
        .filter((m) => m.values[day] != null)
        .sort((a, b) => (b.values[day] ?? 0) - (a.values[day] ?? 0))
        .slice(0, limit)
        .map((m) => m.id);

      store[week.week][day] = new Set(top10Ids);
    }
  }

  top10Store = store;
}

export function isTop10(memberId: string, week: string, day: DayKey): boolean {
  return top10Store[week]?.[day]?.has(memberId) ?? false;
}

export function clearTop10Store(): void {
  top10Store = {};
}
