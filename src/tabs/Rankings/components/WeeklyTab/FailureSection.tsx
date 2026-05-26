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
};

export default function FailureSection({
  allRankingsByDay,
  selectedWeek,
  getDayLabel,
}: Props) {
  if (!selectedWeek) return null;

  const hasWeeklyData = selectedWeek.members.some(
    (m) => m.values.Weekly != null,
  );

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-gray-200">Below Requirement</h2>

      <div className="flex gap-4 overflow-x-auto snap-x pb-2">
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
            />
          );
        })}
      </div>

      {!hasWeeklyData && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-200">
          Weekly data is yet to be input.
        </div>
      )}
    </div>
  );
}
