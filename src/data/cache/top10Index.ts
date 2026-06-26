import { EVENTS } from "../../features/Rankings/constants/days";
import type { EventKey, Week } from "../../types/week";

type Top10Store = Record<string, Partial<Record<EventKey, Set<string>>>>;

let top10Store: Top10Store | null = null;

// Build top 10 index from weeks dataset
export function buildTop10Index(weeks: Week[]) {
  const store: Top10Store = {};

  for (const week of weeks) {
    store[week.week] = {};

    for (const event of EVENTS) {
      const limit = event === "Weekly" ? 30 : 10;

      const topIds = week.members
        .filter((m) => m.values[event] != null)
        .sort((a, b) => (b.values[event] ?? 0) - (a.values[event] ?? 0))
        .slice(0, limit)
        .map((m) => m.id);

      store[week.week][event] = new Set(topIds);
    }
  }

  top10Store = store;
}

// Query helper
export function isTop10(
  memberId: string,
  week: string,
  event: EventKey,
): boolean {
  return top10Store?.[week]?.[event]?.has(memberId) ?? false;
}

// Clear cache when data refreshes
export function clearTop10Index() {
  top10Store = null;
}
