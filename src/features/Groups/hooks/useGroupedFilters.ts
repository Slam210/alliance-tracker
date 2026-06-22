import { useState } from "react";

export function useGroupFilters() {
  const [displayNameFilter, setDisplayNameFilter] = useState<string[]>([]);
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
    displayNameFilter,
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
