import { useMemo } from "react";
import type { Member } from "../../../types/member";
import { formatOffsetHours, getEffectiveOffset } from "../utils/Offset";

export function useGroupOptions(members: Member[]) {
  const displayNames = useMemo(() => {
    return [
      ...new Set(members.map((m) => m.displayName).filter(Boolean)),
    ].sort();
  }, [members]);

  const timezones = useMemo(() => {
    return [...new Set(members.map((m) => m.timezone).filter(Boolean))].sort();
  }, [members]);

  const offsets = useMemo(() => {
    return [
      ...new Set(
        members
          .map((m) => formatOffsetHours(getEffectiveOffset(m.displayName)))
          .filter(Boolean),
      ),
    ].sort();
  }, [members]);

  return { displayNames, timezones, offsets };
}
