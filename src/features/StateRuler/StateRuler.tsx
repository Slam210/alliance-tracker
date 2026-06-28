import { useMemo, useState } from "react";

import type { Member } from "../../types/member";
import type {
  StateRulerResponse,
  StateRulerWeek,
} from "../../types/stateRuler";

import SearchMember from "../../components/SearchMember";

import { useStateRulerActions } from "./hooks/useStateRulerActions";

import { buildInitialWeeks } from "./utils/buildInitialWeeks";
import { createEmptyStateRulerRow } from "./utils/createEmptyStateRulerRow";

import WeekSelector from "./components/WeekSelector";
import StateRulerModal from "./components/StateRulerModal";
import MemberGrid from "./components/MemberGrid";
import { buildStateRulerPayload } from "./utils/buildStateRulerPayload";
import { updateWeekRow } from "./utils/updateWeekRow";
import { useAuth } from "../../hooks/useAuth";

type Props = {
  members: Member[];
  stateRulerData: StateRulerResponse;
  loadMembers: () => Promise<void>;
};

export default function StateRuler({
  members,
  stateRulerData,
  loadMembers,
}: Props) {
  const { role } = useAuth();

  const { isSaving, handleAddStateRulerData } = useStateRulerActions({
    reloadMembers: loadMembers,
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
      const name = String(member.nickname).toLowerCase();
      const nickname = String(member.name).toLowerCase();

      return name.includes(query) || nickname.includes(query);
    });
  }, [activeMembers, search]);

  const selectedMember = activeMembers.find(
    (member) => member.id === selectedMemberId,
  );

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
