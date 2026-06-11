import { useCallback, useState } from "react";
import { assignGroup } from "../../../services/api";
import { useAppData } from "../../../hooks/useAppData";
import type { Member } from "../../../types/member";

export function useGroupActions() {
  const { loadMembers } = useAppData();
  const [isAssigning, setIsAssigning] = useState(false);

  const handleAssignGroup = useCallback(
    async (members: Member[], localMembers: Member[]) => {
      try {
        setIsAssigning(true);

        const changedMembers = localMembers.filter((local) => {
          const original = members.find((m) => m.id === local.id);
          if (!original) return false;

          return (
            original.groupNumber !== local.groupNumber ||
            original.groupLeader !== local.groupLeader
          );
        });

        if (changedMembers.length === 0) return;

        await assignGroup(changedMembers);
        await loadMembers();
      } finally {
        setIsAssigning(false);
      }
    },
    [loadMembers],
  );

  return {
    isAssigning,
    handleAssignGroup,
  };
}
