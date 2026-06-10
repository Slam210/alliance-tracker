import { useMemo } from "react";
import type { Member } from "../../../types/member";

import { useFilteredMembers } from "../hooks/useFilteredMembers";
import { useGroupFilters } from "../hooks/useGroupedFilters";
import { useGroupedMembers } from "../hooks/useGroupedMembers";
import { useGroupOptions } from "../hooks/useGroupOptions";

import TimelineRow from "./TimelineRow";
import GroupFilters from "./GroupFilters";

type Props = {
  members: Member[];
};

const BASE_OFFSET = -120;

export default function GroupsTimeline({ members }: Props) {
  const {
    displayNameFilter,
    timezoneFilter,
    offsetFilter,
    setDisplayNameFilter,
    setTimezoneFilter,
    clearFilters,
    setOffsetFilter,
  } = useGroupFilters();

  const activeMembers = members.filter((m) => m.status === "Active");

  const filteredMembers = useFilteredMembers(
    activeMembers,
    displayNameFilter,
    timezoneFilter,
    offsetFilter,
  );

  const { displayNames, timezones, offsets } = useGroupOptions(activeMembers);

  const offsetGroups = useGroupedMembers(filteredMembers);

  const rows = useMemo(() => {
    return offsetGroups
      .map((group) => ({
        offsetMinutes: group.offsetMinutes,

        displayNames: group.displayNames.map((d) => d.displayName),

        timezones: [
          ...new Set(
            group.displayNames.flatMap((d) =>
              d.timezones.map((tz) => tz.timezone),
            ),
          ),
        ],

        memberCount: group.displayNames.reduce(
          (total, displayName) =>
            total +
            displayName.timezones.reduce(
              (tzTotal, timezone) => tzTotal + timezone.members.length,
              0,
            ),
          0,
        ),
      }))
      .sort((a, b) => b.memberCount - a.memberCount);
  }, [offsetGroups]);

  return (
    <div className="space-y-8 p-3 md:p-6  text-xs sm:text-sm lg:text-base xl:text-lg">
      <GroupFilters
        displayNameFilter={displayNameFilter}
        timezoneFilter={timezoneFilter}
        displayNames={displayNames}
        timezones={timezones}
        setDisplayNameFilter={setDisplayNameFilter}
        setTimezoneFilter={setTimezoneFilter}
        clearFilters={clearFilters}
        offsetFilter={offsetFilter}
        setOffsetFilter={setOffsetFilter}
        offsets={offsets}
      />

      <div>
        {/* Reference row */}
        <TimelineRow offsetMinutes={BASE_OFFSET} memberCount={0} isBase />

        {/* Filtered rows */}
        {rows.map((row) => (
          <TimelineRow
            key={row.offsetMinutes}
            offsetMinutes={row.offsetMinutes}
            memberCount={row.memberCount}
            displayNames={row.displayNames}
            timezones={row.timezones}
          />
        ))}
      </div>
    </div>
  );
}
