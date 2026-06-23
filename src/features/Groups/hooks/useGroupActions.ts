import { useCallback, useState } from "react";
import { assignGroup } from "../../../services/api";
import type { Member } from "../../../types/member";

type Props = {
  loadMembers: () => void;
};

export function useGroupActions({ loadMembers }: Props) {
  const [isAssigning, setIsAssigning] = useState(false);

  const handleAssignGroup = useCallback(
    async (members: Member[], localMembers: Member[]) => {
      try {
        setIsAssigning(true);

        const changedMembers = localMembers.filter((local) => {
          const original = members.find((m) => m.id === local.id);
          if (!original) return false;

          return (
            original.group_number !== local.group_number ||
            original.group_leader !== local.group_leader
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
