import { useMemo } from "react";

import type { Week } from "../../../types/week";

import type {
  SpecialNoteEntry,
  SpecialNotesByDay,
} from "../../../types/derived/specialNotes";

import { DAYS } from "../constants/days";
import { getRequirement } from "../utils/scoring";
import { isExcluded } from "../utils/week";

type SpecialNoteBucket = "top" | "bottom";

export function useSpecialNotes(weeks: Week[], selectedWeekIndex: number) {
  return useMemo(() => {
    const selectedWeek = weeks[selectedWeekIndex];

    const successNotes = {} as SpecialNotesByDay;
    const failureNotes = {} as SpecialNotesByDay;

    if (!selectedWeek) {
      return { successNotes, failureNotes };
    }

    for (const day of DAYS) {
      successNotes[day] = [];
      failureNotes[day] = [];
      const limit = day === "Weekly" ? 30 : 10;

      const topCandidates: SpecialNoteEntry[] = [];
      const bottomCandidates: SpecialNoteEntry[] = [];

      const requirement = getRequirement(day, selectedWeek.week);

      for (const member of selectedWeek.members.filter(isExcluded)) {
        const currentScore = member.values[day];

        if (currentScore == null) continue;

        const currentBucket: SpecialNoteBucket =
          currentScore >= requirement ? "top" : "bottom";

        // Build TWO independent timelines
        const history: Record<
          SpecialNoteBucket,
          { week: string; score: number }[]
        > = {
          top: [],
          bottom: [],
        };

        for (let i = 0; i < selectedWeekIndex; i++) {
          const historicalWeek = weeks[i];

          const historicalMember = historicalWeek.members.find(
            (m) => m.id === member.id,
          );

          const score = historicalMember?.values[day];

          if (score == null) continue;

          const req = getRequirement(day, historicalWeek.week);

          const bucket: SpecialNoteBucket = score >= req ? "top" : "bottom";

          history[bucket].push({
            week: historicalWeek.week,
            score,
          });
        }

        const relevantHistory = history[currentBucket];
        const totalAppearances = relevantHistory.length;

        // FIRST TIME
        if (relevantHistory.length === 0) {
          const note: SpecialNoteEntry = {
            id: member.id,
            name: member.name,
            type: "first_time",
            bucket: currentBucket,
            currentScore,
            previousScore: null,
            previousWeek: null,
            totalAppearances: 1,
          };

          if (currentBucket === "top") {
            topCandidates.push(note);
          } else {
            bottomCandidates.push(note);
          }

          continue;
        }

        const previousWeekEntry = relevantHistory[relevantHistory.length - 1];

        // RECURRING + STREAK
        let streak = 1;

        for (let i = selectedWeekIndex - 1; i >= 0; i--) {
          const historicalWeek = weeks[i];

          const historicalMember = historicalWeek.members.find(
            (m) => m.id === member.id,
          );

          const score = historicalMember?.values[day];

          if (score == null) break;

          const req = getRequirement(day, historicalWeek.week);

          const bucket: SpecialNoteBucket = score >= req ? "top" : "bottom";

          if (bucket === currentBucket) {
            streak++;
          } else {
            break;
          }
        }

        const note: SpecialNoteEntry = {
          id: member.id,
          name: member.name,
          type:
            previousWeekEntry.week === weeks[selectedWeekIndex - 1]?.week
              ? "recurring"
              : "reappearance",
          bucket: currentBucket,
          currentScore,
          previousScore: previousWeekEntry.score,
          previousWeek: previousWeekEntry.week,
          streak,
          totalAppearances: totalAppearances + 1,
        };

        if (currentBucket === "top") {
          topCandidates.push(note);
        } else {
          bottomCandidates.push(note);
        }
      }

      // FINAL SORTING + OUTPUT
      successNotes[day] = topCandidates
        .sort((a, b) => b.currentScore - a.currentScore)
        .slice(0, limit);

      failureNotes[day] = bottomCandidates;
    }

    return {
      successNotes,
      failureNotes,
    };
  }, [weeks, selectedWeekIndex]);
}
