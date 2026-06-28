import { useMemo } from "react";
import type { SpecialNotesByDay } from "../../../types/derived/specialNotes";
import type { Week } from "../../../types/week";
import { EVENTS } from "../constants/days";
import {
  applyCommonNoteFields,
  type MemberSummary,
} from "../utils/weeklySummaryUtils";
import type { SummaryMode } from "../../../types/derived/summary";
import { getNextWeek, getWeekIndex } from "../utils/week";
import { getRequirement } from "../utils/scoring";
import { getMemberNickname } from "../../../data/cache/memberIndex";
import { formatDisplayNumber } from "../../../utils/formatNumbers";
import { AllianceSettings } from "../../../types/settings";

export function useWeeklySummaryText({
  mode,
  selectedWeek,
  successNotes,
  failureNotes,
  risers,
  fallers,
  activeMemberIds,
  allianceSettings,
}: {
  mode: SummaryMode;
  selectedWeek: Week;
  successNotes?: SpecialNotesByDay;
  failureNotes?: SpecialNotesByDay;
  risers?: SpecialNotesByDay;
  fallers?: SpecialNotesByDay;
  activeMemberIds: Set<string>;
  allianceSettings: AllianceSettings;
}) {
  return useMemo(() => {
    const weekIndex = getWeekIndex(selectedWeek.week);
    const nextWeek = getNextWeek(selectedWeek.week);
    const nextWeekIndex = weekIndex + 1;
    const isNextNewSystem = nextWeekIndex >= 7;

    const subHeader = mode === "positive" ? "Top" : "Bottom";

    //----
    // NEXT WEEK REQUIREMENTS HEADER
    //----
    const nextWeekHeader = (() => {
      const weekly = getRequirement("Weekly", allianceSettings.start_requirements, allianceSettings.max_requirements, allianceSettings.scale_duration, nextWeek);

      if (!isNextNewSystem) {
        const daily = getRequirement("Mod Vehicle Boost", allianceSettings.start_requirements, allianceSettings.max_requirements, allianceSettings.scale_duration, nextWeek);

        return `
NEXT WEEK REQUIREMENTS (${nextWeek})
Daily Requirement: ${daily ? formatDisplayNumber(daily) : "N/A"}
Weekly Requirement: ${weekly ? formatDisplayNumber(weekly) : "N/A"}
        `.trim();
      }

      const eventLines = EVENTS.map((event) => {
        const value = getRequirement(event, allianceSettings.start_requirements, allianceSettings.max_requirements, allianceSettings.scale_duration, nextWeek);
        return `${event}: ${value ? formatDisplayNumber(value) : "N/A"}`;
      });

      return `
NEXT WEEK REQUIREMENTS (${nextWeek})
${eventLines.join("\n")}
      `.trim();
    })();

    //----
    // MAIN SUMMARY BUILD
    //----
    const sections = EVENTS.map((event) => {
      const map = new Map<string, MemberSummary>();

      const notes =
        mode === "positive" ? successNotes?.[event] : failureNotes?.[event];

      notes?.forEach((note) => {
        const existing = map.get(note.id);
        const nickname = getMemberNickname(note.id);

        const base: MemberSummary = existing ?? {
          id: note.id,
          name: nickname ? nickname : note.name,
          top10Count: 0,
          failureCount: 0,
          firstTime: false,
        };

        const updated =
          mode === "positive"
            ? applyCommonNoteFields(
                {
                  ...base,
                  top10Count: (base.top10Count ?? 0) + 1,
                },
                note,
              )
            : applyCommonNoteFields(
                {
                  ...base,
                  failureCount: (base.failureCount ?? 0) + 1,
                },
                note,
              );

        map.set(note.id, updated);
      });

      const entries = Array.from(map.values());

      const changeMap = new Map<string, string>();

      if (mode === "positive") {
        risers?.[event]
          ?.filter((r) => activeMemberIds.has(r.id))
          .forEach((note) => {
            const prev = note.previousScore ?? 0;
            const curr = note.currentScore ?? 0;

            changeMap.set(
              note.id,
              `↑ ${formatDisplayNumber(prev)} → ${formatDisplayNumber(curr)}`,
            );
          });
      } else {
        fallers?.[event]
          ?.filter((f) => activeMemberIds.has(f.id))
          .forEach((note) => {
            const prev = note.previousScore ?? 0;
            const curr = note.currentScore ?? 0;

            changeMap.set(
              note.id,
              `↓ ${prev.toLocaleString()} → ${curr.toLocaleString()}`,
            );
          });
      }

      const top10Entries = entries.filter((e) => (e.top10Count ?? 0) > 0);

      const nonTop10Entries = entries.filter((e) => (e.top10Count ?? 0) === 0);

      const limit = event === "Weekly" ? 30 : 10;

      const top10Lines = top10Entries
        .filter((entry) => activeMemberIds.has(entry.id))
        .map((entry) => {
          const parts: string[] = [];

          if (entry.firstTime) parts.push("First appearance");

          if (entry.streak && entry.streak >= 2) {
            const total = entry.totalAppearances;
            const showTotal =
              typeof total === "number" && total !== entry.streak;

            parts.push(
              showTotal
                ? `Streak: ${entry.streak} - Appearances: ${total}`
                : `Streak: ${entry.streak}`,
            );
          }

          if (entry.reappearanceCount) {
            parts.push(`Reappeared (${entry.reappearanceCount} appearances)`);
          }

          const change = changeMap.get(entry.id);

          if (change) {
            parts.push(change);
            changeMap.delete(entry.id);
          }

          return parts.length
            ? `${entry.name}: ${parts.join(" • ")}`
            : entry.name;
        })
        .slice(0, limit);

      const normalLines = nonTop10Entries
        .filter((entry) => activeMemberIds.has(entry.id))
        .map((entry) => {
          const parts: string[] = [];

          if (entry.firstTime) parts.push("First appearance");

          if (entry.streak && entry.streak >= 2) {
            const total = entry.totalAppearances;
            const showTotal =
              typeof total === "number" && total !== entry.streak;

            parts.push(
              showTotal
                ? `${entry.streak}-week streak (${total} appearances)`
                : `${entry.streak}-week streak`,
            );
          }

          if (entry.reappearanceCount) {
            parts.push(`Reappeared (${entry.reappearanceCount} appearances)`);
          }

          const change = changeMap.get(entry.id);

          if (change) {
            parts.push(change);
            changeMap.delete(entry.id);
          }

          return parts.length
            ? `${entry.name} — ${parts.join(" • ")}`
            : entry.name;
        });

      const changeOnlyLines = [...changeMap.entries()].map(([id, text]) => {
        const note =
          mode === "positive"
            ? risers?.[event]?.find((r) => r.id === id)
            : fallers?.[event]?.find((f) => f.id === id);

        const nickname = note ? getMemberNickname(note.id) : null;

        return `${nickname ?? note?.name ?? id} — ${text}`;
      });

      const allLines = [...top10Lines, ...normalLines, ...changeOnlyLines];

      if (allLines.length === 0) return "";

      return `
${event}
${allLines.join("\n")}
`.trim();
    });

    const filtered = sections.filter(Boolean);

    return `
${nextWeekHeader}

Week: ${selectedWeek.week}
${subHeader} 10 By Day : Top 30 for Weekly

${filtered.join("\n\n\n")}
    `.trim();
  }, [
    mode,
    selectedWeek,
    successNotes,
    failureNotes,
    risers,
    fallers,
    activeMemberIds,
    allianceSettings,
  ]);
}
