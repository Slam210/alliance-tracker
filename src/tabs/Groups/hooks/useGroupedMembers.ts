import { useMemo } from "react";
import type { Member } from "../../../types/member";
import type { OffsetBucket } from "../../../types/derived/groups";
import { getEffectiveOffset } from "../utils/Offset";

export function useGroupedMembers(members: Member[]) {
  return useMemo(() => {
    const offsetMap = new Map<number, Map<string, Map<string, Member[]>>>();

    members.forEach((member) => {
      const displayName = member.displayName?.trim();
      if (!displayName) return;

      const timezoneKey = member.timezone || "No Timezone";
      const offset = getEffectiveOffset(displayName);

      // offset group
      if (!offsetMap.has(offset)) {
        offsetMap.set(offset, new Map());
      }

      const displayMap = offsetMap.get(offset)!;

      // displayName group
      if (!displayMap.has(displayName)) {
        displayMap.set(displayName, new Map());
      }

      const timezoneMap = displayMap.get(displayName)!;

      // timezone group inside displayName
      if (!timezoneMap.has(timezoneKey)) {
        timezoneMap.set(timezoneKey, []);
      }

      timezoneMap.get(timezoneKey)!.push(member);
    });

    const result: OffsetBucket[] = Array.from(offsetMap.entries())
      .map(([offsetMinutes, displayMap]) => ({
        offsetMinutes,
        displayNames: Array.from(displayMap.entries())
          .map(([displayName, timezoneMap]) => ({
            displayName,
            timezones: Array.from(timezoneMap.entries()).map(
              ([timezone, members]) => ({
                timezone,
                members,
              }),
            ),
          }))
          .sort((a, b) => a.displayName.localeCompare(b.displayName)),
      }))
      .sort((a, b) => a.offsetMinutes - b.offsetMinutes);

    return result;
  }, [members]);
}
