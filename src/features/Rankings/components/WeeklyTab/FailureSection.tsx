import type { DayKey, Week } from "../../../../types/week";
import type { RankingsByDay } from "../../../../types/derived/rankings";

import { DAYS } from "../../constants/days";
import { getRequirement } from "../../utils/scoring";
import DailyRankingCard from "./DailyRankCard";
import { isExcluded } from "../../utils/week";

type Props = {
  allRankingsByDay: RankingsByDay;
  selectedWeek: Week | undefined;
  getDayLabel: (day: DayKey) => string;
  focusedMembers: Set<string>;
  onToggleMember: (name: string) => void;
};

export default function FailureSection({
  allRankingsByDay,
  selectedWeek,
  getDayLabel,
  focusedMembers,
  onToggleMember,
}: Props) {
  if (!selectedWeek) return null;

  const hasWeeklyData = selectedWeek.members.some(
    (m) => m.values.Weekly != null,
  );

  return (
    <div className="rounded-2xl border border-gray-800 bg-linear-to-b from-gray-900 to-gray-950 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 px-4 sm:px-6 py-3">
        <h2 className="text-lg sm:text-xl font-bold text-white">
          Below Requirement
        </h2>
      </div>

      {/* Content */}
      <div className="relative p-3 sm:p-4">
        <div className="flex gap-4 overflow-x-auto px-1 sm:px-2 pb-2 no-scrollbar">
          {DAYS.map((day) => {
            const requirement = getRequirement(day, selectedWeek.week);

            const failingMembers =
              allRankingsByDay[day]
                ?.filter((m) => isExcluded(m))
                .filter((m) => m.score < requirement)
                .sort((a, b) => a.score - b.score) ?? [];

            return (
              <DailyRankingCard
                key={day}
                title={getDayLabel(day)}
                entries={failingMembers}
                emptyMessage={
                  allRankingsByDay[day]?.length
                    ? hasWeeklyData
                      ? "Everyone passed"
                      : "No failures"
                    : "No data"
                }
                variant="danger"
                focusedMembers={focusedMembers}
                onToggleMember={onToggleMember}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
