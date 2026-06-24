import { DAYS } from "../../features/Rankings/constants/days";
import type { DayKey, Week } from "../../types/week";

type Top10Store = Record<string, Partial<Record<DayKey, Set<string>>>>;

let top10Store: Top10Store | null = null;

// Build top 10 index from weeks dataset
export function buildTop10Index(weeks: Week[]) {
  const store: Top10Store = {};

  for (const week of weeks) {
    store[week.week] = {};

    for (const day of DAYS) {
      const limit = day === "Weekly" ? 30 : 10;

      const topIds = week.members
        .filter((m) => m.values[day] != null)
        .sort((a, b) => (b.values[day] ?? 0) - (a.values[day] ?? 0))
        .slice(0, limit)
        .map((m) => m.id);

      store[week.week][day] = new Set(topIds);
    }
  }

  top10Store = store;
}

// Query helper
export function isTop10(memberId: string, week: string, day: DayKey): boolean {
  return top10Store?.[week]?.[day]?.has(memberId) ?? false;
}

// Clear cache when data refreshes
export function clearTop10Index() {
  top10Store = null;
}
