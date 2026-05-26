import { useMemo } from "react";
import type { Member } from "../../../types/member";

export function useMemberFilter(members: Member[], query: string) {
  return useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return members;

    return members.filter((m) => m.name.toLowerCase().includes(q));
  }, [members, query]);
}
