import type { PointLog } from "../log";
import type { Member } from "../member";
import type { DayKey } from "../week";

// Rewards
export type EosRewardGroup =
  | "contribution"
  | "key_player"
  | "backbone"
  | "alliance_leader";

// Rules
export type PointRulesResponse = PointRule[];

export interface PointRule {
  system: string;
  type: string;

  minRank: number | null;
  maxRank: number | null;

  requiresRequirement: boolean | null;

  points: number;
}

// Members

export type MemberWithPoints = Member & {
  points: number;
  logs: PointLog[];
};

export type RankedMember = {
  rank: number;
  id: string;
  name: string;
  score: number | null;
  exception: boolean;
};

export type DayRanking = {
  requirement: number;
  rankings: RankedMember[];
};

export type WeeklyDailyRankings = Record<string, Record<DayKey, DayRanking>>;
