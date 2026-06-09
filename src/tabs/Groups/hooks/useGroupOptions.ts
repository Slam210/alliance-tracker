import { useMemo } from "react";
import type { Member } from "../../../types/member";

export function useGroupOptions(members: Member[]) {
  const displayNames = useMemo(() => {
    return [
      ...new Set(members.map((m) => m.displayName).filter(Boolean)),
    ].sort();
  }, [members]);

  const timezones = useMemo(() => {
    return [...new Set(members.map((m) => m.timezone).filter(Boolean))].sort();
  }, [members]);

  return { displayNames, timezones };
}
