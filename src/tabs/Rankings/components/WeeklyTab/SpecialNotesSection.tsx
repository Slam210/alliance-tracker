// components/WeeklyTab/SpecialNotesSection.tsx

import type { DayKey } from "../../../../types/week";

import type { SpecialNotesByDay } from "../../../../types/derived/specialNotes";

import { DAYS } from "../../constants/days";

import DailySpecialNotesCard from "./DailySpecialNotesCard";

type Props = {
  title: string;
  notesByDay: SpecialNotesByDay;
  getDayLabel: (day: DayKey) => string;
  tone: "top" | "bottom";
  focusedMembers: Set<string>;
  onToggleMember: (name: string) => void;
};

export default function SpecialNotesSection({
  title,
  notesByDay,
  getDayLabel,
  tone,
  focusedMembers,
  onToggleMember,
}: Props) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-gray-200">{title}</h2>

      <div className="flex gap-4 overflow-x-auto snap-x pb-2 no-scrollbar">
        {DAYS.map((day) => {
          const entries = notesByDay[day] ?? [];

          return (
            <DailySpecialNotesCard
              key={day}
              title={getDayLabel(day)}
              entries={entries}
              tone={tone}
              focusedMembers={focusedMembers}
              onToggleMember={onToggleMember}
            />
          );
        })}
      </div>
    </div>
  );
}
