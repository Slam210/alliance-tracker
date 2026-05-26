import type { DayKey } from "../../../../types/week";
import type { RankingsByDay } from "../../../../types/derived/rankings";

import { DAYS } from "../../constants/days";
import DailyRankingCard from "./DailyRankCard";

type Props = {
  rankingsByDay: RankingsByDay;
  getDayLabel: (day: DayKey) => string;
};

export default function Top10Section({ rankingsByDay, getDayLabel }: Props) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-gray-200">Top 10</h2>

      <div className="flex gap-4 overflow-x-auto snap-x pb-2">
        {DAYS.map((day) => (
          <DailyRankingCard
            key={day}
            title={getDayLabel(day)}
            entries={rankingsByDay[day] ?? []}
            emptyMessage="No data"
            variant="success"
          />
        ))}
      </div>
    </div>
  );
}
