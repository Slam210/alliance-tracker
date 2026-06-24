import { useCallback, useState } from "react";
import type { Member } from "../../../types/member";
import { addMember, updateMember } from "../../../services/api";

type Props = {
  members: Member[];
  reloadMembers: () => Promise<void>;
};

export function safeConfirm(message: string) {
  if (typeof window === "undefined") return false;
  return window.confirm(message);
}

export function useMemberActions({ members, reloadMembers }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingStaus, setIsChangingStatus] = useState<string>("");
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

        if (!safeConfirm(message)) return;
      }

      try {
        setIsAdding(true);

        await addMember(name, nickname);
        await reloadMembers();
      } finally {
        setIsAdding(false);
      }
    },
    [findDuplicates, reloadMembers],
  );

  const changeStatus = useCallback(
    async (id: string, status: string) => {
      try {
        setIsChangingStatus(id);

        await updateMember(id, { status });
        await reloadMembers();
      } finally {
        setIsChangingStatus("");
      }
    },
    [reloadMembers],
  );

  const handleRenameMember = useCallback(
    async (
      id: string,
      name?: string,
      nickname?: string,
      timezone?: string,
      display_name?: string,
    ) => {
      try {
        setIsUpdating(true);

        await updateMember(id, { name, nickname, timezone, display_name });
        await reloadMembers();
      } finally {
        setIsUpdating(false);
      }
    },
    [reloadMembers],
  );

  return {
    handleAdd,
    changeStatus,
    handleRenameMember,
    isAdding,
    isUpdating,
    isChangingStaus,
  };
}
