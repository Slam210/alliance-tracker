import { useState } from "react";
import type { Member } from "../../../types/member";

export type GroupConfig = {
  groupNumber: string;
  utcGroup: string;
};

export function useGroupEditor(members: Member[]) {
  const [localMembers, setLocalMembers] = useState<Member[]>(members);

  const activeMembers = localMembers.filter(
    (member) => member.status === "Active",
  );

  const [groups, setGroups] = useState<GroupConfig[]>(() => {
    const existing = activeMembers
      .map((m) => m.groupNumber)
      .filter((g): g is string => g !== "");

    return Array.from(new Set(existing))
      .map(Number)
      .sort((a, b) => a - b)
      .map((groupNumber) => ({
        groupNumber: String(groupNumber),
        utcGroup: "",
      }));
  });

  const handleDrop = (memberId: string, groupNumber: string | "") => {
    if (groupNumber !== "") {
      setGroups((prev) =>
        prev.some((group) => group.groupNumber === groupNumber)
          ? prev
          : [...prev, { groupNumber, utcGroup: "" }],
      );
    }

    setLocalMembers((prev) =>
      prev.map((member) =>
        member.id === memberId
          ? {
              ...member,
              groupNumber,
              ...(groupNumber === "" ? { groupLeader: false } : {}),
            }
          : member,
      ),
    );
  };

  const setLeader = (memberId: string, groupNumber: string) => {
    setLocalMembers((prev) =>
      prev.map((member) =>
        member.groupNumber === groupNumber
          ? {
              ...member,
              groupLeader: member.id === memberId,
            }
          : member,
      ),
    );
  };

  const createGroup = () => {
    setGroups((prev) => {
      const max = prev.length
        ? Math.max(...prev.map((g) => Number(g.groupNumber)))
        : 0;

      const next = String(max + 1);

      if (prev.some((g) => g.groupNumber === next)) {
        return prev;
      }

      return [
        ...prev,
        {
          groupNumber: next,
          utcGroup: "",
        },
      ];
    });
  };

  const deleteGroup = (groupKey: string) => {
    setGroups((prev) => prev.filter((g) => g.groupNumber !== groupKey));

    setLocalMembers((prev) =>
      prev.map((m) =>
        m.groupNumber === groupKey
          ? {
              ...m,
              groupNumber: "",
              groupLeader: false,
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
              groupNumber: "",
              groupLeader: false,
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
