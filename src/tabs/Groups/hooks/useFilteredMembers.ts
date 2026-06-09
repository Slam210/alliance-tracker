import { useMemo } from "react";
import type { Member } from "../../../types/member";

export function useFilteredMembers(
  members: Member[],
  displayNameFilter: string[],
  timezoneFilter: string[],
) {
  return useMemo(() => {
    return members.filter((m) => {
      if (displayNameFilter.length === 0 && timezoneFilter.length === 0)
        return true;
      if (
        displayNameFilter.length > 0 &&
        displayNameFilter.includes(m.displayName || "")
      )
        return true;
      if (
        timezoneFilter.length > 0 &&
        timezoneFilter.includes(m.timezone || "")
      )
        return true;
      return false;
    });
  }, [members, displayNameFilter, timezoneFilter]);
}
