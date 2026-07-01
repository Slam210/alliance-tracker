import type { Member } from "../member";

export type TimezoneDataGroups = Record<string, TimezoneDataGroup>;

export type TimezoneDataGroup = {
  display_name: string;
  baseOffsetMinutes: number;
  dstOffsetMinutes: number;
  zoneIds: string[];
};

export type TimezoneBucket = {
  display_name: string;
  zoneIds: string[];
  baseOffsetMinutes: number;
  dstOffsetMinutes: number;
};

type TimezoneGroup = {
  timezone: string;
  members: Member[];
};

type DisplayNameBucket = {
  display_name: string;
  timezones: TimezoneGroup[];
};

export type OffsetBucket = {
  offsetMinutes: number;
  display_names: DisplayNameBucket[];
};
