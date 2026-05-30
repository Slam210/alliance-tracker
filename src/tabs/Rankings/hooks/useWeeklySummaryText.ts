import { useMemo } from "react";
import type { SpecialNotesByDay } from "../../../types/derived/specialNotes";
import type { Week, DayKey } from "../../../types/week";
import { DAYS } from "../constants/days";
import {
  applyCommonNoteFields,
  type MemberSummary,
} from "../utils/weeklySummaryUtils";
import type { SummaryMode } from "../../../types/derived/summary";

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
    const subHeader = mode === "positive" ? "Top" : "Bottom";
    const sections = DAYS.map((day) => {
      const map = new Map<string, MemberSummary>();

      // -------------------------
      // BASE NOTES
      // -------------------------
      const notes =
        mode === "positive" ? successNotes?.[day] : failureNotes?.[day];

      notes?.forEach((note) => {
        const existing = map.get(note.id);

        const base: MemberSummary = existing ?? {
          id: note.id,
          name: note.name,
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

      // SPLIT LOGIC
      const top10Entries = entries.filter((e) => (e.top10Count ?? 0) > 0);

      const nonTop10Entries = entries.filter((e) => (e.top10Count ?? 0) === 0);

      // TOP 10
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

          return `• ${entry.name} — ${parts.join(" • ")}`;
        })
        .slice(0, 10);

      // Below Requirements
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

          return `• ${entry.name} — ${parts.join(" • ")}`;
        });

      const baseLines = [...top10Lines, ...normalLines];

      // RISERS / FALLERS
      const extraLines =
        mode === "positive"
          ? (risers?.[day]
              ?.filter((risers) => activeMemberIds.has(risers.id))
              .map((note) => {
                const prev = note.previousScore ?? 0;
                const curr = note.currentScore ?? 0;
                return `• ${note.name} ${prev} → ${curr} (broke requirement)`;
              }) ?? [])
          : (fallers?.[day]
              ?.filter((fallers) => activeMemberIds.has(fallers.id))
              .map((note) => {
                const prev = note.previousScore ?? 0;
                const curr = note.currentScore ?? 0;
                return `• ${note.name} ${prev} → ${curr} (dropped below requirement)`;
              }) ?? []);

      const hasBase = baseLines.length > 0;
      const hasExtra = extraLines.length > 0;

      if (!hasBase && !hasExtra) return "";

      const extraHeader = mode === "positive" ? "RISERS" : "FALLERS";

      return `
${getDayLabel(day)}
-------------------------
${hasBase ? `${baseLines.join("\n")}` : ""}

${hasExtra ? `${extraHeader}\n${extraLines.join("\n")}` : ""}
`.trim();
    });

    const filtered = sections.filter(Boolean);

    return `
${mode === "positive" ? "POSITIVE" : "NEGATIVE"} WEEKLY SUMMARY
Week: ${selectedWeek.week}
${subHeader} 10 By Day

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
