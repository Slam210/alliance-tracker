import { useCallback, useState } from "react";
import { submitStateRuler } from "../../../services/api";
import { SubmitStateRulerParams } from "../../../types/stateRuler";

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
