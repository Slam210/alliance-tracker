export type TimezoneGroup = {
  displayName: string;
  baseOffsetMinutes: number;
  dstOffsetMinutes: number;
  zoneIds: string[];
};

export type TimezoneGroups = Record<string, TimezoneGroup>;
