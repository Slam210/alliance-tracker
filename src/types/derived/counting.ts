import type { Member } from "../member";
import type { DayKey } from "../week";
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

export type AllTimeEntry = {
  member: Member;
  score: number;
  weekId: string;
  day?: DayKey;
};
