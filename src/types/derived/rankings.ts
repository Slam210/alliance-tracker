import type { AllianceDuelEntry, EventKey } from "../week";

export type RankedEntry = AllianceDuelEntry & { score: number };

export type WeeklyMemberInsight = {
  member: {
    id: string;
    name: string;
  };
  count: number;
};

export type RankingsByEvent = Record<EventKey, RankedEntry[]>;
