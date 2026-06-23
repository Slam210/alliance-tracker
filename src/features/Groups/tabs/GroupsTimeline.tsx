import { useMemo, useState } from "react";
import type { Member } from "../../../types/member";

import { useFilteredMembers } from "../hooks/useFilteredMembers";
import { useGroupFilters } from "../hooks/useGroupedFilters";
import { useGroupedMembers } from "../hooks/useGroupedMembers";
import { useGroupOptions } from "../hooks/useGroupOptions";

import TimelineRow from "../components/TimelineRow";
import GroupFilters from "../components/GroupFilters";

type Props = {
  members: Member[];
};

const BASE_OFFSET = -120;

export default function GroupsTimeline({ members }: Props) {
  const {
    display_nameFilter,
    timezoneFilter,
    offsetFilter,
    setDisplayNameFilter,
    setTimezoneFilter,
    clearFilters,
    setOffsetFilter,
  } = useGroupFilters();

  const [scrollLeft, setScrollLeft] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const activeMembers = members.filter((m) => m.status === "Active");

  const filteredMembers = useFilteredMembers(
    activeMembers,
    display_nameFilter,
    timezoneFilter,
    offsetFilter,
  );

  const { display_names, timezones, offsets } = useGroupOptions(activeMembers);

  const offsetGroups = useGroupedMembers(filteredMembers);

  const rows = useMemo(() => {
    return offsetGroups
      .map((group) => ({
        offsetMinutes: group.offsetMinutes,

        display_names: group.display_names.map((d) => d.display_name),

        timezones: [
          ...new Set(
            group.display_names.flatMap((d) =>
              d.timezones.map((tz) => tz.timezone),
            ),
          ),
        ],

        memberCount: group.display_names.reduce(
          (total, display_name) =>
            total +
            display_name.timezones.reduce(
              (tzTotal, timezone) => tzTotal + timezone.members.length,
              0,
            ),
          0,
        ),
      }))
      .sort((a, b) => b.memberCount - a.memberCount);
  }, [offsetGroups]);

  return (
    <div className="space-y-8 p-3 md:p-6 text-xs sm:text-sm lg:text-base xl:text-lg">
      <GroupFilters
        display_nameFilter={display_nameFilter}
        timezoneFilter={timezoneFilter}
        display_names={display_names}
        timezones={timezones}
        setDisplayNameFilter={setDisplayNameFilter}
        setTimezoneFilter={setTimezoneFilter}
        clearFilters={clearFilters}
        offsetFilter={offsetFilter}
        setOffsetFilter={setOffsetFilter}
        offsets={offsets}
      />

      <div>
        <TimelineRow
          offsetMinutes={BASE_OFFSET}
          memberCount={0}
          isBase
          scrollLeft={scrollLeft}
          onScrollPositionChange={setScrollLeft}
          hoveredIndex={hoveredIndex}
          setHoveredIndex={setHoveredIndex}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />

        {rows.map((row) => (
          <TimelineRow
            key={row.offsetMinutes}
            offsetMinutes={row.offsetMinutes}
            memberCount={row.memberCount}
            display_names={row.display_names}
            timezones={row.timezones}
            scrollLeft={scrollLeft}
            onScrollPositionChange={setScrollLeft}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
          />
        ))}
      </div>
    </div>
  );
}
