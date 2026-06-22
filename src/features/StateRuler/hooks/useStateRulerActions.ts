import { useCallback, useState } from "react";
import { submitStateRuler } from "../../../services/api";

type Props = {
  reloadMembers: () => Promise<void>;
};

export function useStateRulerActions({ reloadMembers }: Props) {
  const [isSaving, setIsSaving] = useState(false);

  const handleAddStateRulerData = useCallback(
    async (
      id: string,
      name: string,
      type: string,
      sheetName: string,
      progressRank?: number,
      progressScore?: number,
      clashRank?: number,
      clashScore?: number,
    ) => {
      try {
        setIsSaving(true);

        await submitStateRuler({
          id,
          name,
          type,
          sheetName,
          progressRank,
          progressScore,
          clashRank,
          clashScore,
        });
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
