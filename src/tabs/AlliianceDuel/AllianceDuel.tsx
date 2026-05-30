import type { Member } from "../../types/member";
import { submitAllianceDuel } from "../../services/api";
import type { Week } from "../../types/week";
import { hasException } from "./utils/hasException";
import DuelCalendar from "./components/DuelCalendar";
import MemberSearch from "./components/MemberSearch";
import MemberGrid from "./components/MemberGrid";
import DuelEntryModal from "./components/DuelEntryModal";
import { getMemberDayPoints as getMemberDayPointsUtil } from "./utils/getMemberDayPoints";
import { useAllianceDuelState } from "./hooks/useAllianceDuelState";
import { useAllianceDuelContext } from "./hooks/useDayRequirement";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

type Props = {
  members: Member[];
  weeks: Week[];
  updatePoints: () => Promise<void>;
};

export default function AllianceDuel({ members, weeks, updatePoints }: Props) {
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
    const term = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(term) ||
      (m.nickname && m.nickname.toLowerCase().includes(term))
    );
  });

  const getMemberDayPoints = (memberId: string) =>
    getMemberDayPointsUtil(memberId, selectedDate, weeks);

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
      void updatePoints();
    }
  };

  return (
    <div className="">
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
        <button
          onClick={() => setCalendarOpen((v) => !v)}
          className="w-full flex items-center justify-between text-white"
        >
          <div className="flex items-center gap-2">
            {selectedDate ? (
              <>
                <Calendar />
                <span className="text-sm sm:text-base">
                  {selectedDate.toDateString()}
                </span>
              </>
            ) : (
              <>
                <Calendar />
                <span className="text-sm sm:text-base text-gray-300">
                  Select a date
                </span>
              </>
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
        </button>
        {/* Collapsible Calendar */}
        {calendarOpen && (
          <div className="mt-4">
            <DuelCalendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>
        )}
      </div>

      {/* Member Section */}
      {selectedDate && (
        <div className="space-y-4 w-full max-w-7xl mx-auto m-4">
          {/* Search */}
          <MemberSearch search={search} setSearch={setSearch} />

          {/* Member Grid */}
          <MemberGrid
            members={filteredMembers}
            getMemberDayPoints={getMemberDayPoints}
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
    </div>
  );
}
