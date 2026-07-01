import { useMemo } from "react";

import type { Week } from "../../../types/week";

import type {
  SpecialNoteBucket,
  SpecialNoteEntry,
  SpecialNotesByDay,
} from "../../../types/derived/specialNotes";

import { EVENTS } from "../constants/days";
import { isExcluded } from "../utils/week";
import { isTop10 } from "../../../data/cache/top10Index";
import { AllianceSettings } from "../../../types/settings";
import { getRequirement } from "../utils/scoring";

export function useSpecialNotes(
  weeks: Week[],
  selectedWeekIndex: number,
  allianceSettings: AllianceSettings,
  activeMemberIds: Set<string>,
) {
  return useMemo(() => {
    const selectedWeek = weeks[selectedWeekIndex];

    const successNotes = {} as SpecialNotesByDay;
    const failureNotes = {} as SpecialNotesByDay;

    if (!selectedWeek || !allianceSettings) {
      return { successNotes, failureNotes };
    }

    for (const event of EVENTS) {
      successNotes[event] = [];
      failureNotes[event] = [];

      const limit = event === "Weekly" ? 30 : 10;

      const topCandidates: SpecialNoteEntry[] = [];
      const bottomCandidates: SpecialNoteEntry[] = [];

      for (const member of selectedWeek.members.filter(isExcluded)) {
        if (!activeMemberIds.has(member.id)) continue;

        const currentScore = member.values[event];

        if (currentScore == null) continue;

        const requirement = getRequirement(
          event,
          allianceSettings.start_requirements,
          allianceSettings.max_requirements,
          allianceSettings.scale_duration,
          selectedWeek.week,
        );

        const qualifies =
          requirement != null && currentScore >= requirement;

        const inTop10 = isTop10(member.id, selectedWeek.week, event);

        let currentBucket: SpecialNoteBucket;

        if (inTop10) {
          currentBucket = "top";
        } else if (!qualifies) {
          currentBucket = "bottom";
        } else {
          // Qualified but not Top 10 -> ignore
          continue;
        }

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

          const score = historicalMember?.values[event];

          if (score == null) continue;

          const historicalRequirement = getRequirement(
            event,
            allianceSettings.start_requirements,
            allianceSettings.max_requirements,
            allianceSettings.scale_duration,
            historicalWeek.week,
          );

          const qualifiesHistorically =
            historicalRequirement != null &&
            score >= historicalRequirement;

          const historicalTop10 = isTop10(
            member.id,
            historicalWeek.week,
            event,
          );

          if (historicalTop10) {
            history.top.push({
              week: historicalWeek.week,
              score,
            });
          } else if (!qualifiesHistorically) {
            history.bottom.push({
              week: historicalWeek.week,
              score,
            });
          }
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

        const previousWeekEntry =
          relevantHistory[relevantHistory.length - 1];

        // RECURRING + STREAK
        let streak = 1;

        for (let i = selectedWeekIndex - 1; i >= 0; i--) {
          const historicalWeek = weeks[i];

          const historicalMember = historicalWeek.members.find(
            (m) => m.id === member.id,
          );

          const score = historicalMember?.values[event];

          if (score == null) break;

          const historicalRequirement = getRequirement(
            event,
            allianceSettings.start_requirements,
            allianceSettings.max_requirements,
            allianceSettings.scale_duration,
            historicalWeek.week,
          );

          const qualifiesHistorically =
            historicalRequirement != null &&
            score >= historicalRequirement;

          const historicalTop10 = isTop10(
            member.id,
            historicalWeek.week,
            event,
          );

          let bucket: SpecialNoteBucket | null = null;

          if (historicalTop10) {
            bucket = "top";
          } else if (!qualifiesHistorically) {
            bucket = "bottom";
          }

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

      successNotes[event] = topCandidates
        .sort((a, b) => b.currentScore - a.currentScore)
        .slice(0, limit);

      failureNotes[event] = bottomCandidates;
    }

    return {
      successNotes,
      failureNotes,
    };
  }, [weeks, selectedWeekIndex, allianceSettings, activeMemberIds]);
}
