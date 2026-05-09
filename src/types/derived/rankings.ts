import type { AllianceDuelEntry } from "../week";

export type RankedEntry = AllianceDuelEntry & { score: number };

export type WeeklyMemberInsight = {
  member: {
    id: string;
    name: string;
  };
  count: number;
};
