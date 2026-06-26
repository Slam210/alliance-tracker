import { useMemo } from "react";

import type { Week } from "../../../types/week";
import type { RankedEntry, RankingsByEvent } from "../../../types/derived/rankings";

import { EVENTS } from "../constants/days";
import { getRequirement } from "../utils/scoring";
import { isExcluded } from "../utils/week";
import type {
  MemberCount,
  WeeklyInsights,
} from "../../../types/derived/counting";
import { AllianceSettings } from "../../../types/settings";

type UseWeeklyInsightsProps = {
  selectedWeek: Week | undefined;
  rankingsByEvent: RankingsByEvent | undefined;
  allRankingsByEvent: RankingsByEvent | undefined;
  allianceSettings: AllianceSettings;
};

export function useWeeklyInsights({
  selectedWeek,
  rankingsByEvent,
  allRankingsByEvent,
  allianceSettings,
}: UseWeeklyInsightsProps): WeeklyInsights {
  return useMemo(() => {
    if (!selectedWeek || !rankingsByEvent || !allRankingsByEvent || !allianceSettings) {
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

    const weeklyRequirement = getRequirement("Weekly", allianceSettings.start_requirements, allianceSettings.max_requirements, allianceSettings.scale_duration, selectedWeek.week);

    if (!weeklyRequirement) return {
      uniqueTop10Members: [] as MemberCount[],
      repeatingFailures: [] as MemberCount[],
      hasWeeklyData: false,
    };

    /*
      TOP 10 COUNTS
      DAILY FAILURE COUNTS
    */
    for (const event of EVENTS) {
      /*
        TOP 10 APPEARANCES
      */
      rankingsByEvent[event]?.forEach((member: RankedEntry) => {
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
      const requirement = getRequirement(event, allianceSettings.start_requirements, allianceSettings.max_requirements,allianceSettings.scale_duration, selectedWeek.week);

      if (!requirement) continue;

      allRankingsByEvent[event]
        ?.filter((member) => isExcluded(member))
        .filter((member) => member.score < (requirement))
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

        return weeklyScore != null && weeklyScore < (weeklyRequirement);
      })
      .sort((a, b) => b.count - a.count);

    return {
      uniqueTop10Members,
      repeatingFailures,
      hasWeeklyData,
    };
  }, [selectedWeek, rankingsByEvent, allRankingsByEvent, allianceSettings]);
}
