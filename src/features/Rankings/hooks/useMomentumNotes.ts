import { useMemo } from "react";
import type { Week } from "../../../types/week";
import type {
  SpecialNotesByDay,
  SpecialNoteEntry,
} from "../../../types/derived/specialNotes";

import { EVENTS } from "../constants/days";
import { getRequirement } from "../utils/scoring";
import { isTop10 } from "../../../data/cache/top10Index";
import type { AllianceSettings } from "../../../types/settings";

export function useMomentumNotes(weeks: Week[], selectedWeekIndex: number, allianceSettings: AllianceSettings) {
  return useMemo(() => {
    const selectedWeek = weeks[selectedWeekIndex];
    const previousWeek = weeks[selectedWeekIndex - 1];

    const risers = {} as SpecialNotesByDay;
    const fallers = {} as SpecialNotesByDay;

    for (const event of EVENTS) {
      risers[event] = [];
      fallers[event] = [];
    }

    if (!selectedWeek || !previousWeek) {
      return { risers, fallers };
    }

    for (const event of EVENTS) {
      const currentRequirement = getRequirement(event, allianceSettings.start_requirements, allianceSettings.max_requirements, allianceSettings.scale_duration, selectedWeek.week);
      const previousRequirement = getRequirement(event, allianceSettings.start_requirements, allianceSettings.max_requirements, allianceSettings.scale_duration, previousWeek.week);

      for (const member of selectedWeek.members) {
        const currentScore = member.values[event];

        const previousScore = previousWeek.members.find(
          (m) => m.id === member.id,
        )?.values[event];

        if (currentScore == null || previousScore == null) continue;

        const wasTop10LastWeek = isTop10(member.id, previousWeek.week, event);

        if (!wasTop10LastWeek || !previousRequirement || !currentRequirement) continue;

        const wasBelowRequirementLastWeek = previousScore < (previousRequirement);

        const wasAboveRequirementLastWeek =
          previousScore >= (previousRequirement);

        const isAboveRequirementThisWeek = currentScore >= (currentRequirement);

        const isBelowRequirementThisWeek = currentScore < (currentRequirement);

        // -------- RISER --------
        if (wasBelowRequirementLastWeek && isAboveRequirementThisWeek) {
          const entry: SpecialNoteEntry = {
            id: member.id,
            name: member.name,
            type: "riser",
            bucket: "top",
            currentScore,
            previousScore,
            previousWeek: previousWeek.week,
            totalAppearances: 1,
          };

          risers[event].push(entry);
        }

        // -------- FALLER --------
        if (wasAboveRequirementLastWeek && isBelowRequirementThisWeek) {
          const entry: SpecialNoteEntry = {
            id: member.id,
            name: member.name,
            type: "faller",
            bucket: "bottom",
            currentScore,
            previousScore,
            previousWeek: previousWeek.week,
            totalAppearances: 1,
          };

          fallers[event].push(entry);
        }
      }
    }

    return { risers, fallers };
  }, [weeks, selectedWeekIndex, allianceSettings]);
}
