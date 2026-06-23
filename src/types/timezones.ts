export type TimezoneGroup = {
  display_name: string;
  baseOffsetMinutes: number;
  dstOffsetMinutes: number;
  zoneIds: string[];
};

export type TimezoneGroups = Record<string, TimezoneGroup>;
