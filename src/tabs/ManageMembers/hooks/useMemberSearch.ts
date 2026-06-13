import { useMemo, useState } from "react";
import type { Member } from "../../../types/member";

export function useMemberSearch(members: Member[]) {
  const [search, setSearch] = useState("");

  const normalizedSearch = search.toLowerCase();

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const name = String(m.name ?? "").toLowerCase();
      const nickname = String(m.nickname ?? "").toLowerCase();

      return (
        name.includes(normalizedSearch) || nickname.includes(normalizedSearch)
      );
    });
  }, [members, normalizedSearch]);

  return {
    search,
    setSearch,
    filteredMembers,
  };
}
