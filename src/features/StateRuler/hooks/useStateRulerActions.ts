import { useCallback, useState } from "react";
import { SubmitStateRulerParams } from "../../../types/stateRuler";
import { submitStateRuler } from "../../../services/state-ruler";

type Props = {
  loadMembers: () => Promise<void>;
  loadStateRulerData: () => Promise<void>;
};

export function useStateRulerActions({ loadMembers, loadStateRulerData }: Props) {
  const [isSaving, setIsSaving] = useState(false);

  const handleAddStateRulerData = useCallback(
    async (params: SubmitStateRulerParams) => {
      try {
        setIsSaving(true);

        await submitStateRuler(params);
        await loadMembers();
        await loadStateRulerData();
      } finally {
        setIsSaving(false);
      }
    },
    [loadMembers, loadStateRulerData],
  );

  return {
    isSaving,
    handleAddStateRulerData,
  };
}
