import { useMemo } from "react";

import type { Week } from "../../../types/week";
import type { RankingsByDay } from "../../../types/derived/rankings";

import { DAYS } from "../constants/days";
import { getRequirement } from "../utils/scoring";
import { isExcluded } from "../utils/week";
import type {
  MemberCount,
  WeeklyInsights,
} from "../../../types/derived/counting";

type UseWeeklyInsightsProps = {
  selectedWeek: Week | undefined;
  rankingsByDay: RankingsByDay;
  allRankingsByDay: RankingsByDay;
};

export function useWeeklyInsights({
  selectedWeek,
  rankingsByDay,
  allRankingsByDay,
}: UseWeeklyInsightsProps): WeeklyInsights {
  return useMemo(() => {
    if (!selectedWeek) {
      return {
        uniqueTop10Members: [] as MemberCount[],
        repeatingFailures: [] as MemberCount[],
        hasWeeklyData: false,
      };
    }

    const top10Counts = new Map<string, MemberCount>();
    const dailyFailureCounts = new Map<string, MemberCount>();
    const hasWeeklyData = selectedWeek.members.some(
      (member) => member.values.Weekly != null,
    );

    const weeklyRequirement = getRequirement("Weekly", selectedWeek.week);

    /*
      TOP 10 COUNTS
      DAILY FAILURE COUNTS
    */
    for (const day of DAYS) {
      /*
        TOP 10 APPEARANCES
      */
      rankingsByDay[day]?.forEach((member) => {
        const existing = top10Counts.get(member.id);

        if (existing) {
          existing.count += 1;
        } else {
          top10Counts.set(member.id, {
            member,
            count: 1,
          });
        }
      });

      /*
        DAILY FAILURES
      */
      const requirement = getRequirement(day, selectedWeek.week);

      allRankingsByDay[day]
        ?.filter((member) => isExcluded(member))
        .filter((member) => member.score < requirement)
        .forEach((member) => {
          const existing = dailyFailureCounts.get(member.id);

          if (existing) {
            existing.count += 1;
          } else {
            dailyFailureCounts.set(member.id, {
              member,
              count: 1,
            });
          }
        });
    }

    /*
      SORT TOP 10 APPEARANCES
    */
    const uniqueTop10Members = Array.from(top10Counts.values()).sort(
      (a, b) => b.count - a.count,
    );

    const repeatingFailures = Array.from(dailyFailureCounts.values())
      .filter(({ member }) => {
        if (!isExcluded(member)) {
          return false;
        }

        /*
          Weekly scores not entered yet:
          show all daily failures.
        */
        if (!hasWeeklyData) {
          return true;
        }

        const weeklyScore = member.values.Weekly;

        return weeklyScore != null && weeklyScore < weeklyRequirement;
      })
      .sort((a, b) => b.count - a.count);

    return {
      uniqueTop10Members,
      repeatingFailures,
      hasWeeklyData,
    };
  }, [selectedWeek, rankingsByDay, allRankingsByDay]);
}
