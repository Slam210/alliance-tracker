import { useCallback } from "react";
import type { Member } from "../../../types/member";
import { addMember, updateStatus, renameMember } from "../../../services/api";

type Props = {
  members: Member[];
  reloadMembers: () => Promise<void>;
};

export function useMemberActions({ members, reloadMembers }: Props) {
  const findDuplicates = useCallback(
    (name: string, nickname: string) => {
      return members.filter((m) => {
        return (
          m.name.toLowerCase() === name.toLowerCase() ||
          (nickname && m.nickname?.toLowerCase() === nickname.toLowerCase())
        );
      });
    },
    [members],
  );

  const handleAdd = useCallback(
    async (name: string, nickname: string) => {
      if (!name.trim()) return;

      const duplicates = findDuplicates(name, nickname);

      if (duplicates.length > 0) {
        const message =
          "Duplicate member(s) found:\n\n" +
          duplicates
            .map(
              (m) =>
                `• Name: ${m.name}\n  Nickname: ${
                  m.nickname || "N/A"
                }\n  Status: ${m.status}`,
            )
            .join("\n\n") +
          "\n\nDo you still want to add this member?";

        const confirmAdd = window.confirm(message);

        if (!confirmAdd) return;
      }

      await addMember(name, nickname);
      await reloadMembers();
    },
    [findDuplicates, reloadMembers],
  );

  const changeStatus = useCallback(
    async (id: string, status: string) => {
      await updateStatus(id, status);
      await reloadMembers();
    },
    [reloadMembers],
  );

  const handleRenameMember = useCallback(
    async (id: string, name?: string, nickname?: string) => {
      await renameMember(id, name, nickname);
      await reloadMembers();
    },
    [reloadMembers],
  );

  return {
    handleAdd,
    changeStatus,
    handleRenameMember,
  };
}
