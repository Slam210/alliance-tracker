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
import { useSpecialNotes } from "../hooks/useSpecialNotes";
import SpecialNotesSection from "../components/WeeklyTab/SpecialNotesSection";

type WeeklyTabProps = {
  weeks: Week[];

  getDayLabel: (day: DayKey) => string;
};

export default function WeeklyTab({ weeks, getDayLabel }: WeeklyTabProps) {
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const selectedWeek = weeks[selectedWeekIndex];
  const [focusedMembers, setFocusedMembers] = useState<Set<string>>(new Set());

  /* WEEKLY TOP 10 */
  const { rankingsByDay, allRankingsByDay } = useRankings(selectedWeek);

  const insights = useWeeklyInsights({
    selectedWeek,
    rankingsByDay,
    allRankingsByDay,
  });

  const { successNotes, failureNotes } = useSpecialNotes(
    weeks,
    selectedWeekIndex,
  );

  const toggleMemberFocus = (name: string) => {
    setFocusedMembers((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

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
      {/* Special Notes */}
      <SpecialNotesSection
        title="Special Notes - Passed Requirement"
        notesByDay={successNotes}
        getDayLabel={getDayLabel}
        tone={"top"}
        focusedMembers={focusedMembers}
        onToggleMember={toggleMemberFocus}
      />

      <SpecialNotesSection
        title="Special Notes - Failed Requirement"
        notesByDay={failureNotes}
        getDayLabel={getDayLabel}
        tone={"bottom"}
        focusedMembers={focusedMembers}
        onToggleMember={toggleMemberFocus}
      />
    </div>
  );
}
