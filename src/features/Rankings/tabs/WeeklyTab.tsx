import { useEffect, useMemo, useState } from "react";
import type { Week } from "../../../types/week";
import WeekRequirementsPanel from "../components/WeeklyTab/weekRequirementsPanel";
import { getRequirement } from "../utils/scoring";
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
import WeeklyGroups from "../components/WeeklyTab/WeeklyGroups";
import { AllianceSettings } from "../../../types/settings";
import MembersRequired from "../../../components/required/MembersRequired";
import WeeksRequired from "../../../components/required/WeeksRequired";
import { deleteAllianceDuel } from "../../../services/alliance-duel";
import ConfirmModal from "../../../components/ConfirmPopup";

type WeeklyTabProps = {
  weeks: Week[];
  members: Member[];
  focusedMembers: Set<string>;
  setFocusedMembers: React.Dispatch<React.SetStateAction<Set<string>>>;
  allianceSettings: AllianceSettings;
  loadWeeks: () => Promise<void>;
};

export default function WeeklyTab({
  members,
  weeks,
  focusedMembers,
  setFocusedMembers,
  allianceSettings,
  loadWeeks,
}: WeeklyTabProps) {
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(weeks.length - 1);
  const selectedWeek = weeks[selectedWeekIndex];

  useEffect(() => {
    if (weeks.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedWeekIndex(0);
      return;
    }

    setSelectedWeekIndex((prev) => Math.min(prev, weeks.length - 1));
  }, [weeks]);

  // Filter (Activity)
  const activeMemberIds = useMemo(
    () => buildActiveMemberSet(members),
    [members],
  );

  /* WEEKLY TOP 10 */
  const { rankingsByEvent, allRankingsByEvent } = useRankings(selectedWeek, allianceSettings, activeMemberIds);


  const insights = useWeeklyInsights({
    selectedWeek,
    rankingsByEvent,
    allRankingsByEvent,
    allianceSettings,
  });

  const { successNotes, failureNotes } = useSpecialNotes(
    weeks,
    selectedWeekIndex,
    allianceSettings,
    activeMemberIds
  );

  const { risers, fallers } = useMomentumNotes(weeks, selectedWeekIndex, allianceSettings);

  const toggleMemberFocus = (memberId: string) => {
    setFocusedMembers((prev) => {
      const next = new Set(prev);
      if (next.has(memberId)) next.delete(memberId);
      else next.add(memberId);
      return next;
    });
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteWeekNumber, setDeleteWeekNumber] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteWeek = async () => {
    if (deleteWeekNumber == null) return;

    try {
      setIsDeleting(true);

      await deleteAllianceDuel({
        weekNumber: deleteWeekNumber,
      });

      await loadWeeks();
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
      setDeleteWeekNumber(null);
    }
  };

  return (
    <MembersRequired members={members}>
      <WeeksRequired weeks={weeks}>
        <div className="space-y-6 w-full mx-auto p-4">
          {/* Week Selector */}
          <WeekSelector
            weeks={weeks}
            selectedWeekIndex={selectedWeekIndex}
            setSelectedWeekIndex={setSelectedWeekIndex}
            onDeleteWeek={(weekNumber) => {
              setDeleteWeekNumber(weekNumber);
              setShowDeleteModal(true);
            }}
          />
          <div className="space-y-6 p-2 sm:p-4">
            <div className="mx-auto">
              <WeekRequirementsPanel
                week={selectedWeek?.week}
                getRequirement={getRequirement}
                allianceSettings={allianceSettings}
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
              rankingsByEvent={rankingsByEvent}
              focusedMembers={focusedMembers}
              onToggleMember={toggleMemberFocus}
            />

            {/* Below Requirement */}
            <FailureSection
              allRankingsByEvent={allRankingsByEvent}
              selectedWeek={selectedWeek}
              focusedMembers={focusedMembers}
              onToggleMember={toggleMemberFocus}
              allianceSettings={allianceSettings}
            />
            {/* Special Notes */}
            <SpecialNotesSection
              title="Special Notes - Passed Requirement"
              notesByDay={successNotes}
              tone={"top"}
              focusedMembers={focusedMembers}
              onToggleMember={toggleMemberFocus}
            />

            <SpecialNotesSection
              title="Special Notes - Failed Requirement"
              notesByDay={failureNotes}
              tone={"bottom"}
              focusedMembers={focusedMembers}
              onToggleMember={toggleMemberFocus}
            />

            <SpecialNotesSection
              title="Special Notes - Risers"
              notesByDay={risers}
              tone="top"
              focusedMembers={focusedMembers}
              onToggleMember={toggleMemberFocus}
            />

            <SpecialNotesSection
              title="Special Notes - Fallers"
              notesByDay={fallers}
              tone="bottom"
              focusedMembers={focusedMembers}
              onToggleMember={toggleMemberFocus}
            />
            <WeeklyGroups members={members} week={selectedWeek} allianceSettings={allianceSettings} activeMemberIds={ activeMemberIds} />
            <div className="flex flex-col lg:flex-row gap-4 w-full">
              <WeeklySummarySection
                mode="positive"
                selectedWeek={selectedWeek}
                successNotes={successNotes}
                risers={risers}
                activeMemberIds={activeMemberIds}
                allianceSettings={allianceSettings}
              />

              <WeeklySummarySection
                mode="negative"
                selectedWeek={selectedWeek}
                failureNotes={failureNotes}
                fallers={fallers}
                activeMemberIds={activeMemberIds}
                allianceSettings={allianceSettings}
              />
            </div>
          </div>
        </div>
        <ConfirmModal
          open={showDeleteModal}
          title="Delete Week"
          message={
            <>
              Are you sure you want to delete all duel scores and exceptions for{" "}
              <strong>Week {deleteWeekNumber}</strong>?
              <br />
              <br />
              This action cannot be undone.
            </>
          }
          loading={isDeleting}
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteWeekNumber(null);
          }}
          onConfirm={handleDeleteWeek}
        />
      </WeeksRequired>
    </MembersRequired>
  );
}
