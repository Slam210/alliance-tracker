import { useMemo } from "react";
import type { SpecialNotesByDay } from "../../../types/derived/specialNotes";
import type { Week, DayKey } from "../../../types/week";
import { DAYS } from "../constants/days";
import {
  applyCommonNoteFields,
  type MemberSummary,
} from "../utils/weeklySummaryUtils";
import type { SummaryMode } from "../../../types/derived/summary";
import { getNextWeek, getWeekIndex } from "../utils/week";
import { getRequirement } from "../utils/scoring";
import { EVENT_MAP } from "../constants/eventMap";
import { getMemberNickname } from "../../../stores/memberStore";

export function useWeeklySummaryText({
  mode,
  selectedWeek,
  successNotes,
  failureNotes,
  risers,
  fallers,
  getDayLabel,
  activeMemberIds,
}: {
  mode: SummaryMode;
  selectedWeek: Week;
  successNotes?: SpecialNotesByDay;
  failureNotes?: SpecialNotesByDay;
  risers?: SpecialNotesByDay;
  fallers?: SpecialNotesByDay;
  getDayLabel: (day: DayKey) => string;
  activeMemberIds: Set<string>;
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
      const weekly = getRequirement("Weekly", nextWeek);

      if (!isNextNewSystem) {
        const daily = getRequirement("Mon", nextWeek);

        return `
NEXT WEEK REQUIREMENTS (${nextWeek})
Daily Requirement: ${daily.toLocaleString()}
Weekly Requirement: ${weekly.toLocaleString()}
        `.trim();
      }

      const dayLines = DAYS.map((day) => {
        const value = getRequirement(day, nextWeek);
        return `${EVENT_MAP[day]}: ${value.toLocaleString()}`;
      });

      return `
NEXT WEEK REQUIREMENTS (${nextWeek})
${dayLines.join("\n")}
      `.trim();
    })();

    //----
    // MAIN SUMMARY BUILD
    //----
    const sections = DAYS.map((day) => {
      const map = new Map<string, MemberSummary>();

      const notes =
        mode === "positive" ? successNotes?.[day] : failureNotes?.[day];

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

      const top10Entries = entries.filter((e) => (e.top10Count ?? 0) > 0);

      const nonTop10Entries = entries.filter((e) => (e.top10Count ?? 0) === 0);

      const limit = day === "Weekly" ? 30 : 10;

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
                ? `${entry.streak}-week streak (${total} appearances)`
                : `${entry.streak}-week streak`,
            );
          }

          if (entry.reappearanceCount) {
            parts.push(`Reappeared (${entry.reappearanceCount} appearances)`);
          }

          return `${entry.name} — ${parts.join(" • ")}`;
        })
        .slice(0, limit);

      const normalLines = nonTop10Entries
        .filter((entry) => activeMemberIds.has(entry.id))
        .map((entry) => {
          const parts: string[] = [];

          if (mode === "negative" && entry.failureCount) {
            parts.push(
              `Below requirements ${entry.failureCount} time${
                entry.failureCount !== 1 ? "s" : ""
              }`,
            );
          }

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

          return `${entry.name} — ${parts.join(" • ")}`;
        });

      const baseLines = [...top10Lines, ...normalLines];

      const extraLines =
        mode === "positive"
          ? (risers?.[day]
              ?.filter((r) => activeMemberIds.has(r.id))
              .map((note) => {
                const prev = note.previousScore ?? 0;
                const curr = note.currentScore ?? 0;
                return `${note.name} ${prev} → ${curr} (broke requirement)`;
              }) ?? [])
          : (fallers?.[day]
              ?.filter((f) => activeMemberIds.has(f.id))
              .map((note) => {
                const prev = note.previousScore ?? 0;
                const curr = note.currentScore ?? 0;
                return `${note.name} ${prev} → ${curr} (dropped below requirement)`;
              }) ?? []);

      const hasBase = baseLines.length > 0;
      const hasExtra = extraLines.length > 0;

      if (!hasBase && !hasExtra) return "";

      const extraHeader = mode === "positive" ? "RISERS" : "FALLERS";

      return `
${getDayLabel(day)}

${hasBase ? baseLines.join("\n") : ""}

${hasExtra ? `${extraHeader}\n${extraLines.join("\n")}` : ""}
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
    getDayLabel,
    activeMemberIds,
  ]);
}
