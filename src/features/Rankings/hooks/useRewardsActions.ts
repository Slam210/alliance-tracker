import { useCallback, useState } from "react";
import type { eos_rewardGroup } from "../../../types/derived/eos";
import type { adjustmentType } from "../../../types/log";
import { cancelRewardData, updateMember } from "../../../services/member";
import { addAdjustmentLog, deleteAdjustmentLog } from "../../../services/log";

type props = {
  loadMembers: () => void;
  loadLogs: () => void;
};

export function useSaveRewardActions({ loadMembers, loadLogs }: props) {
  const [isSaving, setIsSaving] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const saveReward = useCallback(
    async (memberId: string, eos_reward: eos_rewardGroup) => {
      try {
        setIsSaving(true);
        await updateMember(memberId, { eos_reward });
        loadMembers();
      } catch (err) {
        console.error("Failed to save reward:", err);
      } finally {
        setIsSaving(false);
      }
    },
    [loadMembers],
  );

  const cancelReward = useCallback(
    async (memberId: string) => {
      try {
        setIsCanceling(true);
        await cancelRewardData(memberId);
        loadMembers();
      } catch (err) {
        console.error("Failed to save reward:", err);
      } finally {
        setIsCanceling(false);
      }
    },
    [loadMembers],
  );

  const addLog = useCallback(
    async (
      memberID: string,
      adjustmentType: adjustmentType,
      count: number,
      points: number,
      reason: string,
    ) => {
      try {
        setIsAdding(true);
        await addAdjustmentLog({
          memberID,
          adjustmentType,
          count,
          points,
          reason,
        });
        loadLogs();
      } catch (err) {
        console.error("Failed to save reward:", err);
      } finally {
        setIsAdding(false);
      }
    },
    [loadLogs],
  );

  const deleteLog = useCallback(
    async (logID: string) => {
      try {
        setIsDeleting(true);
        await deleteAdjustmentLog(logID);
        loadLogs();
      } catch (err) {
        console.error("Failed to save reward:", err);
      } finally {
        setIsDeleting(false);
      }
    },
    [loadLogs],
  );

  return {
    saveReward,
    cancelReward,
    isSaving,
    isCanceling,
    isAdding,
    addLog,
    isDeleting,
    deleteLog,
  };
}
