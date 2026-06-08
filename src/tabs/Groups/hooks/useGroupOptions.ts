import { useMemo } from "react";
import type { Member } from "../../../types/member";

export function useGroupOptions(
  members: Member[],
  displayNameFilter: string,
  timezoneFilter: string,
) {
  const displayNames = useMemo(() => {
    return [
      ...new Set(
        members
          .filter((m) => !timezoneFilter || m.timezone === timezoneFilter)
          .map((m) => m.displayName)
          .filter(Boolean),
      ),
    ].sort();
  }, [members, timezoneFilter]);

  const timezones = useMemo(() => {
    return [
      ...new Set(
        members
          .filter(
            (m) => !displayNameFilter || m.displayName === displayNameFilter,
          )
          .map((m) => m.timezone)
          .filter(Boolean),
      ),
    ].sort();
  }, [members, displayNameFilter]);

  return { displayNames, timezones };
}
