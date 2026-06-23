import { useMemo } from "react";
import type { Member } from "../../../types/member";
import type { OffsetBucket } from "../../../types/derived/groups";
import { getEffectiveOffset } from "../utils/Offset";

export function useGroupedMembers(members: Member[]) {
  return useMemo(() => {
    const offsetMap = new Map<number, Map<string, Map<string, Member[]>>>();

    members.forEach((member) => {
      console.log(member.display_name);
      const display_name = member.display_name?.trim();
      if (!display_name) return;

      const timezoneKey = member.timezone || "No Timezone";
      const offset = getEffectiveOffset(display_name);

      if (offset === null) {
        return;
      }

      // offset group
      if (!offsetMap.has(offset)) {
        offsetMap.set(offset, new Map());
      }

      const displayMap = offsetMap.get(offset)!;

      // display_name group
      if (!displayMap.has(display_name)) {
        displayMap.set(display_name, new Map());
      }

      const timezoneMap = displayMap.get(display_name)!;

      // timezone group inside display_name
      if (!timezoneMap.has(timezoneKey)) {
        timezoneMap.set(timezoneKey, []);
      }

      timezoneMap.get(timezoneKey)!.push(member);
    });

    const result: OffsetBucket[] = Array.from(offsetMap.entries())
      .map(([offsetMinutes, displayMap]) => ({
        offsetMinutes,
        display_names: Array.from(displayMap.entries())
          .map(([display_name, timezoneMap]) => ({
            display_name,
            timezones: Array.from(timezoneMap.entries()).map(
              ([timezone, members]) => ({
                timezone,
                members,
              }),
            ),
          }))
          .sort((a, b) => a.display_name.localeCompare(b.display_name)),
      }))
      .sort((a, b) => a.offsetMinutes - b.offsetMinutes);

    return result;
  }, [members]);
}
