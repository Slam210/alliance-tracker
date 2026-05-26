import { useMemo, useState } from "react";
import type { Member } from "../../../types/member";

export function useMemberSearch(members: Member[]) {
  const [search, setSearch] = useState("");

  const filteredMembers = useMemo(() => {
    return members.filter(
      (m) =>
        m.name?.toLowerCase().includes(search.toLowerCase()) ||
        m.nickname?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [members, search]);

  return {
    search,
    setSearch,
    filteredMembers,
  };
}
