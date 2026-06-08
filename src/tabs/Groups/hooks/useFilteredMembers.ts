import { useMemo } from "react";
import type { Member } from "../../../types/member";

export function useFilteredMembers(
  members: Member[],
  displayNameFilter: string,
  timezoneFilter: string,
) {
  return useMemo(() => {
    return members.filter((m) => {
      if (displayNameFilter && m.displayName !== displayNameFilter)
        return false;
      if (timezoneFilter && m.timezone !== timezoneFilter) return false;
      return true;
    });
  }, [members, displayNameFilter, timezoneFilter]);
}
