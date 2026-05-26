import { useState } from "react";
import type { DayKey, Week } from "../../../types/week";
import WeekRequirementsPanel from "../components/WeeklyTab/weekRequirementsPanel";
import { getRequirement } from "../utils/scoring";
import { getWeekStartDate } from "../utils/week";
import { useRankings } from "../hooks/useRankings";
import { useWeeklyInsights } from "../hooks/useWeeklyInsights";
import WeekSelector from "../components/WeeklyTab/WeekSelector";
import Top10Section from "../components/WeeklyTab/Top10Section";
import FailureSection from "../components/WeeklyTab/FailureSection";
import FailureInsights from "../components/WeeklyTab/FailureInsights";
import Top10Insights from "../components/WeeklyTab/Top10InsightCard";

type WeeklyTabProps = {
  weeks: Week[];

  getDayLabel: (day: DayKey) => string;
};

export default function WeeklyTab({ weeks, getDayLabel }: WeeklyTabProps) {
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const selectedWeek = weeks[selectedWeekIndex];

  /* WEEKLY TOP 10 */
  const { rankingsByDay, allRankingsByDay } = useRankings(selectedWeek);

  const insights = useWeeklyInsights({
    selectedWeek,
    rankingsByDay,
    allRankingsByDay,
  });

  return (
    <div className="space-y-6">
      {/* Week Selector */}
      <div className="flex gap-3 overflow-x-auto pb-3 snap-x">
        <WeekSelector
          weeks={weeks}
          selectedWeekIndex={selectedWeekIndex}
          setSelectedWeekIndex={setSelectedWeekIndex}
        />
      </div>
      <div className="mt-4 w-full lg:w-80">
        <div className="sticky top-4">
          <WeekRequirementsPanel
            week={selectedWeek?.week}
            getWeekStartDate={getWeekStartDate}
            getRequirement={getRequirement}
          />
        </div>
      </div>
      {/* Weekly Member Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Top10Insights insights={insights} />
        <FailureInsights insights={insights} />
      </div>
      {/* TOP 10 */}
      <Top10Section rankingsByDay={rankingsByDay} getDayLabel={getDayLabel} />

      {/* Below Requirement */}
      <FailureSection
        allRankingsByDay={allRankingsByDay}
        selectedWeek={selectedWeek}
        getDayLabel={getDayLabel}
      />
    </div>
  );
}
