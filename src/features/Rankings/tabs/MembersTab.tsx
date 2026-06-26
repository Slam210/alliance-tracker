import { useState } from "react";
import type { Member } from "../../../types/member";
import { useMemberFilter } from "../hooks/useMemberFilter";
import { useMemberStats } from "../hooks/useMemberStats";
import { MemberPicker } from "../components/MemberTab/MemberPicker";
import { MemberSummaryCards } from "../components/MemberTab/MemberSummaryCards";
import { MemberWeeklyTable } from "../components/MemberTab/MemberWeeklyTable";
import SearchMember from "../../../components/SearchMember";
import { AllianceSettings } from "../../../types/settings";
import { Week } from "../../../types/week";

type Props = {
  members: Member[];
  weeks: Week[];
  allianceSettings: AllianceSettings;
};

export default function MembersTab({ members, weeks, allianceSettings }: Props) {
  const [memberQuery, setMemberQuery] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const filteredMembers = useMemberFilter(members, memberQuery);

  const {
    selectedMemberStats,
    selectedMemberSummary,
    selectedMemberWeeklyRows,
  } = useMemberStats(weeks, selectedMemberId);

  return (
    <div className="space-y-6 p-2 sm:p-4">
      <SearchMember search={memberQuery} setSearch={setMemberQuery} />

      <MemberPicker
        members={filteredMembers}
        selectedId={selectedMemberId}
        onSelect={setSelectedMemberId}
      />

      {selectedMemberId && selectedMemberStats && (
        <div className="space-y-6 mt-4">
          <MemberSummaryCards
            summary={selectedMemberSummary}
          />

          <MemberWeeklyTable
            selectedMemberId={selectedMemberId}
            rows={selectedMemberWeeklyRows}
            allianceSettings={allianceSettings}
          />
        </div>
      )}
    </div>
  );
}
