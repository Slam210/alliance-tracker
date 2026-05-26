import type { AllianceDuelEntry, DayKey } from "../week";

export type RankedEntry = AllianceDuelEntry & { score: number };

export type WeeklyMemberInsight = {
  member: {
    id: string;
    name: string;
  };
  count: number;
};

export type RankingsByDay = Record<DayKey, RankedEntry[]>;
