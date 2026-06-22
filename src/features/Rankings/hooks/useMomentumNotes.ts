import { useMemo } from "react";
import type { Week } from "../../../types/week";
import type {
  SpecialNotesByDay,
  SpecialNoteEntry,
} from "../../../types/derived/specialNotes";

import { DAYS } from "../constants/days";
import { getRequirement } from "../utils/scoring";
import { isTop10 } from "../../../data/cache/top10Index";

export function useMomentumNotes(weeks: Week[], selectedWeekIndex: number) {
  return useMemo(() => {
    const selectedWeek = weeks[selectedWeekIndex];
    const previousWeek = weeks[selectedWeekIndex - 1];

    const risers = {} as SpecialNotesByDay;
    const fallers = {} as SpecialNotesByDay;

    for (const day of DAYS) {
      risers[day] = [];
      fallers[day] = [];
    }

    if (!selectedWeek || !previousWeek) {
      return { risers, fallers };
    }

    for (const day of DAYS) {
      const currentRequirement = getRequirement(day, selectedWeek.week);
      const previousRequirement = getRequirement(day, previousWeek.week);

      for (const member of selectedWeek.members) {
        const currentScore = member.values[day];

        const previousScore = previousWeek.members.find(
          (m) => m.id === member.id,
        )?.values[day];

        if (currentScore == null || previousScore == null) continue;

        const wasTop10LastWeek = isTop10(member.id, previousWeek.week, day);

        if (!wasTop10LastWeek) continue;

        const wasBelowRequirementLastWeek = previousScore < previousRequirement;

        const wasAboveRequirementLastWeek =
          previousScore >= previousRequirement;

        const isAboveRequirementThisWeek = currentScore >= currentRequirement;

        const isBelowRequirementThisWeek = currentScore < currentRequirement;

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

          risers[day].push(entry);
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

          fallers[day].push(entry);
        }
      }
    }

    return { risers, fallers };
  }, [weeks, selectedWeekIndex]);
}
