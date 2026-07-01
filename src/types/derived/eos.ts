import { SystemType } from "../../features/Settings/utils/tabs/PointRules/pointRuleConstants";
import type { PointLog } from "../log";
import type { Member } from "../member";
import type { EventKey } from "../week";

// Rewards
export type eos_rewardGroup =
  | "contribution"
  | "key_player"
  | "backbone"
  | "alliance_leader";

// Rules
export type PointRulesResponse = PointRule[];

export interface PointRule {
  id: string | null;
  system: SystemType | null;
  type: string | null;

  minRank: number | null;
  maxRank: number | null;

  requiresRequirement: boolean | null;

  points: number | null;
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
  requirement: number | null;
  rankings: RankedMember[];
};

export type WeeklyDailyRankings = Record<string, Record<EventKey, DayRanking>>;
