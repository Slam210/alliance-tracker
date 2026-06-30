import { useEffect, useMemo, useState } from "react";
import { addDays, format, subDays } from "date-fns";
import type { Member } from "../../types/member";
import type {
  StateRulerResponse,
  StateRulerWeek,
} from "../../types/stateRuler";

import SearchMember from "../../components/SearchMember";

import { useStateRulerActions } from "./hooks/useStateRulerActions";

import { buildInitialWeeks } from "./utils/buildInitialWeeks";
import { createEmptyStateRulerRow } from "./utils/createEmptyStateRulerRow";
import StateRulerDatePicker from "./components/StateRulerDatePicker";

import WeekSelector from "./components/WeekSelector";
import StateRulerModal from "./components/StateRulerModal";
import MemberGrid from "./components/MemberGrid";
import { buildStateRulerPayload } from "./utils/buildStateRulerPayload";
import { updateWeekRow } from "./utils/updateWeekRow";
import { useAuth } from "../../hooks/useAuth";
import { deleteStateRuler, updateStateRulerDate } from "../../services/state-ruler";
import { Loader2 } from "lucide-react";
import ConfirmModal from "../../components/ConfirmPopup";

type Props = {
  members: Member[];
  stateRulerData: StateRulerResponse;
  loadMembers: () => Promise<void>;
  loadStateRulerData: () => Promise<void>;
};

