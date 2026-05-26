import { useMemo } from "react";
import type { DayKey, Week } from "../../../types/week";
import { DAYS } from "../constants/days";
import type { MemberDaySummary } from "../../../types/derived/summary";

export function useMemberStats(weeks: Week[], selectedMemberId: string | null) {
  const selectedMemberStats = useMemo(() => {
    if (!selectedMemberId) return null;

    const stats: Record<DayKey, number[]> = {
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      Sat: [],
      Weekly: [],
    };

    for (const week of weeks) {
      const member = week.members.find((m) => m.id === selectedMemberId);
      if (!member) continue;

      for (const day of DAYS) {
        const val = member.values[day];
        if (val != null) stats[day].push(val);
      }
    }

    return stats;
  }, [weeks, selectedMemberId]);

  const selectedMemberSummary = useMemo(() => {
    if (!selectedMemberStats) return null;

    const summary = {} as Record<DayKey, MemberDaySummary>;

    for (const day of DAYS) {
      const arr = selectedMemberStats[day];

      const entries = arr.length;
      const uniqueEntries = new Set(arr).size;

      const total = entries ? arr.reduce((a, b) => a + b, 0) : 0;
      const avg = entries ? total / entries : 0;

      const best = entries ? Math.max(...arr) : 0;
      const showSpread = uniqueEntries > 1;
      const worst = showSpread ? Math.min(...arr) : best;

      summary[day] = {
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
        Mon: member?.values.Mon ?? null,
        Tue: member?.values.Tue ?? null,
        Wed: member?.values.Wed ?? null,
        Thu: member?.values.Thu ?? null,
        Fri: member?.values.Fri ?? null,
        Sat: member?.values.Sat ?? null,
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
