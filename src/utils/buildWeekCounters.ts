import type { AllianceSettings } from "../types/settings";
import type { ApiWeek, EventKey, Week } from "../types/week";
import { getRequirement } from "../features/Rankings/utils/scoring";

export function buildWeekCounters(
  weeks: ApiWeek[],
  allianceSettings: AllianceSettings,
): Week[] {
  return weeks.map((week) => ({
    ...week,
    members: week.members.map((member) => {
      let daily_top = 0;
      let daily_bottom = 0;
      let weekly_top = 0;
      let weekly_bottom = 0;

      (Object.entries(member.values) as [EventKey, number | null][]).forEach(
        ([event, points]) => {
          if (points == null) return;

          const requirement = getRequirement(
            event,
            allianceSettings.start_requirements,
            allianceSettings.max_requirements,
            allianceSettings.scale_duration,
            week.week,
          );

          if (requirement == null) return;


          if (event === "Weekly") {
            if (points >= requirement) {
              weekly_top++;
            } else {
              weekly_bottom++;
            }
          } else {
            if (points >= requirement) {
              daily_top++;
            } else {
              daily_bottom++;
            }
          }
        },
      );

      return {
        ...member,
        counters: {
          daily_top,
          daily_bottom,
          weekly_top,
          weekly_bottom,
        },
      };
    }),
  }));
}
