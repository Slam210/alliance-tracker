import type { Member } from "../../types/member";
import {
  deleteAllianceDuel,
  submitAllianceDuel,
  submitAllianceDuelBatch,
  updateAllianceDuel,
} from "../../services/alliance-duel";
import { hasException } from "./utils/hasException";
import DuelCalendar from "./components/DuelCalendar";
import MemberGrid from "./components/MemberGrid";
import DuelEntryModal from "./components/DuelEntryModal";
import { getMemberEventPoints as getMemberEventPointsUtil } from "./utils/getMemberEventPoints";
import { getExemptStatus as getExemptStatusUtil } from "./utils/getExemptStatus";
import { useAllianceDuelState } from "./hooks/useAllianceDuelState";
import { useAllianceDuelContext } from "./hooks/useDayRequirement";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import BatchEditModal from "./components/BatchEditModal";
import SearchMember from "../../components/SearchMember";
import { AllianceSettings } from "../../types/settings";
import { Week } from "../../types/week";
import { useAuth } from "../../hooks/useAuth";
import LoadingOverlay from "../../components/LoadingOverlay";
import { getWeekNumber } from "../../utils/week";
import { getAllianceEventIndex } from "../../constants/week";
import { EVENT_MAP } from "./constants/event";
import ConfirmModal from "../../components/ConfirmPopup";

type Props = {
  members: Member[];
  weeks: Week[];
  loadWeeks: () => Promise<void>;
  allianceSettings: AllianceSettings;
};