export default function StateRuler({
  members,
  stateRulerData,
  loadMembers,
  loadStateRulerData,
}: Props) {
  const { allianceId, role } = useAuth();

  const { isSaving, handleAddStateRulerData } = useStateRulerActions({
    loadMembers,
    loadStateRulerData,
  });

  const activeMembers = useMemo(
    () => members.filter((m) => m.status === "Active"),
    [members],
  );

  const initialWeeks = useMemo(
    () => buildInitialWeeks(stateRulerData, activeMembers),
    [stateRulerData, activeMembers],
  );

  const [weeks, setWeeks] = useState<StateRulerWeek[]>(initialWeeks);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWeeks(initialWeeks);
  }, [initialWeeks]);

  const [entryType, setEntryType] = useState<"progress" | "clash" | "both">(
    "both",
  );

  const [selectedWeekIndex, setSelectedWeekIndex] = useState(
    initialWeeks.length - 1,
  );

  const [search, setSearch] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const [selectedRow, setSelectedRow] = useState<
    StateRulerWeek["rows"][number] | null
  >(null);

  const currentWeek = weeks[selectedWeekIndex];

  const filteredMembers = useMemo(() => {
    const query = search.toLowerCase();

    return activeMembers.filter((member) => {
      const name = String(member.name).toLowerCase();
      const nickname = String(member.nickname).toLowerCase();

      return name.includes(query) || nickname.includes(query);
    });
  }, [activeMembers, search]);

  const selectedMember = activeMembers.find(
    (member) => member.id === selectedMemberId,
  );

  const [isUpdatingDate, setIsUpdatingDate] = useState(false);
  const previousWeek = weeks[selectedWeekIndex - 1];
  const nextWeek = weeks[selectedWeekIndex + 1];

  const minDate = previousWeek?.date
    ? format(addDays(new Date(previousWeek.date), 8), "yyyy-MM-dd")
    : undefined;

  const maxDate = nextWeek?.date
    ? format(subDays(new Date(nextWeek.date), 6), "yyyy-MM-dd")
    : undefined;

  const handleSelectMember = (member: Member) => {
    const row = currentWeek.rows.find((r) => r.id === member.id);

    setSelectedMemberId(member.id);
    setSelectedRow(row ? { ...row } : createEmptyStateRulerRow(member));
  };

  const handleCancel = () => {
    setSelectedRow(null);
    setSelectedMemberId(null);
    setEntryType("both");
  };

  const handleSubmit = async () => {
    if (!selectedMember || !selectedRow) return;

    try {
      const payload = buildStateRulerPayload(
        selectedMember.id,
        currentWeek.name,
        entryType,
        selectedRow,
      );

      await handleAddStateRulerData(payload);

      setWeeks((prev) =>
        updateWeekRow(
          prev,
          selectedWeekIndex,
          selectedMember.id,
          selectedRow,
          entryType,
        ),
      );

      handleCancel();
      setSearch("");
    } catch (error) {
      console.error("Failed to save state ruler entry", error);
    }
  };

  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [showDeleteWeekModal, setShowDeleteWeekModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="space-y-6 p-4 text-white">
      <WeekSelector
        weekName={currentWeek.name}
        currentIndex={selectedWeekIndex}
        totalWeeks={weeks.length}
        onChange={setSelectedWeekIndex}
      />

      <SearchMember search={search} setSearch={setSearch} />

      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
        <StateRulerDatePicker
          date={currentWeek.date}
          minDate={minDate}
          maxDate={maxDate}
          onChange={async (date) => {
            // optimistic update
            setWeeks((prev) =>
              prev.map((week, index) =>
                index === selectedWeekIndex ? { ...week, date } : week,
              ),
            );

            setIsUpdatingDate(true);

            try {
              await updateStateRulerDate({
                allianceId,
                weekName: currentWeek.name,
                date,
              });
              await loadStateRulerData();
            } catch (error) {
              console.error(error);
            } finally {
              setIsUpdatingDate(false);
            }
          }}
        />

        <div className="flex items-center gap-3">
          {isUpdatingDate && (
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          )}

        </div>
      </div>
      <div className="flex justify-center">
        {role === "admin" && (
          <button
            onClick={() => setShowDeleteWeekModal(true)}
            className="
              rounded-xl
              border
              border-red-500/20
              bg-red-500/10
              px-4
              py-2
              text-sm
              font-medium
              text-red-300
              transition
              hover:bg-red-500
              hover:text-black
              whitespace-nowrap
              cursor-pointer
            "
          >
            Reset Week
          </button>
        )}
      </div>

      <MemberGrid
        members={filteredMembers}
        currentWeek={currentWeek}
        onSelect={handleSelectMember}
        onDelete={setMemberToDelete}
      />

      {selectedMember && selectedRow && role === "admin" && (
        <StateRulerModal
          member={selectedMember}
          row={selectedRow}
          setRow={setSelectedRow}
          weekName={currentWeek.name}
          entryType={entryType}
          setEntryType={setEntryType}
          onClose={handleCancel}
          onSave={handleSubmit}
          isSaving={isSaving}
        />
      )}
      {role === "admin" && <ConfirmModal
        open={!!memberToDelete}
        title="Delete State Ruler Entry"
        message={
          <>
            Delete the State Ruler entry for{" "}
            <strong>
              {memberToDelete?.nickname || memberToDelete?.name}
            </strong>
            ?
            <br />
            <br />
            Week: <strong>{currentWeek.name}</strong>
          </>
        }
        loading={isDeleting}
        onClose={() => setMemberToDelete(null)}
        onConfirm={async () => {
          if (!memberToDelete) return;
          setIsDeleting(true);
          try {
            await deleteStateRuler({
              weekId: Number(currentWeek.name.slice(2)),
              memberId: memberToDelete.id,
            });
            await loadStateRulerData();
            setMemberToDelete(null);
          } finally {
            setIsDeleting(false);
          }
        }}
      />}
      {role === "admin" && <ConfirmModal
        open={showDeleteWeekModal}
        title="Delete State Ruler Week"
        message={
          <>
            Delete <strong>{currentWeek.name}</strong>?
            <br />
            <br />
            All State Ruler entries for this week will be removed.
          </>
        }
        loading={isDeleting}
        onClose={() => setShowDeleteWeekModal(false)}
        onConfirm={async () => {
          setIsDeleting(true);
          try {
            await deleteStateRuler({
              weekId: Number(currentWeek.name.slice(2)),
            });
            await loadStateRulerData();
            setShowDeleteWeekModal(false);
          } finally {
            setIsDeleting(false);
          }
        }}
      />}
    </div>
  );
}
