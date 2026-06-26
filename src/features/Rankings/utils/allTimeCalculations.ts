import type { Week } from "../../../types/week";
import type { RankedEntry } from "../../../types/derived/rankings";
import { isExcluded } from "./week";
import type { MemberCount } from "../../../types/derived/counting";
import { EVENTS } from "../constants/days";

export function buildActiveMemberSet(
  members: { id: string; status: string }[],
) {
  return new Set(members.filter((m) => m.status === "Active").map((m) => m.id));
}

export function computeAllTimeRankings(
  weeks: Week[],
  activeMemberIds: Set<string>,
) {
  return EVENTS.map((event) => {
    const map = new Map<string, RankedEntry>();
    const limit = event === "Weekly" ? 30 : 10;

    for (const week of weeks) {
      for (const member of week.members) {
        if (!activeMemberIds.has(member.id)) continue;

        const score = member.values[event];
        if (score == null) continue;

        const existing = map.get(member.id);

        if (!existing || score > existing.score) {
          map.set(member.id, { ...member, score });
        }
      }
    }

    return {
      event,
      top10: Array.from(map.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, limit),
    };
  });
}

export function computeAllTimeInsights(
  weeks: Week[],
  activeMemberIds: Set<string>,
) {
  const topCounts = new Map<string, MemberCount>();
  const failureCounts = new Map<string, MemberCount>();

  for (const week of weeks) {
    for (const member of week.members) {
      if (!activeMemberIds.has(member.id)) continue;
      if (!isExcluded(member)) continue;

      const { daily_top, weekly_top, daily_bottom, weekly_bottom } =
        member.counters;

      const topTotal = daily_top + weekly_top;
      const failTotal = daily_bottom + weekly_bottom;

      // TOPS
      if (topTotal > 0) {
        const existing = topCounts.get(member.id);

        const entry: RankedEntry = {
          ...member,
          score: topTotal,
        };

        if (existing) {
          existing.count += topTotal;
        } else {
          topCounts.set(member.id, {
            member: entry,
            count: topTotal,
          });
        }
      }

      // FAILURES
      if (failTotal > 0) {
        const existing = failureCounts.get(member.id);

        const entry: RankedEntry = {
          ...member,
          score: failTotal,
        };

        if (existing) {
          existing.count += failTotal;
        } else {
          failureCounts.set(member.id, {
            member: entry,
            count: failTotal,
          });
        }
      }
    }
  }

  return {
    topPlayers: Array.from(topCounts.values()).sort(
      (a, b) => b.count - a.count,
    ),

    bottomPlayers: Array.from(failureCounts.values()).sort(
      (a, b) => b.count - a.count,
    ),

    hasWeeklyData: topCounts.size > 0 || failureCounts.size > 0,
  };
}
