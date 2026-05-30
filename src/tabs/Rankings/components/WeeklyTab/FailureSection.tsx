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
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-gray-200">Below Requirement</h2>

      <div className="flex gap-4 overflow-x-auto snap-x pb-2 no-scrollbar">
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
  );
}
