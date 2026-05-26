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
    <div className="space-y-6 p-3 sm:p-6">
      {/* Calendar */}
      <div className="w-full max-w-4xl mx-auto bg-gray-800 p-3 sm:p-4 rounded">
        <DuelCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>

      {/* Member Section */}
      {selectedDate && (
        <div className="space-y-4 w-full max-w-3xl mx-auto">
          <h3 className="text-base sm:text-lg text-white text-center sm:text-left">
            {selectedDate.toDateString()}
          </h3>

          {/* Search */}
          <MemberSearch
            search={search}
            setSearch={setSearch}
            filteredMembers={filteredMembers}
            getMemberDayPoints={getMemberDayPoints}
            onSelectMember={handleSelectMember}
          />

          {/* Member Grid */}
          <MemberGrid
            members={filteredMembers}
            getMemberDayPoints={getMemberDayPoints}
            onSelectMember={handleSelectMember}
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
