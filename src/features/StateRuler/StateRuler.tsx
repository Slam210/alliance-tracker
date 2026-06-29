import { useMemo, useState } from "react";
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
import { updateStateRulerDate } from "../../services/state-ruler";
import { Loader2 } from "lucide-react";

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

  return (
    <div className="space-y-6 p-4 text-white">
      <WeekSelector
        weekName={currentWeek.name}
        currentIndex={selectedWeekIndex}
        totalWeeks={weeks.length}
        onChange={setSelectedWeekIndex}
      />

      <SearchMember search={search} setSearch={setSearch} />

      <div className="flex justify-center">
        <StateRulerDatePicker
          date={currentWeek.date}
          minDate={minDate}
          maxDate={maxDate}
          onChange={async (date) => {
            // optimistic update
            setWeeks((prev) =>
              prev.map((week, index) =>
                index === selectedWeekIndex
                  ? { ...week, date }
                  : week,
              ),
            );

            setIsUpdatingDate(true);

            try {
              await updateStateRulerDate({
                allianceId,
                weekName: currentWeek.name,
                date,
              });
            } catch (error) {
              console.error(error);
            } finally {
              setIsUpdatingDate(false);
            }
          }}
        />
          {isUpdatingDate && (
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          )}
      </div>

      <MemberGrid
        members={filteredMembers}
        currentWeek={currentWeek}
        onSelect={handleSelectMember}
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
    </div>
  );
}
