import { useState } from "react";

import type {
  eos_rewardGroup,
  MemberWithPoints,
} from "../../../../types/derived/eos";
import type { adjustmentType } from "../../../../types/log";

import ModalHeader from "./ModalHeader";
import ModalTabs from "./ModalTabs";
import LogsTab from "./LogsTab";
import RewardGroupCard from "./RewardGroupCard";
import AdjustmentCard from "./AdjustmentCard";
import { useAdjustmentForm } from "../../hooks/useAdjustmentForm";
import { useAuth } from "../../../../hooks/useAuth";

type Props = {
  member: MemberWithPoints;

  activeTab: "overview" | "logs";
  onTabChange: (tab: "overview" | "logs") => void;

  onClose: () => void;

  isSaving: boolean;
  handleSubmit: (group: eos_rewardGroup) => void;

  isAdding: boolean;
  handleAdd: (
    adjustmentType: adjustmentType,
    count: number,
    points: number,
    reason: string,
  ) => void;

  isDeleting: boolean;
  handleDelete: (logID: string) => void;
};

const REWARD_GROUPS: eos_rewardGroup[] = [
  "contribution",
  "key_player",
  "backbone",
  "alliance_leader",
];

export default function MemberDetailsModal({
  member,
  activeTab,
  onTabChange,
  onClose,
  isSaving,
  handleSubmit,
  isAdding,
  handleAdd,
  isDeleting,
  handleDelete,
}: Props) {
  const { role } = useAuth();
  const [rewardGroup, setRewardGroup] = useState<eos_rewardGroup>(
    member.eos_reward as eos_rewardGroup,
  );

  const {
    adjustmentType,
    setAdjustmentType,
    count,
    setCount,
    points,
    setPoints,
    reason,
    setReason,
    total,
  } = useAdjustmentForm();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        className="
          relative
          flex max-h-[90vh] w-full max-w-4xl flex-col
          overflow-auto no-scrollbar
          rounded-3xl
          border border-slate-700/60
          bg-slate-900
          shadow-2xl shadow-black/60
        "
      >
        <div
          className="
            pointer-events-none absolute inset-0
            bg-linear-to-br
            from-blue-500/10
            via-transparent
            to-cyan-500/10
          "
        />

        <ModalHeader member={member} onClose={onClose} />

        <ModalTabs activeTab={activeTab} onTabChange={onTabChange} />

        <div className="relative flex-1 overflow-y-auto no-scrollbar p-6">
          {activeTab === "overview" && role === "admin" && (
            <div className="space-y-4">
              <RewardGroupCard
                rewardGroup={rewardGroup}
                setRewardGroup={setRewardGroup}
                rewardGroups={REWARD_GROUPS}
                isSaving={isSaving}
                onClose={onClose}
                onSave={() => handleSubmit(rewardGroup)}
              />

              <AdjustmentCard
                adjustmentType={adjustmentType}
                setAdjustmentType={setAdjustmentType}
                count={count}
                setCount={setCount}
                points={points}
                setPoints={setPoints}
                reason={reason}
                setReason={setReason}
                total={total}
                isAdding={isAdding}
                onClose={onClose}
                onAdd={() => handleAdd(adjustmentType, count, points, reason)}
              />
            </div>
          )}

          {activeTab === "logs" && (
            <LogsTab
              member={member}
              isDeleting={isDeleting}
              handleDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
