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

// Logs

export type PointLog =
  | AllianceDuelLog
  | StateRulerLog
  | GroupLeaderLog
  | EOSLog;

export type AllianceDuelLog = {
  type: "alliance_duel";
  points: number;
  week: string;
  day: DayKey;
};

export type StateRulerLog = {
  type: "state_ruler";
  week: string;
  category: "clash" | "progress";
  points: number;
  rank: number;
  score: number;
};

export type GroupLeaderLog = {
  type: "group_leader";
  points: number;
};

export type EOSLog = {
  type: "eos_bonus" | "eos_penalty";
  points: number;
};

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
};

export type DayRanking = {
  requirement: number;
  rankings: RankedMember[];
};

export type WeeklyDailyRankings = Record<string, Record<DayKey, DayRanking>>;
