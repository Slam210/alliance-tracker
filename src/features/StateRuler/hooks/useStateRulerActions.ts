import { useCallback, useState } from "react";
import { SubmitStateRulerParams } from "../../../types/stateRuler";
import { submitStateRuler } from "../../../services/state-ruler";

type Props = {
  reloadMembers: () => Promise<void>;
};

export function useStateRulerActions({ reloadMembers }: Props) {
  const [isSaving, setIsSaving] = useState(false);

  const handleAddStateRulerData = useCallback(
    async (params: SubmitStateRulerParams) => {
      try {
        setIsSaving(true);

        await submitStateRuler(params);
        await reloadMembers();
      } finally {
        setIsSaving(false);
      }
    },
    [reloadMembers],
  );

  return {
    isSaving,
    handleAddStateRulerData,
  };
}
