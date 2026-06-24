import { useMemo, useState } from "react";
import type { Member } from "../../../types/member";
import type { StateRulerResponse } from "../../../types/stateRuler";
import type { Week } from "../../../types/week";
import type {
  eos_rewardGroup,
  MemberWithPoints,
  PointRule,
} from "../../../types/derived/eos";

import MemberDetailsModal from "../components/EosTab/MemberDetailsModal";
import MemberList from "../components/EosTab/MemberList";

import { useMemberPoints } from "../hooks/useMemberPoints";
import { useWeeklyDailyRankings } from "../hooks/useWeeklyDailyRankings";
import { useSaveRewardActions } from "../hooks/useRewardsActions";
import type { AdjustmentLog, adjustmentType } from "../../../types/log";
import SearchMember from "../../../components/SearchMember";

type Props = {
  members: Member[];
  weeks: Week[];
  stateRulerData: StateRulerResponse | undefined;
  pointRules: PointRule[];
  loadMembers: () => void;
  loadLogs: () => void;
  logs: AdjustmentLog[];
};

export default function EosTab({
  members,
  weeks,
  stateRulerData,
  pointRules,
  loadMembers,
  loadLogs,
  logs,
}: Props) {
  const rankings = useWeeklyDailyRankings(weeks);

  const { memberPoints, search, setSearch } = useMemberPoints(
    members,
    rankings,
    stateRulerData,
    pointRules,
    logs,
  );

  const [selectedMember, setSelectedMember] = useState<MemberWithPoints | null>(
    null,
  );

  const [activeTab, setActiveTab] = useState<"overview" | "logs">("overview");

  const initialRewardMap = useMemo(() => {
    const next: Record<string, eos_rewardGroup> = {};

    members.forEach((member) => {
      next[member.id] =
        member.eos_reward === "key_player" ||
        member.eos_reward === "backbone" ||
        member.eos_reward === "alliance_leader"
          ? member.eos_reward
          : "contribution";
    });

    return next;
  }, [members]);

  const groupedMembers = useMemo(() => {
    const groups: Record<eos_rewardGroup, MemberWithPoints[]> = {
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

  const {
    saveReward,
    cancelReward,
    isSaving,
    isCanceling,
    addLog,
    isAdding,
    isDeleting,
    deleteLog,
  } = useSaveRewardActions({
    loadMembers,
    loadLogs,
  });

  const handleSubmit = async (eos_reward: eos_rewardGroup) => {
    if (!selectedMember) return;

    try {
      await saveReward(selectedMember.id, eos_reward as eos_rewardGroup);

      setSelectedMember(null);
    } catch (error) {
      console.error("Failed to save eos data", error);
    }
  };

  const handleAdd = async (
    adjustmentType: adjustmentType,
    count: number,
    points: number,
    reason: string,
  ) => {
    if (!selectedMember) {
      return;
    }

    try {
      await addLog(selectedMember.id, adjustmentType, count, points, reason);
      setSelectedMember(null);
    } catch (error) {
      console.error("Failed to save log data", error);
    }
  };

  const handleDelete = async (logID: string) => {
    if (!selectedMember) {
      return;
    }

    try {
      await deleteLog(logID);
      setSelectedMember(null);
    } catch (error) {
      console.error("Failed to delete log data", error);
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
      <SearchMember search={search} setSearch={setSearch} />
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
          isAdding={isAdding}
          handleAdd={handleAdd}
          isDeleting={isDeleting}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
}