export default function AllianceDuel({
  members,
  weeks,
  loadWeeks,
  allianceSettings,
}: Props) {
  const { role } = useAuth();
  const {
    selectedDate,
    setSelectedDate,
    search,
    setSearch,
    selectedMember,
    setSelectedMember,
    showPopup,
    setShowPopup,
    points,
    setPoints,
    isSubmitting,
    setIsSubmitting,
    exception,
    setException,
    showBatchPopup,
    setShowBatchPopup,
    isUpdating,
    setIsUpdating,
  } = useAllianceDuelState();

  const [calendarOpen, setCalendarOpen] = useState(true);

  const { requirement } = useAllianceDuelContext({
    selectedDate,
    START_BY_DAY: allianceSettings.start_requirements,
    END_BY_DAY: allianceSettings.max_requirements,
    TOTAL_WEEKS: allianceSettings.scale_duration,
    startDate: allianceSettings.start_date,
  });
  // Filter (Activity)
  const activeMembers = members.filter((m) => m.status === "Active");

  // Filter (name + nickname)
  const filteredMembers = activeMembers.filter((m) => {
    const term = String(search).toLowerCase();
    return (
      String(m.name).toLowerCase().includes(term) ||
      (m.nickname && String(m.nickname).toLowerCase().includes(term))
    );
  });

  const getMemberEventPoints = (memberId: string) =>
    getMemberEventPointsUtil(memberId, selectedDate, weeks, allianceSettings.start_date);

  const getExemptStatus = (memberId: string) =>
    getExemptStatusUtil(memberId, selectedDate, weeks, allianceSettings.start_date);

  function handleSelectMember(member: Member) {
    if (!selectedDate) return;
    setSelectedMember(member);
    setShowPopup(true);
    setSearch("");

    const existing = hasException(member.id, selectedDate, weeks, allianceSettings.start_date);
    setException(existing);
  }

  const handleSubmit = async () => {
    if (!selectedMember || !selectedDate) return;
    if (points === null || points < 0) return;

    try {
      setIsSubmitting(true);

      const payload = {
        id: selectedMember.id,
        name: selectedMember.name,
        date: selectedDate,
        points,
        exception,
        startDate: allianceSettings.start_date,
      };

      await submitAllianceDuel(payload);
      await loadWeeks();

      // Reset UI after success
      setShowPopup(false);
      setPoints(null);
      setSelectedMember(null);
    } catch (err) {
      console.error("Failed to submit duel:", err);
      alert("Failed to submit. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBatchSubmit = async (
    entries: {
      id: string;
      name: string;
      date: Date;
      points: number;
      exception: boolean;
    }[],
  ) => {
    try {
      setIsSubmitting(true);

      await submitAllianceDuelBatch(entries);

      await loadWeeks();

      setShowBatchPopup(false);
    } catch (err) {
      console.error("Failed to submit batch duel:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedDate) return;

    try {
      setIsUpdating(true);

      await updateAllianceDuel({
        date: selectedDate,
        startDate: allianceSettings.start_date,
      });

      await loadWeeks();
    } catch (err) {
      console.error("Failed to update:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    if (!selectedDate) return;

    try {
      setIsUpdating(true);
      const index = getAllianceEventIndex(selectedDate, allianceSettings.start_date);
      const event = EVENT_MAP[index];

      await deleteAllianceDuel({
        weekNumber: getWeekNumber(selectedDate, allianceSettings.start_date),
        event,
      });

      await loadWeeks();
    } catch (err) {
      console.error("Failed to delete:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  return (
    <>
      <LoadingOverlay
        open={isUpdating}
        text="Updating alliance duel..."
      />
      <div className="p-4">
        {/* Calendar */}
        <div
          className="
          mx-auto
          w-full
          max-w-7xl
          rounded-2xl
          border
          border-white/10
          bg-linear-to-br
          from-slate-800/90
          to-slate-900/90
          p-4
          sm:p-5
          lg:p-6
          shadow-lg
        "
        >
          {/* Header / Filter Bar */}
          <div
            onClick={() => setCalendarOpen((v) => !v)}
            className="w-full flex items-center justify-between text-white"
          >
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2">
                <Calendar />
                {selectedDate ? (
                  <span className="text-sm sm:text-base">
                    {selectedDate.toDateString()}
                  </span>
                ) : (
                  <span className="text-sm sm:text-base text-gray-300">
                    Select a date
                  </span>
                )}
              </div>
              {selectedDate && requirement && (
                <div className="text-sm sm:text-base text-blue-300">
                  Requirement: {requirement.toLocaleString()}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-gray-300">
              {selectedDate && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDate(null);
                    setCalendarOpen(true);
                  }}
                  className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition text-blue-300 cursor-pointer"
                >
                  Clear
                </button>
              )}

              {calendarOpen ? (
                <ChevronUp className="cursor-pointer" />
              ) : (
                <ChevronDown className="cursor-pointer" />
              )}
            </div>
          </div>
          {/* Collapsible Calendar */}
          {calendarOpen && (
            <div className="mt-4">
              <DuelCalendar
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                setCalendarOpen={setCalendarOpen}
                startDate={allianceSettings.start_date}
              />
            </div>
          )}
        </div>

        {/* Member Section */}
        {selectedDate && (
          <div className="space-y-4 w-full max-w-7xl mx-auto m-4">
            {/* Search */}
            <div className="flex gap-2">
              <div className="flex-1">
                <SearchMember search={search} setSearch={setSearch} />
              </div>

              {role === "admin" && <button
                onClick={() => handleUpdate()}
                className="
                rounded-xl
                border
                border-green-500/20
                bg-green-500/10
                px-4
                h-fit
                my-auto
                py-2
                text-sm
                font-medium
                text-green-300
                transition
                hover:bg-green-500
                hover:text-black
                cursor-pointer
                whitespace-nowrap
              "
              >
                Update
              </button>}

              {role === "admin" && <button
                onClick={() => setShowBatchPopup(true)}
                className="
                rounded-xl
                border
                border-blue-500/20
                bg-blue-500/10
                px-4
                h-fit
                my-auto
                py-2
                text-sm
                font-medium
                text-blue-300
                transition
                hover:bg-blue-500
                hover:text-black
                cursor-pointer
                whitespace-nowrap
              "
              >
                Batch
              </button>}

              {role === "admin" && <button
                onClick={() => setShowDeleteModal(true)}
                className="
                rounded-xl
                border
                border-red-500/20
                bg-red-500/10
                px-4
                h-fit
                my-auto
                py-2
                text-sm
                font-medium
                text-red-300
                transition
                hover:bg-red-500
                hover:text-black
                cursor-pointer
                whitespace-nowrap
              "
              >
                Delete
              </button>}
            </div>

            {/* Member Grid */}
            <MemberGrid
              members={filteredMembers}
              getMemberEventPoints={getMemberEventPoints}
              selectedDate={selectedDate}
              getExemptStatus={getExemptStatus}
              onSelectMember={handleSelectMember}
              requirement={requirement}
              startDate={allianceSettings.start_date}
              onDeleteMember={setMemberToDelete}
            />
          </div>
        )}

        {/* Popup Modal */}
        {role === "admin" && <DuelEntryModal
          open={showPopup}
          member={selectedMember}
          selectedDate={selectedDate}
          points={points}
          setPoints={setPoints}
          exception={exception}
          setException={setException}
          isSubmitting={isSubmitting}
          currentPoints={
            selectedMember ? getMemberEventPoints(selectedMember.id) : null
          }
          onClose={() => {
            setShowPopup(false);
            setPoints(null);
            setSelectedMember(null);
          }}
          onSubmit={handleSubmit}
        />}

        {role === "admin" && <BatchEditModal
          open={showBatchPopup}
          members={activeMembers}
          selectedDate={selectedDate}
          isSubmitting={isSubmitting}
          onClose={() => {
            setShowBatchPopup(false);
          }}
          onSubmit={handleBatchSubmit}
          allianceSettings={allianceSettings}
          getMemberEventPoints={getMemberEventPoints}
        />}
        {role === "admin" && <ConfirmModal
          open={showDeleteModal}
          title="Delete Duel Scores"
          message={
            <>
              Are you sure you want to delete all duel scores for{" "}
              <strong>{selectedDate?.toDateString()}</strong>?
              <br />
              <strong>Event: {EVENT_MAP[getAllianceEventIndex(selectedDate!, allianceSettings.start_date)]}</strong>
              <br />
              This action cannot be undone.
            </>
          }
          loading={isUpdating}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={async () => {
            await handleDelete();
            setShowDeleteModal(false);
          }}
        />}
        {role === "admin" && <ConfirmModal
          open={!!memberToDelete}
          title="Delete Duel Entry"
          message={
            <>
              Are you sure you want to delete the duel score for{" "}
              <strong>{memberToDelete?.nickname || memberToDelete?.name}</strong>?
              <br />
              <strong>
                Event: {EVENT_MAP[getAllianceEventIndex(selectedDate!, allianceSettings.start_date)]}
              </strong>
              <br />
              This action cannot be undone.
            </>
          }
          loading={isUpdating}
          onClose={() => setMemberToDelete(null)}
          onConfirm={async () => {
            if (!memberToDelete || !selectedDate) return;

            const index = getAllianceEventIndex(
              selectedDate,
              allianceSettings.start_date
            );

            await deleteAllianceDuel({
              weekNumber: getWeekNumber(
                selectedDate,
                allianceSettings.start_date
              ),
              event: EVENT_MAP[index],
              memberId: memberToDelete.id,
            });

            await loadWeeks();

            setMemberToDelete(null);
          }}
        />}
      </div>
    </>
  );
}
