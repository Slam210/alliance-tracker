import { useMemo } from "react";
import type { EventKey, Week } from "../../../types/week";
import type { Member } from "../../../types/member";
import type { AllianceSettings } from "../../../types/settings";
import {
  buildActiveMemberSet,
  computeAllTimeRankings,
  computeAllTimeInsights,
} from "../utils/allTimeCalculations";
import type { AllTimeEntry } from "../../../types/derived/counting";
import { EVENTS } from "../constants/days";
import { getRequirement } from "../utils/scoring";

export function useAllTimeInsights(members: Member[], weeks: Week[], allianceSettings: AllianceSettings) {
  const activeMemberIds = useMemo(
    () => buildActiveMemberSet(members),
    [members],
  );

  const allTimeRankings = useMemo(
    () => computeAllTimeRankings(weeks, activeMemberIds),
    [weeks, activeMemberIds],
  );

  const allTimeInsights = useMemo(
    () => computeAllTimeInsights(weeks, activeMemberIds),
    [weeks, activeMemberIds],
  );

  const allTimeTop100ByDay = useMemo(() => {
    const result: Record<EventKey, AllTimeEntry[]> = {
      "Mod Vehicle Boost": [],
      "Shelter Upgrade": [],
      "Age of Science": [],
      "Hero Progression": [],
      "Holistic Growth": [],
      "Enemy Buster": [],
      Weekly: [],
    };

    const activeMemberIds = new Set(
      members.filter((m) => m.status === "Active").map((m) => m.id),
    );

    for (const week of weeks) {
      for (const event of EVENTS) {
        for (const entry of week.members) {
          const requirement = getRequirement(event, allianceSettings.start_requirements, allianceSettings.max_requirements, allianceSettings.scale_duration, week.week);
          const score = entry.values[event];

          if (score == null || !requirement) continue;
          if (score < requirement) continue;
          if (!activeMemberIds.has(entry.id)) continue;
          result[event].push({
            member: {
              id: entry.id,
              name: entry.name,
            } as Member,
            score,
            weekId: week.week,
            event: event,
          });
        }
      }
    }

    for (const event of Object.keys(result) as EventKey[]) {
      result[event] = result[event].sort((a, b) => b.score - a.score).slice(0, 100);
    }

    return result;
  }, [weeks, members, allianceSettings]);

  const bottomTop100ByDay = useMemo(() => {
    const result: Record<EventKey, AllTimeEntry[]> = {
      "Mod Vehicle Boost": [],
      "Shelter Upgrade": [],
      "Age of Science": [],
      "Hero Progression": [],
      "Holistic Growth": [],
      "Enemy Buster": [],
      Weekly: [],
    };

    const activeMemberIds = new Set(
      members.filter((m) => m.status === "Active").map((m) => m.id),
    );

    for (const week of weeks) {
      for (const event of Object.keys(result) as EventKey[]) {
        for (const entry of week.members) {
          const requirement = getRequirement(event, allianceSettings.start_requirements, allianceSettings.max_requirements, allianceSettings.scale_duration, week.week);
          const score = entry.values[event];

          if (score == null || !requirement) continue;
          if (score > requirement) continue;
          if (!activeMemberIds.has(entry.id)) continue;
          result[event as EventKey].push({
            member: {
              id: entry.id,
              name: entry.name,
            } as Member,
            score,
            weekId: week.week,
            event: event,
          });
        }
      }
    }

    for (const event of Object.keys(result) as EventKey[]) {
      result[event] = result[event].sort((a, b) => a.score - b.score).slice(0, 100);
    }

    return result;
  }, [weeks, members, allianceSettings]);

  return {
    activeMemberIds,
    allTimeRankings,
    allTimeInsights,
    allTimeTop100ByDay,
    bottomTop100ByDay,
  };
}
