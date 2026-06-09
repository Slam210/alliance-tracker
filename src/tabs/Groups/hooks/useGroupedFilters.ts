import { useState } from "react";

export function useGroupFilters() {
  const [displayNameFilter, setDisplayNameFilter] = useState<string[]>([]);
  const [timezoneFilter, setTimezoneFilter] = useState<string[]>([]);

  const [groupByDisplayName, setGroupByDisplayName] = useState(true);
  const [groupByTimezone, setGroupByTimezone] = useState(true);

  const clearFilters = () => {
    setDisplayNameFilter([]);
    setTimezoneFilter([]);
  };

  return {
    displayNameFilter,
    timezoneFilter,
    groupByDisplayName,
    groupByTimezone,
    setDisplayNameFilter,
    setTimezoneFilter,
    setGroupByDisplayName,
    setGroupByTimezone,
    clearFilters,
  };
}
