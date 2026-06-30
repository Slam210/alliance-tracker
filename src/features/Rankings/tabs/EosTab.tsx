import { useMemo, useState } from "react";
import type { Member } from "../../../types/member";
import type { StateRulerResponse } from "../../../types/stateRuler";
import type { Week } from "../../../types/week";
import type {
  eos_rewardGroup,
  MemberWithPoints,
  PointRule,
} from "../../../types/derived/eos";

import MembersRequired from "../../../components/required/MembersRequired";
import MemberDetailsModal from "../components/EosTab/MemberDetailsModal";
import MemberList from "../components/EosTab/MemberList";

import { useWeeklyDailyRankings } from "../hooks/useWeeklyDailyRankings";
import { useSaveRewardActions } from "../hooks/useRewardsActions";
import type { AdjustmentLog, adjustmentType } from "../../../types/log";
import SearchMember from "../../../components/SearchMember";
import { AllianceSettings } from "../../../types/settings";
import { useAuth } from "../../../hooks/useAuth";
import { useMemberPoints } from "../hooks/useMemberPoints";

type Props = {
  members: Member[];
  weeks: Week[];
  stateRulerData: StateRulerResponse | undefined;
  pointRules: PointRule[];
  loadMembers: () => void;
  loadLogs: () => void;
  logs: AdjustmentLog[];
  allianceSettings: AllianceSettings;
};

export default function EosTab({
  members,
  weeks,
  stateRulerData,
  pointRules,
  loadMembers,
  loadLogs,
  logs,
  allianceSettings,
}: Props) {
  const { role } = useAuth();

  const rankings = useWeeklyDailyRankings(weeks, allianceSettings);

  const { memberPoints, search, setSearch } = useMemberPoints(
    members,
    rankings,
    stateRulerData,
    pointRules,
    logs,
  );

  const [selectedMember, setSelectedMember] =
    useState<MemberWithPoints | null>(null);

  const [activeTab, setActiveTab] = useState<"overview" | "logs">("overview");

  /**
   * 1. GLOBAL RANK (stable, never changes with search or grouping)
   */
  const rankedMembers = useMemo(() => {
    if (!memberPoints) return [];

    return Object.values(memberPoints)
      .sort((a, b) => b.points - a.points)
      .map((m, index) => ({
        ...m,
        globalRank: index + 1,
      }));
  }, [memberPoints]);

  /**
   * 2. INITIAL REWARD MAP (stable group assignment)
   */
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

  /**
   * 3. GROUP MEMBERS (from ranked list, NOT raw list)
   */
  const groupedMembers = useMemo(() => {
    const groups: Record<eos_rewardGroup, (MemberWithPoints & { globalRank: number })[]> = {
      contribution: [],
      key_player: [],
      backbone: [],
      alliance_leader: [],
    };

    rankedMembers.forEach((member) => {
      groups[initialRewardMap[member.id] ?? "contribution"].push(member);
    });

    return groups;
  }, [rankedMembers, initialRewardMap]);

  /**
   * 4. SEARCH FILTER (does NOT affect ranking)
   */
  const visibleGroups = useMemo(() => {
    if (!search) return groupedMembers;

    const lower = search.toLowerCase();

    const filtered: typeof groupedMembers = {
      contribution: [],
      key_player: [],
      backbone: [],
      alliance_leader: [],
    };

    rankedMembers
      .filter((m) =>
        (m.nickname || m.name).toLowerCase().includes(lower)
      )
      .forEach((m) => {
        filtered[initialRewardMap[m.id] ?? "contribution"].push(m);
      });

    return filtered;
  }, [search, rankedMembers, groupedMembers, initialRewardMap]);

  const {
    saveReward,
    cancelReward,
    isSaving,
    isCanceling,
    addLog,
    isAdding,
    isDeleting,
    deleteLog,
  } = useSaveRewardActions({ loadMembers, loadLogs });

  const handleSubmit = async (eos_reward: eos_rewardGroup) => {
    if (!selectedMember) return;

    await saveReward(selectedMember.id, eos_reward);
    loadMembers();
    loadLogs();
    setSearch("");
    setSelectedMember(null);
  };

  const handleAdd = async (
    adjustmentType: adjustmentType,
    count: number,
    points: number,
    reason: string,
  ) => {
    if (!selectedMember) return;

    await addLog(selectedMember.id, adjustmentType, count, points, reason);
    loadLogs();
    setSearch("");
    setSelectedMember(null);
  };

  const handleDelete = async (logID: string) => {
    if (!selectedMember) return;

    await deleteLog(logID);
    loadLogs();
    setSearch("");
    setSelectedMember(null);
  };

  const handleXClick = async (memberId: string) => {
    if (!memberId) return;

    await cancelReward(memberId);
  };

  return (
    <MembersRequired members={members}>
      <div className="space-y-6 p-4 text-white">
        <SearchMember search={search} setSearch={setSearch} />

        <MemberList
          groups={visibleGroups}
          onSelect={(member) => {
            setSelectedMember(member);
            setActiveTab("overview");
          }}
          handleXClick={handleXClick}
          isCanceling={isCanceling}
        />

        {selectedMember && role === "admin" && (
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
    </MembersRequired>
  );
}
