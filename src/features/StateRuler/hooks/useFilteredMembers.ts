import { useMemo } from "react";
import type { Member } from "../../../types/member";

export function useFilteredMembers(activeMembers: Member[], search: string) {
  return useMemo(() => {
    const query = search.toLowerCase();

    return activeMembers.filter((member) => {
      const name = String(
        member.nickname ? member.nickname : member.name,
      ).toLowerCase();

      return name.includes(query);
    });
  }, [activeMembers, search]);
}
