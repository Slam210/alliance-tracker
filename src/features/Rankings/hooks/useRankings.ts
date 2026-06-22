import { useMemo } from "react";

import type { DayKey, Week } from "../../../types/week";
import type { RankedEntry } from "../../../types/derived/rankings";

import { DAYS } from "../constants/days";
import { getRequirement } from "../utils/scoring";
import { isExcluded } from "../utils/week";

type RankingsByDay = Record<DayKey, RankedEntry[]>;

export function useRankings(selectedWeek: Week | undefined) {
  return useMemo(() => {
    if (!selectedWeek) {
      return {
        rankingsByDay: {} as RankingsByDay,
        allRankingsByDay: {} as RankingsByDay,
      };
    }

    const rankingsByDay = {} as RankingsByDay;
    const allRankingsByDay = {} as RankingsByDay;

    for (const day of DAYS) {
      const requirement = getRequirement(day, selectedWeek.week);
      const limit = day === "Weekly" ? 30 : 10;

      /*
        ALL MEMBERS WITH SCORES
      */
      const rankedMembers = selectedWeek.members
        .filter(isExcluded)
        .map((member) => {
          const score = member.values[day];

          return score != null
            ? ({
                ...member,
                score,
              } satisfies RankedEntry)
            : null;
        })
        .filter((member): member is RankedEntry => member !== null)
        .sort((a, b) => b.score - a.score);

      /*
        TOP MEMBERS ABOVE REQUIREMENT
      */
      rankingsByDay[day] = rankedMembers
        .filter((member) => member.score >= requirement)
        .slice(0, limit);

      /*
        ALL SCORES
      */
      allRankingsByDay[day] = rankedMembers;
    }

    return {
      rankingsByDay,
      allRankingsByDay,
    };
  }, [selectedWeek]);
}
