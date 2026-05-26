import type { RankedEntry } from "./rankings";

export type MemberCount = {
  member: RankedEntry;
  count: number;
};

export type WeeklyInsights = {
  uniqueTop10Members: MemberCount[];
  repeatingFailures: MemberCount[];
  hasWeeklyData: boolean;
};
