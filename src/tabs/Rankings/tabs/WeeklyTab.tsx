import { useMemo, useState } from "react";
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
import { useMomentumNotes } from "../hooks/useMomentumNotes";
import WeeklySummarySection from "../components/WeeklyTab/WeeklySummarySection";
import type { Member } from "../../../types/member";
import { buildActiveMemberSet } from "../utils/allTimeCalculations";

type WeeklyTabProps = {
  weeks: Week[];
  getDayLabel: (day: DayKey) => string;
  members: Member[];
};

export default function WeeklyTab({
  members,
  weeks,
  getDayLabel,
}: WeeklyTabProps) {
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const selectedWeek = weeks[selectedWeekIndex];
  const [focusedMembers, setFocusedMembers] = useState<Set<string>>(new Set());

  // Filter (Activity)
  const activeMemberIds = useMemo(
    () => buildActiveMemberSet(members),
    [members],
  );

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

  const { risers, fallers } = useMomentumNotes(weeks, selectedWeekIndex);

  const toggleMemberFocus = (name: string) => {
    setFocusedMembers((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className="space-y-6 w-full mx-auto">
      {/* Week Selector */}
      <WeekSelector
        weeks={weeks}
        selectedWeekIndex={selectedWeekIndex}
        setSelectedWeekIndex={setSelectedWeekIndex}
      />
      <div className="space-y-6 p-2 sm:p-4">
        <div className="mx-auto">
          <WeekRequirementsPanel
            week={selectedWeek?.week}
            getWeekStartDate={getWeekStartDate}
            getRequirement={getRequirement}
          />
        </div>
        {/* Weekly Member Insights */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Top10Insights
            insights={insights}
            focusedMembers={focusedMembers}
            onToggleMember={toggleMemberFocus}
          />
          <FailureInsights
            insights={insights}
            focusedMembers={focusedMembers}
            onToggleMember={toggleMemberFocus}
          />
        </div>
        {/* TOP 10 */}
        <Top10Section
          rankingsByDay={rankingsByDay}
          getDayLabel={getDayLabel}
          focusedMembers={focusedMembers}
          onToggleMember={toggleMemberFocus}
        />

        {/* Below Requirement */}
        <FailureSection
          allRankingsByDay={allRankingsByDay}
          selectedWeek={selectedWeek}
          getDayLabel={getDayLabel}
          focusedMembers={focusedMembers}
          onToggleMember={toggleMemberFocus}
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

        <SpecialNotesSection
          title="Special Notes - Risers"
          notesByDay={risers}
          getDayLabel={getDayLabel}
          tone="top"
          focusedMembers={focusedMembers}
          onToggleMember={toggleMemberFocus}
        />

        <SpecialNotesSection
          title="Special Notes - Fallers"
          notesByDay={fallers}
          getDayLabel={getDayLabel}
          tone="bottom"
          focusedMembers={focusedMembers}
          onToggleMember={toggleMemberFocus}
        />
        <div className="flex flex-col lg:flex-row gap-4 w-full">
          <WeeklySummarySection
            mode="positive"
            selectedWeek={selectedWeek}
            successNotes={successNotes}
            risers={risers}
            getDayLabel={getDayLabel}
            activeMemberIds={activeMemberIds}
          />

          <WeeklySummarySection
            mode="negative"
            selectedWeek={selectedWeek}
            failureNotes={failureNotes}
            fallers={fallers}
            getDayLabel={getDayLabel}
            activeMemberIds={activeMemberIds}
          />
        </div>
      </div>
    </div>
  );
}
