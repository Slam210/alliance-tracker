import { useMemo } from "react";
import type { Week, EventKey } from "../../../types/week";
import type {
  WeeklyDailyRankings,
  DayRanking,
} from "../../../types/derived/eos";
import { EVENTS } from "../constants/days";
import { getRequirement } from "../utils/scoring";
import type { AllianceSettings } from "../../../types/settings";

export function useWeeklyDailyRankings(weeks: Week[], allianceSettings: AllianceSettings): WeeklyDailyRankings {
  return useMemo(() => {
    return weeks.reduce<WeeklyDailyRankings>((weekMap, week) => {
      weekMap[week.week] = EVENTS.reduce<Record<EventKey, DayRanking>>(
        (eventMap, event) => {
          eventMap[event] = {
            requirement: getRequirement(event, allianceSettings.start_requirements, allianceSettings.max_requirements, allianceSettings.scale_duration, week.week) ,
            rankings: [...week.members]
              .sort((a, b) => (b.values[event] ?? 0) - (a.values[event] ?? 0))
              .map((entry, index) => ({
                rank: index + 1,
                id: entry.id,
                name: entry.name,
                score: entry.values[event] || null,
                exception: entry.exception,
              })),
          };

          return eventMap;
        },
        {} as Record<EventKey, DayRanking>,
      );

      return weekMap;
    }, {});
  }, [weeks, allianceSettings]);
}
