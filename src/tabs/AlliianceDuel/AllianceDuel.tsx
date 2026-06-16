import type { Member } from "../../types/member";
import {
  submitAllianceDuel,
  submitAllianceDuelBatch,
} from "../../services/api";
import type { EntryType, Week } from "../../types/week";
import { hasException } from "./utils/hasException";
import DuelCalendar from "./components/DuelCalendar";
import MemberSearch from "./components/MemberSearch";
import MemberGrid from "./components/MemberGrid";
import DuelEntryModal from "./components/DuelEntryModal";
import { getMemberDayPoints as getMemberDayPointsUtil } from "./utils/getMemberDayPoints";
import { getExemptStatus as getExemptStatusUtil } from "./utils/getExemptStatus";
import { useAllianceDuelState } from "./hooks/useAllianceDuelState";
import { useAllianceDuelContext } from "./hooks/useDayRequirement";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import BatchEditModal from "./components/BatchEditModal";

type Props = {
  members: Member[];
  weeks: Week[];
  loadWeeks: () => Promise<void>;
};

export default function AllianceDuel({ members, weeks, loadWeeks }: Props) {
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
    entryType,
    setEntryType,
    exception,
    setException,
    showBatchPopup,
    setShowBatchPopup,
  } = useAllianceDuelState();

  const [calendarOpen, setCalendarOpen] = useState(true);

  const { requirement } = useAllianceDuelContext({
    selectedDate,
    weeks,
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

  const getMemberDayPoints = (memberId: string) =>
    getMemberDayPointsUtil(memberId, selectedDate, weeks);

  const getExemptStatus = (memberId: string) =>
    getExemptStatusUtil(memberId, selectedDate, weeks);

  function handleSelectMember(member: Member) {
    if (!selectedDate) return;
    setSelectedMember(member);
    setShowPopup(true);
    setSearch("");

    const existing = hasException(member.id, selectedDate, weeks);
    setException(existing);
  }

  const handleSubmit = async () => {
    if (!selectedMember || !selectedDate) return;
    if (!entryType) {
      alert("Please select an entry type");
      return;
    }
    if (points === null || points < 0) return;

    try {
      setIsSubmitting(true);

      await submitAllianceDuel({
        id: selectedMember.id,
        name: selectedMember.name,
        entryType: entryType,
        date: selectedDate,
        points,
        exception,
      });
      await loadWeeks();

      // Reset UI after success
      setShowPopup(false);
      setPoints(null);
      setSelectedMember(null);
      setEntryType(null);
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
      entryType: EntryType;
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

  return (
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
              <MemberSearch search={search} setSearch={setSearch} />
            </div>

            <button
              onClick={() => setShowBatchPopup(true)}
              className="
              rounded-xl
              border
              border-blue-500/20
              bg-blue-500/10
              px-4
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
            </button>
          </div>

          {/* Member Grid */}
          <MemberGrid
            members={filteredMembers}
            getMemberDayPoints={getMemberDayPoints}
            getExemptStatus={getExemptStatus}
            onSelectMember={handleSelectMember}
            requirement={requirement}
          />
        </div>
      )}

      {/* Popup Modal */}
      <DuelEntryModal
        open={showPopup}
        member={selectedMember}
        selectedDate={selectedDate}
        points={points}
        setPoints={setPoints}
        entryType={entryType}
        setEntryType={setEntryType}
        exception={exception}
        setException={setException}
        isSubmitting={isSubmitting}
        currentPoints={
          selectedMember ? getMemberDayPoints(selectedMember.id) : null
        }
        onClose={() => {
          setShowPopup(false);
          setPoints(null);
          setSelectedMember(null);
          setEntryType(null);
        }}
        onSubmit={handleSubmit}
        isSunday={selectedDate?.getDay() === 0}
      />

      <BatchEditModal
        open={showBatchPopup}
        members={filteredMembers}
        selectedDate={selectedDate}
        isSubmitting={isSubmitting}
        isSunday={selectedDate?.getDay() === 0}
        onClose={() => setShowBatchPopup(false)}
        onSubmit={handleBatchSubmit}
      />
    </div>
  );
}
