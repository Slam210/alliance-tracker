import { useMemo } from "react";
import type { Member } from "../../../types/member";
import { formatOffsetHours, getEffectiveOffset } from "../utils/Offset";

export function useGroupOptions(members: Member[]) {
  const display_names = useMemo(() => {
    return [
      ...new Set(members.map((m) => m.display_name).filter(Boolean)),
    ].sort();
  }, [members]);

  const timezones = useMemo(() => {
    return [...new Set(members.map((m) => m.timezone).filter(Boolean))].sort();
  }, [members]);

  const offsets = useMemo(() => {
    return [
      ...new Set(
        members
          .map((m) => formatOffsetHours(getEffectiveOffset(m.display_name)))
          .filter(Boolean),
      ),
    ].sort();
  }, [members]);

  return { display_names, timezones, offsets };
}
