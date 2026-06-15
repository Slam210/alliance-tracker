import { useMemo } from "react";
import type { Week, DayKey } from "../../../types/week";
import type {
  WeeklyDailyRankings,
  DayRanking,
} from "../../../types/derived/eos";
import { DAYS } from "../constants/days";
import { getRequirement } from "../utils/scoring";

export function useWeeklyDailyRankings(weeks: Week[]): WeeklyDailyRankings {
  return useMemo(() => {
    return weeks.reduce<WeeklyDailyRankings>((weekMap, week) => {
      weekMap[week.week] = DAYS.reduce<Record<DayKey, DayRanking>>(
        (dayMap, day) => {
          dayMap[day] = {
            requirement: getRequirement(day, week.week),
            rankings: [...week.members]
              .sort((a, b) => (b.values[day] ?? 0) - (a.values[day] ?? 0))
              .map((entry, index) => ({
                rank: index + 1,
                id: entry.id,
                name: entry.name,
                score: entry.values[day] || null,
              })),
          };

          return dayMap;
        },
        {} as Record<DayKey, DayRanking>,
      );

      return weekMap;
    }, {});
  }, [weeks]);
}
