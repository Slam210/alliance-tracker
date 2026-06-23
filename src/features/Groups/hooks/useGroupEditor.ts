import { useState } from "react";
import type { Member } from "../../../types/member";

export type GroupConfig = {
  group_number: number;
  utcGroup: string;
};

export function useGroupEditor(members: Member[]) {
  const [localMembers, setLocalMembers] = useState<Member[]>(members);

  const activeMembers = localMembers.filter(
    (member) => member.status === "Active",
  );

  const [groups, setGroups] = useState<GroupConfig[]>(() => {
    const existing = activeMembers
      .map((m) => m.group_number)
      .filter((g): g is number => g !== null);

    return Array.from(new Set(existing))
      .map(Number)
      .sort((a, b) => a - b)
      .map((group_number) => ({
        group_number: group_number,
        utcGroup: "",
      }));
  });

  const handleDrop = (memberId: string, group_number: number | null) => {
    if (group_number !== null) {
      setGroups((prev) =>
        prev.some((group) => group.group_number === group_number)
          ? prev
          : [...prev, { group_number, utcGroup: "" }],
      );
    }

    setLocalMembers((prev) =>
      prev.map((member) =>
        member.id === memberId
          ? {
              ...member,
              group_number,
              ...(group_number === null ? { group_leader: false } : {}),
            }
          : member,
      ),
    );
  };

  const setLeader = (memberId: string, group_number: number) => {
    setLocalMembers((prev) =>
      prev.map((member) =>
        member.group_number === group_number
          ? {
              ...member,
              group_leader: member.id === memberId,
            }
          : member,
      ),
    );
  };

  const createGroup = () => {
    setGroups((prev) => {
      const max = prev.length
        ? Math.max(...prev.map((g) => g.group_number))
        : 0;

      const next = max + 1;

      if (prev.some((g) => g.group_number === next)) {
        return prev;
      }

      return [
        ...prev,
        {
          group_number: next,
          utcGroup: "",
        },
      ];
    });
  };

  const deleteGroup = (groupKey: number) => {
    setGroups((prev) => prev.filter((g) => g.group_number !== groupKey));

    setLocalMembers((prev) =>
      prev.map((m) =>
        m.group_number === groupKey
          ? {
              ...m,
              group_number: null,
              group_leader: false,
            }
          : m,
      ),
    );
  };

  const removeMember = (memberId: string) => {
    setLocalMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              group_number: null,
              group_leader: false,
            }
          : m,
      ),
    );
  };

  return {
    groups,
    setGroups,
    localMembers,
    setLocalMembers,
    activeMembers,
    handleDrop,
    setLeader,
    createGroup,
    deleteGroup,
    removeMember,
  };
}
