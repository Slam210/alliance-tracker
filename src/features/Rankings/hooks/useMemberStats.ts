import { useMemo } from "react";
import type { EventKey, Week } from "../../../types/week";
import { EVENTS } from "../constants/days";
import type { MemberDaySummary } from "../../../types/derived/summary";

export function useMemberStats(weeks: Week[], selectedMemberId: string | null) {
  const selectedMemberStats = useMemo(() => {
    if (!selectedMemberId) return null;

    const stats: Record<EventKey, number[]> = {
      "Mod Vehicle Boost": [],
      "Shelter Upgrade": [],
      "Age of Science": [],
      "Hero Progression": [],
      "Holistic Growth": [],
      "Enemy Buster": [],
      Weekly: [],
    };

    for (const week of weeks) {
      const member = week.members.find((m) => m.id === selectedMemberId);
      if (!member) continue;

      for (const event of EVENTS) {
        const val = member.values[event];
        if (val != null) stats[event].push(val);
      }
    }

    return stats;
  }, [weeks, selectedMemberId]);

  const selectedMemberSummary = useMemo(() => {
    if (!selectedMemberStats) return null;

    const summary = {} as Record<EventKey, MemberDaySummary>;

    for (const event of EVENTS) {
      const arr = selectedMemberStats[event];

      const entries = arr.length;
      const uniqueEntries = new Set(arr).size;

      const total = entries ? arr.reduce((a, b) => a + b, 0) : 0;
      const avg = entries ? total / entries : 0;

      const best = entries ? Math.max(...arr) : 0;
      const showSpread = uniqueEntries > 1;
      const worst = showSpread ? Math.min(...arr) : best;

      summary[event] = {
        best,
        avg,
        total,
        worst,
        entries,
        uniqueEntries,
        showSpread,
      };
    }

    return summary;
  }, [selectedMemberStats]);

  const selectedMemberWeeklyRows = useMemo(() => {
    if (!selectedMemberId) return [];

    return weeks.map((week) => {
      const member = week.members.find((m) => m.id === selectedMemberId);

      const values = {
        "Mod Vehicle Boost": member?.values["Mod Vehicle Boost"] ?? null,
        "Shelter Upgrade": member?.values["Shelter Upgrade"] ?? null,
        "Age of Science": member?.values["Age of Science"] ?? null,
        "Hero Progression": member?.values["Hero Progression"] ?? null,
        "Holistic Growth": member?.values["Holistic Growth"] ?? null,
        "Enemy Buster": member?.values["Enemy Buster"] ?? null,
        Weekly: member?.values.Weekly ?? null,
      };

      return {
        week: week.week,
        values,
        exception: member?.exception ?? false,
      };
    });
  }, [weeks, selectedMemberId]);

  return {
    selectedMemberStats,
    selectedMemberSummary,
    selectedMemberWeeklyRows,
  };
}
