import { useMemo } from "react";
import type { DayKey, Week } from "../../../types/week";
import type { Member } from "../../../types/member";
import {
  buildActiveMemberSet,
  computeAllTimeRankings,
  computeAllTimeInsights,
} from "../utils/allTimeCalculations";
import type { AllTimeEntry } from "../../../types/derived/counting";
import { DAYS } from "../constants/days";
import { getRequirement } from "../utils/scoring";

export function useAllTimeInsights(members: Member[], weeks: Week[]) {
  const activeMemberIds = useMemo(
    () => buildActiveMemberSet(members),
    [members],
  );

  const allTimeRankings = useMemo(
    () => computeAllTimeRankings(weeks, activeMemberIds),
    [weeks, activeMemberIds],
  );

  const allTimeInsights = useMemo(
    () => computeAllTimeInsights(weeks, activeMemberIds),
    [weeks, activeMemberIds],
  );

  const allTimeTop100ByDay = useMemo(() => {
    const result: Record<DayKey, AllTimeEntry[]> = {
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      Sat: [],
      Weekly: [],
    };

    const activeMemberIds = new Set(
      members.filter((m) => m.status === "Active").map((m) => m.id),
    );

    for (const week of weeks) {
      for (const day of DAYS) {
        for (const entry of week.members) {
          const requirement = getRequirement(day, week.week);
          const score = entry.values[day];

          if (score == null) continue;
          if (score < requirement) continue;
          if (!activeMemberIds.has(entry.id)) continue;
          result[day].push({
            member: {
              id: entry.id,
              name: entry.name,
            } as Member,
            score,
            weekId: week.week,
          });
        }
      }
    }

    for (const day of Object.keys(result) as DayKey[]) {
      result[day] = result[day].sort((a, b) => b.score - a.score).slice(0, 100);
    }

    return result;
  }, [weeks]);

  return {
    activeMemberIds,
    allTimeRankings,
    allTimeInsights,
    allTimeTop100ByDay,
  };
}
