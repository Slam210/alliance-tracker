import { useMemo } from "react";

import type { Week } from "../../../types/week";
import type { RankedEntry, RankingsByEvent } from "../../../types/derived/rankings";

import { getRequirement } from "../utils/scoring";
import { isExcluded } from "../utils/week";
import { EVENTS } from "../constants/days";
import { AllianceSettings } from "../../../types/settings";

export function useRankings(selectedWeek: Week | undefined, allianceSettings: AllianceSettings, activeMemberIds: Set<string>) {
  return useMemo(() => {
    if (!selectedWeek || !allianceSettings) {
      return {
        rankingsByDay: {} as RankingsByEvent,
        allRankingsByDay: {} as RankingsByEvent,
      };
    }

    const rankingsByEvent = {} as RankingsByEvent;
    const allRankingsByEvent = {} as RankingsByEvent;

    for (const event of EVENTS) {
      const requirement = getRequirement(event, allianceSettings.start_requirements, allianceSettings.max_requirements, allianceSettings.scale_duration, selectedWeek.week);
      if (requirement === null) continue;
      const limit = event === "Weekly" ? 30 : 10;

      /*
        ALL MEMBERS WITH SCORES
      */
      const rankedMembers = selectedWeek.members
        .filter((member) => activeMemberIds.has(member.id))
        .filter(isExcluded)
        .map((member) => {
          const score = member.values[event];

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
      rankingsByEvent[event] = rankedMembers
        .filter((member) => member.score >= (requirement))
        .slice(0, limit);

      /*
        ALL SCORES
      */
      allRankingsByEvent[event] = rankedMembers;
    }

    return {
      rankingsByEvent,
      allRankingsByEvent,
    };
  }, [selectedWeek, allianceSettings]);
}
