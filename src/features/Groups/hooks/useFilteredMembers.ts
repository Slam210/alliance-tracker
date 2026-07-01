import { useMemo } from "react";
import type { Member } from "../../../types/member";
import { formatOffsetHours, getEffectiveOffset } from "../utils/Offset";

export function useFilteredMembers(
  members: Member[],
  display_nameFilter: string[],
  timezoneFilter: string[],
  offsetFilter: string[],
) {
  return useMemo(() => {
    return members.filter((m) => {
      if (
        display_nameFilter.length === 0 &&
        timezoneFilter.length === 0 &&
        offsetFilter.length === 0
      )
        return true;
      if (
        display_nameFilter.length > 0 &&
        display_nameFilter.includes(m.display_name || "")
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
          formatOffsetHours(getEffectiveOffset(m.display_name || "")),
        )
      )
        return true;
      return false;
    });
  }, [members, display_nameFilter, timezoneFilter, offsetFilter]);
}
