import { useCallback, useState } from "react";
import type { EosRewardGroup } from "../../../types/derived/eos";
import { cancelRewardData, submitRewardData } from "../../../services/api";

type props = {
  loadMembers: () => void;
};

export function useSaveRewardActions({ loadMembers }: props) {
  const [isSaving, setIsSaving] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const saveReward = useCallback(
    async (
      memberId: string,
      eosReward: EosRewardGroup,
      bonusPoints: number,
      penaltyPoints: number,
    ) => {
      try {
        setIsSaving(true);
        await submitRewardData(memberId, eosReward, bonusPoints, penaltyPoints);
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

  return {
    saveReward,
    cancelReward,
    isSaving,
    isCanceling,
  };
}
