import { useMemo, useState } from "react";
import type { Member } from "../../../types/member";
import type { StateRulerResponse } from "../../../types/stateRuler";
import type { Week } from "../../../types/week";
import type {
  EosRewardGroup,
  MemberWithPoints,
  PointRule,
} from "../../../types/derived/eos";

import MemberDetailsModal from "../components/EosTab/MemberDetailsModal";
import MemberList from "../components/EosTab/MemberList";

import { useMemberPoints } from "../hooks/useMemberPoints";
import { useWeeklyDailyRankings } from "../hooks/useWeeklyDailyRankings";
import { useSaveRewardActions } from "../hooks/useRewardsActions";

type Props = {
  members: Member[];
  weeks: Week[];
  stateRulerData: StateRulerResponse;
  pointRules: PointRule[];
  loadMembers: () => void;
};

export default function EosTab({
  members,
  weeks,
  stateRulerData,
  pointRules,
  loadMembers,
}: Props) {
  const rankings = useWeeklyDailyRankings(weeks);

  const { memberPoints, search, setSearch } = useMemberPoints(
    members,
    rankings,
    stateRulerData,
    pointRules,
  );

  const [selectedMember, setSelectedMember] = useState<MemberWithPoints | null>(
    null,
  );

  const [activeTab, setActiveTab] = useState<"overview" | "logs">("overview");

  const initialRewardMap = useMemo(() => {
    const next: Record<string, EosRewardGroup> = {};

    members.forEach((member) => {
      next[member.id] =
        member.eosReward === "key_player" ||
        member.eosReward === "backbone" ||
        member.eosReward === "alliance_leader"
          ? member.eosReward
          : "contribution";
    });

    return next;
  }, [members]);

  const groupedMembers = useMemo(() => {
    const groups: Record<EosRewardGroup, MemberWithPoints[]> = {
      contribution: [],
      key_player: [],
      backbone: [],
      alliance_leader: [],
    };

    Object.values(memberPoints)
      .sort((a, b) => b.points - a.points)
      .forEach((member) => {
        groups[initialRewardMap[member.id] ?? "contribution"].push(member);
      });

    return groups;
  }, [memberPoints, initialRewardMap]);

  const { saveReward, cancelReward, isSaving, isCanceling } =
    useSaveRewardActions({
      loadMembers,
    });

  const handleSubmit = async (
    eosReward: EosRewardGroup,
    bonus: number,
    penalty: number,
  ) => {
    if (!selectedMember) return;

    try {
      await saveReward(
        selectedMember.id,
        eosReward as EosRewardGroup,
        Number(bonus) || 0,
        Number(penalty) || 0,
      );

      setSelectedMember(null);
    } catch (error) {
      console.error("Failed to save eos data", error);
    }
  };

  const handleXClick = async (memberId: string) => {
    if (!memberId || memberId === "") return;

    try {
      await cancelReward(memberId);
    } catch (error) {
      console.error("Failed to reset eos data", error);
    }
  };

  return (
    <div className="space-y-6 p-4 text-white">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search member..."
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
      />
      <MemberList
        groups={groupedMembers}
        onSelect={(member) => {
          setSelectedMember(member);
          setActiveTab("overview");
        }}
        handleXClick={handleXClick}
        isCanceling={isCanceling}
      />

      {selectedMember && (
        <MemberDetailsModal
          key={selectedMember.id}
          member={selectedMember}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onClose={() => setSelectedMember(null)}
          isSaving={isSaving}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
