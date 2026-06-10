import { useMemo } from "react";
import type { Member } from "../../../types/member";
import { formatOffsetHours, getEffectiveOffset } from "../utils/Offset";

export function useFilteredMembers(
  members: Member[],
  displayNameFilter: string[],
  timezoneFilter: string[],
  offsetFilter: string[],
) {
  return useMemo(() => {
    return members.filter((m) => {
      if (
        displayNameFilter.length === 0 &&
        timezoneFilter.length === 0 &&
        offsetFilter.length === 0
      )
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
      if (
        offsetFilter.length > 0 &&
        offsetFilter.includes(
          formatOffsetHours(getEffectiveOffset(m.displayName || "")),
        )
      )
        return true;
      return false;
    });
  }, [members, displayNameFilter, timezoneFilter, offsetFilter]);
}
