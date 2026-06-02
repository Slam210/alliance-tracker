import { useState } from "react";
import type { DayKey } from "../../../../types/week";
import type { SpecialNotesByDay } from "../../../../types/derived/specialNotes";

import { DAYS } from "../../constants/days";
import DailySpecialNotesCard from "./DailySpecialNotesCard";

export type FilterType = "first_time" | "reappearance" | "recurring" | null;

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
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(null);
  return (
    <div className="rounded-2xl border border-gray-800 bg-linear-to-b from-gray-900 to-gray-950 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 px-4 sm:px-6 py-3">
        <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
        <select
          value={selectedFilter ?? ""}
          onChange={(e) =>
            setSelectedFilter((e.target.value as FilterType) || null)
          }
          className="
          bg-gray-800
          text-gray-200
          text-xs
          rounded-md
          border
          border-gray-600
          px-2
          py-1
          pr-8
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          cursor-pointer
        "
        >
          <option value="">All</option>
          <option value="first_time">First Time</option>
          <option value="reappearance">Reappearance</option>
          <option value="recurring">Recurring</option>
        </select>
      </div>

      {/* Content */}
      <div className="relative p-3 sm:p-4">
        <div className="flex gap-4 overflow-x-auto px-1 sm:px-2 pb-2 no-scrollbar">
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
                selectedFilter={selectedFilter}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
