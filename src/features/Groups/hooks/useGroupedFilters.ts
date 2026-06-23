import { useState } from "react";

export function useGroupFilters() {
  const [display_nameFilter, setDisplayNameFilter] = useState<string[]>([]);
  const [timezoneFilter, setTimezoneFilter] = useState<string[]>([]);
  const [offsetFilter, setOffsetFilter] = useState<string[]>([]);

  const [groupByDisplayName, setGroupByDisplayName] = useState(true);
  const [groupByTimezone, setGroupByTimezone] = useState(true);

  const clearFilters = () => {
    setDisplayNameFilter([]);
    setTimezoneFilter([]);
    setOffsetFilter([]);
  };

  return {
    display_nameFilter,
    timezoneFilter,
    offsetFilter,
    groupByDisplayName,
    groupByTimezone,
    setDisplayNameFilter,
    setTimezoneFilter,
    setOffsetFilter,
    setGroupByDisplayName,
    setGroupByTimezone,
    clearFilters,
  };
}
