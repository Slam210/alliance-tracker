import type { Member } from "../member";

export type TimezoneBucket = {
  displayName: string;
  zoneIds: string[];
  baseOffsetMinutes: number;
  dstOffsetMinutes: number;
};

type TimezoneGroup = {
  timezone: string;
  members: Member[];
};

type DisplayNameBucket = {
  displayName: string;
  timezones: TimezoneGroup[];
};

export type OffsetBucket = {
  offsetMinutes: number;
  displayNames: DisplayNameBucket[];
};
